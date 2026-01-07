import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Button, Empty, message } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../../shared/store/redux/slices/dashboardSlice';
import { fetchEnrolledCourses } from '../../shared/store/redux/slices/enrolledSlice';
import styled from 'styled-components';
import { theme } from '../../shared/store/theme/index';
import styles from './MyProgress.module.scss';
import EnrolledCard from './components/EnrolledCard';
import RecommendedCard from './components/RecommendedCardComponent';
import { TrackingAPI } from '../../services/tracking.services';
import LoadSpinner from '../../components/LoadSpinner';
const { Title, Text } = Typography;
const PageContainer = styled.div`
  color: ${theme.colors.textPrimary};
  font-family: ${theme.fonts.family};
`;
const Header = styled.div``;
const Heading = styled.div``;
const StatsGrid = styled.div``;
const CoursesSection = styled.div``;
const SectionHeader = styled.div``;
const BrowseButton = styled.div``;
const CoursesGrid = styled.div``;
const RecommendedGrid = styled.div``;
const LoadingContainer = styled.div``;
const StatCard = styled.div``;
const IconWrapper = styled.div``;
const StatWrapper = styled.div``;
const StatValue = styled.div``;
const ClickableWrapper = styled.div``;
const MyProgress = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courses: allCourses, status: dashboardStatus, error: dashboardError } = useSelector(
    (state) => state.dashboard || { courses: [], status: 'idle', error: null }
  );
  const { courseIds: enrolledCourseIds, status: enrolledStatus, error: enrolledError } =
    useSelector((state) => state.enrolled || { courseIds: [], enrolledMap: {}, status: 'idle', error: null });
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const enrolledState = { from: 'enrolled', fromTitle: 'Enrolled Courses', returnTo: '/my-progress' };
  const recommendedState = { from: 'recommended', fromTitle: 'Yotta Recommended Courses', returnTo: '/my-progress' };
  const trendingState = { from: 'trending', fromTitle: 'Top Trending Courses', returnTo: '/my-progress' };
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
          message.destroy();
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        if (err.response?.status === 401) {
          message.warning('Session may have expired. Please refresh the page.');
        } else {
          message.error('Failed to fetch course progress');
        }
      }
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 60000);  
    return () => clearInterval(interval);
  }, [enrolledStatus]);

  // Helper function to parse duration string (HH:MM:SS) to decimal hours
  const parseDurationToHours = (durationStr) => {
    if (!durationStr) return 0;
    const parts = durationStr.split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    const seconds = parts[2] || 0;
    return hours + (minutes / 60) + (seconds / 3600);
  };
  // Prepare data for display
  const enrolledCourses = useMemo(() => {
    if (dashboardStatus !== 'succeeded' || enrolledStatus !== 'succeeded' || enrolledCourseIds.length === 0)
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
      });
  }, [allCourses, dashboardStatus, enrolledCourseIds, progressMap, enrolledStatus]);
  const enrolledIds = useMemo(() => new Set(enrolledCourses.map((c) => c.id)), [enrolledCourses]);
  useEffect(() => {
    if (dashboardStatus === 'succeeded') {
      setRecommendedCourses(allCourses);
      setTrendingCourses(allCourses);
    }
  }, [dashboardStatus, allCourses]);
  const displayedEnrolled = enrolledCourses.slice(0, 4);
  const displayedRecommended = recommendedCourses.slice(0, 2);
  const displayedTrending = trendingCourses.slice(0, 4);
  const numEnrolled = enrolledCourses.length;
  const totalHoursSpent = Math.round(
    enrolledCourses.reduce((sum, course) => {
      const progress = course.progress / 100;
      const totalHours = parseDurationToHours(course.duration);
      return sum + (totalHours * progress);
    }, 0)
  );
  const numCompleted = enrolledCourses.filter((course) => course.progress === 100).length;
  const stats = [
    { icon: <BookOutlined />, value: numEnrolled.toString(), label: 'Courses Enrolled', bgColor: theme.colors.statBlue },
    { icon: <ClockCircleOutlined />, value: totalHoursSpent.toString(), label: 'Total Hours Spent', bgColor: theme.colors.statYellow },
    { icon: <CheckCircleOutlined />, value: numCompleted.toString(), label: 'Courses Completed', bgColor: theme.colors.statTeal },
  ];
  const handleBrowseEnrolled = () => navigate('/enrolled-courses');
  const handleBrowseRecommended = () => navigate('/recommended-courses');
  const handleBrowseTrending = () => navigate('/trending-courses');
  const handleEnrolledCourseClick = (course) => {
    navigate(`/courses/${course.id}/play`, { state: { course, ...enrolledState } });
  };
  const handleRecommendedCourseClick = (course) => {
    const isEnrolled = enrolledIds.has(course.course_id);
    const path = isEnrolled ? `/courses/${course.course_id}/play` : `/courses/${course.course_id}`;
    navigate(path, { state: { ...(isEnrolled ? { course } : {}), ...recommendedState } });
  };
  const handleTrendingCourseClick = (course) => {
    const isEnrolled = enrolledIds.has(course.course_id);
    const path = isEnrolled ? `/courses/${course.course_id}/play` : `/courses/${course.course_id}`;
    navigate(path, { state: { ...(isEnrolled ? { course } : {}), ...trendingState } });
  };
  if (dashboardStatus === 'loading' || enrolledStatus === 'loading') {
    return (
      <PageContainer>
        <LoadingContainer className={styles.loadingContainer}>
          <LoadSpinner />
        </LoadingContainer>
      </PageContainer>
    );
  }
  if (dashboardStatus === 'failed' || enrolledStatus === 'failed') {
    return (
      <PageContainer>
        <Empty description={dashboardError || enrolledError || 'Failed to load courses'} />
      </PageContainer>
    );
  }
  return (
    <PageContainer className={styles.pageContainer}>
      <Header className={styles.header}>
        <Heading className={styles.pageTitle} >My Progress</Heading>
      </Header>
      <StatsGrid className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={index} className={styles.statCard}>
            <IconWrapper className={styles.iconWrapper} style={{ backgroundColor: stat.bgColor }}>
              {stat.icon}
            </IconWrapper>
            <StatWrapper className={styles.statWrapper}>
              <StatValue className={styles.statValue}>{stat.value}</StatValue>
              <Text className={styles.statLabel}>{stat.label}</Text>
            </StatWrapper>
          </StatCard>
        ))}
      </StatsGrid>
      {/* Enrolled Courses */}
      <CoursesSection className={styles.coursesSection}>
        <SectionHeader className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>Recently Enrolled Courses ({enrolledCourses.length})</Text>
          <BrowseButton className={styles.browseButton} onClick={handleBrowseEnrolled}>
            Browse all
            <ArrowRightOutlined />
          </BrowseButton>
        </SectionHeader>
        {enrolledCourses.length === 0 ? (
          <Empty description="No courses enrolled" />
        ) : (
          <CoursesGrid className={styles.coursesGrid}>
            {displayedEnrolled.map((course) => (
              <ClickableWrapper key={course.id} className={styles.clickableWrapper} onClick={() => handleEnrolledCourseClick(course)}>
                <EnrolledCard course={course} continueState={enrolledState} />
              </ClickableWrapper>
            ))}
          </CoursesGrid>
        )}
      </CoursesSection>
      {/* Recommended Courses */}
      <CoursesSection className={styles.coursesSection}>
        <SectionHeader className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>Yotta Recommended Courses</Text>
          <browseButton className={styles.browseButton} type="text" onClick={handleBrowseRecommended}>
            Browse all
            <ArrowRightOutlined />
          </browseButton>
        </SectionHeader>
        {dashboardStatus === 'loading' ? (
          <LoadingContainer className={styles.loadingContainer}>
            <LoadSpinner />
          </LoadingContainer>
        ) : dashboardStatus === 'failed' ? (
          <Empty description={dashboardError || 'Failed to load recommended courses'} />
        ) : (
          <RecommendedGrid className={styles.recommendedGrid}>
            {displayedRecommended.map((course) => (
              <ClickableWrapper key={course.course_id} className={styles.clickableWrapper} onClick={() => handleRecommendedCourseClick(course)}>
                <RecommendedCard course={course} isEnrolled={enrolledIds.has(course.course_id)} navState={recommendedState} />
              </ClickableWrapper>
            ))}
          </RecommendedGrid>
        )}
      </CoursesSection>
      {/* Trending Courses */}
      <CoursesSection className={styles.coursesSection}>
        <SectionHeader className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>Top Trending Courses</Text>
          <browseButton className={styles.browseButton} type="text" onClick={handleBrowseTrending}>
            Browse all
            <ArrowRightOutlined />
          </browseButton>
        </SectionHeader>
        {dashboardStatus === 'loading' ? (
          <LoadingContainer className={styles.loadingContainer}>
            <LoadSpinner />
          </LoadingContainer>
        ) : dashboardStatus === 'failed' ? (
          <Empty description={dashboardError || 'Failed to load trending courses'} />
        ) : (
          <RecommendedGrid className={styles.recommendedGrid}>
            {displayedTrending.map((course) => (
              <ClickableWrapper key={course.course_id} className={styles.clickableWrapper} onClick={() => handleTrendingCourseClick(course)}>
                <RecommendedCard course={course} isEnrolled={enrolledIds.has(course.course_id)} navState={trendingState} />
              </ClickableWrapper>
            ))}
          </RecommendedGrid>
        )}
      </CoursesSection>
    </PageContainer>
  );
};
export default MyProgress;