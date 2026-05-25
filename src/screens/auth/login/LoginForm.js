import { Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import InputField from '../../../components/auth/InputField';
import { styles } from '../../../styles/loginStyles';
import PasswordToggleIcon from '../shared/PasswordToggleIcon';
import AuthButton from '../../../components/auth/AuthButton';

const LoginForm = ({
  email,
  password,
  setEmail,
  setPassword,
  passwordVisible,
  setPasswordVisible,
  loading,
  onLogin,
  onGoSignup,
  onGoForgot,
}) => (
  <>
    <Text style={styles.title}>Welcome Back test</Text>
    <Text style={styles.subtitle}>Hey, welcome back to your special place</Text>

    <InputField
      icon={<AntDesign name="mail" size={20} color="#666" />}
      placeholder="user@gmail.com"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <InputField
      icon={<AntDesign name="lock" size={20} color="#666" />}
      rightIcon={
        <PasswordToggleIcon
          passwordVisible={passwordVisible}
          onToggle={() => setPasswordVisible(!passwordVisible)}
        />
      }
      placeholder="Enter your password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={passwordVisible}
    />

    <AuthButton
      title={loading ? 'Signing In...' : 'Sign In'}
      onPress={onLogin}
    />

    <View style={styles.linkContainer}>
      <Text style={styles.linkPrefix}>Don't have an account?</Text>
      <TouchableOpacity onPress={onGoSignup}>
        <Text style={styles.linkText}> Sign Up</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity onPress={onGoForgot}>
      <Text style={[styles.linkText, { textAlign: 'center', marginTop: 8 }]}>
        Forgot Password?
      </Text>
    </TouchableOpacity>
  </>
);

export default LoginForm;
