import React from 'react';
import { useAppStore } from '../../../app/store';
import { EffectRegistry } from '../../effects/EffectRegistry';
import { theme } from '../theme';
import type { ActiveEffect } from '../../../types/effects';
import type { SceneParam } from '../../../types/scene';

const EffectParamControl: React.FC<{ instanceId: string, paramKey: string, schema: SceneParam }> = ({ instanceId, paramKey, schema }) => {
    const { globalEffects: rawGlobalEffects, updateGlobalEffectParam } = useAppStore();
    
    // CRITICAL FIX: Ensure globalEffects is always an array
    const globalEffects = rawGlobalEffects || [];
    
    const effect = globalEffects.find(e => e.instanceId === instanceId);
    const effectDef = effect ? EffectRegistry.get(effect.effectId) : null;
    
    if (!effect || !effectDef) return null;

    const defaultValue = effectDef.defaultParams[paramKey];
    const value = effect.params[paramKey] ?? defaultValue;

    const labelStyles: React.CSSProperties = {
        fontSize: '12px',
        opacity: 0.8,
        marginBottom: '2px',
        display: 'block'
    };

    switch(schema.type) {
        case 'number':
            return (
                <div>
                    <label style={labelStyles}>{schema.label}: {Number(value).toFixed(2)}</label>
                    <input 
                        type="range"
                        min={schema.min}
                        max={schema.max}
                        step={schema.step}
                        value={value}
                        onChange={(e) => updateGlobalEffectParam(instanceId, paramKey, parseFloat(e.target.value))}
                        // Fix: Cast style object to React.CSSProperties to handle non-standard property types.
                        style={theme.styles.slider as React.CSSProperties}
                    />
                </div>
            );
        case 'color':
            return (
                <div>
                     <label style={labelStyles}>{schema.label}</label>
                     <input
                        type="color"
                        value={value}
                        onChange={(e) => updateGlobalEffectParam(instanceId, paramKey, e.target.value)}
                        style={{ ...theme.styles.input, padding: '2px', height: '28px', width: '100%' }}
                     />
                </div>
            );
        default: return null;
    }
};

const ActiveEffectItem: React.FC<{ effect: ActiveEffect }> = ({ effect }) => {
    const { removeGlobalEffect } = useAppStore();
    const effectDef = EffectRegistry.get(effect.effectId);

    if (!effectDef) return null;

    return (
        <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{effectDef.name}</span>
                <button
                    onClick={() => removeGlobalEffect(effect.instanceId)}
                    style={{ background: 'none', border: 'none', color: theme.colors.error, cursor: 'pointer', fontSize: '16px' }}
                >
                    &times;
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(effectDef.paramsSchema).map(([key, schema]) => (
                    <EffectParamControl key={key} instanceId={effect.instanceId} paramKey={key} schema={schema} />
                ))}
            </div>
        </div>
    );
};

export default function EffectsControls() {
    const { globalEffects: rawGlobalEffects, addGlobalEffect } = useAppStore();
    
    // CRITICAL FIX: Ensure globalEffects is always an array
    const globalEffects = rawGlobalEffects || [];
    
    const availableEffects = EffectRegistry.list();

    const controlStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    };

    return (
        <div style={controlStyles}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <select
                    defaultValue=""
                    onChange={(e) => {
                        if (e.target.value) addGlobalEffect(e.target.value);
                        e.target.value = "";
                    }}
                    style={{ ...theme.styles.input, flexGrow: 1 }}
                >
                    <option value="" disabled>Effekt hinzufügen...</option>
                    {availableEffects.map(def => (
                        <option key={def.id} value={def.id} style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>{def.name}</option>
                    ))}
                </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                {globalEffects.map(effect => (
                    <ActiveEffectItem key={effect.instanceId} effect={effect} />
                ))}
                {globalEffects.length === 0 && (
                    <p style={{ textAlign: 'center', opacity: 0.5, fontSize: '12px' }}>Keine aktiven Effekte.</p>
                )}
            </div>
        </div>
    );
}
