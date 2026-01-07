import { CognitoUser } from 'amazon-cognito-identity-js';
import { getCookie, setCookie } from 'cookies-next';
import AWSCognitoUserPool from './AWSCognitoUserPool';

export default function RefreshToken() {
  const refreshToken = getCookie('refreshToken');
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
      (err, session) => {
        if (err) {
          console.error('Token refresh failed:', err);
          reject(err);
        } else {
          const newAccessToken = session.getIdToken().getJwtToken();

          // Store the new access token in the cookie
          setCookie('accessToken', newAccessToken, {
            maxAge: 3600, // 1 hour
            path: '/',
            secure: true,
            sameSite: 'Strict'
          });

          resolve(newAccessToken);
        }
      }
    );
  });
}