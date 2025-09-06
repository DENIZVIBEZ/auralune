import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { CameraState, CameraMode } from '../types/camera';
import type { FeatureTrack } from '../types/features';
import type { ActiveEffect } from '../types/effects';
import type { UIState, PanelState } from '../types/ui';
import type { SceneObject, SceneObjectReactivity } from '../types/objects';
import type { CameraKeyframe } from '../types/ai';

// --- TYPES ---

type ExportStatus = 'IDLE' | 'REQUESTED' | 'RECORDING' | 'PAUSED' | 'ENCODING' | 'DONE' | 'ERROR';

interface CameraPreset {
  id: string;
  name: string;
  state: CameraState;
}

interface Look {
  id: string;
  name: string;
  sceneId: string;
  sceneParams: Record<string, any>;
  effects: ActiveEffect[];
  camera: CameraState;
}

interface GlobalReactivityState {
    camera: {
        enabled: boolean;
        band: 'bass' | 'mids' | 'highs';
        movementType: 'shake' | 'zoom' | 'none';
        intensity: number;
    };
    objects: {
        enabled: boolean;
        band: 'bass' | 'mids' | 'highs';
        movementType: 'jiggle' | 'none';
        intensity: number;
    };
}

// --- INITIAL STATE ---

const initialCameraState: CameraState = {
  mode: 'ORBIT',
  target: [0, 0, 0],
  distance: 5,
  azimuth: 0,
  elevation: 0,
  fov: 75,
  userControlled: false,
};

const initialUIState: UIState = {
  isLeftSidebarVisible: true,
  isRightSidebarVisible: false,
  panels: [
    { id: 'scenes', title: 'Scenes', visible: true, isCollapsed: false },
    { id: 'effects', title: 'Effects', visible: true, isCollapsed: false },
    { id: 'objects', title: 'Objects', visible: true, isCollapsed: false },
    { id: 'camera', title: 'Camera', visible: true, isCollapsed: false },
    { id: 'audio', title: 'Audio', visible: true, isCollapsed: false },
    { id: 'export', title: 'Export', visible: true, isCollapsed: false },
  ]
};

const initialGlobalReactivity: GlobalReactivityState = {
    camera: {
        enabled: false,
        band: 'bass',
        movementType: 'shake',
        intensity: 1.0,
    },
    objects: {
        enabled: false,
        band: 'bass',
        movementType: 'jiggle',
        intensity: 1.0,
    },
};

// --- STORE CREATION ---
// CRITICAL FIX: Use a more stable store creation pattern to prevent React Error #185

export const useAppStore = create(
  combine(
    {
      // --- AUDIO STATE ---
      audioSrc: null as string | null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: false,
      isAnalyzing: false,
      featureTrack: null as FeatureTrack | null,

      // --- SCENE STATE ---
      activeSceneId: 'particles',
      sceneParams: {} as Record<string, any>,
      sceneObjects: [] as SceneObject[],
      selectedObjectId: null as string | null,

      // --- CAMERA STATE ---
      camera: initialCameraState,
      cameraPresets: [] as CameraPreset[],
      cameraKeyframes: [] as CameraKeyframe[],

      // --- EFFECTS STATE ---
      activeEffects: [] as ActiveEffect[],

      // --- LOOKS STATE ---
      looks: [] as Look[],
      activeLookId: null as string | null,

      // --- GLOBAL REACTIVITY STATE ---
      globalReactivity: initialGlobalReactivity,

      // --- EXPORT STATE ---
      exportStatus: 'IDLE' as ExportStatus,
      recordingCountdown: 0,
      exportProgress: 0,
      exportError: null as string | null,
      exportOutputUrl: null as string | null,

      // --- UI STATE ---
      ui: initialUIState,
    },
    (set, get) => ({
      // --- AUDIO ACTIONS ---
      setAudioSrc: (src: string | null) => {
        set({ audioSrc: src, currentTime: 0, duration: 0, isPlaying: false });
      },
      togglePlay: () => {
        const state = get();
        if (state.duration > 0) {
          set({ isPlaying: !state.isPlaying });
        }
      },
      // CRITICAL FIX: Simplified setCurrentTime to prevent infinite loops
      setCurrentTime: (time: number, isScrubbing = false) => {
        const state = get();
        // Prevent updates during recording unless scrubbing
        if (state.exportStatus === 'RECORDING' && !isScrubbing) return;
        
        const newTime = Math.max(0, Math.min(time, state.duration));
        // Only update if there's a meaningful change
        if (Math.abs(newTime - state.currentTime) > 0.01) {
          set({ currentTime: newTime });
        }
      },
      setDuration: (duration: number) => set({ duration }),
      setVolume: (volume: number) => set({ volume, isMuted: volume === 0 }),
      toggleMute: () => set(state => ({ isMuted: !state.isMuted })),

      // --- ANALYSIS ACTIONS ---
      setIsAnalyzing: (isAnalyzing: boolean) => set({ isAnalyzing }),
      setFeatureTrack: (track: FeatureTrack) => set({ featureTrack: track }),

      // --- SCENE ACTIONS ---
      setActiveScene: (id: string) => set({ activeSceneId: id, sceneParams: {} }),
      setSceneParam: (key: string, value: any) => set(state => ({ 
        sceneParams: { ...state.sceneParams, [key]: value } 
      })),
      resetSceneParams: () => set({ sceneParams: {} }),

      // --- OBJECT ACTIONS ---
      addSceneObject: (url: string, name: string) => set(state => ({
        sceneObjects: [...state.sceneObjects, {
          id: nanoid(),
          url, name,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1,
          reactivity: { scaleOn: 'bass', intensity: 1.0 }
        }]
      })),
      removeSceneObject: (id: string) => set(state => ({
        sceneObjects: state.sceneObjects.filter(obj => obj.id !== id),
        selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId
      })),
      setSelectedObjectId: (id: string | null) => set({ selectedObjectId: id }),
      updateSceneObjectTransform: (id: string, transform: Partial<Pick<SceneObject, 'position' | 'rotation' | 'scale'>>) => set(state => ({
        sceneObjects: state.sceneObjects.map(obj => obj.id === id ? { ...obj, ...transform } : obj)
      })),
      updateSceneObjectReactivity: (id: string, reactivity: Partial<SceneObjectReactivity>) => set(state => ({
        sceneObjects: state.sceneObjects.map(obj => obj.id === id ? { ...obj, reactivity: { ...obj.reactivity, ...reactivity } } : obj)
      })),

      // --- CAMERA ACTIONS ---
      setCameraMode: (mode: CameraMode) => set(state => ({ camera: { ...state.camera, mode } })),
      setCameraTarget: (target: [number, number, number]) => set(state => ({ camera: { ...state.camera, target } })),
      setCameraDistance: (distance: number) => set(state => ({ camera: { ...state.camera, distance } })),
      setCameraAzimuth: (azimuth: number) => set(state => ({ camera: { ...state.camera, azimuth } })),
      setCameraElevation: (elevation: number) => set(state => ({ camera: { ...state.camera, elevation } })),
      setCameraFov: (fov: number) => set(state => ({ camera: { ...state.camera, fov } })),
      setCameraUserControlled: (userControlled: boolean) => set(state => ({ camera: { ...state.camera, userControlled } })),
      updateCameraState: (updates: Partial<CameraState>) => set(state => ({ camera: { ...state.camera, ...updates } })),

      // --- CAMERA PRESETS ---
      saveCameraPreset: (name: string) => set(state => ({
        cameraPresets: [...state.cameraPresets, { id: nanoid(), name, state: state.camera }]
      })),
      loadCameraPreset: (id: string) => set(state => {
        const preset = state.cameraPresets.find(p => p.id === id);
        return preset ? { camera: preset.state } : {};
      }),
      deleteCameraPreset: (id: string) => set(state => ({
        cameraPresets: state.cameraPresets.filter(p => p.id !== id)
      })),

      // --- CAMERA KEYFRAMES ---
      addCameraKeyframe: (keyframe: Omit<CameraKeyframe, 'id'>) => set(state => ({
        cameraKeyframes: [...state.cameraKeyframes, { ...keyframe, id: nanoid() }]
      })),
      removeCameraKeyframe: (id: string) => set(state => ({
        cameraKeyframes: state.cameraKeyframes.filter(k => k.id !== id)
      })),
      updateCameraKeyframe: (id: string, updates: Partial<CameraKeyframe>) => set(state => ({
        cameraKeyframes: state.cameraKeyframes.map(k => k.id === id ? { ...k, ...updates } : k)
      })),

      // --- EFFECTS ACTIONS ---
      addEffect: (effect: Omit<ActiveEffect, 'id'>) => set(state => ({
        activeEffects: [...state.activeEffects, { ...effect, id: nanoid() }]
      })),
      removeEffect: (id: string) => set(state => ({
        activeEffects: state.activeEffects.filter(e => e.id !== id)
      })),
      updateEffect: (id: string, updates: Partial<ActiveEffect>) => set(state => ({
        activeEffects: state.activeEffects.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      clearEffects: () => set({ activeEffects: [] }),

      // --- LOOKS ACTIONS ---
      saveLook: (name: string) => set(state => ({
        looks: [...state.looks, {
          id: nanoid(),
          name,
          sceneId: state.activeSceneId,
          sceneParams: state.sceneParams,
          effects: state.activeEffects,
          camera: state.camera
        }]
      })),
      loadLook: (id: string) => set(state => {
        const look = state.looks.find(l => l.id === id);
        return look ? {
          activeLookId: id,
          activeSceneId: look.sceneId,
          sceneParams: look.sceneParams,
          activeEffects: look.effects,
          camera: look.camera
        } : {};
      }),
      deleteLook: (id: string) => set(state => ({
        looks: state.looks.filter(l => l.id !== id),
        activeLookId: state.activeLookId === id ? null : state.activeLookId
      })),

      // --- GLOBAL REACTIVITY ACTIONS ---
      updateGlobalReactivity: (updates: Partial<GlobalReactivityState>) => set(state => ({
        globalReactivity: { ...state.globalReactivity, ...updates }
      })),

      // --- EXPORT ACTIONS ---
      requestExport: () => {
        const state = get();
        if (state.duration > 0) {
          set({ exportStatus: 'REQUESTED', recordingCountdown: 3 });
        }
      },
      setExportStatus: (status: ExportStatus) => set({ exportStatus: status }),
      setRecordingCountdown: (value: number) => set({ recordingCountdown: value }),
      setExportProgress: (progress: number) => set({ exportProgress: progress }),
      setExportOutputUrl: (url: string) => set({ exportOutputUrl: url }),
      resetExport: () => set({ 
        exportStatus: 'IDLE', 
        exportProgress: 0, 
        exportError: null, 
        exportOutputUrl: null 
      }),
      
      // --- UI ACTIONS ---
      setPanelVisibility: (id: string, visible: boolean) => set(state => ({
        ui: { 
          ...state.ui, 
          panels: state.ui.panels.map(p => p.id === id ? { ...p, visible } : p) 
        }
      })),
      togglePanelCollapsed: (id: string) => set(state => ({
        ui: { 
          ...state.ui, 
          panels: state.ui.panels.map(p => p.id === id ? { ...p, isCollapsed: !p.isCollapsed } : p) 
        }
      })),
      toggleLeftSidebar: () => set(state => ({ 
        ui: { ...state.ui, isLeftSidebarVisible: !state.ui.isLeftSidebarVisible } 
      })),
      toggleRightSidebar: () => set(state => ({ 
        ui: { ...state.ui, isRightSidebarVisible: !state.ui.isRightSidebarVisible } 
      })),
    })
  )
);

