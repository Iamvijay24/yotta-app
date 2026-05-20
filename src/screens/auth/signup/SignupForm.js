import { Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import AuthButton from '../../../components/auth/AuthButton';
import InputField from '../../../components/auth/InputField';
import { styles } from '../../../styles/loginStyles';
import PasswordToggleIcon from '../shared/PasswordToggleIcon';

const SignupForm = ({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  passwordVisible,
  setPasswordVisible,
  loading,
  onSignup,
  onGoLogin,
}) => (
  <>
    <Text style={styles.title}>Create Account</Text>
    <Text style={styles.subtitle}>Join us today</Text>

    <InputField
      icon={<AntDesign name="user" size={20} color="#666" />}
      placeholder="Full Name"
      value={name}
      onChangeText={setName}
      autoCapitalize="words"
    />

    <InputField
      icon={<AntDesign name="mail" size={20} color="#666" />}
      placeholder="Email"
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
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={passwordVisible}
    />

    <AuthButton
      title={loading ? 'Creating Account...' : 'Sign Up'}
      onPress={onSignup}
    />

    <View style={styles.linkContainer}>
      <Text style={styles.linkPrefix}>Already have an account?</Text>
      <TouchableOpacity onPress={onGoLogin}>
        <Text style={styles.linkText}> Sign In</Text>
      </TouchableOpacity>
    </View>
  </>
);

export default SignupForm;
