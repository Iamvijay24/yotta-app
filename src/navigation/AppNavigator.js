import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../shared/api/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import CoursesListScreen from '../screens/CoursesListScreen';
import MyProgressScreen from '../screens/MyProgressScreen';
import AccountScreen from '../screens/AccountScreen';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const TabStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#2575fc',
      tabBarInactiveTintColor: '#666',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Courses') {
          iconName = 'library-books';
        } else if (route.name === 'My Progress') {
          iconName = 'show-chart';
        } else if (route.name === 'Account') {
          iconName = 'person';
        }

        // Fallback to default icons if the named icon fails to load
        try {
          return <Icon name={iconName} size={size} color={color} />;
        } catch (error) {
          // Fallback icons
          const fallbackIcons = {
            Courses: 'menu-book',
            'My Progress': 'trending-up',
            Account: 'account-circle',
          };
          return (
            <Icon
              name={fallbackIcons[route.name] || 'help'}
              size={size}
              color={color}
            />
          );
        }
      },
    })}
  >
    <Tab.Screen name="Courses" component={CoursesListScreen} />
    <Tab.Screen name="My Progress" component={MyProgressScreen} />
    <Tab.Screen name="Account" component={AccountScreen} />
  </Tab.Navigator>
);

const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={TabStack} />
    <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
    <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
    <Stack.Screen name="Payments" component={PaymentsScreen} />
    <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
