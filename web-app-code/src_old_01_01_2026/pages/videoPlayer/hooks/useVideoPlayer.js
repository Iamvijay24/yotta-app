import { useState, useRef, useEffect, useCallback } from "react";
import Hls from "hls.js";

export const useVideoPlayer = (
  contentUrl,
  topicId,
  initialProgressPercentage,
  onProgressUpdate,
) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const mountedRef = useRef(true);
  const hasResumedOnceRef = useRef(false);

  // Simplified refs
  const progressTrackingRef = useRef({
    lastReportedBucket: Math.floor(initialProgressPercentage / 10) * 10,
    lastUpdateTime: 0,
  });

  const initStateRef = useRef({
    isInitializing: false,
    currentTopicId: topicId,
    currentUrl: contentUrl,
  });
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    playbackSpeed: 1,
    loading: true,
    error: false,
    ready: false,
  });
  const [hlsState, setHlsState] = useState({
    levels: [],
    currentLevel: -1,
  });
  const isHls = contentUrl?.endsWith(".m3u8");

  // Complete cleanup function
  const cleanupVideo = useCallback(() => {
    console.log("🧹 Cleaning up video...");
   
    const video = videoRef.current;
   
    // Stop HLS first
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
        console.log("🗑️ HLS destroyed");
      } catch (e) {
        console.warn("HLS cleanup error:", e);
      }
      hlsRef.current = null;
    }
    // Clean video element
    if (video) {
      video.pause();
      video.removeAttribute("src");
      // Remove all source children
      while (video.firstChild) {
        video.removeChild(video.firstChild);
      }
      video.load();
      video.currentTime = 0;
    }
    setHlsState({ levels: [], currentLevel: -1 });
  }, []);

  // Detect topic/URL change and cleanup
  useEffect(() => {
    if (
      initStateRef.current.currentTopicId !== topicId ||
      initStateRef.current.currentUrl !== contentUrl
    ) {
      console.log("📌 Topic changed:", topicId);
     
      initStateRef.current.currentTopicId = topicId;
      initStateRef.current.currentUrl = contentUrl;
     
      // Reset progress tracking
      progressTrackingRef.current = {
        lastReportedBucket: Math.floor(initialProgressPercentage / 10) * 10,
        lastUpdateTime: 0,
      };
      hasResumedOnceRef.current = false; // RESET HERE
      cleanupVideo();
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
        ready: false,
        loading: true,
        error: false,
      }));
    }
  }, [topicId, contentUrl, initialProgressPercentage, cleanupVideo]);

  // Progress reporter
  const reportProgress = useCallback((currentTime, duration) => {
    if (!duration || duration <= 0) return;
   
    const now = Date.now();
    if (now - progressTrackingRef.current.lastUpdateTime < 2000) return;
   
    progressTrackingRef.current.lastUpdateTime = now;
   
    const currentProgress = Math.round((currentTime / duration) * 100);
    const bucket = Math.floor(currentProgress / 10) * 10;
   
    if (bucket > progressTrackingRef.current.lastReportedBucket && bucket <= 100) {
      progressTrackingRef.current.lastReportedBucket = bucket;
     
      if (onProgressUpdate) {
        onProgressUpdate(topicId, bucket, bucket >= 100);
      }
    }
  }, [topicId, onProgressUpdate]);

  // Initialize HLS
  const initializeHls = useCallback((video, url) => {
    if (!video || !url || initStateRef.current.isInitializing) return null;
   
    console.log("🎬 Initializing HLS...");
    initStateRef.current.isInitializing = true;
    const hls = new Hls({
      debug: false,
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90,
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
      startLevel: -1,
      autoStartLoad: true,
      maxLoadingDelay: 4,
      maxBufferHole: 0.5,
      manifestLoadingTimeOut: 10000,
      manifestLoadingMaxRetry: 3,
      levelLoadingTimeOut: 10000,
      levelLoadingMaxRetry: 3,
      fragLoadingTimeOut: 20000,
      fragLoadingMaxRetry: 3,
    });
    let hasManifestLoaded = false;
    let hasError = false;
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log("📎 HLS media attached");
      hls.loadSource(url);
    });
    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      console.log("✅ HLS manifest parsed");
      hasManifestLoaded = true;
     
      setHlsState({
        levels: data.levels,
        currentLevel: hls.currentLevel,
      });
      setPlayerState((prev) => ({
        ...prev,
        loading: false,
        ready: true,
        error: false,
      }));
      initStateRef.current.isInitializing = false;
    });
    hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
      setHlsState((prev) => ({ ...prev, currentLevel: data.level }));
    });
    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error("❌ HLS error:", data.type, data.details, "fatal:", data.fatal);
      if (data.fatal && !hasError) {
        hasError = true;
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            if (!hasManifestLoaded) {
              console.error("💥 Network error before manifest");
              setPlayerState((prev) => ({
                ...prev,
                error: true,
                loading: false,
                ready: false,
              }));
              initStateRef.current.isInitializing = false;
            } else {
              console.log("🔄 Network error, restarting load...");
              setTimeout(() => hls.startLoad(), 1000);
            }
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log("🔄 Media error, recovering...");
            hls.recoverMediaError();
            break;
          default:
            console.error("💥 Fatal HLS error");
            setPlayerState((prev) => ({
              ...prev,
              error: true,
              loading: false,
              ready: false,
            }));
            initStateRef.current.isInitializing = false;
            break;
        }
      }
    });
    hls.attachMedia(video);
    return hls;
  }, []);

  // Initialize native video
  const initializeNative = useCallback((video, url) => {
    if (!video || !url) return;
    console.log("📥 Loading native video");
   
    video.src = url;
    video.load();
    const onLoadedMetadata = () => {
      console.log("✅ Native metadata loaded, duration:", video.duration);
     
      setPlayerState((prev) => ({
        ...prev,
        duration: video.duration,
        ready: true,
        loading: false,
        error: false,
      }));
    };
    const onCanPlay = () => {
      console.log("✅ Native can play");
      setPlayerState((prev) => ({
        ...prev,
        loading: false,
        error: false,
        ready: true,
      }));
    };
    const onError = () => {
      console.error("❌ Native video error:", video.error);
      setPlayerState((prev) => ({
        ...prev,
        error: true,
        loading: false,
        ready: false,
      }));
    };
    video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    video.addEventListener("canplay", onCanPlay, { once: true });
    video.addEventListener("error", onError, { once: true });
    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
    };
  }, []);

  // Main initialization effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !contentUrl) return;
    console.log("🎥 Initializing video player:", { contentUrl, topicId, isHls });
    mountedRef.current = true;
    initStateRef.current.isInitializing = true;
    setPlayerState((prev) => ({
      ...prev,
      loading: true,
      error: false,
      ready: false,
    }));
    // Small delay to ensure video element is ready
    const initTimer = setTimeout(() => {
      if (!mountedRef.current) return;
      if (isHls && Hls.isSupported()) {
        hlsRef.current = initializeHls(video, contentUrl);
      } else if (!isHls) {
        initializeNative(video, contentUrl);
      } else {
        console.error("HLS not supported");
        setPlayerState((prev) => ({
          ...prev,
          error: true,
          loading: false,
        }));
        initStateRef.current.isInitializing = false;
      }
    }, 100);
    return () => {
      clearTimeout(initTimer);
      mountedRef.current = false;
    };
  }, [contentUrl, isHls, initializeHls, initializeNative]);

  // Resume from saved progress
  useEffect(() => {
  const video = videoRef.current;
  if (!video || !playerState.ready || !playerState.duration) return;

  // Prevent resume rerunning when user seeks or API updates
  if (hasResumedOnceRef.current) return;
  if (video.currentTime > 1) return;

  if (initialProgressPercentage <= 0 || initialProgressPercentage >= 100) return;

  const resumeTime = (initialProgressPercentage / 100) * playerState.duration;

  console.log("🎯 Resuming at:", resumeTime);

  hasResumedOnceRef.current = true;

  const timer = setTimeout(() => {
    if (video && mountedRef.current) {
      video.currentTime = resumeTime;
      setPlayerState((prev) => ({ ...prev, currentTime: resumeTime }));
    }
  }, isHls ? 1000 : 300);

  return () => clearTimeout(timer);
}, [
  playerState.ready,
  playerState.duration,
  isHls
]);


  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      if (!mountedRef.current) return;
     
      const currentTime = video.currentTime;
      const duration = video.duration;
      setPlayerState((prev) => {
        // Only update if changed significantly (avoid unnecessary renders)
        if (Math.abs(prev.currentTime - currentTime) < 0.1) return prev;
        return { ...prev, currentTime };
      });
      if (video.paused === false) {
        reportProgress(currentTime, duration);
      }
    };
    const onLoadedMetadata = () => {
      if (!mountedRef.current) return;
      console.log("📊 Metadata loaded:", video.duration);
      setPlayerState((prev) => ({ ...prev, duration: video.duration }));
    };
    const onDurationChange = () => {
      if (!mountedRef.current) return;
      console.log("📊 Duration changed:", video.duration);
      setPlayerState((prev) => ({ ...prev, duration: video.duration }));
    };
    const onPlay = () => {
      if (!mountedRef.current) return;
      setPlayerState((prev) => ({ ...prev, isPlaying: true }));
    };
    const onPause = () => {
      if (!mountedRef.current) return;
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
    };
    const onEnded = () => {
      if (!mountedRef.current) return;
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
     
      // Report 100% completion
      if (onProgressUpdate) {
        onProgressUpdate(topicId, 100, true);
      }
    };
    const onWaiting = () => {
      console.log("⏳ Video buffering...");
    };
    const onCanPlayThrough = () => {
      console.log("✅ Video can play through");
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplaythrough", onCanPlayThrough);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, [reportProgress, topicId, onProgressUpdate]);

  // Controls
  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video || !playerState.ready) return;
    video.play().catch((err) => {
      console.error("Play error:", err);
    });
  }, [playerState.ready]);
  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
  }, []);
  const seek = useCallback((time) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
   
    const clampedTime = Math.max(0, Math.min(time, video.duration));
    video.currentTime = clampedTime;
  }, []);
  const skip = useCallback((seconds) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
   
    const newTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    video.currentTime = newTime;
  }, []);
  const setVolume = useCallback((vol) => {
    const video = videoRef.current;
    if (!video) return;
   
    video.volume = vol;
    setPlayerState((prev) => ({
      ...prev,
      volume: vol,
      isMuted: vol === 0,
    }));
  }, []);
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
   
    const newMuted = !video.muted;
    video.muted = newMuted;
    setPlayerState((prev) => ({ ...prev, isMuted: newMuted }));
  }, []);
  const setSpeed = useCallback((speed) => {
    const video = videoRef.current;
    if (!video) return;
   
    video.playbackRate = speed;
    setPlayerState((prev) => ({ ...prev, playbackSpeed: speed }));
  }, []);
  const setQuality = useCallback((level) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setHlsState((prev) => ({ ...prev, currentLevel: level }));
    }
  }, []);
  const retry = useCallback(() => {
    console.log("🔄 Manual retry");
    cleanupVideo();
   
    setPlayerState((prev) => ({
      ...prev,
      error: false,
      loading: true,
      ready: false,
    }));
    initStateRef.current.isInitializing = false;
    // Force re-initialization by updating state
    setTimeout(() => {
      const video = videoRef.current;
      if (!video || !contentUrl) return;
      if (isHls && Hls.isSupported()) {
        hlsRef.current = initializeHls(video, contentUrl);
      } else {
        initializeNative(video, contentUrl);
      }
    }, 100);
  }, [contentUrl, isHls, cleanupVideo, initializeHls, initializeNative]);

  // Final cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanupVideo();
    };
  }, [cleanupVideo]);

  return {
    videoRef,
    playerState,
    hlsState,
    controls: {
      play,
      pause,
      seek,
      skip,
      setVolume,
      toggleMute,
      setSpeed,
      setQuality,
      retry,
    },
  };
};