
import React, { useEffect } from 'react';
import { useAppStore } from '../../app/store';
import type { FeatureTrack } from '../../types/features';

// This is a headless component that "analyzes" the audio file.
// In a real app, this would use the Web Audio API and libraries like Meyda.js or a custom FFT implementation.
// For this simulation, we generate mock data based on the audio duration.
export default function AnalysisManager() {
  const { audioFile, setDuration, setFeatureTrack, setIsAnalyzing } = useAppStore();

  useEffect(() => {
    if (!audioFile) return;

    const analyze = async () => {
      setIsAnalyzing(true);

      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Use a temporary audio element to get the duration accurately.
      const tempAudio = document.createElement('audio');
      const audioUrl = URL.createObjectURL(audioFile);
      tempAudio.src = audioUrl;

      tempAudio.onloadedmetadata = () => {
        const duration = tempAudio.duration;
        setDuration(duration);
        URL.revokeObjectURL(audioUrl); // Clean up

        const frames = Math.ceil(duration * 60); // 60 data points per second
        
        // Generate mock data
        const mockTrack: FeatureTrack = {
          bass: Array.from({ length: frames }, () => Math.random() * 0.5 + Math.sin(Date.now()) * 0.2),
          mids: Array.from({ length: frames }, () => Math.random() * 0.4),
          highs: Array.from({ length: frames }, () => Math.random() * 0.3),
          onsets: Array.from({ length: frames }, (_, i) => (i % 15 === 0 ? 1 : 0)), // Beat every quarter second
          waveform: Array.from({ length: frames }, () => [Math.random() * 2 - 1, Math.random() * 2 - 1]),
          spectralCentroid: Array.from({ length: frames }, () => Math.random() * 1000 + 500),
        };

        setFeatureTrack(mockTrack);
        setIsAnalyzing(false);
      };

      tempAudio.onerror = () => {
          console.error("Error loading audio for analysis.");
          setIsAnalyzing(false);
          URL.revokeObjectURL(audioUrl);
      }
    };

    analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFile]);

  return null;
}
