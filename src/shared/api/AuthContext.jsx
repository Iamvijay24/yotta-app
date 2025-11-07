// src/shared/api/AuthContext.jsx - React Native version
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AWSCognitoUserPool from './AWSCognitoUserPool.jsx';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on component mount
  const checkAuthStatus = useCallback(async () => {
    try {
      const currentUser = AWSCognitoUserPool.getCurrentUser();
      if (currentUser) {
        currentUser.getSession(async (err, session) => {
          if (err) {
            console.error('Session error:', err);
            await clearStoredAuth();
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // Store tokens in AsyncStorage
            const accessToken = session.getAccessToken().getJwtToken();
            const refreshToken = session.getRefreshToken().getToken();

            await AsyncStorage.setItem('@accessToken', accessToken);
            await AsyncStorage.setItem('@refreshToken', refreshToken);
            await AsyncStorage.setItem(
              '@user',
              JSON.stringify(session.idToken?.payload),
            );

            setUser(session.idToken?.payload);
            setIsAuthenticated(true);
          }
          setLoading(false);
        });
      } else {
        await clearStoredAuth();
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
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Helper function to clear stored auth data
  const clearStoredAuth = async () => {
    try {
      await AsyncStorage.removeItem('@accessToken');
      await AsyncStorage.removeItem('@refreshToken');
      await AsyncStorage.removeItem('@user');
    } catch (error) {
      console.error('Error clearing stored auth:', error);
    }
  };

  // Login function
  const login = async (email, password) => {
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
        onSuccess: async result => {
          console.log('Login successful:', result);
          const userData = {
            email: email,
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          };

          // Store in AsyncStorage
          await AsyncStorage.setItem('@accessToken', userData.accessToken);
          await AsyncStorage.setItem('@refreshToken', userData.refreshToken);
          await AsyncStorage.setItem(
            '@user',
            JSON.stringify(result.idToken?.payload),
          );

          setUser(result.idToken?.payload);
          setIsAuthenticated(true);

          resolve(userData);
        },
        onFailure: err => {
          console.error('Login failed:', err);
          reject(err);
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          console.log('New password required for user:', userAttributes);
          reject(new Error('NEW_PASSWORD_REQUIRED'));
        },
      });
    });
  };

  // Register function
  const register = async (email, password, name) => {
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

      AWSCognitoUserPool.signUp(
        email,
        password,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            console.error('Registration failed:', err);
            reject(err);
            return;
          }
          resolve(result.user);
        },
      );
    });
  };

  // Logout function
  const logout = async () => {
    try {
      const currentUser = AWSCognitoUserPool.getCurrentUser();
      if (currentUser) {
        currentUser.signOut();
      }

      await clearStoredAuth();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Verify email function
  const verifyEmail = async (email, code) => {
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
  const resendVerificationCode = async email => {
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
  const forgotPassword = async email => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: AWSCognitoUserPool,
      });

      cognitoUser.forgotPassword({
        onSuccess: data => {
          resolve(data);
        },
        onFailure: err => {
          reject(err);
        },
      });
    });
  };

  // Reset password
  const resetPassword = async (email, verificationCode, newPassword) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: AWSCognitoUserPool,
      });

      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          resolve();
        },
        onFailure: err => {
          reject(err);
        },
      });
    });
  };

  // Get current user tokens
  const getCurrentUserTokens = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('@accessToken');
      const refreshToken = await AsyncStorage.getItem('@refreshToken');
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
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
    getCurrentUserTokens,
    getCurrentUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
