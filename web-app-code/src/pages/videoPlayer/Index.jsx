import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { usePlayerControls } from './hooks/usePlayerControls';
import { VideoThumbnail } from './components/VideoThumbnail';
import { VideoControls } from './components/VideoControls';
import styles from './video_player.module.scss';

const FALLBACK_THUMBNAIL = 'https://peach.blender.org/wp-content/uploads/poster_bunny_big.jpg';

const VideoPlayer = ({
  currentTopic,
  onProgressUpdate,
  initialProgressPercentage = 0,
  currentLessonNumber,
  hasAIAssistance = false
}) => {
  const containerRef = useRef(null);
  const mouseMoveThrottleRef = useRef(null);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const contentUrl = currentTopic?.contentUrl;
  const thumbnail = currentTopic?.thumbnail || FALLBACK_THUMBNAIL;
  const topicId = currentTopic?.id;

  // Custom hooks
  const {
    videoRef,
    playerState,
    hlsState,
    controls,
  } = useVideoPlayer(contentUrl, topicId, initialProgressPercentage, onProgressUpdate);
  
  const { showControls, showControlsTemporarily } = usePlayerControls(playerState.isPlaying);

  const getPopupContainer = useCallback(() => containerRef.current, []);

  const [aiTutorLoading, setAiTutorLoading] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const handleMouseMove = useCallback(() => {
    if (mouseMoveThrottleRef.current) return;
    mouseMoveThrottleRef.current = setTimeout(() => {
      showControlsTemporarily();
      mouseMoveThrottleRef.current = null;
    }, 100);
  }, [showControlsTemporarily]);

  // Reset thumbnail when topic changes
  useEffect(() => {
    setShowThumbnail(true);
  }, [topicId]);

  // Handle video ended
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleEnded = () => setShowThumbnail(true);
    video.addEventListener('ended', handleEnded);
    
    return () => video.removeEventListener('ended', handleEnded);
  }, [videoRef]);

  // Handle fullscreen changes
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
 
  useEffect(() => {
    return () => {
      if (mouseMoveThrottleRef.current) {
        clearTimeout(mouseMoveThrottleRef.current);
      }
    };
  }, []);

  const handlePlay = useCallback(() => {
    if (showThumbnail) {
      setShowThumbnail(false);
    }
    
    if (playerState.error) {
      controls.retry();
      return;
    }
    
    if (playerState.isPlaying) {
      controls.pause();
    } else {
      controls.play();
    }
  }, [showThumbnail, playerState.error, playerState.isPlaying, controls]);

  const handleSeek = useCallback((e) => {
    if (!playerState.duration) return;
    const time = (parseFloat(e.target.value) / 100) * playerState.duration;
    controls.seek(time);
  }, [playerState.duration, controls]);

  const handleProgressClick = useCallback((e) => {
    if (!playerState.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * playerState.duration;
    controls.seek(time);
  }, [playerState.duration, controls]);

  const handleVolumeChange = useCallback((e) => {
    const newVol = parseFloat(e.target.value);
    controls.setVolume(newVol);
  }, [controls]);

  const handleFullScreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [isFullscreen]);

  const handleSkipForward = useCallback(() => {
    controls.skip(10);
    showControlsTemporarily();
  }, [controls, showControlsTemporarily]);

  const handleSkipBackward = useCallback(() => {
    controls.skip(-10);
    showControlsTemporarily();
  }, [controls, showControlsTemporarily]);

  const handleKeyDown = useCallback((e) => {
    if (isWidgetOpen) return; // Don't handle keys when widget is open

    if ([' ', 'ArrowLeft', 'ArrowRight', 'f', 'F', 'm', 'M', 'k', 'K'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    switch(e.key) {
    case ' ':
    case 'k':
    case 'K':
      handlePlay();
      break;
    case 'ArrowLeft':
      handleSkipBackward();
      break;
    case 'ArrowRight':
      handleSkipForward();
      break;
    case 'f':
    case 'F':
      handleFullScreen();
      break;
    case 'm':
    case 'M':
      controls.toggleMute();
      showControlsTemporarily();
      break;
    default:
      break;
    }
  }, [isWidgetOpen, handlePlay, handleSkipBackward, handleSkipForward, handleFullScreen, controls, showControlsTemporarily]);
 
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [handleKeyDown]);

  // AI Widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://d3cz62hdgxo8h8.cloudfront.net/ai_widget.latest.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (window.ai_tutor && typeof window.ai_tutor.destroy === 'function') {
        window.ai_tutor.destroy();
        setIsWidgetOpen(false);
      }
    };
  }, []);

  // Handle widget close on outside click
  useEffect(() => {
    if (!isWidgetOpen) return;

    const handleClickOutside = (e) => {
      const widgetEl = document.getElementById('fb-widget-config');
      if (widgetEl && !widgetEl.contains(e.target)) {
        setIsWidgetOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isWidgetOpen]);

  const handleAiTutor = useCallback(async() => {
    try {
      setAiTutorLoading(true);
      controls.pause();

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      // Use the lesson number directly from props
      const lessonNumber = currentLessonNumber ?? 1;

      const fbId = `fb-vibe-coding-lesson-${lessonNumber}`;
      const partnerId = '5118f0d9';
      const kbId = `vibe-coding-lesson-${lessonNumber}`;

      await window.ai_tutor.init(fbId, partnerId, kbId);
      window.ai_tutor.open();
      setIsWidgetOpen(true);

      // Focus on the widget after it opens
      setTimeout(() => {
        const widgetEl = document.getElementById('fb-widget-config');
        if (widgetEl) widgetEl.focus();
      }, 500);
    } catch (error) {
      console.error('Failed to initialize AI Tutor widget:', error);
    } finally {
      setAiTutorLoading(false);
    }
  }, [controls, currentLessonNumber]);

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getQualityLabel = (level) => {
    return level.height ? `${level.height}p` : `${Math.round(level.bitrate / 1000)}kbps`;
  };

  // Calculate progress percentage safely
  const progressPercent = useMemo(() => {
    if (!playerState.duration || playerState.duration <= 0) {
      return 0;
    }
    
    const calculated = (playerState.currentTime / playerState.duration) * 100;
    return Math.min(100, Math.max(0, calculated));
  }, [playerState.currentTime, playerState.duration]);

  if (!currentTopic) {
    return <div className={styles.contentSectionWrapper}>No content available</div>;
  }

  return (
    <div className={styles.contentSectionWrapper}>
      <div
        ref={containerRef}
        className={styles.videoPlayerContainer}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleFullScreen}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Thumbnail */}
        <VideoThumbnail
          visible={showThumbnail}
          thumbnailUrl={thumbnail}
          fallbackUrl={FALLBACK_THUMBNAIL}
          onPlay={handlePlay}
        />

        {/* Loading overlay */}
        {playerState.loading && !showThumbnail && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            Loading video...
          </div>
        )}

        {/* Buffering overlay */}
        {playerState.buffering && !playerState.loading && !showThumbnail && (
          <div className={styles.bufferingOverlay}>
            <div className={styles.bufferingSpinner}></div>
            Loading...
          </div>
        )}
        {/* ============================================================== */}
        {/* Debug overlay - for testing */}
        {/* ============================================================== */}
        {/* <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 50
        }}>
          Buffering: {playerState.buffering ? 'true' : 'false'}<br/>
          Loading: {playerState.loading ? 'true' : 'false'}<br/>
          Seeking: {playerState.seeking ? 'true' : 'false'}<br/>
          Thumbnail: {showThumbnail ? 'true' : 'false'}
        </div> */}

        {/* Error overlay */}
        {playerState.error && (
          <div className={styles.errorOverlay} onClick={handlePlay}>
            Failed to load video. Click to retry.
          </div>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          className={styles.videoElement}
          playsInline
          preload="metadata"
          onClick={handlePlay}
        />

        {/* Controls */}
        {!showThumbnail && !playerState.error && playerState.ready && (
          <VideoControls
            show={showControls}
            isPlaying={playerState.isPlaying}
            currentTime={playerState.currentTime}
            duration={playerState.duration}
            volume={playerState.volume}
            isMuted={playerState.isMuted}
            playbackSpeed={playerState.playbackSpeed}
            progressPercent={progressPercent}
            levels={hlsState.levels}
            currentLevel={hlsState.currentLevel}
            onTogglePlay={handlePlay}
            onSeek={handleSeek}
            onProgressClick={handleProgressClick}
            onToggleMute={controls.toggleMute}
            onVolumeChange={handleVolumeChange}
            onSpeedChange={controls.setSpeed}
            onQualityChange={controls.setQuality}
            onFullScreen={handleFullScreen}
            onSkipForward={handleSkipForward}
            onSkipBackward={handleSkipBackward}
            onAiTutor={handleAiTutor}
            formatTime={formatTime}
            getQualityLabel={getQualityLabel}
            aiTutorLoading={aiTutorLoading}
            hasAIAssistance={hasAIAssistance}
            getPopupContainer={getPopupContainer}
          />
        )}
      </div>

      {/* Widget Container */}
      <div
        id="fb-widget-config"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999
        }}
      />
    </div>
  );
};

export default VideoPlayer;
