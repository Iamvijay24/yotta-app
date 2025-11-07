import AsyncStorage from '@react-native-async-storage/async-storage';
import { CognitoUser } from 'amazon-cognito-identity-js';
import AWSCognitoUserPool from './AWSCognitoUserPool';

export default async function RefreshToken() {
  const refreshToken = await AsyncStorage.getItem('@refreshToken');
  if (!refreshToken) {
    console.error('No refresh token found');
    return;
  }

  const cognitoUser = AWSCognitoUserPool.getCurrentUser();
  if (!cognitoUser) {
    console.error('No authenticated user found');
    return;
  }

  return new Promise((resolve, reject) => {
    cognitoUser.refreshSession(
      { getToken: () => refreshToken },
      async (err, session) => {
        if (err) {
          console.error('Token refresh failed:', err);
          reject(err);
        } else {
          const newAccessToken = session.getIdToken().getJwtToken();

          // Store the new access token in AsyncStorage
          await AsyncStorage.setItem('@accessToken', newAccessToken);

          resolve(newAccessToken);
        }
      },
    );
  });
}
