import axios from 'axios';
import { getCookie } from 'cookies-next';
import refreshToken from './refreshToken.js'; // Your AWS Cognito refresh logic

export { AuthProvider, useAuth } from './AuthContext.jsx';

const axiosInstance = axios.create({
  baseURL: 'https://u2u6ayshy6.execute-api.us-west-2.amazonaws.com/dev/',
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async(error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshToken();
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // If refresh token fails, redirect to login or handle as needed
        // For example: window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const handleError = (error) => {
  let errorMessage = 'Something went wrong';
  let status = 500;

  if (error.response) {
    status = error.response.status;
    errorMessage = error.response.data?.message || error.response.statusText;
  } else if (error.request) {
    errorMessage = 'Network error - please check your connection';
    status = 0;
  } else {
    errorMessage = error.message;
  }

  return {
    success: false,
    error: errorMessage,
    status,
    data: null,
  };
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const apiCall = async(action, data = {}, config = {}) => {
  const maxRetries = config.maxRetries || 3;
  const retryDelay = config.retryDelay || 1000;
  const retryCondition = config.retryCondition || ((error) => {
    // Retry on network errors, timeouts, and 5xx server errors
    return !error.response ||
           error.code === 'ECONNABORTED' ||
           error.code === 'NETWORK_ERROR' ||
           (error.response.status >= 500 && error.response.status < 600);
  });

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (!action) {
        throw new Error('Action is required');
      }

      const payload = {
        action,
        ...data
      };

      // Remove retry-specific config before passing to axios
      const axiosConfig = { ...config };
      delete axiosConfig.maxRetries;
      delete axiosConfig.retryDelay;
      delete axiosConfig.retryCondition;

      const response = await axiosInstance.post("", payload, axiosConfig);
      return {
        data: response.data,
        status: response.status,
        success: true,
        action: action,
        attempt: attempt + 1,
      };
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's the last attempt or if retry condition is not met
      if (attempt === maxRetries || !retryCondition(error)) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = retryDelay * Math.pow(2, attempt);
      console.warn(`API call failed (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay}ms...`, {
        action,
        error: error.message,
        status: error.response?.status
      });

      await sleep(delay);
    }
  }

  return {
    ...handleError(lastError),
    action: action,
    attempts: maxRetries + 1,
  };
};

const ApiRequest = (action, data, config = {}) => {
  // Set default retry configuration that applies to all API calls
  const defaultConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    ...config // Allow overriding defaults if needed
  };
  
  return apiCall(action, data, defaultConfig);
};

export default ApiRequest;
