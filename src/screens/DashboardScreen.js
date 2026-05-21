import { useState } from 'react';
import { Alert, SafeAreaView, StatusBar } from 'react-native';

import { DashboardAPI } from '../services/dashboard.services';
import { useAuth } from '../shared/api/AuthContext';
import CourseSection from './dashboard/CourseSection';
import DashboardHeader from './dashboard/DashboardHeader';
import { styles } from './dashboard/styles';

const DashboardScreen = () => {
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
      await DashboardAPI.getAllCourses();
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh courses');
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <DashboardHeader user={user} onLogout={handleLogout} />

      <CourseSection
        title="Your Courses"
        data={courses.filter(course => course.enrolled)}
        onCoursePress={handleCoursePress}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showEmpty
      />

      <CourseSection
        title="Available Courses"
        data={courses.filter(course => !course.enrolled)}
        onCoursePress={handleCoursePress}
        horizontal
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;
