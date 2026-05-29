import { useNavigation } from '@react-navigation/native';
import { Alert, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../shared/api/AuthContext';
import AccountHeader from './AccountHeader';
import AccountMenu from './AccountMenu';
import LogoutSection from './LogoutSection';
import ProfileCard from './ProfileCard';
import { styles } from './styles';

const AccountScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout(navigation);
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: '1',
      title: 'Edit Profile',
      icon: 'edit',
      action: () =>
        Alert.alert('Coming Soon', 'Edit profile feature coming soon!'),
    },
    {
      id: '2',
      title: 'Notifications',
      icon: 'bells',
      action: () =>
        Alert.alert('Coming Soon', 'Notification settings coming soon!'),
    },
    {
      id: '3',
      title: 'Privacy & Security',
      icon: 'safety',
      action: () => Alert.alert('Coming Soon', 'Privacy settings coming soon!'),
    },
    {
      id: '4',
      title: 'Help & Support',
      icon: 'questioncircle',
      action: () => Alert.alert('Coming Soon', 'Help & support coming soon!'),
    },
    {
      id: '5',
      title: 'About',
      icon: 'infocirlce',
      action: () => Alert.alert('About', 'Yotta Academy v1.0.0'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AccountHeader />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard user={user} />
        <AccountMenu items={menuItems} />
        <LogoutSection onLogout={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;
