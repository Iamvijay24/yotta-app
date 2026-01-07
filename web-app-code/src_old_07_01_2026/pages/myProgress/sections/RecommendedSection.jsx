import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Row, Col, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumb } from '../../../shared/store/redux/slices/breadcrumbSlice';
import { fetchAllCourses } from '../../../shared/store/redux/slices/dashboardSlice';
import { fetchEnrolledCourses } from '../../../shared/store/redux/slices/enrolledSlice';
import styled from 'styled-components';
import { theme } from '../../../shared/store/theme/index';
import styles from '../MyProgress.module.scss';
import CourseCard from '../../courses/components/CourseCard';
import PaginationComponent from '../../../components/PaginationComponent';
import BreadcrumbComponent from '../../../components/BreadcrumbComponent';
import LoadSpinner from '../../../components/LoadSpinner';
import CourseFilter from '../../../components/CourseFilter';
import { useLayout } from '../../../shared/contexts/LayoutContext.hooks';

const { Text } = Typography;

const PageContainer = styled.div`
  color: ${theme.colors.textPrimary};
  font-family: ${theme.fonts.family};
`;

const HeaderSection = styled.div``;

const LoadingWrapper = styled.div``;

const Recommended_section = () => {
  const { collapsed } = useLayout();
  const dispatch = useDispatch();
  // Redux state
  const { courses: allCourses, status: dashboardStatus, error: dashboardError } = useSelector((state) => state.dashboard || { courses: [], status: 'idle', error: null });
  const { courseIds: enrolledCourseIds, status: enrolledStatus, error: enrolledError } = useSelector((state) => state.enrolled || { courseIds: [], status: 'idle', error: null });
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const navState = {
    from: 'recommended',
    fromTitle: 'Yotta Recommended Courses',
    returnTo: '/recommended-courses'
  };
  const enrolledIds = useMemo(() => new Set(enrolledCourseIds), [enrolledCourseIds]);
  useEffect(() => {
    dispatch(setBreadcrumb([
      { title: 'My Progress', path: '/my-progress' },
      { title: 'Yotta Recommended Courses' }
    ]));
  }, [dispatch]);
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
    if (window.innerWidth <= 768) {
      return { xs: 24, sm: 12, md: 8, lg: 8, xl: 8 };
    }
    return {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 8,
      xl: collapsed ? 6 : 8
    };
  };
  // Handle loading or error states
  if (dashboardStatus === 'loading' || enrolledStatus === 'loading') {
    return (
      <PageContainer>
        <BreadcrumbComponent style={{ margin: '0 40px' }} />
        <LoadingWrapper className={styles.loadingWrapper}>
          <LoadSpinner />
        </LoadingWrapper>
      </PageContainer>
    );
  }
  if (dashboardStatus === 'failed' || enrolledStatus === 'failed') {
    return (
      <PageContainer>
        <BreadcrumbComponent style={{ margin: '0 40px' }} />
        <Empty description={dashboardError || enrolledError || 'Failed to load recommended courses'} style={{ padding: '70px 0' }} />
      </PageContainer>
    );
  }
  return (
    <PageContainer className={styles.sectionPageContainer}>
      <BreadcrumbComponent />
      <HeaderSection className={styles.headerSection}>
        <Text className={styles.resultsText}>Yotta Recommended Courses</Text>
        <CourseFilter
          courses={allCourses}
          status={dashboardStatus}
          onFilterChange={handleFilterChange}
        />
      </HeaderSection>
      {filteredCourses.length === 0 ? (
        <Empty description="No recommended courses found" />
      ) : (
        <>
          <Row className={styles.sectionCoursesGrid} gutter={[20, 20]}>
            {displayedCourses.map((course) => (
              <Col
                key={course.course_id}
                {...getColumnSpan()}
              >
                <CourseCard course={course} isEnrolled={enrolledIds.has(course.course_id)} navState={navState} />
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

export default Recommended_section;
