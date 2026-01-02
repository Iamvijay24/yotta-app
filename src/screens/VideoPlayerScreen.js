import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../shared/api/AuthContext';
import Slider from '@react-native-community/slider';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VideoPlayerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const videoRef = useRef(null);

  // Route params
  const {
    course,
    currentTopic,
    allTopics = [],
    currentTopicIndex = 0,
  } = route.params || {};

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);

  // Auto-hide controls timer
  const controlsTimerRef = useRef(null);

  // Current topic data
  const currentTopicData = currentTopic || allTopics[currentTopicIndex];

  // Reset controls visibility
  const resetControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    setShowControls(true);
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Video event handlers
  const onLoad = useCallback(
    data => {
      setDuration(data.duration);
      setIsLoading(false);
      resetControlsTimer();
    },
    [resetControlsTimer],
  );

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

  // Control handlers
  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    resetControlsTimer();
  }, [isPlaying, resetControlsTimer]);

  const onSeek = useCallback(
    value => {
      videoRef.current?.seek(value);
      resetControlsTimer();
    },
    [resetControlsTimer],
  );

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    resetControlsTimer();
  }, [isMuted, resetControlsTimer]);

  const skipForward = useCallback(() => {
    const newTime = Math.min(currentTime + 10, duration);
    videoRef.current?.seek(newTime);
    resetControlsTimer();
  }, [currentTime, duration, resetControlsTimer]);

  const skipBackward = useCallback(() => {
    const newTime = Math.max(currentTime - 10, 0);
    videoRef.current?.seek(newTime);
    resetControlsTimer();
  }, [currentTime, resetControlsTimer]);

  // Navigation handlers
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

  // Format time display
  const formatTime = useCallback(seconds => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);

  // Handle screen tap to show/hide controls
  const handleScreenTap = useCallback(() => {
    if (showControls) {
      setShowControls(false);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    } else {
      resetControlsTimer();
    }
  }, [showControls, resetControlsTimer]);

  if (!currentTopicData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No video content available</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, isFullscreen && styles.fullscreenContainer]}
    >
      <StatusBar barStyle="light-content" hidden={isFullscreen} />

      {/* Header (when not fullscreen) */}
      {!isFullscreen && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {currentTopicData.title || 'Video Player'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.headerSubtitleScroll}
            >
              <Text style={styles.headerSubtitle}>
                {course?.title || 'Course'}
              </Text>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Video Player */}
      <View
        style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}
      >
        <TouchableOpacity
          style={styles.videoTouchable}
          activeOpacity={1}
          onPress={handleScreenTap}
        >
          <Video
            ref={videoRef}
            source={{
              uri: currentTopicData.contentUrl || currentTopicData.content_url,
            }}
            style={styles.video}
            paused={!isPlaying}
            volume={isMuted ? 0 : volume}
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

          {/* Loading overlay */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}

          {/* Buffering overlay */}
          {isBuffering && !isLoading && (
            <View style={styles.bufferingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.bufferingText}>Buffering...</Text>
            </View>
          )}

          {/* Controls overlay */}
          {showControls && !isLoading && (
            <View style={styles.controlsOverlay}>
              {/* Top controls */}
              <View style={styles.topControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setIsFullscreen(!isFullscreen)}
                >
                  <Icon
                    name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              {/* Center play/pause */}
              <View style={styles.centerControls}>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={skipBackward}
                >
                  <Icon name="replay-10" size={32} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.playButton}
                  onPress={togglePlayPause}
                >
                  <Icon
                    name={isPlaying ? 'pause' : 'play-arrow'}
                    size={48}
                    color="#fff"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={skipForward}
                >
                  <Icon name="forward-10" size={32} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Bottom controls */}
              <View style={styles.bottomControls}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

                <Slider
                  style={styles.progressBar}
                  minimumValue={0}
                  maximumValue={duration}
                  value={currentTime}
                  onValueChange={onSeek}
                  minimumTrackTintColor="#2575fc"
                  maximumTrackTintColor="#fff"
                  thumbStyle={styles.sliderThumb}
                />

                <Text style={styles.timeText}>{formatTime(duration)}</Text>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleMute}
                >
                  <Icon
                    name={isMuted ? 'volume-off' : 'volume-up'}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Topic Navigation (when not fullscreen) */}
      {!isFullscreen && (
        <View style={styles.navigationContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.topicsScroll}
          >
            {allTopics.map((topic, index) => (
              <TouchableOpacity
                key={topic.id || index}
                style={[
                  styles.topicButton,
                  index === currentTopicIndex && styles.activeTopicButton,
                ]}
                onPress={() => {
                  if (index !== currentTopicIndex) {
                    navigation.replace('VideoPlayer', {
                      course,
                      allTopics,
                      currentTopicIndex: index,
                    });
                  }
                }}
              >
                <View style={styles.topicIcon}>
                  <Icon
                    name={
                      topic.type === 'video'
                        ? 'videocam'
                        : topic.type === 'quiz'
                        ? 'quiz'
                        : 'article'
                    }
                    size={16}
                    color={index === currentTopicIndex ? '#2575fc' : '#666'}
                  />
                </View>
                <Text
                  style={[
                    styles.topicTitle,
                    index === currentTopicIndex && styles.activeTopicTitle,
                  ]}
                  numberOfLines={2}
                >
                  {topic.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Navigation buttons */}
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentTopicIndex === 0 && styles.disabledNavButton,
              ]}
              onPress={goToPreviousTopic}
              disabled={currentTopicIndex === 0}
            >
              <Icon
                name="chevron-left"
                size={24}
                color={currentTopicIndex === 0 ? '#ccc' : '#2575fc'}
              />
              <Text
                style={[
                  styles.navButtonText,
                  currentTopicIndex === 0 && styles.disabledNavText,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.progressIndicator}>
              <Text style={styles.progressText}>
                {currentTopicIndex + 1} of {allTopics.length}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        ((currentTopicIndex + 1) / allTopics.length) * 100
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.navButton,
                currentTopicIndex === allTopics.length - 1 &&
                  styles.disabledNavButton,
              ]}
              onPress={goToNextTopic}
              disabled={currentTopicIndex === allTopics.length - 1}
            >
              <Text
                style={[
                  styles.navButtonText,
                  currentTopicIndex === allTopics.length - 1 &&
                    styles.disabledNavText,
                ]}
              >
                Next
              </Text>
              <Icon
                name="chevron-right"
                size={24}
                color={
                  currentTopicIndex === allTopics.length - 1
                    ? '#ccc'
                    : '#2575fc'
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenContainer: {
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 2,
  },
  headerSubtitleScroll: {
    maxHeight: 16, // Match the font size + some padding
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  videoTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bufferingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 14,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    padding: 16,
  },
  playButton: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    marginHorizontal: 32,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    marginHorizontal: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2575fc',
    borderRadius: 2,
  },
  sliderThumb: {
    width: 12,
    height: 12,
    backgroundColor: '#2575fc',
  },
  navigationContainer: {
    backgroundColor: '#f5f7fa',
  },
  topicsScroll: {
    maxHeight: 80,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  topicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTopicButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2575fc',
    borderWidth: 2,
  },
  topicIcon: {
    marginRight: 8,
  },
  topicTitle: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  activeTopicTitle: {
    color: '#2575fc',
    fontWeight: '600',
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledNavButton: {
    backgroundColor: '#f5f5f5',
  },
  navButtonText: {
    fontSize: 14,
    color: '#2575fc',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  disabledNavText: {
    color: '#ccc',
  },
  progressIndicator: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2575fc',
    borderRadius: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButtonText: {
    color: '#2575fc',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoPlayerScreen;
