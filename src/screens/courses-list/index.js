/* eslint-disable max-lines-per-function */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';

import CourseCard from '../../components/CourseCard';
import CourseFilter from '../../components/CourseFilter';
import PaginationComponent from '../../components/PaginationComponent';
import { fetchAllCourses } from '../../shared/store/redux/slices/dashboardSlice';
import { fetchEnrolledCourses } from '../../shared/store/redux/slices/enrolledSlice';
import CoursesListHeader from './CoursesListHeader';
import { EmptyState, ErrorState, LoadingState } from './CoursesListStates';
import { styles } from './styles';

const CoursesListScreen = ({ navigation }) => {
  const dispatch = useDispatch();

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

  const handleCoursePress = course => {
    const isEnrolled = enrolledIds.has(course.course_id || course.id);
    navigation.navigate('CourseDetails', { course, isEnrolled });
  };

  const renderCourseItem = ({ item }) => {
    const isEnrolledItem = enrolledIds.has(item.course_id || item.id);
    return (
      <CourseCard
        course={item}
        onPress={handleCoursePress}
        isEnrolled={isEnrolledItem}
      />
    );
  };

  const errorMessage = (() => {
    if (typeof dashboardError === 'string') return dashboardError;
    if (typeof enrolledError === 'string') return enrolledError;
    return (
      dashboardError?.message ||
      enrolledError?.message ||
      'Failed to load courses'
    );
  })();

  if (dashboardStatus === 'loading' || enrolledStatus === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <CoursesListHeader
          onPressAccount={() => navigation.navigate('Account')}
          onPressNotifications={() => console.log('Notifications pressed')}
        />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (dashboardStatus === 'failed' || enrolledStatus === 'failed') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <CoursesListHeader
          onPressAccount={() => navigation.navigate('Account')}
          onPressNotifications={() => console.log('Notifications pressed')}
        />
        <ErrorState
          message={errorMessage}
          onRetry={() => {
            dispatch(fetchAllCourses());
            dispatch(fetchEnrolledCourses());
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <CoursesListHeader
        onPressAccount={() => navigation.navigate('Account')}
        onPressNotifications={() => console.log('Notifications pressed')}
      />

      <View style={styles.content}>
        {displayedCourses.length === 0 ? (
          <EmptyState />
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

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsFilterModalVisible(true)}
      >
        <AntDesign name="filter" size={24} color="#fff" />
      </TouchableOpacity>

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

export default CoursesListScreen;
