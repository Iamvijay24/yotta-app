import { CognitoUser } from 'amazon-cognito-identity-js';
import { getCookie, setCookie } from 'cookies-next';
import AWSCognitoUserPool from './AWSCognitoUserPool';

export default function refreshToken() {
  const refreshToken = getCookie('refreshToken');
  if (!refreshToken) {
    console.error('No refresh token found');
    throw new Error('No refresh token');
  }
  const cognitoUser = AWSCognitoUserPool.getCurrentUser();
  if (!cognitoUser) {
    console.error('No authenticated user found');
    throw new Error('No authenticated user');
  }
  return new Promise((resolve, reject) => {
    cognitoUser.refreshSession(
      { RefreshToken: refreshToken },
      (err, session) => {
        if (err) {
          console.error('Token refresh failed:', err);
          reject(err);
        } else if (!session.isValid()) {
          console.error('Refreshed session is invalid');
          reject(new Error('Invalid session after refresh'));
        } else {
          const newIdToken = session.getIdToken().getJwtToken();
          setCookie('idToken', newIdToken, {
            maxAge: 3600,
            path: '/',
            secure: true,
            sameSite: 'strict'
          });
          resolve(newIdToken);
        }
      }
    );
  });
}
