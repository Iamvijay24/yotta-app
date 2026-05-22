import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

const LogoutSection = ({ onLogout }) => (
  <View style={styles.logoutSection}>
    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  </View>
);

export default LogoutSection;
