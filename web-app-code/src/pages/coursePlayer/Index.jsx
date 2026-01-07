// src/pages/course_player/Index.jsx (UPDATED WITH STYLED COMPONENTS)
import { Alert, Button, Empty, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import LoadSpinner from '../../components/LoadSpinner';
import VideoPlayer from '../../pages/videoPlayer/Index';
import { useCourseProgress } from '../../pages/videoPlayer/hooks/useCourseProgress';
import { useVideoDurations } from '../../pages/videoPlayer/hooks/useVideoDurations';
import { setBreadcrumb } from '../../shared/store/redux/slices/breadcrumbSlice';
import { fetchCourseStructure } from '../../shared/store/redux/slices/dashboardSlice';
import { fetchEnrolledCourses } from '../../shared/store/redux/slices/enrolledSlice';
import LessonNavigation from '../coursePlayer/components/LessonNavigation';
import Quiz from '../coursePlayer/components/Quiz';
import Sidebar from '../coursePlayer/components/Sidebar';
import styles from './CoursePlayer.module.scss';
const { Title, Text, Paragraph } = Typography;
const PageContainer = styled.div``;
const MainContent = styled.div``;
const ContentArea = styled.div``;
const DescriptionSection = styled.div``;
const LoadingContainer = styled.div``;
const CenteredEmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
`;
const WarningBanner = styled(Alert)``;
const CoursePlayer = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  if (import.meta.env.DEV) console.log('CoursePlayer render - courseId:', courseId);
  const { breadcrumbContext } = location.state || {};
  const { from, fromTitle, returnTo } = breadcrumbContext || {};
  const [activeKey, setActiveKey] = useState(['1']);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [sections, setSections] = useState(location.state?.sections || []);
  const { courseStructures = {}, courseStructureLoading = {}, courseStructureErrors = {} } = useSelector(state => state.dashboard || {});
  const { enrolledMap, userId: reduxUserId, status: enrolledStatus } = useSelector(state => state.enrolled || {});
  /* ---- Resolve data (with fallback on error) ---------------------- */
  const rawCourseStructure = courseStructures[courseId];
  const error = courseStructureErrors[courseId];
  const courseStructure = rawCourseStructure;
  /* Compute primitives for stable deps */
  const hasData = !!rawCourseStructure;
  const isLoading = !!courseStructureLoading[courseId];
  const hasError = !!error;
  /* ---- Fetch only when we have no data -------------------------- */
  useEffect(() => {
    if (!hasData && !isLoading && !hasError) {
      dispatch(fetchCourseStructure(courseId));
    }
  }, [dispatch, courseId, hasData, isLoading, hasError]);
  const enrollmentId = enrolledMap[courseId]?.enrollment_id;
  const userId = reduxUserId || '39a2055a-7007-4a98-8956-138dabe603dev';
  const isEnrolled = !!enrollmentId;
  const hasHandledBackRef = useRef(false);
  /* ------------------ Fetch enrolled courses if needed ------------------ */
  useEffect(() => {
    if (enrolledStatus === 'succeeded' || !courseId) return;
    if (!enrolledMap[courseId]) {
      if (import.meta.env.DEV) console.log('Attempting to fetch enrolled courses');
      dispatch(fetchEnrolledCourses(userId));
    }
  }, [dispatch, courseId, enrolledMap, enrolledStatus, userId]);
  /* ------------------ Derive sections from structure ------------------ */
  useEffect(() => {
    if (courseStructure?.structure && sections.length === 0) {
      if (import.meta.env.DEV) console.log('Deriving sections from course structure');
      const sortedStructure = [...courseStructure.structure].sort((a, b) => a.order_index - b.order_index);
      const derivedSections = sortedStructure.map((module, index) => ({
        key: module.lesson_id || `sec_${index + 1}`,
        title: module.title || 'Unnamed Section',
        lessons: [...(module.topics || [])]
          .sort((a, b) => a.index - b.index)
          .map((topic, tIndex) => ({
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
  const currentLessonNumber = sections.findIndex(s => s.key === currentLessonId) + 1;
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
    if (index !== - 1) {
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
  const handleBackToCourses = () => {
    navigate('/courses', { replace: true });
  };
  /* ---- FIXED RENDERING LOGIC ------------------------------------ */
  if (isLoading) {
    return (
      <PageContainer className={styles.pageContainer}>
        <LoadingContainer className={styles.loadingContainer}>
          <LoadSpinner />
          <Text style={{ marginTop: 16 }}>Loading course content...</Text>
        </LoadingContainer>
      </PageContainer>
    );
  }
  const errorMessage = error?.message || 'Failed to load course structure';
  const renderEmptyUI = (description) => (
    <PageContainer className={styles.pageContainer}>
      <MainContent className={styles.mainContent}>
        <BreadcrumbComponent style={{ width: '100%', zIndex: 1000, paddingLeft: 40, paddingTop: 30, background: '#FFFFFF' }} />
        <ContentArea className={styles.contentArea} style={{ paddingTop: 24 }}>
          <CenteredEmptyContainer>
            <Empty description={description} />
            <Button
              type="primary"
              size="large"
              onClick={handleBackToCourses}
              style={{ marginTop: 16 }}
            >
              Back to Courses
            </Button>
          </CenteredEmptyContainer>
        </ContentArea>
      </MainContent>
      <div className={styles.sidebarContainer}>
        <Sidebar
          sections={[]}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
          allTopics={[]}
          currentTopicId={null}
          handleTopicClick={handleTopicClick}
          progressPercentage={0}
          completedTopics={0}
          totalTopics={0}
          courseData={null}
          courseId={courseId}
          navigate={navigate}
          progressMap={progressMap}
          totalDuration={0}
          formatDuration={() => '0:00'}
        />
      </div>
    </PageContainer>
  );
  if (hasError) {
    return renderEmptyUI(errorMessage);
  }
  if (!isLoading && !hasData) {
    return renderEmptyUI('Course not found');
  }
  if (!courseStructure) {
    return renderEmptyUI('Course not available');
  }
  /* ------------------ Empty topics UI ------------------ */
  if (!allTopics.length) {
    return (
      <PageContainer className={styles.pageContainer}>
        <MainContent className={styles.mainContent}>
          <BreadcrumbComponent style={{ width: '100%', zIndex: 1000, paddingLeft: 40, paddingTop: 30, background: '#FFFFFF' }} />
          <ContentArea className={styles.contentArea} style={{ paddingTop: 24 }}>
            <CenteredEmptyContainer>
              <Empty description="No topics available." />
              <Button
                type="primary"
                size="large"
                onClick={handleBackToCourses}
                style={{ marginTop: 16 }}
              >
                Back to Courses
              </Button>
            </CenteredEmptyContainer>
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
          {/* {enrolledStatus === 'succeeded' && !isEnrolled && (
            <WarningBanner
              className={styles.warningBanner}
              message="Progress tracking unavailable"
              description="This course is not enrolled. Enroll to save your progress across sessions."
              type="warning"
              showIcon
              closable
            />
          )} */}
          {currentTopicData ? (
            <>
              {currentTopicData.type === 'video' ? (
                <VideoPlayer
                  key={currentLessonId}
                  currentTopic={currentTopicData}
                  onProgressUpdate={handleProgressUpdate}
                  initialProgressPercentage={progressMap[currentTopicData.id]?.percentage || 0}
                  currentLessonId={currentLessonId}
                  currentLessonNumber={currentLessonNumber}
                  hasAIAssistance={courseStructure?.course?.AI_exists || courseStructure?.course?.ai_modal}
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
                <CenteredEmptyContainer>
                  <Empty description="Content type not supported" />
                </CenteredEmptyContainer>
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
            <CenteredEmptyContainer>
              <Empty description="No topic selected" />
            </CenteredEmptyContainer>
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