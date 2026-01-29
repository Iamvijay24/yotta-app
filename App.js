import React from 'react';
import { StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/shared/store/redux/store';
import { AuthProvider, useAuth } from './src/shared/api/AuthContext';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_CONFIG } from './src/config/stripe';
import AppNavigator from './src/navigation/AppNavigator';
import './src/styles/global.scss';

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
