// ===== src/features/ui/components/CameraControls.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React, { useState } from 'react';
import { useAppStore } from '../../../app/store';
import type { CameraMode } from '../../../types/camera';
import { theme } from '../theme';
import { generateCameraPath } from '../../ai/CameraPathGenerator';

const controlStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const labelStyles: React.CSSProperties = {
  color: theme.colors.primary,
  fontSize: theme.typography.smallSize,
  fontWeight: 'bold',
  marginBottom: '4px',
  display: 'block'
};

const sliderStyles = theme.styles.slider as React.CSSProperties;

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ borderTop: `1px solid rgba(212, 175, 55, 0.3)`, marginTop: '5px', paddingTop: '15px' }}>
        <h3 style={{ ...labelStyles, margin: '0 0 8px 0', fontSize: '14px' }}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {children}
        </div>
    </div>
);

/**
 * Sub-component for AI Camera Path Generation
 */
const AICameraControls = () => {
  const { camera, setAICameraPrompt, setAICameraPath, setAICameraStatus, duration } = useAppStore();
  const aiParams = camera.params.AI;

  const handleGenerate = async () => {
    if (!aiParams.prompt.trim()) return;
    setAICameraStatus('LOADING');
    try {
      const path = await generateCameraPath(aiParams.prompt);
      setAICameraPath(path);
      setAICameraStatus('IDLE');
    } catch (e: any) {
      setAICameraStatus('ERROR', e.message || 'An unexpected error occurred.');
    }
  };

  const aiSectionStyle: React.CSSProperties = {
    padding: '10px',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: '4px',
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const aiLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: theme.colors.primary,
  };

  const buttonStyle: React.CSSProperties = {
    ...theme.styles.button,
    transition: 'background-color 0.3s, opacity 0.3s',
  };

  if (aiParams.status === 'LOADING') {
    buttonStyle.opacity = 0.7;
  }

  const errorStyle: React.CSSProperties = {
    fontSize: '12px',
    color: theme.colors.error,
    margin: '4px 0 0 0',
  };

  return (
    <div style={aiSectionStyle}>
      <label style={aiLabelStyle}>
        <span style={{ fontSize: '18px' }}>🤖</span>
        <span>AI Cinematographer</span>
      </label>
      <p style={{ fontSize: '12px', margin: 0, opacity: 0.8 }}>
        Describe a camera movement (e.g., "slow dramatic pan")
      </p>
      <textarea
        placeholder="Enter movement description..."
        value={aiParams.prompt}
        onChange={(e) => setAICameraPrompt(e.target.value)}
        style={{...theme.styles.input, height: '60px', resize: 'vertical'}}
        disabled={aiParams.status === 'LOADING'}
      />
      <button
        style={buttonStyle}
        onClick={handleGenerate}
        disabled={aiParams.status === 'LOADING' || !aiParams.prompt.trim() || duration <= 0}
      >
        {aiParams.status === 'LOADING' ? 'Generating...' : '✨ Generate Path'}
      </button>
      {duration <= 0 && <p style={{...errorStyle, color: theme.colors.warning}}>Load audio first!</p>}
      {aiParams.error && <p style={errorStyle}>{aiParams.error}</p>}
    </div>
  );
};


/**
 * ULTRA-SAFE CameraControls
 * WARNUNG: KEIN setCurrentTime HIER!
 */
export default function CameraControls() {
  const {
    camera,
    cameraPresets: rawCameraPresets,
    setCameraMode,
    setCameraParam,
    saveCameraPreset,
    loadCameraPreset,
    deleteCameraPreset,
    setCameraMouseParam,
  } = useAppStore();

  // CRITICAL FIX: Ensure cameraPresets is always an array
  const cameraPresets = rawCameraPresets || [];

  const [presetName, setPresetName] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState('');
  
  // CRITICAL FIX: Ensure camera.params exists
  const mouseSettings = camera?.params?.MOUSE_SETTINGS || {};

  const modes: CameraMode[] = [
    'STATIC', 'ORBIT', 'DOLLY_ZOOM', 'TRACKING', 'CRANE', 
    'HANDHELD', 'DRONE', 'CINEMATIC_PAN', 'ZOOM_BURST', 'SPIRAL', 'AI'
  ];

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCameraMode(e.target.value as CameraMode);
  };
  
  const handleSavePreset = () => {
    if (presetName.trim()) {
      saveCameraPreset(presetName.trim());
      setPresetName('');
    }
  };

  const handleDeletePreset = () => {
    if (selectedPresetId) {
      deleteCameraPreset(selectedPresetId);
      setSelectedPresetId('');
    }
  };

  const handleLoadPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedPresetId(id);
    if (id) {
        loadCameraPreset(id);
    }
  };

  const selectStyles: React.CSSProperties = {
    ...theme.styles.input,
    width: '100%',
  };

  const presetControlRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  };

  const smallButtonStyle: React.CSSProperties = {
      ...theme.styles.button,
      padding: '4px 8px',
      fontSize: '12px'
  };

  return (
    <div style={controlStyles}>
      {/* --- Presets Section --- */}
      <div>
        <label style={labelStyles}>Camera Presets</label>
        <div style={presetControlRowStyle}>
            <select
                value={selectedPresetId}
                onChange={handleLoadPreset}
                style={{ ...selectStyles, flexGrow: 1 }}
            >
                <option value="">Load Preset...</option>
                {cameraPresets.map(preset => (
                    <option key={preset.id} value={preset.id} style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
                        {preset.name}
                    </option>
                ))}
            </select>
            <button
                onClick={handleDeletePreset}
                style={{...smallButtonStyle, color: theme.colors.error, borderColor: theme.colors.error}}
                disabled={!selectedPresetId}
            >
                Delete
            </button>
        </div>
        <div style={{ ...presetControlRowStyle, marginTop: '8px' }}>
            <input
                type="text"
                placeholder="New preset name..."
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                style={{ ...theme.styles.input, flexGrow: 1 }}
            />
            <button onClick={handleSavePreset} style={smallButtonStyle} disabled={!presetName.trim()}>
                Save
            </button>
        </div>
      </div>

      {/* --- Mouse Settings --- */}
      <Section title="Mouse Settings">
         <div>
          <label style={{...labelStyles, fontSize: '12px', opacity: 0.9}}>Orbit Sensitivity: {(mouseSettings.orbitSensitivity || 1.0).toFixed(2)}</label>
          <input
            type="range" min={0.1} max={3} step={0.05}
            value={mouseSettings.orbitSensitivity || 1.0}
            onChange={(e) => setCameraMouseParam('orbitSensitivity', parseFloat(e.target.value))}
            style={sliderStyles}
          />
        </div>
         <div>
          <label style={{...labelStyles, fontSize: '12px', opacity: 0.9}}>Zoom Sensitivity: {(mouseSettings.zoomSensitivity || 1.0).toFixed(2)}</label>
          <input
            type="range" min={0.1} max={3} step={0.05}
            value={mouseSettings.zoomSensitivity || 1.0}
            onChange={(e) => setCameraMouseParam('zoomSensitivity', parseFloat(e.target.value))}
            style={sliderStyles}
          />
        </div>
         <div>
          <label style={{...labelStyles, fontSize: '12px', opacity: 0.9}}>Pan Sensitivity: {(mouseSettings.panSensitivity || 1.0).toFixed(2)}</label>
          <input
            type="range" min={0.1} max={3} step={0.05}
            value={mouseSettings.panSensitivity || 1.0}
            onChange={(e) => setCameraMouseParam('panSensitivity', parseFloat(e.target.value))}
            style={sliderStyles}
          />
        </div>
      </Section>

      {/* --- Main Controls Section --- */}
      <Section title="Automation">
        <div>
          <label style={labelStyles}>Camera Mode</label>
          <select
            value={camera.mode}
            onChange={handleModeChange}
            style={selectStyles}
          >
            {modes.map(mode => (
              <option key={mode} value={mode} style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
                {mode.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {camera.mode === 'AI' ? (
          <AICameraControls />
        ) : (
          <>
            {camera.mode === 'ORBIT' && (
              <div>
                <label style={labelStyles}>Orbit Speed: {camera.params?.ORBIT?.speed?.toFixed(1) || '0.5'}</label>
                <input
                  type="range" min={0} max={2} step={0.05}
                  value={camera.params?.ORBIT?.speed || 0.5}
                  onChange={(e) => setCameraParam('ORBIT', 'speed', parseFloat(e.target.value))}
                  style={sliderStyles}
                />
              </div>
            )}
            {camera.mode === 'HANDHELD' && (
              <div>
                <label style={labelStyles}>Shake Intensity: {camera.params?.HANDHELD?.intensity?.toFixed(2) || '0.10'}</label>
                <input
                  type="range" min={0} max={1} step={0.01}
                  value={camera.params?.HANDHELD?.intensity || 0.1}
                  onChange={(e) => setCameraParam('HANDHELD', 'intensity', parseFloat(e.target.value))}
                  style={sliderStyles}
                />
              </div>
            )}
          </>
        )}
      </Section>
    </div>
  );
}