import React, { useRef, useEffect } from 'react';
import { useAppStore } from '../../app/store';

// This is a headless component that manages the audio element
// CRITICAL: This component does NOT call setCurrentTime to avoid conflicts with AnimationController
export default function AudioController() {
  const { audioSrc, isPlaying, currentTime, volume, isMuted, setDuration } = useAppStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Effect to handle source changes
  useEffect(() => {
    if (audioRef.current && audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
    }
  }, [audioSrc]);

  // Effect to handle play/pause state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Effect to handle volume and mute state
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
        audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Effect to sync store's currentTime to audio element's currentTime
  // This handles seeking from UI elements like a progress bar
  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 0.2) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <audio
      ref={audioRef}
      onLoadedMetadata={handleLoadedMetadata}
      style={{ display: 'none' }}
    />
  );
}