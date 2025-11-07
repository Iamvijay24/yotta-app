import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyProgressScreen = () => {
  const [enrolledCourses] = useState([
    {
      id: '1',
      title: 'React Native Fundamentals',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      lastAccessed: '2024-10-20',
      nextLesson: 'Component Lifecycle',
    },
    {
      id: '3',
      title: 'Mobile UI/UX Design',
      progress: 30,
      totalLessons: 16,
      completedLessons: 5,
      lastAccessed: '2024-10-18',
      nextLesson: 'Color Theory Basics',
    },
  ]);

  const [overallStats] = useState({
    totalCourses: 2,
    completedCourses: 0,
    totalProgress: 52.5,
    studyStreak: 5,
  });

  const renderCourseProgress = ({ item }) => (
    <View style={styles.courseCard}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.progressPercent}>{item.progress}%</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
      </View>

      <View style={styles.courseDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Lessons:</Text>
          <Text style={styles.detailValue}>
            {item.completedLessons}/{item.totalLessons}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last accessed:</Text>
          <Text style={styles.detailValue}>{item.lastAccessed}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Next:</Text>
          <Text style={styles.detailValue}>{item.nextLesson}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Progress</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Overall Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overall Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{overallStats.totalCourses}</Text>
              <Text style={styles.statLabel}>Total Courses</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {overallStats.completedCourses}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {overallStats.totalProgress.toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>Avg Progress</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{overallStats.studyStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Course Progress */}
        <View style={styles.coursesSection}>
          <Text style={styles.sectionTitle}>Course Progress</Text>
          <FlatList
            data={enrolledCourses}
            renderItem={renderCourseProgress}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.coursesList}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    paddingTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2575fc',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  coursesSection: {
    marginBottom: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2575fc',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2575fc',
    borderRadius: 3,
  },
  courseDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});

export default MyProgressScreen;
