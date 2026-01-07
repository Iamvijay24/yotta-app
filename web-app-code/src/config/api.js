import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import refreshToken from '../shared/api/refreshToken';

const restAxiosInstance = axios.create({
  baseURL: 'https://u2u6ayshy6.execute-api.us-west-2.amazonaws.com/dev/',
  headers: {
    'Content-Type': 'application/json',
  },
});


restAxiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('idToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

restAxiosInstance.interceptors.response.use(
  (response) => response,
  async(error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return restAxiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const newAccessToken = await refreshToken();
        setCookie('idToken', newAccessToken, {
          maxAge: 3600,
          path: '/',
          secure: import.meta.env.MODE === 'production',
          sameSite: 'Strict'
        });
        restAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return restAxiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error('Refresh failed:', refreshErr);
        processQueue(refreshErr, null);
        setCookie('idToken', '', { maxAge: -1 });
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export async function makeApiRequest(method, endPoint, data = null) {
  try {
    const response = await restAxiosInstance({
      method,
      url: endPoint,
      data,
    });
    if (response.status === 204) {
      return response.status;
    }
    return response.data;
  } catch (error) {
    console.error(`API Error [${endPoint}]:`, error);
    const isUnauthorized = error.response?.status === 401 || error.response?.status === 403;
    if (isUnauthorized) {
      // alert('Session expired. Please log in again.');
    }
    throw error;
  }
}
