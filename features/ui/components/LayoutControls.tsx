// FIX: Rewrote and cleaned up the entire file.
// Removed all layout saving/loading logic and garbage text.
// This component now provides a simple dropdown to toggle panel visibility.
import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../../app/store';
import { theme } from '../theme';

export default function LayoutControls() {
  const { ui, setPanelVisibility } = useAppStore();
  const [isPanelMenuOpen, setIsPanelMenuOpen] = useState(false);
  const panelMenuRef = useRef<HTMLDivElement>(null);
  
  const allPanels = useAppStore(s => s.ui.panels);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelMenuRef.current && !panelMenuRef.current.contains(event.target as Node)) {
        setIsPanelMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: theme.colors.panelBg,
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${theme.colors.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 20px',
    zIndex: 1600,
    gap: '15px',
  };
  
  const buttonStyle = theme.styles.button;

  const panelMenuContainerStyle: React.CSSProperties = {
    position: 'relative',
  };

  const panelMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 5px)',
    right: 0,
    backgroundColor: theme.colors.panelBg,
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: '4px',
    padding: '8px',
    zIndex: 1700,
    minWidth: '150px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    boxShadow: '0 8px 32px 0 rgba(212, 175, 55, 0.2)',
  };

  const panelMenuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
    userSelect: 'none',
    transition: 'background-color 0.2s ease',
  };

  const checkboxStyle: React.CSSProperties = {
      width: '16px',
      height: '16px',
      border: `1px solid ${theme.colors.primary}`,
      borderRadius: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.colors.background,
      backgroundColor: 'transparent',
      fontSize: '12px',
      fontWeight: 'bold',
      flexShrink: 0,
      transition: 'background-color 0.2s ease',
  };

  return (
    <div style={containerStyle}>
        <div style={panelMenuContainerStyle} ref={panelMenuRef}>
            <button
                style={buttonStyle}
                onClick={() => setIsPanelMenuOpen(!isPanelMenuOpen)}
            >
                Panels ▾
            </button>
            {isPanelMenuOpen && (
                <div style={panelMenuStyle}>
                    {allPanels.map(panel => {
                        // Find the current state of the panel to get its visibility
                        const currentPanelState = ui.panels.find(p => p.id === panel.id);
                        const isVisible = currentPanelState?.visible ?? false;

                        return (
                            <div
                                key={panel.id}
                                style={panelMenuItemStyle}
                                onClick={() => setPanelVisibility(panel.id, !isVisible)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div style={{
                                    ...checkboxStyle,
                                    backgroundColor: isVisible ? theme.colors.primary : 'transparent'
                                }}>
                                    {isVisible && '✓'}
                                </div>
                                <span>{panel.id.charAt(0).toUpperCase() + panel.id.slice(1)}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    </div>
  );
}
