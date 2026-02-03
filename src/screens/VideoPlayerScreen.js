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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../shared/api/AuthContext';
import Slider from '@react-native-community/slider';
import { VideoControls } from '../components/VideoControls';
import { WebView } from 'react-native-webview';

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

  console.log(route.params);
  console.log(currentTopicIndex);

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
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [aiTutorLoading, setAiTutorLoading] = useState(false);
  const [showAIWidget, setShowAIWidget] = useState(false);
  const webViewRef = useRef(null);

  // Auto-hide controls timer
  const controlsTimerRef = useRef(null);

  // Current topic data
  const currentTopicData = currentTopic || allTopics[currentTopicIndex];

  // Show controls when pressing/hovering
  const showControlsOnPress = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    setShowControls(true);
  }, []);

  // Hide controls when clicking again
  const hideControlsOnPress = useCallback(() => {
    setShowControls(false);
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
  }, []);

  // Video event handlers
  const onLoad = useCallback(data => {
    setDuration(data.duration);
    setIsLoading(false);
    setShowControls(true); // Show controls when video loads
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

  // Control handlers
  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    showControlsOnPress();
  }, [isPlaying, showControlsOnPress]);

  const onSeek = useCallback(
    value => {
      videoRef.current?.seek(value);
      showControlsOnPress();
    },
    [showControlsOnPress],
  );

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    showControlsOnPress();
  }, [isMuted, showControlsOnPress]);

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
    setIsPlaying(false); // Pause video when AI opens
    setAiTutorLoading(true);
    setShowAIWidget(true);
  }, []);

  const handleCloseAI = useCallback(() => {
    // Send a message to the script to clean up if necessary
    const closeScript = `
      if (window.ai_tutor && typeof window.ai_tutor.destroy === 'function') {
        window.ai_tutor.destroy();
      }
    `;
    webViewRef.current?.injectJavaScript(closeScript);
    setShowAIWidget(false);
    setAiTutorLoading(false);
  }, []);

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

  // Helper functions for VideoControls
  const getQualityLabel = useCallback(level => {
    return level?.height
      ? `${level.height}p`
      : `${Math.round((level?.bitrate || 0) / 1000)}kbps`;
  }, []);

  const getPopupContainer = useCallback(
    () => videoRef.current?.parentNode || document.body,
    [],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);

  // Show controls when topic changes
  useEffect(() => {
    setShowControls(true);
  }, [currentTopicIndex]);

  // Keep controls visible when video is paused
  useEffect(() => {
    if (!isPlaying && !isLoading) {
      setShowControls(true);
    }
  }, [isPlaying, isLoading]);

  // Handle screen tap to show/hide controls
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
          onPressIn={() => {
            setShowControls(true);
            if (controlsTimerRef.current) {
              clearTimeout(controlsTimerRef.current);
            }
          }}
          onPressOut={() => {
            // Keep controls visible when hovering/pressing
            // Controls will only hide when user taps again
          }}
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

          {/* Video Controls */}
          <VideoControls
            show={showControls && !isLoading}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            playbackSpeed={playbackSpeed}
            progressPercent={progressPercentage}
            levels={[]} // TODO: Add HLS levels if available
            currentLevel={-1}
            onTogglePlay={togglePlayPause}
            onSeek={onSeek}
            onProgressClick={e => {
              // For React Native, handle progress click differently
              // This would need to be implemented based on touch coordinates
            }}
            onToggleMute={toggleMute}
            onVolumeChange={setVolume}
            onSpeedChange={handleSpeedChange}
            onQualityChange={() => {}} // TODO: Implement quality change
            onFullScreen={() => setIsFullscreen(!isFullscreen)}
            onSkipForward={skipForward}
            onSkipBackward={skipBackward}
            onAiTutor={handleAiTutor}
            aiTutorLoading={aiTutorLoading}
            hasAIAssistance={true}
            formatTime={formatTime}
            getQualityLabel={getQualityLabel}
            getPopupContainer={getPopupContainer}
          />
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

      {/* AI Widget Overlay */}
      {showAIWidget && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { zIndex: 9999, backgroundColor: '#000' },
          ]}
        >
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            thirdPartyCookiesEnabled={true}
            databaseEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="always"
            androidLayerType="hardware"
            onMessage={event => {
              const msg = event.nativeEvent.data;
              console.log('AI_WIDGET_LOG:', msg);

              if (msg === 'READY' || msg.startsWith('ERROR')) {
                setAiTutorLoading(false);
              }

              // THE FIX: Ensure the entire view is unmounted immediately
              if (msg === 'CLOSE_WIDGET') {
                setShowAIWidget(false);
                setAiTutorLoading(false);
              }
            }}
            source={{
              html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
              <style>
                html, body { 
                  margin: 0; padding: 0; 
                  height: 100vh; width: 100vw; 
                  background-color: #000; 
                  overflow: hidden; 
                }
                #fb-widget-config { 
                  width: 100% !important; 
                  height: 100% !important; 
                  position: absolute; top: 0; left: 0; 
                }
                /* Force the internal containers to fill the screen */
                div[class*="widget-container"], .fb-avatar-container, [class*="MainContainer"] {
                   width: 100% !important;
                   height: 100% !important;
                   max-width: none !important;
                   border-radius: 0 !important;
                }
              </style>
            </head>
            <body>
              <div id="fb-widget-config"></div>
              <script src="https://d3cz62hdgxo8h8.cloudfront.net/ai_widget.latest.js"></script>
              <script>
                (function() {
                  var check = setInterval(function() {
                    if (window.ai_tutor) {
                      clearInterval(check);
                      window.ai_tutor.init(
                        'fb-vibe-coding-lesson-${currentTopicIndex + 1}',
                        '5118f0d9',
                        'vibe-coding-lesson-${currentTopicIndex + 1}'
                      ).then(function() {
                        window.ai_tutor.open();
                        
                        // Signal Button that loading is done
                        setTimeout(function() {
                          window.ReactNativeWebView.postMessage('READY');
                        }, 2000);

                        // IMPROVED CLOSE DETECTION:
                        // We listen for any click and check if the element is an 'X' or has 'close' in its class
                        document.addEventListener('click', function(e) {
                          var target = e.target;
                          var isCloseButton = target.closest('[class*="close"]') || 
                                              target.innerText === '×' || 
                                              target.getAttribute('aria-label') === 'Close';
                          
                          if (isCloseButton) {
                            window.ReactNativeWebView.postMessage('CLOSE_WIDGET');
                          }
                        });

                      });
                    }
                  }, 500);
                })();
              </script>
            </body>
          </html>
        `,
              baseUrl: 'https://d3cz62hdgxo8h8.cloudfront.net/',
            }}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  aiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
    zIndex: 9999,
  },
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#2575fc',
  },
  aiHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  aiCloseBtn: {
    padding: 4,
  },
  aiWebView: {
    flex: 1,
  },
  spinnerOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default VideoPlayerScreen;
