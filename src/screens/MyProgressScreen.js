import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchEnrolledCourses } from '../shared/store/redux/slices/enrolledSlice';
import { fetchAllCourses } from '../shared/store/redux/slices/dashboardSlice';
import { TrackingAPI } from '../services/tracking.services';
import LoadSpinner from '../components/LoadSpinner';

const MyProgressScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const unmountedRef = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [progressMap, setProgressMap] = useState({});

  const {
    courses: allCourses,
    status: dashboardStatus,
    error: dashboardError,
  } = useSelector(
    state => state.dashboard || { courses: [], status: 'idle', error: null },
  );
  const {
    courseIds: enrolledCourseIds,
    status: enrolledStatus,
    error: enrolledError,
  } = useSelector(
    state =>
      state.enrolled || {
        courseIds: [],
        enrolledMap: {},
        status: 'idle',
        error: null,
      },
  );

  // Fetch all courses
  useEffect(() => {
    if (dashboardStatus === 'idle' && allCourses.length === 0) {
      dispatch(fetchAllCourses());
    }
  }, [dispatch, dashboardStatus]);

  // Fetch enrolled courses
  useEffect(() => {
    if (enrolledStatus === 'idle') {
      dispatch(fetchEnrolledCourses());
    }
  }, [dispatch, enrolledStatus]);

  // Mark unmounted on cleanup
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  // Fetch courses progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (enrolledStatus !== 'succeeded') return;
      try {
        const response = await TrackingAPI.getAllCourseProgress();
        if (unmountedRef.current) return;
        if (response?.courses) {
          const progressData = {};
          response.courses.forEach(course => {
            progressData[course.course_id] = {
              percentage: course.over_all_percentage || 0,
              completed: course.completed_topics || 0,
              total: course.total_topics || 0,
            };
          });
          if (unmountedRef.current) return;
          setProgressMap(progressData);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
      }
    };
    fetchProgress();
  }, [enrolledStatus]);

  // Prepare data for display
  const enrolledCourses = useMemo(() => {
    if (
      dashboardStatus !== 'succeeded' ||
      enrolledStatus !== 'succeeded' ||
      enrolledCourseIds.length === 0
    )
      return [];
    return allCourses
      .filter(course => enrolledCourseIds.includes(course.course_id))
      .map(course => {
        const progressInfo = progressMap[course.course_id] || {};
        return {
          ...course,
          id: course.course_id,
          enrolled: true,
          progress: progressInfo.percentage || 0,
          currentLecture: progressInfo.completed || 0,
          totalLectures: progressInfo.total || 0,
        };
      })
      .filter(course => course.progress < 100); // Only show in-progress courses
  }, [
    allCourses,
    dashboardStatus,
    enrolledCourseIds,
    progressMap,
    enrolledStatus,
  ]);

  const enrolledIds = useMemo(
    () => new Set(enrolledCourses.map(c => c.id)),
    [enrolledCourses],
  );

  // Helper function to parse duration string (HH:MM:SS) to decimal hours
  const parseDurationToHours = durationStr => {
    if (!durationStr) return 0;
    const parts = durationStr.split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    const seconds = parts[2] || 0;
    return hours + minutes / 60 + seconds / 3600;
  };

  const numEnrolled = enrolledCourses.length;
  const totalHoursSpent = Math.round(
    enrolledCourses.reduce((sum, course) => {
      const progress = course.progress / 100;
      const totalHours = parseDurationToHours(course.duration);
      return sum + totalHours * progress;
    }, 0),
  );
  const numCompleted = enrolledCourses.filter(
    course => course.progress === 100,
  ).length;

  const stats = [
    {
      value: numEnrolled.toString(),
      label: 'Courses Enrolled',
      color: '#2575fc',
    },
    {
      value: totalHoursSpent.toString(),
      label: 'Total Hours Spent',
      color: '#f39c12',
    },
    {
      value: numCompleted.toString(),
      label: 'Courses Completed',
      color: '#27ae60',
    },
  ];

  const handleEnrolledCoursePress = course => {
    navigation.navigate('CourseDetails', { courseId: course.id });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (dashboardStatus === 'idle') {
      dispatch(fetchAllCourses());
    }
    if (enrolledStatus === 'idle') {
      dispatch(fetchEnrolledCourses());
    }
    // Refetch progress
    try {
      const response = await TrackingAPI.getAllCourseProgress();
      if (response?.courses) {
        const progressData = {};
        response.courses.forEach(course => {
          progressData[course.course_id] = {
            percentage: course.over_all_percentage || 0,
            completed: course.completed_topics || 0,
            total: course.total_topics || 0,
          };
        });
        setProgressMap(progressData);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
    setRefreshing(false);
  };

  const renderEnrolledCourse = ({ item }) => {
    const hasAIAssistance =
      item.AI_exists || item.ai_enabled || item.aiAssistance;

    return (
      <TouchableOpacity
        style={styles.enrolledCourseCard}
        onPress={() => handleEnrolledCoursePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.enrolledCardContent}>
          <View style={styles.enrolledCardHeader}>
            <Text style={styles.enrolledCourseTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.enrolledHeaderRight}>
              {hasAIAssistance && (
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>✨ AI Tutor</Text>
                </View>
              )}
              <Text style={styles.enrolledProgressPercent}>
                {item.progress}%
              </Text>
            </View>
          </View>

          <View style={styles.enrolledProgressBar}>
            <View
              style={[
                styles.enrolledProgressFill,
                { width: `${item.progress}%` },
              ]}
            />
          </View>

          <View style={styles.enrolledCourseDetails}>
            <Text style={styles.enrolledDetailText}>
              {item.currentLecture}/{item.totalLectures} lectures
            </Text>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => handleEnrolledCoursePress(item)}
          >
            <Text style={styles.continueButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (dashboardStatus === 'loading' || enrolledStatus === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Progress</Text>
        </View>
        <View style={styles.loadingContainer}>
          <LoadSpinner />
        </View>
      </SafeAreaView>
    );
  }

  if (dashboardStatus === 'failed' || enrolledStatus === 'failed') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Progress</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load courses</Text>
          <Text style={styles.errorSubtext}>
            {dashboardError || enrolledError}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Progress</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Statistics */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Enrolled Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Enrolled Courses in Progress ({enrolledCourses.length})
            </Text>
          </View>
          {enrolledCourses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No courses enrolled</Text>
              <Text style={styles.emptyStateSubtext}>
                Start learning by enrolling in courses!
              </Text>
            </View>
          ) : (
            <FlatList
              data={enrolledCourses}
              renderItem={renderEnrolledCourse}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.enrolledCoursesList}
            />
          )}
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
    // paddingTop: 50,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  browseAllText: {
    fontSize: 14,
    color: '#2575fc',
    fontWeight: '600',
  },
  enrolledCoursesList: {
    paddingVertical: 10,
  },
  enrolledCourseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 280,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  enrolledCardContent: {
    padding: 16,
  },
  enrolledCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  enrolledCourseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  enrolledHeaderRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  aiBadge: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  aiBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  enrolledProgressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2575fc',
  },
  enrolledProgressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  enrolledProgressFill: {
    height: '100%',
    backgroundColor: '#2575fc',
    borderRadius: 3,
  },
  enrolledCourseDetails: {
    marginBottom: 12,
  },
  enrolledDetailText: {
    fontSize: 12,
    color: '#666',
  },
  continueButton: {
    backgroundColor: '#28a745',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recommendedCoursesList: {
    paddingVertical: 10,
  },
  recommendedCourseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 280,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedCourseImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recommendedCardContent: {
    padding: 12,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendedAuthor: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  recommendedDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  recommendedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  enrollButton: {
    backgroundColor: '#2575fc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  enrolledButton: {
    backgroundColor: '#28a745',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  lectureInfo: {
    fontSize: 10,
    color: '#666',
  },
  showMoreButton: {
    alignSelf: 'center',
    backgroundColor: '#2575fc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  showMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyProgressScreen;
