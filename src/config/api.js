import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RefreshToken from '../shared/api/refreshToken';
import { ENV } from './env';

export async function makeApiRequest(method, endPoint, data) {
  const url = `https://u2u6ayshy6.execute-api.us-west-2.amazonaws.com/dev/${endPoint}`;
  const token = await AsyncStorage.getItem('@accessToken');

  try {
    const response = await axios({
      url,
      method,
      // For GET requests axios ignores body; callers currently don't pass data for GET.
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (response.status === 204) {
      return response.status;
    }

    return response.data;
  } catch (error) {
    const isUnauthorized =
      error.response?.status === 401 ||
      error.message === 'Unauthorized' ||
      error.message === 'Request failed with status code 401';

    if (isUnauthorized) {
      try {
        // Try to refresh the token
        const newToken = await RefreshToken();
        if (newToken) {
          // Retry the request with the new token
          const retryResponse = await axios({
            url,
            method,
            data,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${newToken}`,
            },
          });

          if (retryResponse.status === 204) {
            return retryResponse.status;
          }

          return retryResponse.data;
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Fall through to original error handling
      }

      alert('Unauthorized');
    }
    throw error;
  }
}
