// src/pages/course_player/Index.jsx (UPDATED WITH STYLED COMPONENTS)
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Typography, Empty, Button, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumb } from '../../shared/store/redux/slices/breadcrumbSlice';
import { fetchCourseStructure } from '../../shared/store/redux/slices/dashboardSlice';
import { fetchEnrolledCourses } from '../../shared/store/redux/slices/enrolledSlice';
import styled from 'styled-components';
import styles from './CoursePlayer.module.scss';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import Sidebar from '../coursePlayer/components/Sidebar';
import VideoPlayer from '../../pages/videoPlayer/Index';
import Quiz from '../coursePlayer/components/Quiz';
import LessonNavigation from '../coursePlayer/components/LessonNavigation';
import { useCourseProgress } from '../../pages/videoPlayer/hooks/useCourseProgress';
import { useVideoDurations } from '../../pages/videoPlayer/hooks/useVideoDurations';
import LoadSpinner from '../../components/LoadSpinner';
import courseOverview from '../../components/data/course_overview'; // Fallback data import
const { Title, Text, Paragraph } = Typography;

const PageContainer = styled.div``;
const MainContent = styled.div``;
const MainContentFail = styled.div``;
const ContentArea = styled.div``;
const DescriptionSection = styled.div``;
const LoadingContainer = styled.div``;
const ErrorContainer = styled.div``;
const WarningBanner = styled(Alert)``;

const CoursePlayer = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  console.log('CoursePlayer render - courseId:', courseId);
  const { breadcrumbContext } = location.state || {};
  const { from, fromTitle, returnTo } = breadcrumbContext || {};
  const [activeKey, setActiveKey] = useState(['1']);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [localLoading, setLocalLoading] = useState(true);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [hasAttemptedEnrolledFetch, setHasAttemptedEnrolledFetch] = useState(false);
  const [shouldNavigateToNotFound, setShouldNavigateToNotFound] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [courseStructure, setCourseStructure] = useState(location.state?.course || null);
  const { courseStructures = {}, status: dashboardStatus } = useSelector(state => state.dashboard || {});
  const { enrolledMap, userId: reduxUserId, status: enrolledStatus } = useSelector(state => state.enrolled || {});
  // Use raw values for fetch decisions
  const rawCourseStructure = courseStructures[courseId];
  const rawError = useSelector(state => state.dashboard?.courseStructureErrors?.[courseId] || null);
  // Apply fallback via useEffect to avoid side effects in useMemo
  useEffect(() => {
    if (rawCourseStructure) {
      setCourseStructure(rawCourseStructure);
      setLocalLoading(false);
      setUsingFallback(false);
      return;
    }
    if (rawError && !usingFallback && hasAttemptedFetch) {
      console.log('Applying fallback data due to API error');
      setUsingFallback(true);
      setLocalLoading(false);
      setCourseStructure({
        course: {
          title: courseOverview.title,
          description: courseOverview.description,
          thumbnail: courseOverview.thumbnail,
          overall_lessons: courseOverview.total_lessons,
          students: courseOverview.students,
          rating: courseOverview.rating,
          difficulty: courseOverview.difficulty,
          language: courseOverview.language,
          duration: courseOverview.duration,
          oldPrice: courseOverview.oldPrice,
          offerPrice: courseOverview.offerPrice,
          certificate: courseOverview.certificate,
          requirements: courseOverview.requirements,
          learnings: courseOverview.learnings,
          // Map any other fields as needed
        },
        structure: courseOverview.modules
      });
    }
  }, [rawCourseStructure, rawError, usingFallback, hasAttemptedFetch]);
  const [sections, setSections] = useState(location.state?.sections || []);
  // Get per-course loading and error states
  const loading = useSelector(state => state.dashboard?.courseStructureLoading?.[courseId] || false);
  const enrollmentId = enrolledMap[courseId]?.enrollment_id;
  const userId = reduxUserId || '39a2055a-7007-4a98-8956-138dabe603dev';
  const isEnrolled = !!enrollmentId;
  const hasHandledBackRef = useRef(false);
  /* ------------------ Fetch enrolled courses if needed ------------------ */
  useEffect(() => {
    if (enrolledStatus === 'succeeded' || !courseId || hasAttemptedEnrolledFetch) return;
    if (!enrolledMap[courseId]) {
      console.log('Attempting to fetch enrolled courses');
      dispatch(fetchEnrolledCourses(userId));
      setHasAttemptedEnrolledFetch(true);
    }
  }, [dispatch, courseId, enrolledMap, enrolledStatus, userId, hasAttemptedEnrolledFetch]);
  /* ------------------ Fetch course structure ONCE ------------------ */
  useEffect(() => {
    // Don't fetch if already attempted or no courseId
    if (!courseId || hasAttemptedFetch) return;
   
    // Don't fetch if we already have the raw structure
    if (rawCourseStructure) {
      setLocalLoading(false);
      return;
    }
   
    // Don't fetch if there's already a raw error
    if (rawError) {
      setLocalLoading(false);
      return;
    }
   
    // Only fetch if not currently loading and haven't attempted yet
    if (!loading && !hasAttemptedFetch) {
      console.log('Attempting to fetch course structure for:', courseId);
      setHasAttemptedFetch(true);
      dispatch(fetchCourseStructure(courseId));
    }
  }, [courseId, hasAttemptedFetch, rawCourseStructure, rawError, loading]); // Added raw deps to prevent stale closures
  /* ------------------ Handle error navigation ------------------ */
  useEffect(() => {
    if (rawError && hasAttemptedFetch && !rawCourseStructure && !usingFallback) {
      console.error('Course structure error:', rawError);
      setLocalLoading(false);
     
      if (rawError?.status === 404 || rawError?.message === 'Course not found') {
        console.log('Navigating to /not-found due to 404 error');
        setShouldNavigateToNotFound(true);
      }
    }
  }, [rawError, hasAttemptedFetch, rawCourseStructure, usingFallback]);
  /* ------------------ Navigate to not-found page ------------------ */
  useEffect(() => {
    // Only navigate if we have an error, loading is complete, AND no raw data (fallback doesn't prevent 404 nav)
    if (shouldNavigateToNotFound && !rawCourseStructure && !usingFallback) {
      const timer = setTimeout(() => {
        navigate('/not-found', { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldNavigateToNotFound, rawCourseStructure, usingFallback, navigate]);
  /* ------------------ Update local loading state ------------------ */
  useEffect(() => {
    // Stop loading when we have raw data, fallback is used, an error with fallback, or loading is complete
    if (courseStructure || usingFallback) {
      console.log('Course structure loaded successfully or fallback applied');
      setLocalLoading(false);
    } else if (rawError && hasAttemptedFetch) {
      console.log('Stopping loading due to error');
      setLocalLoading(false);
    } else if (!loading && hasAttemptedFetch && !rawCourseStructure && !rawError) {
      // Edge case: loading finished but no data and no error
      console.log('Loading finished with no data');
      setLocalLoading(false);
    }
  }, [courseStructure, usingFallback, rawError, loading, hasAttemptedFetch, rawCourseStructure]);
  /* ------------------ Derive sections from structure ------------------ */
  useEffect(() => {
    if (courseStructure?.structure && sections.length === 0) {
      console.log('Deriving sections from course structure');
      const derivedSections = courseStructure.structure.map((module, index) => ({
        key: module.lesson_id || `sec_${index + 1}`,
        title: module.title || 'Unnamed Section',
        lessons: module.topics?.map((topic, tIndex) => ({
          id: topic.topic_id || `${module.lesson_id}_top_${tIndex}`,
          title: topic.title || 'Unnamed Topic',
          type: topic.type || 'article',
          completed: false,
          contentUrl: topic.content_url,
          description: topic.description || 'No description available',
          thumbnail: topic.thumbnail,
          duration: topic.duration || 'N/A'
        })) || []
      }));
      setSections(derivedSections);
    }
  }, [courseStructure, sections.length]);
  /* ------------------ Unify topics list ------------------ */
  const allTopics = useMemo(() => {
    return sections.flatMap(section =>
      section.lessons.map(lesson => ({
        ...lesson,
        sectionTitle: section.title,
        sectionKey: section.key
      }))
    );
  }, [sections]);
  /* ------------------ Reset currentTopic if out of bounds ------------------ */
  useEffect(() => {
    if (allTopics.length > 0 && currentTopic >= allTopics.length) {
      setCurrentTopic(0);
    }
  }, [allTopics.length, currentTopic]);
  /* ------------------ Durations hook ------------------ */
  const {
    durations: rawDurations,
    totalDuration,
    loading: durationLoading,
    formatDuration
  } = useVideoDurations(allTopics);
  const durations = useMemo(() => rawDurations, [JSON.stringify(rawDurations)]);
  /* ------------------ Course progress hook ------------------ */
  const {
    progressMap,
    completedTopics: progressCompletedTopics,
    totalTopics: progressTotalTopics,
    progressPercentage: overallProgressPercentage,
    updateTopicProgress,
    loading: progressLoading
  } = useCourseProgress(courseId, allTopics, durations, totalDuration, enrollmentId, userId);
  const currentTopicData = allTopics[currentTopic];
  const totalTopics = allTopics.length;
  const completedTopics = progressCompletedTopics;
  const progressPercentage = overallProgressPercentage;
  const currentTopicId = currentTopicData?.id || allTopics[0]?.id;
  const currentLessonId = currentTopicData?.sectionKey;
  /* ------------------ Update breadcrumb ------------------ */
  useEffect(() => {
    const topicTitle = currentTopicData?.title || 'Topic';
    const items = [
      { title: 'My Progress', path: '/my-progress' },
      { title: 'Enrolled Courses', path: '/enrolled-courses' },
      { title: topicTitle }
    ];
    dispatch(setBreadcrumb(items));
  }, [dispatch, currentTopicData]);
  /* ------------------ Navigation helpers ------------------ */
  const handlePrevious = () => {
    if (currentTopic > 0) setCurrentTopic(currentTopic - 1);
  };
  const handleNext = () => {
    if (currentTopic < allTopics.length - 1) setCurrentTopic(currentTopic + 1);
  };
  const handleTopicClick = (topicId) => {
    const index = allTopics.findIndex(t => t.id === topicId);
    if (index !== -1) {
      setCurrentTopic(index);
    }
  };
  const handleProgressUpdate = useCallback((topicId, percentage, completed) => {
    if (!isEnrolled) return;
    updateTopicProgress(topicId, percentage, completed);
  }, [isEnrolled, updateTopicProgress]);
  /* ------------------ Browser back button handler ------------------ */
  useEffect(() => {
    const handlePopState = (event) => {
      if (hasHandledBackRef.current) return;
      hasHandledBackRef.current = true;
      navigate('/my-progress', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      hasHandledBackRef.current = false; // Reset on cleanup
    };
  }, [navigate]);
  /* ------------------ Error UI ------------------ */
  if (rawError && !loading && hasAttemptedFetch && !rawCourseStructure && !usingFallback && !courseStructure) {
    // Don't show error UI if we're about to navigate to not-found
    if (shouldNavigateToNotFound) {
      return (
        <PageContainer className={styles.pageContainer}>
          <LoadingContainer className={styles.loadingContainer}>
            <LoadSpinner/>
            <Text style={{ marginTop: 16 }}>Redirecting...</Text>
          </LoadingContainer>
        </PageContainer>
      );
    }
    return (
      <PageContainer className={styles.pageContainer}>
        <MainContentFail className={styles.mainContentFail}>
          <BreadcrumbComponent style={{ width: '100%', zIndex: 1000, paddingLeft: 40, paddingTop: 30,background: '#FFFFFF',}}/>
          <ContentArea className={styles.contentArea} style={{ paddingTop: 24 }}>
            <ErrorContainer className={styles.errorContainer}>
              <Title level={2} style={{ marginBottom: 16 }}>Course Not Available</Title>
              <Text type="secondary" style={{ fontSize: '16px', marginBottom: 32, display: 'block' }}>
                {rawError?.message || 'This course is not available.'}
              </Text>
              <Button
                type="primary"
                size="large"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  hasHandledBackRef.current = false;
                  navigate('/courses', { replace: true });
                }}
              >
                Back to Courses
              </Button>
            </ErrorContainer>
          </ContentArea>
        </MainContentFail>
      </PageContainer>
    );
  }
  /* ------------------ Loading UI ------------------ */
  if (localLoading || loading || (sections.length === 0 && !rawError && !usingFallback)) {
    return (
      <PageContainer className={styles.pageContainer}>
        <LoadingContainer className={styles.loadingContainer}>
          <LoadSpinner/>
          <Text style={{ marginTop: 16 }}>Loading course content...</Text>
        </LoadingContainer>
      </PageContainer>
    );
  }
  /* ------------------ Empty topics UI ------------------ */
  if (!allTopics.length) {
    return (
      <PageContainer className={styles.pageContainer}>
        <MainContent className={styles.mainContent}>
          <BreadcrumbComponent style={{ width: '100%', zIndex: 1000, paddingLeft: 40, paddingTop: 30,background: '#FFFFFF',}}/>
          <ContentArea className={styles.contentArea} style={{ paddingTop: 24 }}>
            <Empty description="No topics available." />
          </ContentArea>
        </MainContent>
        <div className={styles.sidebarContainer}>
          <Sidebar
            sections={sections}
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            allTopics={allTopics}
            currentTopicId={null}
            handleTopicClick={handleTopicClick}
            progressPercentage={0}
            completedTopics={0}
            totalTopics={0}
            courseData={courseStructure}
            courseId={courseId}
            navigate={navigate}
            progressMap={progressMap}
            totalDuration={0}
            formatDuration={() => '0:00'}
          />
        </div>
      </PageContainer>
    );
  }
  /* ------------------ Main render ------------------ */
  return (
    <PageContainer className={styles.pageContainer}>
      <MainContent className={styles.mainContent}>
        <BreadcrumbComponent style={{ width: '100%', zIndex: 1000, paddingLeft: 40, paddingTop: 30,background: '#FFFFFF',}}/>
        <ContentArea className={styles.contentArea}>
          {!isEnrolled && (
            <WarningBanner
              className={styles.warningBanner}
              message="Progress tracking unavailable"
              description="This course is not enrolled. Enroll to save your progress across sessions."
              type="warning"
              showIcon
              closable
            />
          )}
          {currentTopicData ? (
            <>
              {currentTopicData.type === 'video' ? (
                <VideoPlayer
                  currentTopic={currentTopicData}
                  onProgressUpdate={handleProgressUpdate}
                  initialProgressPercentage={progressMap[currentTopicData.id]?.percentage || 0}
                  currentLessonId={currentLessonId}
                  hasAIAssistance={ courseStructure?.course?.AI_exists || courseStructure?.course?.ai_modal}
                />
              ) : currentTopicData.type === 'quiz' ? (
                <Quiz
                  quizData={{ questions: [] }}
                  onComplete={() => {
                    handleProgressUpdate(currentTopicData.id, 100, true);
                    handleNext();
                  }}
                />
              ) : currentTopicData.type === 'article' ? (
                <DescriptionSection className={styles.descriptionSection}>
                  <Title level={3} style={{ marginBottom: 16 }}>
                    {currentTopicData.title}
                  </Title>
                  <Paragraph style={{ lineHeight: 1.7 }}>
                    {currentTopicData.description}
                  </Paragraph>
                  {currentTopicData.contentUrl && (
                    <Paragraph>
                      <a href={currentTopicData.contentUrl} target="_blank" rel="noopener noreferrer">
                        Read Full Article
                      </a>
                    </Paragraph>
                  )}
                  <Button
                    onClick={() => handleProgressUpdate(currentTopicData.id, 100, true)}
                    style={{ marginTop: 16 }}
                    type="primary"
                    disabled={!isEnrolled}
                  >
                    Mark as Complete {(!isEnrolled && '(Enroll to Track)')}
                  </Button>
                </DescriptionSection>
              ) : (
                <Empty description="Content type not supported" />
              )}
              <LessonNavigation
                currentTopicData={currentTopicData}
                currentTopic={currentTopic}
                totalTopics={totalTopics}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                courseData={courseStructure}
              />
            </>
          ) : (
            <Empty description="No topic selected" />
          )}
        </ContentArea>
      </MainContent>
      <div className={styles.sidebarContainer}>
        <Sidebar
          sections={sections}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
          allTopics={allTopics}
          currentTopicId={currentTopicId}
          handleTopicClick={handleTopicClick}
          progressPercentage={progressPercentage}
          completedTopics={completedTopics}
          totalTopics={totalTopics}
          courseData={courseStructure}
          courseId={courseId}
          navigate={navigate}
          progressMap={progressMap}
          totalDuration={totalDuration}
          formatDuration={formatDuration}
        />
      </div>
    </PageContainer>
  );
};
export default CoursePlayer;