// ===== src/features/ui/UIManager.tsx =====
// This component now acts as the LEFT sidebar for "Visual Controls".
import React from 'react';
import { useAppStore } from '../../app/store';
import { theme } from './theme';
import DockedPanel from './components/DockedPanel';
import CameraControls from './components/CameraControls';
import SceneControls from './components/SceneControls';
import EffectsControls from './components/EffectsControls';
import ExportControls from './components/ExportControls';
import LooksControls from './components/LooksControls';
import ObjectControls from './components/ObjectControls';
import AudioPlayer from './components/AudioPlayer';
import GlobalReactivityControls from './components/GlobalReactivityControls';

const panelContentMap: Record<string, React.ReactNode> = {
  scene: <SceneControls />,
  camera: <CameraControls />,
  effects: <EffectsControls />,
  looks: <LooksControls />,
  objects: <ObjectControls />,
  export: <ExportControls />,
  reactivity: <GlobalReactivityControls />,
};

/**
 * ULTRA-SAFE UIManager-Implementierung - The "Visual Controls" Sidebar
 * WARNUNG: KEIN setCurrentTime HIER!
 */
export default function UIManager() {
  const { ui } = useAppStore();
  
  // CRITICAL FIX: Ensure panels is always an array
  const panels = ui?.panels || [];
  
  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    width: '340px',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    overflowY: 'auto',
    zIndex: 900,
    boxSizing: 'border-box',
    background: theme.colors.background,
  };

  const logoStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    borderBottom: `1px solid ${theme.colors.primary}`,
    background: theme.colors.panelBg,
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: theme.colors.primary,
    fontFamily: theme.typography.mainFont,
    margin: 0,
  };

  const betaStyle: React.CSSProperties = {
    fontSize: '12px',
    color: theme.colors.text,
    opacity: 0.7,
    marginTop: '4px',
  };

  const audioSectionStyle: React.CSSProperties = {
    padding: '15px',
    borderBottom: `1px solid ${theme.colors.primary}`,
    background: theme.colors.panelBg,
  };

  const panelsContainerStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const visualPanels = ['scene', 'camera', 'objects', 'effects', 'looks', 'export', 'reactivity'];

  return (
    <aside style={sidebarStyle}>
      {/* Logo Section */}
      <div style={logoStyle}>
        <h1 style={logoTextStyle}>Auralune</h1>
        <div style={betaStyle}>Beta</div>
      </div>

      {/* Audio Controls Section */}
      <div style={audioSectionStyle}>
        <AudioPlayer />
      </div>

      {/* Panels Container */}
      <div style={panelsContainerStyle}>
        {panels
          .filter(p => visualPanels.includes(p.id))
          .map(panelState => 
            panelState.visible ? ( 
              <DockedPanel key={panelState.id} panelState={panelState}>
                {panelContentMap[panelState.id]}
              </DockedPanel>
            ) : null
          )}
      </div>
    </aside>
  );
}