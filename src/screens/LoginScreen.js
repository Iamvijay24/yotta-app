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
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../shared/api/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login, register, forgotPassword } = useAuth();
  const [mode, setMode] = useState('login'); // login, signup, forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
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
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      Alert.alert(
        'Success',
        'Account created successfully. Please check your email for verification.',
      );
      setMode('login');
    } catch (error) {
      Alert.alert('Error', error.message || 'Signup failed');
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      Alert.alert('Success', 'Password reset email sent');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login with AuthContext
    Alert.alert('Info', 'Google login coming soon');
  };

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#666"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
          }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => setMode('signup')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#666"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => setMode('login')}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderForgotPasswordForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to reset</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#666"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => setMode('login')}>
          <Text style={styles.linkText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderModeSwitch = () => (
    <View style={styles.modeContainer}>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'login' && styles.modeActive]}
        onPress={() => setMode('login')}
      >
        <Text
          style={[styles.modeText, mode === 'login' && styles.modeTextActive]}
        >
          Sign In
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'signup' && styles.modeActive]}
        onPress={() => setMode('signup')}
      >
        <Text
          style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}
        >
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>YottaAcademy</Text>
        </View>

        {mode === 'forgot' ? renderForgotPasswordForm() : renderLoginForm()}

        <View style={{ height: 20 }} />

        {renderModeSwitch()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2575fc',
    marginBottom: 8,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
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
    backgroundColor: '#2575fc',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    alignItems: 'center',
    marginBottom: 16,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#2575fc',
    fontSize: 14,
    fontWeight: '500',
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
    backgroundColor: '#2575fc',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  modeTextActive: {
    color: '#fff',
  },
});

export default LoginScreen;
