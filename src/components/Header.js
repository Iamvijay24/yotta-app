import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign'; // Using AntDesign for consistency

const Header = ({
  userName = 'Alex',
  title = 'Your Courses',
  onBellPress,
  onAvatarPress,
}) => (
  <LinearGradient
    colors={['#667eea', '#764ba2']} // Modern gradient from blue to purple
    style={styles.gradientContainer}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  >
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={onBellPress}>
            <AntDesign name="bells" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onAvatarPress}>
            <Image
              source={{ uri: 'https://via.placeholder.com/40' }} // Replace with actual avatar URI
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradientContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // For Android shadow
  },
  safeArea: {
    backgroundColor: 'transparent', // Let gradient show through
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'transparent', // Transparent to show gradient
  },
  leftSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default Header;
