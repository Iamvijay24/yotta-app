import { Image, Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

const DashboardHeader = ({ user, onLogout }) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>Dashboard</Text>
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.userInfo}>
      <Image
        source={{
          uri: `https://via.placeholder.com/60x60/2575fc/ffffff?text=${encodeURIComponent(
            (user?.name || 'U').charAt(0).toUpperCase(),
          )}`,
        }}
        style={styles.avatar}
      />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
      </View>
    </View>
  </View>
);

export default DashboardHeader;
