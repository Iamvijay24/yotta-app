import { Image, Text, View } from 'react-native';
import { styles } from './styles';

const ProfileCard = ({ user }) => (
  <View style={styles.profileSection}>
    <View style={styles.profileCard}>
      <Image
        source={{
          uri: `https://via.placeholder.com/80x80/2575fc/ffffff?text=${encodeURIComponent(
            user?.name?.charAt(0).toUpperCase() || 'U',
          )}`,
        }}
        style={styles.avatar}
      />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>
    </View>
  </View>
);

export default ProfileCard;
