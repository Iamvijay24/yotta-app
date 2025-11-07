import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      alert('Unauthorized');
    }
    throw error;
  }
}
