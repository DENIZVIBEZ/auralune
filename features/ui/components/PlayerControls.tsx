import React, { useRef } from 'react';
import { useAppStore } from '../../../app/store';
import { theme } from '../theme';
import VisualTimeline from './VisualTimeline';

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function PlayerControls() {
  const {
    fileName,
    setAudioFile,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isAnalyzing,
    setPanelVisibility,
  } = useAppStore();

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
  
  const handleExportClick = () => {
    setPanelVisibility('export', true);
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.panelBg,
    backdropFilter: 'blur(10px)',
    borderTop: `1px solid ${theme.colors.primary}`,
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 20px',
    zIndex: 1500,
    color: theme.colors.text,
    fontFamily: theme.typography.mainFont,
    gap: '5px'
  };
  
  const fileNameStyle: React.CSSProperties = {
      width: '100%',
      textAlign: 'center',
      fontSize: '12px',
      opacity: 0.7,
      height: '15px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
  };

  const controlsRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '15px',
    height: '40px'
  };

  const buttonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.primary,
    cursor: 'pointer',
    fontSize: '20px',
    flexShrink: 0
  };
  
  const playButtonStyle: React.CSSProperties = {
      ...buttonStyle,
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: `2px solid ${theme.colors.primary}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
  };

  const timeStyle: React.CSSProperties = {
    fontSize: '14px',
    width: '50px',
    textAlign: 'center',
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*"
        style={{ display: 'none' }}
      />
      
      <div style={fileNameStyle}>
        {isAnalyzing ? 'Analyzing Audio...' : (fileName || 'No audio loaded')}
      </div>
      
      <div style={controlsRowStyle}>
        <button onClick={handleUploadClick} style={{...theme.styles.button, flexShrink: 0}}>
          📤
        </button>
        <button onClick={togglePlay} style={playButtonStyle} disabled={!duration || isAnalyzing}>
            {isPlaying ? '⏸' : '▶'}
        </button>
        <span style={timeStyle}>{formatTime(currentTime)}</span>
        
        <div style={{ flex: '1 1 auto', minWidth: 0, height: '100%', display: 'flex', alignItems: 'center' }}>
            <VisualTimeline />
        </div>

        <span style={timeStyle}>{formatTime(duration)}</span>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <button onClick={toggleMute} style={buttonStyle}>
                {isMuted || volume === 0 ? '🔇' : '🔊'}
            </button>
            <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ ...theme.styles.slider as React.CSSProperties, width: '80px' }}
            />
        </div>

        <button onClick={handleExportClick} style={{...theme.styles.button, flexShrink: 0}}>
            🎬 Export
        </button>
      </div>
    </div>
  );
}