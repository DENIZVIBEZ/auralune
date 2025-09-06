
// ===== src/features/effects/EffectManager.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React from 'react';
import { EffectComposer } from '@react-three/postprocessing';
import { useAppStore } from '../../app/store';
import { EffectRegistry } from './EffectRegistry';
import './index'; // Ensure registry is populated

/**
 * ULTRA-SAFE EffectManager
 * WARNUNG: KEIN setCurrentTime HIER!
 */
export default function EffectManager() {
  const globalEffects = useAppStore(s => s.globalEffects);
  const featureTrack = useAppStore(s => s.featureTrack);
  const currentTime = useAppStore(s => s.currentTime);

  // ✅ Sichere Early Return
  if (globalEffects.length === 0) {
    return null;
  }

  // ✅ Sichere Audio-Reaktivitäts-Werte für Effekte
  let bass = 0, mids = 0, highs = 0;
  
  if (featureTrack) {
    if (featureTrack.bass && featureTrack.bass.length > 0) {
      const bassIndex = Math.floor(currentTime * 60) % featureTrack.bass.length;
      bass = featureTrack.bass[bassIndex] || 0;
    }
    if (featureTrack.mids && featureTrack.mids.length > 0) {
      const midsIndex = Math.floor(currentTime * 60) % featureTrack.mids.length;
      mids = featureTrack.mids[midsIndex] || 0;
    }
    if (featureTrack.highs && featureTrack.highs.length > 0) {
      const highsIndex = Math.floor(currentTime * 60) % featureTrack.highs.length;
      highs = featureTrack.highs[highsIndex] || 0;
    }
  }

  return (
    <EffectComposer>
      {globalEffects.map(activeEffect => {
        // ✅ Sichere Effekt-Definition-Prüfung
        const effectDef = EffectRegistry.get(activeEffect.effectId);
        if (!effectDef) {
          console.warn(`EffectManager: Unknown effect: ${activeEffect.effectId}`);
          return null;
        }
        
        const EffectComponent = effectDef.component;
        const mergedParams = { ...effectDef.defaultParams, ...activeEffect.params };
        
        // ✅ Füge Audio-Reaktivität zu den Parametern hinzu
        mergedParams.audioReactivity = { bass, mids, highs };
        
        return <EffectComponent key={activeEffect.instanceId} params={mergedParams} />;
      })}
    </EffectComposer>
  );
}
