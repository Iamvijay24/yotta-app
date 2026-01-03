import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../shared/store/redux/slices/dashboardSlice';
import { fetchEnrolledCourses } from '../shared/store/redux/slices/enrolledSlice';
import { theme } from '../shared/store/theme';
import CourseCard from '../components/CourseCard';
import PaginationComponent from '../components/PaginationComponent';
import LoadSpinner from '../components/LoadSpinner';
import CourseFilter from '../components/CourseFilter';

const CoursesListScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // Redux state
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
    state => state.enrolled || { courseIds: [], status: 'idle', error: null },
  );

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    if (dashboardStatus === 'idle' && allCourses.length === 0) {
      dispatch(fetchAllCourses());
    }
  }, [dispatch, dashboardStatus, allCourses.length]);

  useEffect(() => {
    if (enrolledStatus === 'idle' && enrolledCourseIds.length === 0) {
      dispatch(fetchEnrolledCourses());
    }
  }, [dispatch, enrolledStatus, enrolledCourseIds.length]);

  useEffect(() => {
    setFilteredCourses(allCourses);
  }, [allCourses]);

  const enrolledIds = useMemo(
    () => new Set(enrolledCourseIds),
    [enrolledCourseIds],
  );

  const handleFilterChange = useCallback(newFiltered => {
    setFilteredCourses(newFiltered);
    setCurrentPage(1);
  }, []);

  const handlePageChange = page => setCurrentPage(page);

  const displayedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleEnroll = course => {
    // Navigate to course details with enroll option
    navigation.navigate('CourseDetails', { course });
  };

  const handleCoursePress = course => {
    // Navigate to course details with enrollment status
    const isEnrolled = enrolledIds.has(course.course_id || course.id);
    navigation.navigate('CourseDetails', { course, isEnrolled });
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item)}
    >
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.title || item.name}
        </Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category || 'General'}</Text>
        </View>
      </View>

      <Text style={styles.courseDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.courseDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Instructor:</Text>
          <Text style={styles.detailValue}>{item.instructor || 'TBD'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{item.duration || 'TBD'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.enrollButton,
          enrolledIds.has(item.course_id || item.id) && styles.enrolledButton,
        ]}
        onPress={() => handleEnroll(item)}
        disabled={enrolledIds.has(item.course_id || item.id)}
      >
        <Text style={styles.enrollButtonText}>
          {enrolledIds.has(item.course_id || item.id)
            ? 'Enrolled'
            : 'Enroll Now'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Handle loading or error states
  if (dashboardStatus === 'loading' || enrolledStatus === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Courses List</Text>
          <Text style={styles.headerSubtitle}>Recommended courses</Text>
        </View>
        <View style={styles.emptyState}>
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
          <Text style={styles.headerTitle}>Courses List</Text>
          <Text style={styles.headerSubtitle}>Recommended courses</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {typeof dashboardError === 'string'
              ? dashboardError
              : typeof enrolledError === 'string'
              ? enrolledError
              : dashboardError?.message ||
                enrolledError?.message ||
                'Failed to load courses'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              dispatch(fetchAllCourses());
              dispatch(fetchEnrolledCourses());
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Courses</Text>
      </View>

      {/* Courses Grid */}
      <View style={styles.content}>
        {displayedCourses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No courses found</Text>
          </View>
        ) : (
          <FlatList
            data={displayedCourses}
            renderItem={renderCourseItem}
            keyExtractor={item => item.course_id || item.id}
            contentContainerStyle={styles.coursesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Pagination */}
      {filteredCourses.length > pageSize && (
        <View style={styles.paginationContainer}>
          <PaginationComponent
            total={filteredCourses.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageSize={pageSize}
          />
        </View>
      )}

      {/* Floating Filter Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsFilterModalVisible(true)}
      >
        <MaterialIcons name="filter" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Course Filter Modal */}
      <CourseFilter
        courses={allCourses}
        status={dashboardStatus}
        onFilterChange={handleFilterChange}
        isModalVisible={isFilterModalVisible}
        onModalClose={() => setIsFilterModalVisible(false)}
      />
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  coursesList: {
    paddingHorizontal: 20,
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
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4a5568',
    textTransform: 'uppercase',
  },
  courseDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#a0aec0',
    minWidth: 80,
  },
  detailValue: {
    fontSize: 13,
    color: '#4a5568',
    flex: 1,
  },
  enrollButton: {
    backgroundColor: '#2575fc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrolledButton: {
    backgroundColor: '#48bb78',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2575fc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3b82f6',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CoursesListScreen;
