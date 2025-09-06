// ===== src/features/ui/components/Header.tsx =====
import React from 'react';
import { useAppStore } from '../../../app/store';
import { theme } from '../theme';

/**
 * A new global header component that contains the logo and sidebar toggles.
 */
export default function Header() {
  const { ui, toggleLeftSidebar, toggleRightSidebar } = useAppStore();

  if (ui.isFullscreen) {
    return null;
  }

  // Main container for the header
  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: theme.colors.panelBg,
    borderBottom: `1px solid ${theme.colors.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 1001,
    boxSizing: 'border-box',
  };
  
  // Left side of header (toggle + logo)
  const leftSectionStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
  };

  // Right side of header (toggle)
  const rightSectionStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
  };

  // Style for toggle buttons
  const toggleButtonStyle: React.CSSProperties = {
      ...theme.styles.button,
      fontSize: '18px',
      padding: '5px 10px'
  };

  // Logo styles copied from Logo.tsx
  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: theme.colors.primary,
    fontFamily: theme.typography.mainFont,
    fontSize: '24px',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
    pointerEvents: 'none',
  };

  const iconStyles: React.CSSProperties = {
    width: '36px',
    height: '36px',
    backgroundColor: theme.colors.primary,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.colors.background,
    boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
    flexShrink: 0,
  };

  return (
    <header style={headerStyle}>
      <div style={leftSectionStyle}>
          <button onClick={toggleLeftSidebar} style={toggleButtonStyle} title="Toggle Visual Controls">
              {ui.isLeftSidebarVisible ? '‹' : '›'}
          </button>
          <div style={logoContainerStyle}>
            <div style={iconStyles}>A</div>
            <span>AURALUNE</span>
          </div>
      </div>
      <div style={rightSectionStyle}>
        <button onClick={toggleRightSidebar} style={toggleButtonStyle} title="Toggle Audio Controls">
            {ui.isRightSidebarVisible ? '›' : '‹'}
        </button>
      </div>
    </header>
  );
}