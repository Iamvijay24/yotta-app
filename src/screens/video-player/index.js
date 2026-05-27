/* eslint-disable max-lines-per-function */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAuth } from '../../shared/api/AuthContext';
import VideoControls from '../../components/VideoControls';
import VideoAIOverlay from './components/VideoAIOverlay';
import VideoPlayerEmptyState from './components/VideoPlayerEmptyState';
import VideoPlayerHeader from './components/VideoPlayerHeader';
import VideoTopicNavigation from './components/VideoTopicNavigation';
import { styles } from './styles';

const VideoPlayerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const videoRef = useRef(null);
  const webViewRef = useRef(null);
  const controlsTimerRef = useRef(null);

  const {
    course,
    currentTopic,
    allTopics = [],
    currentTopicIndex = 0,
  } = route.params || {};

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [aiTutorLoading, setAiTutorLoading] = useState(false);
  const [showAIWidget, setShowAIWidget] = useState(false);

  const currentTopicData = currentTopic || allTopics[currentTopicIndex];

  const showControlsOnPress = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    setShowControls(true);
  }, []);

  const hideControlsOnPress = useCallback(() => {
    setShowControls(false);
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
  }, []);

  const onLoad = useCallback(data => {
    setDuration(data.duration);
    setIsLoading(false);
    setShowControls(true);
  }, []);

  const onProgress = useCallback(data => {
    setCurrentTime(data.currentTime);
  }, []);

  const onBuffer = useCallback(buffer => {
    setIsBuffering(buffer.isBuffering);
  }, []);

  const onEnd = useCallback(() => {
    setIsPlaying(false);
    setShowControls(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    showControlsOnPress();
  }, [showControlsOnPress]);

  const onSeek = useCallback(
    value => {
      videoRef.current?.seek((value / 100) * duration);
      showControlsOnPress();
    },
    [duration, showControlsOnPress],
  );

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    showControlsOnPress();
  }, [showControlsOnPress]);

  const skipForward = useCallback(() => {
    const newTime = Math.min(currentTime + 10, duration);
    videoRef.current?.seek(newTime);
    showControlsOnPress();
  }, [currentTime, duration, showControlsOnPress]);

  const skipBackward = useCallback(() => {
    const newTime = Math.max(currentTime - 10, 0);
    videoRef.current?.seek(newTime);
    showControlsOnPress();
  }, [currentTime, showControlsOnPress]);

  const handleSpeedChange = useCallback(
    speed => {
      setPlaybackSpeed(speed);
      showControlsOnPress();
    },
    [showControlsOnPress],
  );

  const handleAiTutor = useCallback(() => {
    setIsPlaying(false);
    setAiTutorLoading(true);
    setShowAIWidget(true);
  }, []);

  const handleAiMessage = useCallback(event => {
    const msg = event.nativeEvent.data;
    if (msg === 'READY' || msg.startsWith('ERROR')) {
      setAiTutorLoading(false);
    }
    if (msg === 'CLOSE_WIDGET') {
      setShowAIWidget(false);
      setAiTutorLoading(false);
    }
  }, []);

  const goToPreviousTopic = useCallback(() => {
    if (currentTopicIndex > 0) {
      navigation.replace('VideoPlayer', {
        course,
        allTopics,
        currentTopicIndex: currentTopicIndex - 1,
      });
    }
  }, [currentTopicIndex, navigation, course, allTopics]);

  const goToNextTopic = useCallback(() => {
    if (currentTopicIndex < allTopics.length - 1) {
      navigation.replace('VideoPlayer', {
        course,
        allTopics,
        currentTopicIndex: currentTopicIndex + 1,
      });
    }
  }, [currentTopicIndex, navigation, course, allTopics]);

  const selectTopic = useCallback(
    index => {
      if (index !== currentTopicIndex) {
        navigation.replace('VideoPlayer', {
          course,
          allTopics,
          currentTopicIndex: index,
        });
      }
    },
    [allTopics, course, currentTopicIndex, navigation],
  );

  const formatTime = useCallback(seconds => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getQualityLabel = useCallback(level => {
    return level?.height
      ? `${level.height}p`
      : `${Math.round((level?.bitrate || 0) / 1000)}kbps`;
  }, []);

  const getPopupContainer = useCallback(() => null, []);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setShowControls(true);
    setIsLoading(true);
    setCurrentTime(0);
  }, [currentTopicIndex]);

  useEffect(() => {
    if (!isPlaying && !isLoading) {
      setShowControls(true);
    }
  }, [isPlaying, isLoading]);

  const handleScreenTap = useCallback(() => {
    if (showControls) {
      hideControlsOnPress();
    } else {
      showControlsOnPress();
    }
  }, [showControls, hideControlsOnPress, showControlsOnPress]);

  if (!currentTopicData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <VideoPlayerEmptyState onBack={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, isFullscreen && styles.fullscreenContainer]}
    >
      <StatusBar barStyle="light-content" hidden={isFullscreen} />

      {!isFullscreen && (
        <VideoPlayerHeader
          title={currentTopicData.title}
          subtitle={course?.title}
          onBack={() => navigation.goBack()}
        />
      )}

      <View
        style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}
      >
        <TouchableOpacity
          style={styles.videoTouchable}
          activeOpacity={1}
          onPress={handleScreenTap}
          onPressIn={showControlsOnPress}
        >
          <Video
            ref={videoRef}
            source={{
              uri: currentTopicData.contentUrl || currentTopicData.content_url,
            }}
            style={styles.video}
            paused={!isPlaying}
            volume={isMuted ? 0 : volume}
            rate={playbackSpeed}
            resizeMode="contain"
            onLoad={onLoad}
            onProgress={onProgress}
            onBuffer={onBuffer}
            onEnd={onEnd}
            onError={error => {
              console.error('Video error:', error);
              setIsLoading(false);
              Alert.alert('Error', 'Failed to load video');
            }}
          />

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}

          {isBuffering && !isLoading && (
            <View style={styles.bufferingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.bufferingText}>Buffering...</Text>
            </View>
          )}

          <VideoControls
            show={showControls && !isLoading}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            playbackSpeed={playbackSpeed}
            progressPercent={progressPercentage}
            levels={[]}
            currentLevel={-1}
            onTogglePlay={togglePlayPause}
            onSeek={onSeek}
            onProgressClick={() => {}}
            onToggleMute={toggleMute}
            onVolumeChange={setVolume}
            onSpeedChange={handleSpeedChange}
            onQualityChange={() => {}}
            onFullScreen={() => setIsFullscreen(prev => !prev)}
            onSkipForward={skipForward}
            onSkipBackward={skipBackward}
            onAiTutor={handleAiTutor}
            aiTutorLoading={aiTutorLoading}
            hasAIAssistance={Boolean(user)}
            formatTime={formatTime}
            getQualityLabel={getQualityLabel}
            getPopupContainer={getPopupContainer}
          />
        </TouchableOpacity>
      </View>

      {!isFullscreen && (
        <VideoTopicNavigation
          allTopics={allTopics}
          currentTopicIndex={currentTopicIndex}
          onSelectTopic={selectTopic}
          onPrev={goToPreviousTopic}
          onNext={goToNextTopic}
        />
      )}

      {showAIWidget && (
        <VideoAIOverlay
          webViewRef={webViewRef}
          currentTopicIndex={currentTopicIndex}
          onMessage={handleAiMessage}
        />
      )}
    </SafeAreaView>
  );
};

export default VideoPlayerScreen;
