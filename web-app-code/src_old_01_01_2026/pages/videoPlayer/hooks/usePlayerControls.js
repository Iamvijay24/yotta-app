import { useState, useEffect, useRef, useCallback } from 'react';
export const usePlayerControls = (isPlaying) => {
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);
  const clearControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  }, []);
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
   
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
   
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      clearControlsTimeout();
    }
  }, [isPlaying, clearControlsTimeout]);
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  return {
    showControls,
    showControlsTemporarily,
    clearControlsTimeout,
  };
};