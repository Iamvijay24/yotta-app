import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Send,} from 'lucide-react';
import { Select, Button } from 'antd';
import styles from '../video_player.module.scss';
import { HiOutlineBackward, HiOutlineForward } from 'react-icons/hi2';

const { Option } = Select;
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
  // Stop propagation to prevent double-click fullscreen
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`${styles.videoControls} ${!show ? styles.hidden : ''}`}
      onDoubleClick={stopPropagation}
    >
      <div className={styles.progressContainer} onDoubleClick={stopPropagation}>
        <div
          className={styles.progressBarArea}
          onClick={(e) => {
            e.stopPropagation();
            onProgressClick(e);
          }}
          onDoubleClick={stopPropagation}
        >
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
        <input
          type="range"
          className={styles.progressRange}
          min="0"
          max="100"
          step="0.1"
          value={progressPercent}
          onChange={onSeek}
          onDoubleClick={stopPropagation}
        />
      </div>
      <div className={styles.controlsRow} onDoubleClick={stopPropagation}>
        {/* LEFT SIDE CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
          {/* Skip Backward 10s */}
          <button 
            className={styles.controlButton} 
            onClick={(e) => {
              e.stopPropagation();
              onSkipBackward();
            }}
            onDoubleClick={stopPropagation}
            title="Skip backward 10 seconds"
          >
            <HiOutlineBackward size={25} />
          </button>

          <button 
            className={styles.controlButton} 
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
            onDoubleClick={stopPropagation}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          {/* Skip Forward 10s */}
          <button 
            className={styles.controlButton} 
            onClick={(e) => {
              e.stopPropagation();
              onSkipForward();
            }}
            onDoubleClick={stopPropagation}
            title="Skip forward 10 seconds"
          >
            <HiOutlineForward size={25} />
          </button>
          
          <div className={styles.volumeSliderContainer} onDoubleClick={stopPropagation}>
            <button 
              className={styles.controlButton} 
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute();
              }}
              onDoubleClick={stopPropagation}
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              className={styles.volumeSlider}
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              onClick={stopPropagation}
              onDoubleClick={stopPropagation}
            />
          </div>
          <span className={styles.timeDisplay} onDoubleClick={stopPropagation}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        
        {/* RIGHT SIDE CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Select
            className={`${styles.speedSelector} ${styles.speed}`}
            value={playbackSpeed}
            onChange={onSpeedChange}
            onClick={stopPropagation}
            onDoubleClick={stopPropagation}
            getPopupContainer={getPopupContainer}
          >
            {SPEED_OPTIONS.map((speed) => (
              <Option key={speed} value={speed}>
                {speed}x
              </Option>
            ))}
          </Select>
          
          {hasAIAssistance && (
            <Button
              type="primary"
              icon={<Send size={14} />}
              loading={aiTutorLoading}
              onClick={(e) => {
                e.stopPropagation();
                onAiTutor();
              }}
              onDoubleClick={stopPropagation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1677ff',
                borderRadius: '8px',
              }}
            >
              Ask AI
            </Button>
          )}
          
          <button 
            className={styles.controlButton} 
            onClick={(e) => {
              e.stopPropagation();
              onFullScreen();
            }}
            onDoubleClick={stopPropagation}
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};