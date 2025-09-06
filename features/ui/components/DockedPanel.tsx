// FIX: DockedPanel wurde zu einem einfachen, einklappbaren Container für die neue Seitenleisten-UI umgeschrieben.
// Alle Dragging-, Docking- und Layout-bezogene Logik wurde entfernt.
import React from 'react';
import { useAppStore } from '../../../app/store';
import type { PanelState } from '../../../types/ui';
import { theme } from '../theme';

interface DockedPanelProps {
  children: React.ReactNode;
  panelState: PanelState;
}

export default function DockedPanel({ children, panelState }: DockedPanelProps) {
  // FIX: setPanelVisibility wurde entfernt, da Panels nicht mehr ausgeblendet werden können.
  const { togglePanelCollapsed } = useAppStore();

  const handleHeaderClick = () => {
    togglePanelCollapsed(panelState.id);
  };

  const panelStyles: React.CSSProperties = {
    position: 'relative',
    backgroundColor: theme.colors.panelBg,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.1)',
    color: theme.colors.text,
    fontFamily: theme.typography.mainFont,
    fontSize: theme.typography.bodySize,
    flexShrink: 0, // Verhindert, dass Panels im Flex-Container schrumpfen
  };

  const headerStyles: React.CSSProperties = {
    padding: '10px 15px',
    borderBottom: panelState.isCollapsed ? 'none' : `1px solid ${theme.colors.primary}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    color: theme.colors.primary,
    cursor: 'pointer',
    userSelect: 'none',
  };
  
  const contentContainerStyle: React.CSSProperties = {
      maxHeight: panelState.isCollapsed ? '0px' : '400px', // Animiert die Höhe
      overflow: 'hidden',
      transition: 'max-height 0.3s ease-in-out',
  };
  
  const contentInnerStyle: React.CSSProperties = {
      padding: panelState.isCollapsed ? '0 15px' : '15px', // Entfernt Padding im eingeklappten Zustand
      maxHeight: '380px', // etwas weniger als der Container, damit das Padding sichtbar ist
      overflowY: 'auto',
  };
  
  const iconStyle: React.CSSProperties = {
      transition: 'transform 0.3s ease-in-out',
      transform: panelState.isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
      display: 'inline-block',
      marginRight: '8px',
  };


  return (
    <div style={panelStyles}>
      <div style={headerStyles} onClick={handleHeaderClick}>
        <div style={{ display: 'flex', alignItems: 'center'}}>
            <span style={iconStyle}>▼</span>
            <span>{panelState.id.toUpperCase()}</span>
        </div>
        {/* FIX: Der Schließen-Button wurde entfernt, um das Ausblenden von Panels zu verhindern. */}
      </div>
      <div style={contentContainerStyle}>
        <div style={contentInnerStyle}>
            {children}
        </div>
      </div>
    </div>
  );
}