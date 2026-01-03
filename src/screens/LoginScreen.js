import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../shared/api/AuthContext';
import Logo from '../assets/Logo_main.png';

// Custom Input component that mimics Ant Design's prefix prop
const Input = ({ prefix, suffix, style, ...props }) => (
  <View style={[styles.inputContainer, style]}>
    {prefix && <View style={styles.inputPrefix}>{prefix}</View>}
    <TextInput
      style={[styles.inputWithIcon, suffix && styles.inputWithSuffix]}
      {...props}
    />
    {suffix && <View style={styles.inputSuffix}>{suffix}</View>}
  </View>
);

const LoginScreen = ({ navigation }) => {
  const {
    login,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationCode,
  } = useAuth();
  const [mode, setMode] = useState('login'); // login, signup, forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async () => {
    Keyboard.dismiss(); // Dismiss keyboard before processing

    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by auth state change in AppNavigator
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';

      if (error.message === 'NEW_PASSWORD_REQUIRED') {
        errorMessage = 'New password required. Please check your email.';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.code) {
        switch (error.code) {
          case 'UserNotConfirmedException':
            errorMessage = 'Please confirm your email first';
            break;
          case 'NotAuthorizedException':
            errorMessage = 'Invalid email or password';
            break;
          case 'UserNotFoundException':
            errorMessage = 'User not found';
            break;
          case 'TooManyRequestsException':
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          default:
            errorMessage = `${error.code}: ${error.message || 'Login failed'}`;
        }
      }

      Alert.alert('Login Failed', errorMessage);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      Alert.alert(
        'Success',
        'Account created successfully. Please check your email for verification code.',
      );
      setShowOtpModal(true);
    } catch (error) {
      Alert.alert('Error', error.message || 'Signup failed');
    }
    setLoading(false);
  };

  const handleSendResetCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      Alert.alert('Success', 'Verification code sent to your email');
      setForgotPasswordStep(2);
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, resetCode, newPassword);
      Alert.alert('Success', 'Password reset successfully! You can now login.');
      setMode('login');
      setForgotPasswordStep(1);
      setResetCode('');
      setNewPassword('');
    } catch (error) {
      console.error('Reset password error:', error);
      let errorMessage = 'Password reset failed';

      if (error.code === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code.';
      } else if (error.code === 'ExpiredCodeException') {
        errorMessage = 'Code expired. Request a new one.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit verification code');
      return;
    }

    setOtpLoading(true);
    try {
      await verifyEmail(email, otp);
      Alert.alert('Success', 'Email verified successfully! You can now login.');
      setShowOtpModal(false);
      setOtp('');
      setMode('login');
    } catch (error) {
      console.error('OTP verification error:', error);
      let errorMessage = 'Verification failed';

      if (error.code === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code. Please try again.';
      } else if (error.code === 'ExpiredCodeException') {
        errorMessage =
          'Verification code has expired. Please request a new one.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpLoading(true);
    try {
      await resendVerificationCode(email);
      Alert.alert('Success', 'Verification code sent to your email!');
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert(
        'Error',
        'Failed to resend verification code. Please try again.',
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.titleText}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Hey, welcome back to your special place
      </Text>

      <Input
        prefix={<Text style={styles.iconText}>📧</Text>}
        placeholder="user@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#666"
      />

      <Input
        prefix={<Text style={styles.iconText}>🔒</Text>}
        suffix={
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
            activeOpacity={0.7}
          >
            <Text style={styles.eyeIconText}>
              {passwordVisible ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        }
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={passwordVisible}
        placeholderTextColor="#666"
      />

      <LinearGradient
        colors={['#3b82f6', '#2563eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.buttonGradient}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.linkContainer}>
        <Text style={styles.linkPrefix}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => setMode('signup')}>
          <Text style={styles.linkText}> Sign Up</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => setMode('forgot')}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignupForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join us today</Text>

      <Input
        prefix={<Text style={styles.iconText}>👤</Text>}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholderTextColor="#666"
      />

      <Input
        prefix={<Text style={styles.iconText}>📧</Text>}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#666"
      />

      <Input
        prefix={<Text style={styles.iconText}>🔒</Text>}
        suffix={
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
            activeOpacity={0.7}
          >
            <Text style={styles.eyeIconText}>
              {passwordVisible ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        }
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={passwordVisible}
        placeholderTextColor="#666"
      />

      <LinearGradient
        colors={['#3b82f6', '#2563eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.buttonGradient}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.linkContainer}>
        <Text style={styles.linkPrefix}>Already have an account?</Text>
        <TouchableOpacity onPress={() => setMode('login')}>
          <Text style={styles.linkText}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderForgotPasswordForm = () => (
    <View style={styles.formContainer}>
      {forgotPasswordStep === 1 ? (
        <>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email to receive a reset code
          </Text>

          <Input
            prefix={<Text style={styles.iconText}>📧</Text>}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />

          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleSendResetCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </>
      ) : (
        <>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the code and your new password
          </Text>

          <Input
            prefix={<Text style={styles.iconText}>🔒</Text>}
            placeholder="000000"
            value={resetCode}
            onChangeText={setResetCode}
            keyboardType="numeric"
            maxLength={6}
            placeholderTextColor="#666"
          />

          <Input
            prefix={<Text style={styles.iconText}>🔑</Text>}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />

          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </>
      )}

      <View style={styles.linkContainer}>
        {forgotPasswordStep === 2 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setForgotPasswordStep(1)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            setMode('login');
            setForgotPasswordStep(1);
            setResetCode('');
            setNewPassword('');
          }}
        >
          <Text style={styles.linkText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        {mode === 'forgot'
          ? renderForgotPasswordForm()
          : mode === 'signup'
          ? renderSignupForm()
          : renderLoginForm()}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowOtpModal(false);
                setOtp('');
              }}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>🔒</Text>
              <Text style={styles.modalTitle}>Verify Your Email</Text>
            </View>

            <Text style={styles.modalSubtitle}>
              We've sent a 6-digit verification code to{'\n'}
              <Text style={styles.modalEmail}>{email}</Text>
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="000000"
              value={otp}
              onChangeText={text =>
                setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))
              }
              keyboardType="numeric"
              maxLength={6}
              autoFocus
              textAlign="center"
              placeholderTextColor="#ccc"
            />

            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <TouchableOpacity
                style={[styles.button, styles.modalButton]}
                onPress={handleOtpVerification}
                disabled={otp.length !== 6 || otpLoading}
              >
                <Text style={styles.buttonText}>
                  {otpLoading ? 'Verifying...' : 'Verify Email'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOtp}
              disabled={otpLoading}
            >
              <Text style={styles.resendButtonText}>
                Didn't receive the code? Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 60,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1e293b', // Dark color from gradient
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
    width: '100%',
  },
  buttonGradient: {
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  linkPrefix: {
    color: '#666',
    fontSize: 14,
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 21,
    alignItems: 'center',
  },
  modeActive: {
    backgroundColor: '#3b82f6',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  modeTextActive: {
    color: '#fff',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  inputWithSuffix: {
    marginRight: 40,
  },
  eyeIcon: {
    padding: 4,
  },
  eyeIconText: {
    fontSize: 18,
  },
  iconText: {
    fontSize: 20,
  },
  inputPrefix: {
    marginRight: 12,
  },
  inputSuffix: {
    marginLeft: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalEmail: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    color: '#333',
    width: '100%',
    maxWidth: 200,
  },
  modalButton: {
    width: '100%',
    marginBottom: 16,
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  modalIcon: {
    fontSize: 40,
  },
  titleGradient: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoginScreen;
