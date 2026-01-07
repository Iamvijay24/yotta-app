import axios from 'axios';
import { getCookie } from 'cookies-next';

export async function makeApiRequest(method, endPoint, data) {
  const url = `https://u2u6ayshy6.execute-api.us-west-2.amazonaws.com/dev/${endPoint}`;
  const token = getCookie('accessToken');

  try {
    const response = await axios({
      url,
      method,
      // For GET requests axios ignores body; callers currently don't pass data for GET.
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
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
      alert('Unauthorized');
    }
    throw error;
  }
}