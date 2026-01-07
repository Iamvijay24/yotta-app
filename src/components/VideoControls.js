import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
          minimumTrackTintColor="#2575fc"
          maximumTrackTintColor="#fff"
          thumbStyle={styles.sliderThumb}
        />
      </View>

      {/* Controls Row */}
      <View style={styles.controlsRow}>
        {/* LEFT SIDE CONTROLS */}
        <View style={styles.leftControls}>
          {/* Skip Backward 10s */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={onSkipBackward}
            activeOpacity={0.7}
          >
            <AntDesign name="fastbackward" size={25} color="#fff" />
          </TouchableOpacity>

          {/* Play/Pause */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={onTogglePlay}
            activeOpacity={0.7}
          >
            {isPlaying ? (
              <AntDesign name="pausecircle" size={20} color="#fff" />
            ) : (
              <AntDesign name="playcircleo" size={20} color="#fff" />
            )}
          </TouchableOpacity>

          {/* Skip Forward 10s */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={onSkipForward}
            activeOpacity={0.7}
          >
            <AntDesign name="fastforward" size={25} color="#fff" />
          </TouchableOpacity>

          {/* Volume Controls */}
          <View style={styles.volumeContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={onToggleMute}
              activeOpacity={0.7}
            >
              <AntDesign
                name={isMuted || volume === 0 ? 'sound' : 'sound'}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              value={isMuted ? 0 : volume}
              onValueChange={onVolumeChange}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#666"
              thumbStyle={styles.volumeThumb}
            />
          </View>

          {/* Time Display */}
          <Text style={styles.timeDisplay}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>

        {/* RIGHT SIDE CONTROLS */}
        <View style={styles.rightControls}>
          {/* Speed Selector */}
          <TouchableOpacity
            style={styles.speedSelector}
            onPress={() => {
              const currentIndex = SPEED_OPTIONS.indexOf(playbackSpeed);
              const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
              onSpeedChange(SPEED_OPTIONS[nextIndex]);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.speedText}>{playbackSpeed}x</Text>
          </TouchableOpacity>

          {/* Ask AI Button */}
          {hasAIAssistance && (
            <TouchableOpacity
              style={[
                styles.aiButton,
                aiTutorLoading && styles.aiButtonDisabled,
              ]}
              onPress={onAiTutor}
              disabled={aiTutorLoading}
              activeOpacity={0.7}
            >
              {aiTutorLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <AntDesign name="message1" size={14} color="#fff" />
              )}
              <Text style={styles.aiButtonText}>Ask AI</Text>
            </TouchableOpacity>
          )}

          {/* Fullscreen Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={onFullScreen}
            activeOpacity={0.7}
          >
            <AntDesign name="arrowsalt" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBarArea: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFillActive: {
    height: '100%',
    backgroundColor: '#2575fc',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressRange: {
    width: '100%',
    height: 20,
  },
  sliderThumb: {
    width: 12,
    height: 12,
    backgroundColor: '#2575fc',
  },
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
    padding: 2,
    marginHorizontal: 1,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
  },
  volumeSlider: {
    width: 60,
    height: 20,
    marginLeft: 1,
  },
  volumeThumb: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
  },
  timeDisplay: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 8,
    minWidth: 80,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speedSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  speedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
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
});
