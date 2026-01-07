import { useState, useEffect } from 'react';
const FALLBACK_DURATION = 624;
export const useVideoDurations = (topics) => {
  const [durations, setDurations] = useState({});
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadDurations = async () => {
      const newDurations = {};
      let total = 0;
      const promises = topics
        .filter(topic => topic.type === 'video' && topic.contentUrl)
        .map(async (topic) => {
          const key = topic.id;
          const cached = localStorage.getItem(`duration_${key}`);
          if (cached) {
            const dur = parseFloat(cached);
            newDurations[key] = dur;
            total += dur;
            return;
          }
          await new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.crossOrigin = 'anonymous';
            video.src = topic.contentUrl;
            const onLoaded = () => {
              const dur = video.duration;
              const finalDur = (isNaN(dur) || dur <= 0) ? FALLBACK_DURATION : dur;
              newDurations[key] = finalDur;
              total += finalDur;
              localStorage.setItem(`duration_${key}`, finalDur.toString());
              video.remove();
              resolve();
            };
            const onError = () => {
              newDurations[key] = FALLBACK_DURATION;
              total += FALLBACK_DURATION;
              localStorage.setItem(`duration_${key}`, FALLBACK_DURATION.toString());
              video.remove();
              resolve();
            };
            video.onloadedmetadata = onLoaded;
            video.onerror = onError;
          });
        });
      await Promise.all(promises);
      setDurations(newDurations);
      setTotalDuration(total);
      setLoading(false);
    };
    if (topics.length > 0) {
      loadDurations();
    } else {
      setLoading(false);
    }
  }, [topics]);
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m ${secs}s`;
  };
  return { durations, totalDuration, loading, formatDuration };
};
