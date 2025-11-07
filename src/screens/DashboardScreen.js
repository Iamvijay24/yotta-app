import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { useAuth } from '../shared/api/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([
    {
      id: '1',
      title: 'React Native Fundamentals',
      description: 'Learn the basics of React Native development',
      instructor: 'Jane Smith',
      duration: '4 weeks',
      enrolled: true,
      progress: 75,
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      description: 'Master advanced JavaScript concepts',
      instructor: 'Mike Johnson',
      duration: '6 weeks',
      enrolled: false,
      progress: 0,
    },
    {
      id: '3',
      title: 'Mobile UI/UX Design',
      description: 'Create beautiful and intuitive mobile interfaces',
      instructor: 'Sarah Wilson',
      duration: '8 weeks',
      enrolled: true,
      progress: 30,
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  // Logout functionality
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            // Navigation will be handled by auth state change in AppNavigator
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  // Handle course enrollment
  const handleEnroll = courseId => {
    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? { ...course, enrolled: true, progress: 0 }
          : course,
      ),
    );
    Alert.alert('Success', 'Successfully enrolled in the course!');
  };

  // Handle course selection
  const handleCoursePress = course => {
    if (!course.enrolled) {
      Alert.alert('Not Enrolled', 'Would you like to enroll in this course?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enroll',
          onPress: () => handleEnroll(course.id),
        },
      ]);
    } else {
      // Handle course details navigation
      Alert.alert('Course Details', `Opening ${course.title}`);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // TODO: Fetch updated courses from API
      // await DashboardAPI.getAllCourses();
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh courses');
      setRefreshing(false);
    }
  };

  // Render course item
  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item)}
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseTitleContainer}>
          <Text style={styles.courseTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View
            style={[
              styles.statusBadge,
              item.enrolled ? styles.enrolledBadge : styles.notEnrolledBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {item.enrolled ? 'Enrolled' : 'Available'}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.courseDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.courseDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Instructor:</Text>
          <Text style={styles.detailValue}>{item.instructor}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{item.duration}</Text>
        </View>
      </View>

      {item.enrolled && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progress: {item.progress}%</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${item.progress}%` }]}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Image
            source={{
              uri:
                'https://via.placeholder.com/60x60/2575fc/ffffff?text=' +
                encodeURIComponent(user.name.charAt(0).toUpperCase()),
            }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
      </View>

      {/* Courses List */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Courses</Text>
        <FlatList
          data={courses.filter(course => course.enrolled)}
          renderItem={renderCourseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.coursesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2575fc"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                You haven't enrolled in any courses yet.
              </Text>
            </View>
          }
        />
      </View>

      {/* Available Courses Section */}
      <View style={styles.availableSection}>
        <Text style={styles.sectionTitle}>Available Courses</Text>
        <FlatList
          data={courses.filter(course => !course.enrolled)}
          renderItem={renderCourseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.coursesList}
          showsVerticalScrollIndicator={false}
          horizontal
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#2575fc',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  coursesList: {
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseHeader: {
    marginBottom: 8,
  },
  courseTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  enrolledBadge: {
    backgroundColor: '#28a745',
  },
  notEnrolledBadge: {
    backgroundColor: '#6c757d',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2575fc',
    borderRadius: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  availableSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default DashboardScreen;
