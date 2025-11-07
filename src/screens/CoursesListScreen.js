import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CoursesListScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([
    {
      id: '1',
      title: 'React Native Fundamentals',
      description: 'Learn the basics of React Native development',
      instructor: 'Jane Smith',
      duration: '4 weeks',
      category: 'Mobile Development',
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      description: 'Master advanced JavaScript concepts',
      instructor: 'Mike Johnson',
      duration: '6 weeks',
      category: 'Programming',
    },
    {
      id: '3',
      title: 'Mobile UI/UX Design',
      description: 'Create beautiful and intuitive mobile interfaces',
      instructor: 'Sarah Wilson',
      duration: '8 weeks',
      category: 'Design',
    },
    {
      id: '4',
      title: 'Backend Development with Node.js',
      description: 'Build scalable server-side applications',
      instructor: 'Tom Davis',
      duration: '10 weeks',
      category: 'Backend',
    },
    {
      id: '5',
      title: 'Data Structures and Algorithms',
      description: 'Essential computer science fundamentals',
      instructor: 'Alice Brown',
      duration: '12 weeks',
      category: 'Computer Science',
    },
  ]);

  const handleEnroll = course => {
    // Navigate to course details with enroll option
    navigation.navigate('CourseDetails', { course });
  };

  const handleCoursePress = course => {
    // Navigate to course details
    navigation.navigate('CourseDetails', { course });
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item)}
    >
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
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

      <TouchableOpacity
        style={styles.enrollButton}
        onPress={() => handleEnroll(item)}
      >
        <Text style={styles.enrollButtonText}>Enroll</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Courses List</Text>
        <Text style={styles.headerSubtitle}>Recommended courses</Text>
      </View>

      {/* Courses Grid */}
      <View style={styles.content}>
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.coursesList}
          showsVerticalScrollIndicator={false}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2575fc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
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
  enrollButton: {
    backgroundColor: '#2575fc',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CoursesListScreen;
