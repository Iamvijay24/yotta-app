/* eslint-disable max-lines-per-function */
import { useState } from 'react';
import { Alert, Image, Keyboard, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Logo from '../../assets/Logo_main.png';
import OtpModal from '../../components/auth/OtpModal';
import { useAuth } from '../../shared/api/AuthContext';
import { styles } from '../../styles/loginStyles';
import ForgotPasswordForm from './forgot-password/ForgotPasswordForm';
import LoginForm from './login/LoginForm';
import SignupForm from './signup/SignupForm';

const AuthScreen = () => {
  const {
    login,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationCode,
  } = useAuth();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    Keyboard.dismiss();
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
      Alert.alert('Error', error?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetCode = async () => {
    Keyboard.dismiss();
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
      Alert.alert('Error', error?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    if (!resetCode || !newPassword) {
      Alert.alert('Error', 'Please fill all fields');
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
      Alert.alert('Error', error?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(email, otp);
      Alert.alert('Success', 'Email verified successfully! You can now login.');
      setShowOtpModal(false);
      setOtp('');
      setMode('login');
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        error?.message || 'Verification failed',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendVerificationCode(email);
      Alert.alert('Success', 'Verification code sent to your email!');
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to resend code');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.formContainer}>
          {mode === 'login' && (
            <LoginForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              passwordVisible={passwordVisible}
              setPasswordVisible={setPasswordVisible}
              loading={loading}
              onLogin={handleLogin}
              onGoSignup={() => setMode('signup')}
              onGoForgot={() => setMode('forgot')}
            />
          )}

          {mode === 'signup' && (
            <SignupForm
              name={name}
              email={email}
              password={password}
              setName={setName}
              setEmail={setEmail}
              setPassword={setPassword}
              passwordVisible={passwordVisible}
              setPasswordVisible={setPasswordVisible}
              loading={loading}
              onSignup={handleSignup}
              onGoLogin={() => setMode('login')}
            />
          )}

          {mode === 'forgot' && (
            <ForgotPasswordForm
              forgotPasswordStep={forgotPasswordStep}
              email={email}
              resetCode={resetCode}
              newPassword={newPassword}
              setEmail={setEmail}
              setResetCode={setResetCode}
              setNewPassword={setNewPassword}
              setForgotPasswordStep={setForgotPasswordStep}
              loading={loading}
              onSendResetCode={handleSendResetCode}
              onResetPassword={handleResetPassword}
              onGoLogin={() => {
                setMode('login');
                setForgotPasswordStep(1);
                setResetCode('');
                setNewPassword('');
              }}
            />
          )}
        </View>
      </ScrollView>

      <OtpModal
        visible={showOtpModal}
        otp={otp}
        setOtp={text => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
        email={email}
        onClose={() => {
          setShowOtpModal(false);
          setOtp('');
        }}
        onVerify={handleOtpVerification}
        onResend={handleResendOtp}
      />
    </SafeAreaView>
  );
};

export default AuthScreen;
