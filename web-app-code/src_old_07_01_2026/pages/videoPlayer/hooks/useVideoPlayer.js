import { useState, useRef, useEffect, useCallback, useReducer } from "react";
import Hls from "hls.js";

// Constants
const HLS_CONFIG = {
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
};

const PROGRESS_UPDATE_INTERVAL = 2000;
const RESUME_DELAY_HLS = 1000;
const RESUME_DELAY_NATIVE = 300;
const INIT_DELAY = 100;
const RETRY_DELAY = 1000;

// Action types for player state reducer
const PLAYER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_READY: 'SET_READY',
  SET_ERROR: 'SET_ERROR',
  SET_PLAYING: 'SET_PLAYING',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_DURATION: 'SET_DURATION',
  SET_VOLUME: 'SET_VOLUME',
  SET_MUTED: 'SET_MUTED',
  SET_SPEED: 'SET_SPEED',
  SET_BUFFERING: 'SET_BUFFERING',
  SET_SEEKING: 'SET_SEEKING',
  RESET_STATE: 'RESET_STATE',
};

// Player state reducer
const playerStateReducer = (state, action) => {
  switch (action.type) {
  case PLAYER_ACTIONS.SET_LOADING:
    return { ...state, loading: action.payload, error: false, ready: false };
  case PLAYER_ACTIONS.SET_READY:
    return { ...state, ready: true, loading: false, error: false };
  case PLAYER_ACTIONS.SET_ERROR:
    return { ...state, error: true, loading: false, ready: false };
  case PLAYER_ACTIONS.SET_PLAYING:
    return { ...state, isPlaying: action.payload };
  case PLAYER_ACTIONS.SET_CURRENT_TIME:
    return { ...state, currentTime: action.payload };
  case PLAYER_ACTIONS.SET_DURATION:
    return { ...state, duration: action.payload };
  case PLAYER_ACTIONS.SET_VOLUME:
    return { ...state, volume: action.payload, isMuted: action.payload === 0 };
  case PLAYER_ACTIONS.SET_MUTED:
    return { ...state, isMuted: action.payload };
  case PLAYER_ACTIONS.SET_SPEED:
    return { ...state, playbackSpeed: action.payload };
  case PLAYER_ACTIONS.SET_BUFFERING:
    if (import.meta.env.DEV) console.log("🔄 Buffering state changed:", action.payload);
    return { ...state, buffering: action.payload };
  case PLAYER_ACTIONS.SET_SEEKING:
    return { ...state, seeking: action.payload };
  case PLAYER_ACTIONS.RESET_STATE:
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: false,
      playbackSpeed: 1,
      loading: true,
      error: false,
      ready: false,
      buffering: false,
      seeking: false,
    };
  default:
    return state;
  }
};

// Custom hook for progress tracking
const useProgressTracking = (topicId, onProgressUpdate, initialProgressPercentage) => {
  const progressRef = useRef({
    lastReportedBucket: 0,
    lastUpdateTime: 0,
  });
  const completedRef = useRef(false);

  useEffect(() => {
    const isCompleted = initialProgressPercentage >= 100;
    completedRef.current = isCompleted;
    progressRef.current.lastReportedBucket = Math.floor(initialProgressPercentage / 10) * 10;
    
    if (import.meta.env.DEV) console.log(`Progress tracking initialized: topicId=${topicId}, progress=${initialProgressPercentage}%, locked=${isCompleted}`);
  }, [topicId, initialProgressPercentage]);

  const reportProgress = useCallback((currentTime, duration) => {
    if (!duration || duration <= 0) return;
    if (completedRef.current) {
      if (import.meta.env.DEV) console.log(`Skipping progress report - video already completed at 100%`);
      return;
    }

    const now = Date.now();
    if (now - progressRef.current.lastUpdateTime < PROGRESS_UPDATE_INTERVAL) return;

    progressRef.current.lastUpdateTime = now;
    const currentProgress = Math.round((currentTime / duration) * 100);
    const bucket = Math.floor(currentProgress / 10) * 10;

    if (bucket > progressRef.current.lastReportedBucket && bucket <= 100) {
      if (import.meta.env.DEV) console.log(`Reporting progress: ${bucket}% for topic ${topicId}`);
      progressRef.current.lastReportedBucket = bucket;

      if (bucket >= 100) {
        completedRef.current = true;
        if (import.meta.env.DEV) console.log(`Video marked as completed, locking progress tracking`);
      }
      
      onProgressUpdate?.(topicId, bucket, bucket >= 100);
    }
  }, [topicId, onProgressUpdate]);

  const resetProgress = useCallback((newInitialProgressPercentage) => {
    const isCompleted = newInitialProgressPercentage >= 100;
    completedRef.current = isCompleted;
    progressRef.current = {
      lastReportedBucket: Math.floor(newInitialProgressPercentage / 10) * 10,
      lastUpdateTime: 0,
    };
    if (import.meta.env.DEV) console.log(`Progress reset: progress=${newInitialProgressPercentage}%, locked=${isCompleted}`);
  }, []);

  return { reportProgress, resetProgress };
};

// Custom hook for HLS video handling
const useHlsVideo = (videoRef, contentUrl, onReady, onError) => {
  const hlsRef = useRef(null);
  const [hlsState, setHlsState] = useState({
    levels: [],
    currentLevel: -1,
  });

  const initializeHls = useCallback(() => {
    if (!videoRef.current || !contentUrl) return null;

    console.log("🎬 Initializing HLS...");
    const hls = new Hls(HLS_CONFIG);
    let hasManifestLoaded = false;
    let hasError = false;

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log("📎 HLS media attached");
      hls.loadSource(contentUrl);
    });

    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      console.log("✅ HLS manifest parsed");
      hasManifestLoaded = true;
      setHlsState({
        levels: data.levels,
        currentLevel: hls.currentLevel,
      });
      onReady();
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
            onError();
          } else {
            console.log("🔄 Network error, restarting load...");
            setTimeout(() => hls.startLoad(), RETRY_DELAY);
          }
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.log("🔄 Media error, recovering...");
          hls.recoverMediaError();
          break;
        default:
          console.error("💥 Fatal HLS error");
          onError();
          break;
        }
      }
    });

    hls.attachMedia(videoRef.current);
    hlsRef.current = hls;
    return hls;
  }, [videoRef, contentUrl, onReady, onError]);

  const destroy = useCallback(() => {
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
        console.log("🗑️ HLS destroyed");
      } catch (e) {
        console.warn("HLS cleanup error:", e);
      }
      hlsRef.current = null;
    }
    setHlsState({ levels: [], currentLevel: -1 });
  }, []);

  const setQuality = useCallback((level) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setHlsState((prev) => ({ ...prev, currentLevel: level }));
    }
  }, []);

  return { initializeHls, destroy, setQuality, hlsState };
};

// Custom hook for native video handling
const useNativeVideo = (videoRef, contentUrl, onReady, onError) => {
  const initializeNative = useCallback(() => {
    if (!videoRef.current || !contentUrl) return;

    console.log("📥 Loading native video");
    const video = videoRef.current;
    video.src = contentUrl;
    video.load();

    const onLoadedMetadata = () => {
      console.log("✅ Native metadata loaded, duration:", video.duration);
      onReady();
    };

    const onCanPlay = () => {
      console.log("✅ Native can play");
      onReady();
    };

    const onErrorHandler = () => {
      console.error("❌ Native video error:", video.error);
      onError();
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    video.addEventListener("canplay", onCanPlay, { once: true });
    video.addEventListener("error", onErrorHandler, { once: true });

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onErrorHandler);
    };
  }, [videoRef, contentUrl, onReady, onError]);

  return { initializeNative };
};

// Main hook
export const useVideoPlayer = (
  contentUrl,
  topicId,
  initialProgressPercentage,
  onProgressUpdate,
) => {
  const videoRef = useRef(null);
  const mountedRef = useRef(true);
  const hasResumedOnceRef = useRef(false);
  const videoEndedRef = useRef(false);
  const initStateRef = useRef({
    isInitializing: false,
    currentTopicId: topicId,
    currentUrl: contentUrl,
  });

  const [playerState, dispatch] = useReducer(playerStateReducer, {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    playbackSpeed: 1,
    loading: true,
    error: false,
    ready: false,
    buffering: false,
    seeking: false,
  });

  const { reportProgress, resetProgress } = useProgressTracking(topicId, onProgressUpdate, initialProgressPercentage);
  const isHls = contentUrl?.endsWith(".m3u8");

  const handleReady = useCallback(() => {
    dispatch({ type: PLAYER_ACTIONS.SET_READY });
    initStateRef.current.isInitializing = false;
  }, []);

  const handleError = useCallback(() => {
    dispatch({ type: PLAYER_ACTIONS.SET_ERROR });
    initStateRef.current.isInitializing = false;
  }, []);

  const { initializeHls, destroy: destroyHls, setQuality, hlsState } = useHlsVideo(
    videoRef,
    contentUrl,
    handleReady,
    handleError
  );

  const { initializeNative } = useNativeVideo(
    videoRef,
    contentUrl,
    handleReady,
    handleError
  );

  // Cleanup function
  const cleanupVideo = useCallback(() => {
    console.log("🧹 Cleaning up video...");
    destroyHls();
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      while (video.firstChild) {
        video.removeChild(video.firstChild);
      }
      video.load();
      video.currentTime = 0;
    }
  }, [destroyHls]);

  
  useEffect(() => {
    if (
      initStateRef.current.currentTopicId !== topicId ||
      initStateRef.current.currentUrl !== contentUrl
    ) {
      console.log("📌 Topic/URL changed - resetting state:", topicId);
      initStateRef.current.currentTopicId = topicId;
      initStateRef.current.currentUrl = contentUrl;
      
      hasResumedOnceRef.current = false;
      videoEndedRef.current = false;
      
      resetProgress(initialProgressPercentage);
      cleanupVideo();
      dispatch({ type: PLAYER_ACTIONS.RESET_STATE });
    }
  }, [topicId, contentUrl, initialProgressPercentage, cleanupVideo, resetProgress]);

  // Main initialization effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !contentUrl) return;

    console.log("🎥 Initializing video player:", { contentUrl, topicId, isHls });
    mountedRef.current = true;
    initStateRef.current.isInitializing = true;
    dispatch({ type: PLAYER_ACTIONS.SET_LOADING });

    const initTimer = setTimeout(() => {
      if (!mountedRef.current) return;

      if (isHls && Hls.isSupported()) {
        initializeHls();
      } else if (!isHls) {
        initializeNative();
      } else {
        console.error("HLS not supported");
        dispatch({ type: PLAYER_ACTIONS.SET_ERROR });
        initStateRef.current.isInitializing = false;
      }
    }, INIT_DELAY);

    return () => {
      clearTimeout(initTimer);
      mountedRef.current = false;
    };
  }, [contentUrl, isHls, initializeHls, initializeNative, topicId]);

  // Resume from saved progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playerState.ready) return;
    if (hasResumedOnceRef.current) return;
    if (initialProgressPercentage <= 0 || initialProgressPercentage >= 100) return;

    const tryResume = () => {
      if (!video.duration || video.duration === Infinity) return;

      const resumeTime = (initialProgressPercentage / 100) * video.duration;
      if (video.currentTime < resumeTime - 1) {
        console.log(`🎯 Resuming video at ${initialProgressPercentage}% (${resumeTime.toFixed(2)}s)`);
        video.currentTime = resumeTime;
        dispatch({
          type: PLAYER_ACTIONS.SET_CURRENT_TIME,
          payload: resumeTime
        });
      } else {
        console.log(`⏭️ Skipping resume - already at ${video.currentTime.toFixed(2)}s (resume point: ${resumeTime.toFixed(2)}s)`);
      }
      
      hasResumedOnceRef.current = true;
    };

    if (video.readyState >= 1) {
      tryResume();
    } else {
      video.addEventListener("loadedmetadata", tryResume, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", tryResume);
    };
  }, [playerState.ready, initialProgressPercentage]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (!mountedRef.current) return;
      if (playerState.seeking) return;

      const currentTime = video.currentTime;
      const duration = video.duration;

      dispatch({
        type: PLAYER_ACTIONS.SET_CURRENT_TIME,
        payload: currentTime,
      });

      if (!video.paused) {
        reportProgress(currentTime, duration);
      }
    };

    const onLoadedMetadata = () => {
      if (!mountedRef.current) return;
      console.log("📊 Metadata loaded:", video.duration);
      dispatch({ type: PLAYER_ACTIONS.SET_DURATION, payload: video.duration });
    };

    const onDurationChange = () => {
      if (!mountedRef.current) return;
      console.log("📊 Duration changed:", video.duration);
      dispatch({ type: PLAYER_ACTIONS.SET_DURATION, payload: video.duration });
    };

    const onPlay = () => {
      if (!mountedRef.current) return;
      dispatch({ type: PLAYER_ACTIONS.SET_PLAYING, payload: true });
    };

    const onPause = () => {
      if (!mountedRef.current) return;
      dispatch({ type: PLAYER_ACTIONS.SET_PLAYING, payload: false });
    };

    const onEnded = () => {
      if (!mountedRef.current) return;

      videoEndedRef.current = true;

      dispatch({ type: PLAYER_ACTIONS.SET_PLAYING, payload: false });
      dispatch({ type: PLAYER_ACTIONS.SET_SEEKING, payload: false });

      const video = videoRef.current;
      if (video) {
        reportProgress(video.duration, video.duration);
      }
    };

    const onWaiting = () => {
      if (!mountedRef.current) return;
      console.log("⏳ Video waiting (buffering)...");
      dispatch({ type: PLAYER_ACTIONS.SET_BUFFERING, payload: true });
    };

    const onStalled = () => {
      if (!mountedRef.current) return;
      console.log("⏳ Video stalled (network buffering)...");
      dispatch({ type: PLAYER_ACTIONS.SET_BUFFERING, payload: true });
    };

    const onCanPlay = () => {
      if (!mountedRef.current) return;
      console.log("✅ Video can play");
      dispatch({ type: PLAYER_ACTIONS.SET_BUFFERING, payload: false });
      dispatch({ type: PLAYER_ACTIONS.SET_SEEKING, payload: false });
    };

    const onCanPlayThrough = () => {
      if (!mountedRef.current) return;
      console.log("✅ Video can play through");
      dispatch({ type: PLAYER_ACTIONS.SET_BUFFERING, payload: false });
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("stalled", onStalled);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("canplaythrough", onCanPlayThrough);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("stalled", onStalled);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, [reportProgress]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const video = videoRef.current;
      if (!video) return;

      // Save last progress if video was playing
      if (!video.paused && video.duration > 0) {
        reportProgress(video.currentTime, video.duration);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [reportProgress]);

  // FIXED: Auto-resume after seeking - now checks if video has ended
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => {
      if (!mountedRef.current) return;

      if (videoEndedRef.current) {
        console.log("⏹️ Video ended - preventing auto-resume");
        return;
      }

      // Resume playing if we were seeking and the video was playing before
      if (playerState.seeking && playerState.isPlaying) {
        console.log("▶️ Resuming playback after seeking");
        video.play().catch((err) => {
          console.error("Resume play error:", err);
        });
      }
    };

    video.addEventListener("canplay", onCanPlay);

    return () => {
      video.removeEventListener("canplay", onCanPlay);
    };
  }, [playerState.seeking, playerState.isPlaying]);

  // Control functions
  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video || !playerState.ready) return;

    // FIX: Reset ended flag when playing
    videoEndedRef.current = false;
    
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
    
    if (clampedTime >= video.duration - 0.5) {
      console.log("⏭️ Seeking to end - marking as ended");
      videoEndedRef.current = true;
    }
    
    dispatch({ type: PLAYER_ACTIONS.SET_SEEKING, payload: true });
    video.currentTime = clampedTime;
  }, []);

  const skip = useCallback((seconds) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const newTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    
    if (newTime >= video.duration - 0.5) {
      console.log("⏭️ Skipping to end - marking as ended");
      videoEndedRef.current = true;
    }
    
    dispatch({ type: PLAYER_ACTIONS.SET_SEEKING, payload: true });
    video.currentTime = newTime;
  }, []);

  const setVolume = useCallback((vol) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = vol;
    video.muted = vol === 0;
    dispatch({ type: PLAYER_ACTIONS.SET_VOLUME, payload: vol });
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !video.muted;
    video.muted = newMuted;
    dispatch({ type: PLAYER_ACTIONS.SET_MUTED, payload: newMuted });
  }, []);

  const setSpeed = useCallback((speed) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    dispatch({ type: PLAYER_ACTIONS.SET_SPEED, payload: speed });
  }, []);

  const retry = useCallback(() => {
    console.log("🔄 Manual retry");
    videoEndedRef.current = false;
    cleanupVideo();
    dispatch({ type: PLAYER_ACTIONS.SET_LOADING });
    initStateRef.current.isInitializing = false;
    setTimeout(() => {
      const video = videoRef.current;
      if (!video || !contentUrl) return;

      if (isHls && Hls.isSupported()) {
        initializeHls();
      } else {
        initializeNative();
      }
    }, INIT_DELAY);
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
