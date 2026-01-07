import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import AWSCognitoUserPool from './AWSCognitoUserPool.jsx';
import AuthContext from './AuthContext.context';

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async() => {
    try {
      const currentUser = AWSCognitoUserPool.getCurrentUser();
      if (currentUser) {
        currentUser.getSession((err, session) => {
          if (err) {
            console.error('Session error:', err);
            setUser(null);
            setIsAuthenticated(false);
            deleteCookie('idToken');
          } else {
            console.log("currentUser",currentUser);
            const payload = session.idToken?.payload;
            const mappedUser = {
              ...payload,
              name:  payload.name,
              email: payload.email
            };
            setUser(mappedUser);
            setIsAuthenticated(true);

            const idToken = session.getIdToken().getJwtToken();
            const refreshToken = session.getRefreshToken().getToken();

            const expirationTime = session.getIdToken().getExpiration();
            const currentTime = Math.floor(Date.now() / 1000);
            const maxAge = expirationTime - currentTime;

            // Store ID token as accessToken for API use and refreshToken
            setCookie('idToken', idToken, {
              maxAge: maxAge > 0 ? maxAge : 3600, // Fallback to 1 hour if calculation is negative
              path: '/',
              secure: true,
              sameSite: 'strict'
            });

            setCookie('refreshToken', refreshToken, {
              maxAge: 30 * 24 * 60 * 60, // 30 days
              path: '/',
              secure: true,
              sameSite: 'strict'
            });
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Login function
  const login = async(email, password) => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: AWSCognitoUserPool,
      };

      const cognitoUser = new CognitoUser(userData);

      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async(result) => {
          const payload = result.idToken?.payload;
          const mappedUser = {
            ...payload,
            name:  payload.name,
            email: payload.email
          };
          const idToken = result.getIdToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();

          const userData = {
            email: email,
            accessToken: idToken,
            refreshToken: refreshToken,
          };

          console.log("result.signInUserSession", result);
          setUser(mappedUser);
          setIsAuthenticated(true);

          const expirationTime = result.getIdToken().getExpiration();
          const currentTime = Math.floor(Date.now() / 1000);
          const maxAge = expirationTime - currentTime;

          // Store ID token as accessToken for API use and refreshToken
          setCookie('idToken', idToken, {
            maxAge: maxAge > 0 ? maxAge : 3600,
            path: '/',
            secure: true,
            sameSite: 'strict'
          });

          setCookie('refreshToken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
            secure: true,
            sameSite: 'strict'
          });

          resolve(userData);
        },
        onFailure: (err) => {
          console.error('Login failed:', err);
          reject(err);
        },
        newPasswordRequired: () => {
          // Handle new password requirement
          reject(new Error('NEW_PASSWORD_REQUIRED'));
        },
      });
    });
  };

  // Register function
  const register = async(email, password, name) => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'name',
          Value: name,
        },
      ];

      AWSCognitoUserPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          console.error('Registration failed:', err);
          reject(err);
          return;
        }
        resolve(result.user);
      });
    });
  };

  // Update user attributes
  const updateAttributes = (attributeList) => {
    return new Promise((resolve, reject) => {
      const currentUser = AWSCognitoUserPool.getCurrentUser();
      if (!currentUser) {
        reject(new Error('No current user'));
        return;
      }

      currentUser.updateAttributes(attributeList, (err, result) => {
        if (err) {
          console.error('Update attributes failed:', err);
          reject(err);
          return;
        }
        // Refresh session to update tokens with new attributes
        currentUser.getSession((sessionErr, session) => {
          if (sessionErr) {
            reject(sessionErr);
          } else {
            const payload = session.idToken?.payload;
            const mappedUser = {
              ...payload,
              name:  payload.name,
              email: payload.email
            };
            setUser(mappedUser);
            resolve(result);
          }
        });
      });
    });
  };

  // Logout function
  const logout = () => {
    const currentUser = AWSCognitoUserPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    setUser(null);
    setIsAuthenticated(false);
    deleteCookie('idToken');
    deleteCookie('refreshToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Verify email function
  const verifyEmail = async(email, code) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: AWSCognitoUserPool,
      });

      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  };

  // Resend verification code
  const resendVerificationCode = async(email) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: AWSCognitoUserPool,
      });

      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  };

  // Forgot password
  const forgotPassword = async(email) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: AWSCognitoUserPool,
      });

      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          resolve(data);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  // Reset password
  const resetPassword = async(email, verificationCode, newPassword) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: AWSCognitoUserPool,
      });

      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  // Get current user tokens
  const getCurrentUserTokens = () => {
    return {
      accessToken: getCookie('idToken'),
    };
  };

  // Get current user
  const getCurrentUser = () => {
    const currentUser = AWSCognitoUserPool.getCurrentUser();
    return currentUser;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword,
    updateAttributes,
    getCurrentUserTokens,
    getCurrentUser,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
