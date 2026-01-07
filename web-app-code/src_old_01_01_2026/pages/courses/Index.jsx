// pages/courses/Index.jsx (updated with styled components)
import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../../shared/store/redux/slices/dashboardSlice';
import { fetchEnrolledCourses } from '../../shared/store/redux/slices/enrolledSlice';
import styled from 'styled-components';
import { theme } from '../../shared/store/theme/index';
import styles from './Courses.module.scss';
import CourseCard from './components/CourseCard';
import PaginationComponent from '../../components/PaginationComponent';
import LoadSpinner from '../../components/LoadSpinner';
import CourseFilter from '../../components/CourseFilter';

const PageContainer = styled.div`
  color: ${theme.colors.textPrimary};
  font-family: ${theme.fonts.family};
`;

const HeaderSection = styled.div``;

const ResultsText = styled.div``;

const LoadingWrapper = styled.div``;

const Index = ({ collapsed }) => {
  const dispatch = useDispatch();

  // Redux state
  const { courses: allCourses, status: dashboardStatus, error: dashboardError } = useSelector((state) => state.dashboard || { courses: [], status: 'idle', error: null });
  const { courseIds: enrolledCourseIds, status: enrolledStatus, error: enrolledError } = useSelector((state) => state.enrolled || { courseIds: [], status: 'idle', error: null });

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 15;

  const navState = {
    from: 'courses',
    fromTitle: 'Courses',
    returnTo: '/courses'
  };

  const enrolledIds = useMemo(() => new Set(enrolledCourseIds), [enrolledCourseIds]);

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

  const totalCount = filteredCourses.length;

  const handlePageChange = (page) => setCurrentPage(page);

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
        <LoadingWrapper className={styles.loadingWrapper}>
          <LoadSpinner/>
        </LoadingWrapper>
      </PageContainer>
    );
  }

  if (dashboardStatus === 'failed' || enrolledStatus === 'failed') {
    return (
      <PageContainer>
        <Empty description={
          typeof dashboardError === 'string'
            ? dashboardError
            : typeof enrolledError === 'string'
            ? enrolledError
            : dashboardError?.message || enrolledError?.message || 'Failed to load courses'
        } />
      </PageContainer>
    );
  }

  return (
    <PageContainer className={styles.pageContainer}>
      <HeaderSection className={styles.headerSection}>
        <ResultsText className={styles.resultsText}>Courses</ResultsText>
        <CourseFilter
          courses={allCourses}
          status={dashboardStatus}
          onFilterChange={handleFilterChange}
        />
      </HeaderSection>
      {filteredCourses.length === 0 ? (
        <Empty description="No courses found" />
      ) : (
        <>
          <Row className={styles.coursesGrid} gutter={[20, 20]}>
            {displayedCourses.map((course) => (
              <Col key={course.course_id} {...getColumnSpan()}>
                <CourseCard course={course} isEnrolled={enrolledIds.has(course.course_id)} navState={navState} />
              </Col>
            ))}
          </Row>
          {totalCount > pageSize && (
            <PaginationComponent
              total={totalCount}
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

export default Index;