// ===== src/features/ui/AudioSidebar.tsx =====
import React from 'react';
import { useAppStore } from '../../app/store';
import { theme } from './theme';
import AudioPlayer from './components/AudioPlayer';
import GlobalReactivityControls from './components/GlobalReactivityControls';
import DockedPanel from './components/DockedPanel';

const panelContentMap: Record<string, React.ReactNode> = {
  reactivity: <GlobalReactivityControls />,
};

/**
 * The right sidebar container for all audio-related controls.
 */
export default function AudioSidebar() {
  const { ui } = useAppStore();
  const reactivityPanelState = ui.panels.find(p => p.id === 'reactivity');

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 60, // Below header
    bottom: 0,
    right: 0,
    width: '340px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    zIndex: 900,
    boxSizing: 'border-box',
  };
  
  const titleStyle: React.CSSProperties = {
    padding: '10px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    color: theme.colors.text,
    opacity: 0.8,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  return (
    <aside style={sidebarStyle}>
        <div style={titleStyle}>Audio Controls</div>
        <AudioPlayer />

        {reactivityPanelState && reactivityPanelState.visible && (
            <DockedPanel key={reactivityPanelState.id} panelState={reactivityPanelState}>
                {panelContentMap[reactivityPanelState.id]}
            </DockedPanel>
        )}
    </aside>
  );
}