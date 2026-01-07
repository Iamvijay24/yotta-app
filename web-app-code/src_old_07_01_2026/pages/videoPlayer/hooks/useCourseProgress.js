// pages/videoPlayer/hooks/useCourseProgress.js (updated)
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TrackingAPI } from '../../../services/tracking.services';
export const updateTopicProgressAPI = async (enrollmentId, topicId, courseId, userId, watchTime, percentage, lessonId) => {
  if (!enrollmentId || !userId) {
    return { success: false, percentage: 0 };
  }

  const data = {
    enrollment_id: enrollmentId,
    topic_id: topicId,
    course_id: courseId,
    user_id: userId,
    watchTime,
    percentage,
    lesson_id: lessonId
  };

  try {
    await TrackingAPI.trackTopics(data);
    if (import.meta.env.DEV) console.log(`Progress tracked: ${percentage}%`);
    return { success: true, percentage };
  } catch (error) {
    console.error('Progress tracking error:', error);
    return { success: false, percentage };
  }
};
export const fetchAllProgressAPI = async (enrollmentId) => {
  if (!enrollmentId) {
    return { topicProgressMap: {}, overallPercentage: 0 };
  }
  try {
    const response = await TrackingAPI.getEnrollmentProgress(enrollmentId);
    const topicProgressMap = {};
    response.lessons?.forEach(lesson => {
      lesson.topics?.forEach(topic => {
        topicProgressMap[topic.topic_id] = {
          percentage: topic.percentage,
          completed: topic.percentage >= 100
        };
      });
    });
    return {
      topicProgressMap,
      overallPercentage: response.over_all_percentage || 0
    };
  } catch (error) {
    return { topicProgressMap: {}, overallPercentage: 0 };
  }
};
export const useCourseProgress = (courseId, allTopics, durations, totalDuration, enrollmentId, userId) => {
  const progressMapRef = useRef({});
  const [progressMapState, setProgressMapState] = useState({});
  const [apiOverallPercentage, setApiOverallPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const fetchInProgressRef = useRef(false);
  const updateQueueRef = useRef(new Map());
  const updateTimeoutRef = useRef(null);
  useEffect(() => {
    if (!enrollmentId) {
      setLoading(false);
      progressMapRef.current = {};
      setProgressMapState({});
      setApiOverallPercentage(0);
      return;
    }
    const fetchProgress = async () => {
      if (fetchInProgressRef.current) return;
      fetchInProgressRef.current = true;
      try {
        const fetched = await fetchAllProgressAPI(enrollmentId);
        progressMapRef.current = fetched.topicProgressMap;
        setProgressMapState(fetched.topicProgressMap);
        setApiOverallPercentage(fetched.overallPercentage);
      } catch (error) {
        progressMapRef.current = {};
        setProgressMapState({});
        setApiOverallPercentage(0);
      } finally {
        setLoading(false);
        fetchInProgressRef.current = false;
      }
    };
    fetchProgress();
  }, [enrollmentId]);
  const processBatchedUpdates = useCallback(async() => {
    if (updateQueueRef.current.size === 0) return;

    const updates = Array.from(updateQueueRef.current.entries());
    updateQueueRef.current.clear();

    const newProgressMap = { ...progressMapRef.current };

    for (const [topicId, { percentage, watchTime, lessonId }] of updates) {
      newProgressMap[topicId] = {
        percentage,
        completed: percentage >= 100
      };

      await updateTopicProgressAPI(
        enrollmentId,
        topicId,
        courseId,
        userId,
        watchTime,
        percentage,
        lessonId
      );
    }

    progressMapRef.current = newProgressMap;

    // Now safely refetch
    try {
      const updatedFetched = await fetchAllProgressAPI(enrollmentId);
      progressMapRef.current = updatedFetched.topicProgressMap;
      setProgressMapState(updatedFetched.topicProgressMap);
      setApiOverallPercentage(updatedFetched.overallPercentage);
    } catch {
      setProgressMapState(newProgressMap);
    }
  }, [enrollmentId, courseId, userId]);

  const updateTopicProgress = useCallback((topicId, percentage, completed, watchTime = 0) => {
    const topic = allTopics.find(t => t.id === topicId);
    const lessonId = topic?.sectionKey;
    updateQueueRef.current.set(topicId, { percentage, completed, watchTime, lessonId });
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(async () => {
      await processBatchedUpdates();
    }, 500);
    // Immediate local update
    progressMapRef.current = {
      ...progressMapRef.current,
      [topicId]: { percentage, completed: percentage >= 100 }
    };
    // Immediate UI update for completions
    if (completed || percentage >= 100) {
      setProgressMapState({ ...progressMapRef.current });
    }
  }, [processBatchedUpdates, allTopics]);
  const { progressPercentage, completedTopics, totalTopics } = useMemo(() => {
    let completed = 0;
    let total = 0;
    if (!allTopics || !durations) {
      return { progressPercentage: apiOverallPercentage, completedTopics: 0, totalTopics: 0 };
    }
    allTopics.forEach(topic => {
      if (topic.type === 'video' && durations[topic.id]) {
        total++;
        const prog = progressMapState[topic.id];
        if (prog?.completed) {
          completed++;
        }
      }
    });
    return {
      progressPercentage: apiOverallPercentage,
      completedTopics: completed,
      totalTopics: total
    };
  }, [allTopics, durations, progressMapState, apiOverallPercentage]);
  // Cleanup
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);
  return {
    progressMap: progressMapState,
    completedTopics,
    totalTopics,
    progressPercentage,
    updateTopicProgress,
    loading
  };
};
