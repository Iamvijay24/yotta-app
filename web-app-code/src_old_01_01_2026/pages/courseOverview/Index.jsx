import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumb } from '../../shared/store/redux/slices/breadcrumbSlice';
import { fetchCourseStructure } from '../../shared/store/redux/slices/dashboardSlice';
import { useAuth } from '../../shared/api/AuthContext';
import Img1 from '../../assets/course1.jpg';
import { PaymentAPI } from '../../services/payment.services';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import LoadSpinner from '../../components/LoadSpinner';
import courseOverview from '../../components/data/course_overview';
import styled from 'styled-components';
import AuthorSection from './components/AuthorSection';
import CourseHeader from './components/CourseHeader';
import SidebarFullCourse from './components/SidebarFullCourse';
import SidebarRequirements from './components/SidebarRequirements';
import TableOfContents from './components/TableOfContents';
import VideoThumbnail from './components/VideoThumbnail';
import './CourseOverview.module.scss';
import { PiArticleNyTimesLight, PiVideoLight } from 'react-icons/pi';
import { MdQuiz } from 'react-icons/md';
import styles from './CourseOverview.module.scss'
const PageContainer = styled.div``;
const MainContent = styled.main``;
const ContentGrid = styled.div``;
const LeftCol = styled.div``;
const RightCol = styled.div``;
const LoadingContainer = styled.div``;
const CourseOverview = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { from, fromTitle, returnTo } = location.state || {};
  const { user, isAuthenticated } = useAuth();
  const [activeKey, setActiveKey] = useState(['1']);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [videoDurations, setVideoDurations] = useState({});
  const [totalDurationFormatted, setTotalDurationFormatted] = useState(null);
  /* ---- Redux slice ------------------------------------------------ */
  const {
    courseStructures = {},
    courseStructureLoading = {},
    courseStructureErrors = {}
  } = useSelector(state => state.dashboard || {});
  /* ---- Resolve data (with fallback on error) ---------------------- */
  let rawStructure = courseStructures[courseId];
  const error = courseStructureErrors[courseId];
  // Use fallback data if API fails (hasError but no data)
  if (!rawStructure && error) {
    rawStructure = {
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
    };
  }
  const courseData = rawStructure?.course;
  const modules = rawStructure?.structure || [];
  /* Compute primitives for stable deps */
  const hasData = !!rawStructure;
  const isLoading = !!courseStructureLoading[courseId];
  const hasError = !!error;
  /* ---- Check for 404 errors ----------------------------------- */
  const isNotFoundError = useMemo(() => {
    if (!error) return false;
    if (typeof error === 'string') {
      return error.includes('404') || error.toLowerCase().includes('not found');
    }
    return error.status === 404 || error.message?.toLowerCase().includes('not found');
  }, [error]);
  /* ---- Fetch only when we have no data -------------------------- */
  useEffect(() => {
    if (!hasData && !isLoading && !hasError) {
      dispatch(fetchCourseStructure(courseId));
    }
  }, [dispatch, courseId, hasData, isLoading, hasError]);
  /* ---- Handle navigation for errors/not found ------------------- */
  useEffect(() => {
    // Only navigate if we have an error, loading is complete, AND no fallback data was used
    // (i.e., hasError && !hasData after fallback logic)
    if (hasError && !isLoading && !hasData) {
      // Show error briefly before redirecting (optional)
      const timer = setTimeout(() => {
        navigate('/not-found', { replace: true });
      }, 2000); // 2 second delay to show error message
    
      return () => clearTimeout(timer);
    }
  }, [hasError, isLoading, hasData, navigate]);
  /* ---- Helpers / mapping ----------------------------------------- */
  const capitalize = (str) => (!str ? 'Unknown' : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
  const parseApiDurationToSeconds = (durStr) => {
    if (!durStr) return 0;
    const trimmed = durStr.trim().toLowerCase();
    if (trimmed.includes('min') || trimmed.includes('mins')) {
      const match = trimmed.match(/(\d+)/);
      return match ? parseInt(match[1]) * 60 : 0;
    }
    const parts = trimmed.split(':');
    if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    } else if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };
  /* format seconds into human friendly string */
  const formatDuration = (seconds) => {
    if (!isFinite(seconds) || seconds === null || seconds === undefined) return null;
    const s = Math.max(0, Math.round(seconds));
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };
  const sections = modules.map((module, idx) => ({
    key: module.lesson_id || `sec_${idx + 1}`,
    title: module.title || 'Unnamed Section',
    lessons: (module.topics || []).map((t, tIdx) => {
      const durationSeconds = parseApiDurationToSeconds(t.duration);
      const formattedDuration = durationSeconds > 0 ? formatDuration(durationSeconds) : null;
      return {
        id: t.topic_id,
        title: t.title || 'Unnamed Topic',
        duration: formattedDuration,
        type: (t.type || 'article').toLowerCase(),
        thumbnail: t.thumbnail,
        contentUrl: t.content_url,
        description: t.description || 'No description available'
      }
    })
  }));
  useEffect(() => {
    const durationsMap = {};
    let totalSeconds = 0;
    sections.forEach(sec => {
      sec.lessons.forEach(lesson => {
        if (lesson.duration) {
          durationsMap[lesson.id] = lesson.duration;
          const seconds = parseApiDurationToSeconds(lesson.duration);
          totalSeconds += seconds;
        }
      });
    });
    setVideoDurations(durationsMap);
    if (totalSeconds > 0) {
      setTotalDurationFormatted(formatDuration(totalSeconds));
    } else {
      setTotalDurationFormatted(null);
    }
  }, [JSON.stringify(sections)]);
  /* ---- Breadcrumb ------------------------------------------------ */
  useEffect(() => {
    const items = [];
    if (from === 'recommended' || from === 'trending' || from === 'enrolled') {
      items.push({ title: 'My Progress', path: '/my-progress' });
      if (returnTo !== '/my-progress') {
        items.push({ title: fromTitle || 'Section', path: returnTo });
      }
    } else if (from === 'courses') {
      items.push({ title: 'Courses', path: '/courses' });
    } else {
      items.push({ title: 'Courses', path: '/courses' });
    }
    items.push({ title: courseData?.title || 'Course' });
    dispatch(setBreadcrumb(items));
  }, [dispatch, courseData, from, fromTitle, returnTo]);
  const totalLessons = sections.reduce((a, s) => a + s.lessons.length, 0);
  const getIcon = (type) => {
    switch (type) {
      case 'video':
        return <PiVideoLight style={{ fontSize: '13px', color: '#565C72' }} />;
      case 'article':
        return <PiArticleNyTimesLight style={{ fontSize: '13px', color: '#565C72' }} />;
      case 'quiz':
        return <MdQuiz style={{ fontSize: '13px', color: '#565C72' }} />;
      default:
        return null;
    }
  };
  const handlePurchase = async () => {
    if (!isAuthenticated || !user) {
      message.warning('Please log in to purchase this course');
      navigate('/account/login', { state: { from: location.pathname } });
      return;
    }
    setEnrollLoading(true);
    try {
      const userId = user?.sub || user?.['cognito:username'];
      const currentDomain = window.location.origin;
      const payload = {
        payment_plan: courseData.offerPrice || '400',
        user_id: userId,
        course_id: courseId,
        success_url: `${currentDomain}/payment-status?status=success&courseId=${courseId}`,
        cancel_url: `${currentDomain}/payment-status?status=failed&courseId=${courseId}`,
      };
      const { data } = await PaymentAPI.purchaseCourse(payload);
   
      if (data?.session_id) {
        localStorage.setItem('session_id', data.session_id);
        localStorage.setItem('course_id', courseId);
      }
   
      if (data?.checkout_url) {
        window.open(data.checkout_url, '_blank');
      } else {
        throw new Error('No checkout URL returned from backend');
      }
    } catch (err) {
      console.error('Payment error:', err);
      const msg =
        err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.data?.message ||
            err.message ||
            'Failed to process payment.';
      message.error(msg);
      if (err.response?.status === 401)
        setTimeout(() => navigate('/account/login'), 2000);
    } finally {
      setEnrollLoading(false);
    }
  };
  /* ---- FIXED RENDERING LOGIC ------------------------------------ */
  // If there's an error and loading is complete but no fallback data (e.g., non-recoverable)
  if (hasError && !isLoading && !hasData) {
    return (
      <PageContainer className={styles.pageContainer}>
        <LoadingContainer className={styles.loadingContainer}>
          <LoadSpinner />
        </LoadingContainer>
      </PageContainer>
    );
  }
  if (isLoading && !hasData) {
    return (
      <PageContainer className={styles.pageContainer}>
        <LoadingContainer className={styles.loadingContainer}>
          <LoadSpinner />
        </LoadingContainer>
      </PageContainer>
    );
  }
  if (!isLoading && !hasData) {
    navigate('/not-found', { replace: true });
    return null;
  }
  if (!courseData) {
    navigate('/not-found', { replace: true });
    return null;
  }
  /* ---- Main UI --------------------------------------------------- */
  return (
    <PageContainer className={styles.pageContainer}>
      <MainContent className={styles.mainContent}>
        <BreadcrumbComponent/>
        <ContentGrid className={styles.contentGrid}>
          {/* LEFT COLUMN */}
          <LeftCol className={styles.leftCol}>
            <VideoThumbnail thumbnail={courseData.thumbnail} title={courseData.title} fallback={Img1} />
            <CourseHeader title={courseData.title} description={courseData.description} />
            <AuthorSection rating={courseData.rating} />
            <TableOfContents
              sections={sections}
              activeKey={activeKey}
              setActiveKey={setActiveKey}
              videoDurations={videoDurations}
              totalLessons={courseData.overall_lessons || totalLessons}
              getIcon={getIcon}
            />
          </LeftCol>
          {/* RIGHT COLUMN (sidebar) */}
          <RightCol className={styles.rightCol}>
            <SidebarFullCourse
              courseData={courseData}
              totalDurationFormatted={totalDurationFormatted}
              totalLessons={courseData.overall_lessons || totalLessons}
              difficulty={capitalize(courseData.difficulty)}
              language={capitalize(courseData.language)}
              handlePurchase={handlePurchase}
              enrollLoading={enrollLoading}
            />
            <SidebarRequirements
              requirements={courseData.requirements || []}
              learnings={courseData.learnings || []}
            />
          </RightCol>
        </ContentGrid>
      </MainContent>
    </PageContainer>
  );
};
export default CourseOverview;