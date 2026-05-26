import React from 'react';
import { StatusBar, View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/shared/store/redux/store';
import { AuthProvider, useAuth } from './src/shared/api/AuthContext';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_CONFIG } from './src/config/stripe';
import AppNavigator from './src/navigation/AppNavigator';
import { validateEnvironment } from './src/config/validateEnv';
import { ENV } from './src/config/env';
import './src/styles/global.scss';

const envValidation = validateEnvironment({ throwOnError: false });
const shouldHardFail = ENV.APP_ENV === 'production';

if (!envValidation.isValid) {
  const message = `[ENV] ${envValidation.errors.join(' | ')}`;
  console.error(message);

  if (shouldHardFail) {
    throw new Error(message);
  }
}

const AuthWrapper = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2575fc" />
      </View>
    );
  }

  return <AppNavigator />;
};

function App() {
  if (!envValidation.isValid && !shouldHardFail) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            padding: 20,
            justifyContent: 'center',
            backgroundColor: '#fff7ed',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#9a3412' }}>
            Environment Configuration Required
          </Text>
          <Text style={{ marginTop: 10, color: '#7c2d12' }}>
            Please update your `.env` file and restart Metro.
          </Text>
          <Text style={{ marginTop: 12, color: '#7c2d12' }}>
            {envValidation.errors.join('\n')}
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StripeProvider
          publishableKey={STRIPE_CONFIG.publishableKey}
          merchantIdentifier={STRIPE_CONFIG.merchantIdentifier}
        >
          <AuthProvider>
            <StatusBar barStyle="dark-content" />
            <AuthWrapper />
          </AuthProvider>
        </StripeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
