import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const VideoControls = ({
  show,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackSpeed,
  progressPercent,
  levels,
  currentLevel,
  onTogglePlay,
  onSeek,
  onProgressClick,
  onToggleMute,
  onVolumeChange,
  onSpeedChange,
  onQualityChange,
  onFullScreen,
  onSkipForward,
  onSkipBackward,
  onAiTutor,
  aiTutorLoading,
  hasAIAssistance = false,
  formatTime,
  getQualityLabel,
  getPopupContainer,
}) => {
  const [showSpeedModal, setShowSpeedModal] = useState(false);

  if (!show) {
    return null;
  }

  return (
    <View style={styles.videoControls}>
      {/* Progress Container */}
      <View style={styles.progressContainer}>
        <TouchableOpacity
          style={styles.progressBarArea}
          onPress={onProgressClick}
          activeOpacity={1}
        >
          <View style={styles.progressFill}>
            <View
              style={[
                styles.progressFillActive,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>
        </TouchableOpacity>
        <Slider
          style={styles.progressRange}
          minimumValue={0}
          maximumValue={100}
          value={progressPercent}
          onValueChange={onSeek}
          minimumTrackTintColor="#ef4444"
          maximumTrackTintColor="transparent"
          thumbStyle={styles.sliderThumb}
        />
      </View>

      {/* Single Row Controls - Compact Layout */}
      <View style={styles.compactControlsRow}>
        {/* LEFT SIDE CONTROLS */}
        <View style={styles.compactLeftControls}>
          {/* Skip Backward 10s */}
          <TouchableOpacity
            style={styles.compactControlButton}
            onPress={onSkipBackward}
            activeOpacity={0.7}
          >
            <MaterialIcons name="replay-10" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Play/Pause */}
          <TouchableOpacity
            style={styles.compactPlayButton}
            onPress={onTogglePlay}
            activeOpacity={0.7}
          >
            {isPlaying ? (
              <AntDesign name="pause" size={20} color="#fff" />
            ) : (
              <AntDesign name="play" size={20} color="#fff" />
            )}
          </TouchableOpacity>

          {/* Skip Forward 10s */}
          <TouchableOpacity
            style={styles.compactControlButton}
            onPress={onSkipForward}
            activeOpacity={0.7}
          >
            <MaterialIcons name="forward-10" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Volume Controls */}
          <TouchableOpacity
            style={styles.compactControlButton}
            onPress={onToggleMute}
            activeOpacity={0.7}
          >
            {isMuted || volume === 0 ? (
              <AntDesign name="sound" size={16} color="#fff" />
            ) : (
              <AntDesign name="sound" size={16} color="#fff" />
            )}
          </TouchableOpacity>
          <Slider
            style={styles.compactVolumeSlider}
            minimumValue={0}
            maximumValue={1}
            value={isMuted ? 0 : volume}
            onValueChange={onVolumeChange}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbStyle={styles.compactVolumeThumb}
          />

          {/* Time Display */}
          <Text style={styles.compactTimeDisplay}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>

        {/* RIGHT SIDE CONTROLS */}
        <View style={styles.compactRightControls}>
          {/* Speed Selector */}
          <TouchableOpacity
            style={styles.compactSpeedSelector}
            onPress={() => setShowSpeedModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.compactSpeedText}>{playbackSpeed}x</Text>
          </TouchableOpacity>

          {/* Ask AI Button */}
          {hasAIAssistance && (
            <TouchableOpacity
              style={[
                styles.compactAiButton,
                aiTutorLoading && styles.aiButtonDisabled,
              ]}
              onPress={onAiTutor}
              disabled={aiTutorLoading}
              activeOpacity={0.7}
            >
              {aiTutorLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="send" size={12} color="#fff" />
              )}
              <Text style={styles.compactAiButtonText}>ASK AI</Text>
            </TouchableOpacity>
          )}

          {/* Fullscreen Button */}
          <TouchableOpacity
            style={styles.compactControlButton}
            onPress={onFullScreen}
            activeOpacity={0.7}
          >
            <MaterialIcons name="fullscreen" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Speed Selector Modal */}
      <Modal
        visible={showSpeedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSpeedModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSpeedModal(false)}
        >
          <View style={styles.speedModalContent}>
            <FlatList
              data={SPEED_OPTIONS}
              keyExtractor={item => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.speedOption,
                    item === playbackSpeed && styles.speedOptionSelected,
                  ]}
                  onPress={() => {
                    onSpeedChange(item);
                    setShowSpeedModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.speedOptionText,
                      item === playbackSpeed && styles.speedOptionTextSelected,
                    ]}
                  >
                    {item}x
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'column',
    gap: 4,
  },
  progressContainer: {
    position: 'relative',
    height: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarArea: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#ef4444',
    width: '0%',
    borderRadius: 2,
  },
  progressFillActive: {
    height: '100%',
    backgroundColor: '#ef4444',
    borderRadius: 2,
  },
  progressRange: {
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'transparent',
  },
  sliderThumb: {
    width: 12,
    height: 12,
    backgroundColor: '#ef4444',
    borderRadius: 50,
  },
  // Legacy styles (keeping for compatibility)
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  controlButton: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },

  // New mobile-optimized layout styles
  primaryControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  primaryLeftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  playButton: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  timeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  primaryRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  secondaryControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  secondaryLeftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  secondaryVolumeSlider: {
    width: 60,
    height: 3,
    marginLeft: 8,
  },
  secondaryVolumeThumb: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  secondaryRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondarySpeedSelector: {
    minWidth: 50,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  secondarySpeedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryAiButton: {
    backgroundColor: '#1677ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secondaryAiButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  volumeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
  },
  volumeSlider: {
    width: 80,
    height: 4,
  },
  volumeThumb: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  timeDisplay: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    minWidth: 100,
    marginLeft: 8,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speedSelector: {
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  speedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  aiButton: {
    backgroundColor: '#1677ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiButtonDisabled: {
    opacity: 0.6,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedModalContent: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8,
    minWidth: 100,
    maxHeight: 200,
  },
  speedOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  speedOptionSelected: {
    backgroundColor: '#1677ff',
  },
  speedOptionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  speedOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  // Compact single-row layout styles
  compactControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  compactLeftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactControlButton: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
  compactPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
  },
  compactVolumeSlider: {
    width: 50,
    height: 3,
    marginLeft: 1,
  },
  compactVolumeThumb: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  compactTimeDisplay: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
    minWidth: 80,
  },
  compactRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactSpeedSelector: {
    minWidth: 40,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginHorizontal: 1,
  },
  compactSpeedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  compactAiButton: {
    backgroundColor: '#1677ff',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginHorizontal: 1,
  },
  compactAiButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default VideoControls;
