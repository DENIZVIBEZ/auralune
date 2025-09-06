
import React, { useEffect } from 'react';
// FIX: Import `extend` and `THREE` and call `extend(THREE)` to make R3F JSX elements available to TypeScript.
import { Canvas, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from './app/store';

// Globale Controller und Manager
import AudioController from './features/audio/AudioController';
import AnalysisManager from './features/audio/AnalysisManager';
import AnimationController from './features/canvas/AnimationController';
import ProController from './features/pro/ProController';
import UIManager from './features/ui/UIManager';
import AudioSidebar from './features/ui/AudioSidebar'; // NEU: Rechte Seitenleiste

// 3D-Komponenten
import SceneManager from './features/scenes/SceneManager';
import ModelManager from './features/scenes/components/ModelManager';
import CameraDirector from './features/camera/CameraDirector';
import MouseCameraController from './features/camera/MouseCameraController';
import EffectManager from './features/effects/EffectManager';

// UI-Komponenten
import Header from './features/ui/components/Header'; // NEU: Kopfzeile
import Watermark from './features/pro/Watermark';
import RecordingController from './features/export/RecordingController';
import DebugPanel from './features/debug/DebugPanel';
import { theme } from './features/ui/theme';

// FIX: Explicitly extend R3F with all of THREE to fix JSX type errors.
extend(THREE);

/**
 * ULTRA-SAFE App-Komponente
 * WARNUNG: KEIN setCurrentTime HIER!
 */
export default function App() {
  const { ui, setFullscreen } = useAppStore();

  // Effekt zur Synchronisierung des Vollbildmodus mit der Browser-API
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement != null;
      if (ui.isFullscreen !== isCurrentlyFullscreen) {
        setFullscreen(isCurrentlyFullscreen);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    if (ui.isFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Fehler beim Aktivieren des Vollbildmodus: ${err.message} (${err.name})`);
        setFullscreen(false);
      });
    } else if (!ui.isFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [ui.isFullscreen, setFullscreen]);

  const appStyles: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    background: `linear-gradient(135deg, ${theme.colors.background} 0%, #0A0A0A 100%)`,
    overflow: 'hidden',
    fontFamily: theme.typography.mainFont,
  };
  
  const LEFT_SIDEBAR_WIDTH = 340;
  const RIGHT_SIDEBAR_WIDTH = 340;

  const canvasContainerStyles: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      paddingTop: ui.isFullscreen ? '0' : '60px', // Platz für Header
      paddingBottom: ui.isFullscreen ? '0' : '10px',
      paddingLeft: ui.isFullscreen ? '0' : (ui.isLeftSidebarVisible ? `${LEFT_SIDEBAR_WIDTH}px` : '0'),
      paddingRight: ui.isFullscreen ? '0' : (ui.isRightSidebarVisible ? `${RIGHT_SIDEBAR_WIDTH}px` : '0'),
      boxSizing: 'border-box',
      transition: 'padding 0.3s ease-in-out',
  };


  return (
    <div style={appStyles}>
      {/* Headless-Controller, die immer laufen */}
      <AudioController />
      <AnalysisManager />
      <ProController />

      {/* Container for the 3D Canvas, with padding to avoid UI overlap */}
      <div style={canvasContainerStyles}>
          <Canvas
            gl={{
              preserveDrawingBuffer: true,
              antialias: true,
              alpha: false,
            }}
            camera={{ position: [0, 0, 5], fov: 75 }}
          >
            {/* WARNUNG: AnimationController MUSS hier sein! */}
            <AnimationController />
            <SceneManager />
            <ModelManager />
            <MouseCameraController />
            <CameraDirector />
            <EffectManager />

            {/* Grundbeleuchtung */}
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
          </Canvas>
      </div>

      {/* UI-Layer */}
      <Header />
      {ui.isLeftSidebarVisible && <UIManager />}
      {ui.isRightSidebarVisible && <AudioSidebar />}
      <RecordingController />
      <Watermark />
      <DebugPanel />
    </div>
  );
}