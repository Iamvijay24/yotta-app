import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Row, Col, Empty, message } from 'antd';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumb } from '../../../shared/store/redux/slices/breadcrumbSlice';
import { fetchAllCourses } from '../../../shared/store/redux/slices/dashboardSlice';
import { fetchEnrolledCourses } from '../../../shared/store/redux/slices/enrolledSlice';
import styled from 'styled-components';
import { theme } from '../../../shared/store/theme/index';
import styles from '../MyProgress.module.scss';
import PaginationComponent from '../../../components/PaginationComponent';
import BreadcrumbComponent from '../../../components/BreadcrumbComponent';
import EnrolledCard from '../components/EnrolledCard';
import { TrackingAPI } from '../../../services/tracking.services';
import LoadSpinner from '../../../components/LoadSpinner';
import CourseFilter from '../../../components/CourseFilter';

const { Text } = Typography;

const PageContainer = styled.div`
  color: ${theme.colors.textPrimary};
  font-family: ${theme.fonts.family};
`;

const HeaderSection = styled.div``;

const LoadingContainer = styled.div``;

const Enrolled_section = () => {
  const collapsed = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses: allCourses, status: dashboardStatus, error: dashboardError } = useSelector((state) => state.dashboard || { courses: [], status: 'idle', error: null });
  const {
    courseIds: enrolledCourseIds,
    enrolledMap,
    status: enrolledStatus,
    error: enrolledError
  } = useSelector((state) => state.enrolled || { courseIds: [], enrolledMap: {}, status: 'idle', error: null });
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [progressMap, setProgressMap] = useState({});
  const pageSize = 8;
  const enrolledState = {
    from: 'enrolled',
    fromTitle: 'Enrolled Courses',
    returnTo: '/enrolled-courses'
  };
  // Memoized computation of enrolledCourses - Updated to use progressMap
  const enrolledCourses = useMemo(() => {
    if (dashboardStatus !== 'succeeded' || enrolledStatus !== 'succeeded' || enrolledCourseIds.length === 0) return [];
    return allCourses
      .filter(course => enrolledCourseIds.includes(course.course_id))
      .map(course => {
        const progressInfo = progressMap[course.course_id] || {};
        return {
          ...course,
          id: course.course_id,
          enrolled: true,
          progress: progressInfo.percentage || 0,
          enrollment_id: enrolledMap[course.course_id]?.enrollment_id || `enr_${course.course_id}`,
          currentLecture: progressInfo.completed || 0,
          totalLectures: progressInfo.total || 0,
        };
      });
  }, [allCourses, dashboardStatus, enrolledCourseIds, enrolledMap, progressMap, enrolledStatus]);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { title: 'My Progress', path: '/my-progress' },
      { title: 'Enrolled Courses' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    if (dashboardStatus === 'idle' && allCourses.length === 0) {
      dispatch(fetchAllCourses());
    }
  }, [dispatch, dashboardStatus]);

  // Fetch enrolled courses once
  useEffect(() => {
    if (enrolledStatus === 'idle') {
      dispatch(fetchEnrolledCourses());
    }
  }, [dispatch, enrolledStatus]);

  // Fetch courses progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (enrolledStatus !== 'succeeded') return;
      try {
        const response = await TrackingAPI.getAllCourseProgress();
        if (response?.courses) {
          const progressData = {};
          response.courses.forEach((course) => {
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
        message.error('Failed to fetch course progress');
      }
    };
    fetchProgress();
    const interval = setInterval(fetchProgress, 30000);
    return () => clearInterval(interval);
  }, [enrolledStatus]);

  const handleFilterChange = (newFiltered) => {
    setFilteredCourses(newFiltered);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getColumnSpan = () => {
    return {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 6
    };
  };

  const handleCourseClick = (course) => {
    navigate(`/courses/${course.id}/play`, {
      state: {
        course,
        ...enrolledState
      }
    });
  };

  // Handle loading or error states
  if (dashboardStatus === 'loading' || enrolledStatus === 'loading') {
    return (
      <PageContainer >
        <BreadcrumbComponent style={{ margin: '0 40px' }} />
        <LoadingContainer className={styles.loadingContainer}>
          <LoadSpinner />
        </LoadingContainer>
      </PageContainer>
    );
  }
  if (dashboardStatus === 'failed' || enrolledStatus === 'failed') {
    return (
      <PageContainer>
        <BreadcrumbComponent style={{ margin: '0 40px' }} />
        <Empty description={dashboardError || enrolledError || 'Failed to load enrolled courses'} style={{ padding: '70px 0' }} />
      </PageContainer>
    );
  }

  return (
    <PageContainer className={styles.sectionPageContainer}>
      <BreadcrumbComponent />
      <HeaderSection className={styles.headerSection}>
        <Text className={styles.resultsText}>Enrolled Courses</Text>
        <CourseFilter
          courses={enrolledCourses}
          status={enrolledStatus}
          onFilterChange={handleFilterChange}
        />
      </HeaderSection>
      {enrolledCourses.length === 0 ? (
        <Empty description="No courses enrolled" />
      ) : filteredCourses.length === 0 ? (
        <Empty description="No matching courses found" />
      ) : (
        <>
          <Row className={styles.sectionCoursesGrid} gutter={[20, 20]}>
            {displayedCourses.map((course) => (
              <Col
                key={course.id}
                {...getColumnSpan()}
              >
                <div className={styles.clickableWrapper} onClick={() => handleCourseClick(course)}>
                  <EnrolledCard course={course} continueState={enrolledState} />
                </div>
              </Col>
            ))}
          </Row>
          {filteredCourses.length > pageSize && (
            <PaginationComponent
              total={filteredCourses.length}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              pageSize={pageSize}
            />
          )}
        </>
      )}
    </PageContainer>
  );
};
export default Enrolled_section;