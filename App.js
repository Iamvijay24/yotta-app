import React from 'react';
import { StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/shared/api/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

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
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="dark-content" />
        <AuthWrapper />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
