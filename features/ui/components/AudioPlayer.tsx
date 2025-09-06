// ===== src/features/ui/components/AudioPlayer.tsx =====
import React, { useRef } from 'react';
import { useAppStore } from '../../../app/store';
import { theme } from '../theme';

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * A dedicated component for the main audio playback controls.
 */
export default function AudioPlayer() {
  const { fileName, setAudioFile, isPlaying, togglePlay, currentTime, duration, isAnalyzing } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const audioControlStyle: React.CSSProperties = {
    padding: '10px',
    backgroundColor: theme.colors.panelBg,
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexShrink: 0,
  };
  
  const audioRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const playButtonStyle: React.CSSProperties = {
    ...theme.styles.button,
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    fontSize: '20px',
    flexShrink: 0,
  };
  
  const fileNameStyle: React.CSSProperties = {
    fontSize: '12px',
    opacity: 0.8,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
    flexGrow: 1,
  };

  return (
    <>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            style={{ display: 'none' }}
        />
        <div style={audioControlStyle}>
            <div style={audioRowStyle}>
                <button onClick={handleUploadClick} style={{...theme.styles.button, flexGrow: 1}}>
                    Upload Audio
                </button>
                <button onClick={togglePlay} style={playButtonStyle} disabled={!duration || isAnalyzing}>
                    {isPlaying ? '⏸' : '▶'}
                </button>
            </div>
            <div style={{...audioRowStyle, justifyContent: 'center'}}>
                <span style={fileNameStyle}>
                    {isAnalyzing ? 'Analysiere...' : (fileName || 'Kein Audio geladen')}
                </span>
                <span style={{fontSize: '12px', flexShrink: 0}}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>
        </div>
    </>
  );
}