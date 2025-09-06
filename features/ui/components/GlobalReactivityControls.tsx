// ===== src/features/ui/components/GlobalReactivityControls.tsx =====
import React from 'react';
import { useAppStore } from '../../../app/store';
import { theme } from '../theme';

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ borderTop: `1px solid rgba(212, 175, 55, 0.3)`, paddingTop: '12px', marginTop: '5px' }}>
      <h3 style={{ ...labelStyles, margin: '0 0 8px 0' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </div>
);

const labelStyles: React.CSSProperties = {
  color: theme.colors.primary,
  fontSize: theme.typography.smallSize,
  fontWeight: 'bold',
  marginBottom: '4px',
  display: 'block'
};

const sliderStyles = theme.styles.slider as React.CSSProperties;
const selectStyles: React.CSSProperties = { ...theme.styles.input, width: '100%' };
const checkboxLabelStyles: React.CSSProperties = { ...labelStyles, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' };
const checkboxStyles: React.CSSProperties = { width: '18px', height: '18px', cursor: 'pointer', accentColor: theme.colors.primary };


export default function GlobalReactivityControls() {
  const { globalReactivity, setGlobalReactivity } = useAppStore();
  const camera = globalReactivity.camera;
  const objects = globalReactivity.objects;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Section title="Camera Reactivity">
        <label style={checkboxLabelStyles}>
            <input type="checkbox" checked={camera.enabled} onChange={e => setGlobalReactivity('camera', 'enabled', e.target.checked)} style={checkboxStyles}/>
            Enable Global Camera Shake
        </label>
        <div>
            <label style={{...labelStyles, fontSize: '12px' }}>Audio Band</label>
            <select value={camera.band} onChange={e => setGlobalReactivity('camera', 'band', e.target.value)} style={selectStyles} disabled={!camera.enabled}>
                <option value="bass" style={{backgroundColor: theme.colors.background}}>Bass</option>
                <option value="mids" style={{backgroundColor: theme.colors.background}}>Mids</option>
                <option value="highs" style={{backgroundColor: theme.colors.background}}>Highs</option>
            </select>
        </div>
        <div>
            <label style={{...labelStyles, fontSize: '12px' }}>Intensity: {camera.intensity.toFixed(2)}</label>
            <input type="range" min={0} max={1} step={0.01} value={camera.intensity} onChange={e => setGlobalReactivity('camera', 'intensity', +e.target.value)} style={sliderStyles} disabled={!camera.enabled}/>
        </div>
      </Section>
      <Section title="Object Reactivity">
        <label style={checkboxLabelStyles}>
            <input type="checkbox" checked={objects.enabled} onChange={e => setGlobalReactivity('objects', 'enabled', e.target.checked)} style={checkboxStyles}/>
            Enable Global Object Jiggle
        </label>
        <div>
            <label style={{...labelStyles, fontSize: '12px' }}>Audio Band</label>
            <select value={objects.band} onChange={e => setGlobalReactivity('objects', 'band', e.target.value)} style={selectStyles} disabled={!objects.enabled}>
                <option value="bass" style={{backgroundColor: theme.colors.background}}>Bass</option>
                <option value="mids" style={{backgroundColor: theme.colors.background}}>Mids</option>
                <option value="highs" style={{backgroundColor: theme.colors.background}}>Highs</option>
            </select>
        </div>
        <div>
            <label style={{...labelStyles, fontSize: '12px' }}>Intensity: {objects.intensity.toFixed(2)}</label>
            <input type="range" min={0} max={1} step={0.01} value={objects.intensity} onChange={e => setGlobalReactivity('objects', 'intensity', +e.target.value)} style={sliderStyles} disabled={!objects.enabled}/>
        </div>
      </Section>
    </div>
  );
}
