// ===== src/features/ui/components/ObjectControls.tsx =====
import React, { useState } from 'react';
import { useAppStore } from '../../../app/store';
import { theme } from '../theme';
import type { SceneObject } from '../../../types/objects';

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
  <div style={{ borderTop: `1px solid rgba(212, 175, 55, 0.3)`, paddingTop: '12px', marginTop: '5px' }}>
    <h3 style={{ ...labelStyles, margin: '0 0 8px 0' }}>{title}</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '5px' }}>
      {children}
    </div>
  </div>
);

const TransformControl: React.FC<{ selectedObject: SceneObject }> = ({ selectedObject }) => {
  const { updateSceneObjectTransform } = useAppStore();

  const handleTransform = (axis: 'x' | 'y' | 'z', type: 'position' | 'rotation', value: number) => {
    const newTransform = { ...selectedObject[type] };
    const axisIndex = { x: 0, y: 1, z: 2 }[axis];
    newTransform[axisIndex] = value;
    updateSceneObjectTransform(selectedObject.id, { [type]: newTransform });
  };

  const pos = selectedObject.position;
  const rot = selectedObject.rotation;

  return (
    <>
      <Section title="Position">
        <div>
          <label style={{ fontSize: '12px' }}>X: {pos[0].toFixed(2)}</label>
          <input type="range" min={-10} max={10} step={0.1} value={pos[0]} onChange={e => handleTransform('x', 'position', +e.target.value)} style={sliderStyles} />
        </div>
        <div>
          <label style={{ fontSize: '12px' }}>Y: {pos[1].toFixed(2)}</label>
          <input type="range" min={-10} max={10} step={0.1} value={pos[1]} onChange={e => handleTransform('y', 'position', +e.target.value)} style={sliderStyles} />
        </div>
        <div>
          <label style={{ fontSize: '12px' }}>Z: {pos[2].toFixed(2)}</label>
          <input type="range" min={-10} max={10} step={0.1} value={pos[2]} onChange={e => handleTransform('z', 'position', +e.target.value)} style={sliderStyles} />
        </div>
      </Section>
      <Section title="Rotation">
        <div>
          <label style={{ fontSize: '12px' }}>X: {((rot[0] * 180) / Math.PI).toFixed(0)}°</label>
          <input type="range" min={0} max={Math.PI * 2} step={0.01} value={rot[0]} onChange={e => handleTransform('x', 'rotation', +e.target.value)} style={sliderStyles} />
        </div>
        <div>
          <label style={{ fontSize: '12px' }}>Y: {((rot[1] * 180) / Math.PI).toFixed(0)}°</label>
          <input type="range" min={0} max={Math.PI * 2} step={0.01} value={rot[1]} onChange={e => handleTransform('y', 'rotation', +e.target.value)} style={sliderStyles} />
        </div>
        <div>
          <label style={{ fontSize: '12px' }}>Z: {((rot[2] * 180) / Math.PI).toFixed(0)}°</label>
          <input type="range" min={0} max={Math.PI * 2} step={0.01} value={rot[2]} onChange={e => handleTransform('z', 'rotation', +e.target.value)} style={sliderStyles} />
        </div>
      </Section>
      <Section title="Scale">
         <div>
          <label style={{ fontSize: '12px' }}>Uniform Scale: {selectedObject.scale.toFixed(2)}</label>
          <input type="range" min={0.1} max={5} step={0.05} value={selectedObject.scale} onChange={e => updateSceneObjectTransform(selectedObject.id, { scale: +e.target.value })} style={sliderStyles} />
        </div>
      </Section>
    </>
  );
};

export default function ObjectControls() {
  const {
    sceneObjects: rawSceneObjects,
    selectedObjectId,
    addSceneObject,
    removeSceneObject,
    selectObject,
    updateObjectParam
  } = useAppStore();
  
  // CRITICAL FIX: Ensure sceneObjects is always an array
  const sceneObjects = rawSceneObjects || [];
  
  const [url, setUrl] = useState('');

  const selectedObject = sceneObjects.find(obj => obj.id === selectedObjectId);

  const handleAddFromUrl = () => {
    if (url.trim()) {
      const name = url.split('/').pop()?.split('.')[0] || 'Imported Object';
      addSceneObject(url, name);
      setUrl('');
    }
  };

  const predefinedItems = [
    { name: 'Crystal', url: 'predefined://crystal' },
    { name: 'Torus', url: 'predefined://torus' },
    { name: 'Metaball', url: 'predefined://metaball' },
  ];

  return (
    <div style={controlStyles}>
      <Section title="Add Predefined">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {predefinedItems.map(item => (
            <button key={item.name} onClick={() => addSceneObject(item.url, item.name)} style={{...theme.styles.button, flexGrow: 1, fontSize: '12px' }}>
              + {item.name}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Add from URL (.glb)">
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{...theme.styles.input, flexGrow: 1 }}
          />
          <button onClick={handleAddFromUrl} style={{ ...theme.styles.button, padding: '8px' }}>Add</button>
        </div>
      </Section>
      
      {sceneObjects.length > 0 && (
        <Section title="Scene Objects">
          <div style={{ maxHeight: '100px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
            {sceneObjects.map(obj => (
              <div
                key={obj.id}
                onClick={() => setSelectedObjectId(obj.id)}
                style={{
                  padding: '6px 8px',
                  cursor: 'pointer',
                  backgroundColor: selectedObjectId === obj.id ? theme.colors.primary : 'transparent',
                  color: selectedObjectId === obj.id ? theme.colors.background : theme.colors.text,
                  borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                  fontSize: '14px',
                }}
              >
                {obj.name}
              </div>
            ))}
          </div>
        </Section>
      )}

      {selectedObject && (
        <>
            <TransformControl selectedObject={selectedObject} />
            <Section title="Audio Reactivity">
                <div>
                    <label style={{ fontSize: '12px' }}>Scale On</label>
                    <select
                        value={selectedObject.reactivity.scaleOn}
                        onChange={e => updateSceneObjectReactivity(selectedObject.id, { scaleOn: e.target.value as any })}
                        style={{ ...theme.styles.input, width: '100%' }}
                    >
                        <option value="none">None</option>
                        <option value="bass">Bass</option>
                        <option value="mids">Mids</option>
                        <option value="highs">Highs</option>
                    </select>
                </div>
                 <div>
                    <label style={{ fontSize: '12px' }}>Intensity: {selectedObject.reactivity.intensity.toFixed(2)}</label>
                    <input type="range" min={0} max={10} step={0.1} value={selectedObject.reactivity.intensity} onChange={e => updateSceneObjectReactivity(selectedObject.id, { intensity: +e.target.value })} style={sliderStyles} />
                </div>
            </Section>
            <button
                onClick={() => removeSceneObject(selectedObject.id)}
                style={{ ...theme.styles.button, borderColor: theme.colors.error, color: theme.colors.error, marginTop: '10px' }}
            >
                Remove Object
            </button>
        </>
      )}
    </div>
  );
}