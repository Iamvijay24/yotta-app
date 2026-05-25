import { Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import AuthButton from '../../../components/auth/AuthButton';
import InputField from '../../../components/auth/InputField';
import { styles } from '../../../styles/loginStyles';

const ForgotPasswordForm = ({
  forgotPasswordStep,
  email,
  resetCode,
  newPassword,
  setEmail,
  setResetCode,
  setNewPassword,
  setForgotPasswordStep,
  loading,
  onSendResetCode,
  onResetPassword,
  onGoLogin,
}) => {
  const isSendStep = forgotPasswordStep === 1;
  let buttonTitle = 'Reset Password';

  if (loading && isSendStep) {
    buttonTitle = 'Sending...';
  } else if (loading && !isSendStep) {
    buttonTitle = 'Resetting...';
  } else if (!loading && isSendStep) {
    buttonTitle = 'Send Verification Code';
  }

  return (
    <>
      <Text style={styles.title}>
        {forgotPasswordStep === 1 ? 'Forgot Password' : 'Reset Password'}
      </Text>
      <Text style={styles.subtitle}>
        {forgotPasswordStep === 1
          ? 'Enter your email to receive a reset code'
          : 'Enter the code and your new password'}
      </Text>

      {forgotPasswordStep === 1 ? (
        <InputField
          icon={<AntDesign name="mail" size={20} color="#666" />}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      ) : (
        <>
          <InputField
            icon={<AntDesign name="safety" size={20} color="#666" />}
            placeholder="000000"
            value={resetCode}
            onChangeText={setResetCode}
            keyboardType="numeric"
            maxLength={6}
          />
          <InputField
            icon={<AntDesign name="lock" size={20} color="#666" />}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
        </>
      )}

      <AuthButton
        title={buttonTitle}
        onPress={isSendStep ? onSendResetCode : onResetPassword}
      />

      {forgotPasswordStep === 2 && (
        <TouchableOpacity onPress={() => setForgotPasswordStep(1)}>
          <Text
            style={[styles.linkText, { textAlign: 'center', marginTop: 8 }]}
          >
            ← Back
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={onGoLogin}>
        <Text style={[styles.linkText, { textAlign: 'center', marginTop: 12 }]}>
          Back to Sign In
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default ForgotPasswordForm;
