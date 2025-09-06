
import React, { useState } from 'react';
import { useAppStore } from '../../app/store';
import { theme } from '../ui/theme';

export default function DebugPanel() {
  const { currentTime, duration, isPlaying, exportStatus } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    backgroundColor: theme.colors.panelBg,
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: '8px',
    color: theme.colors.text,
    padding: '10px',
    fontFamily: theme.typography.mainFont,
    fontSize: '12px',
    zIndex: 2000,
    maxWidth: '300px'
  };

  const toggleButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'none',
    border: 'none',
    color: theme.colors.primary,
    cursor: 'pointer',
    fontSize: '14px',
  };

  return (
    <div style={panelStyle}>
      <button style={toggleButtonStyle} onClick={() => setIsOpen(!isOpen)}>{isOpen ? '[-]' : '[+]'}</button>
      <strong>DEBUG</strong>
      {isOpen && (
        <div style={{ marginTop: '8px' }}>
          <div>Time: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s</div>
          <div>Playing: {isPlaying ? 'Yes' : 'No'}</div>
          <div>Export Status: {exportStatus}</div>
        </div>
      )}
    </div>
  );
}
