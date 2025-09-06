
// ===== src/features/effects/templates/ChromaticAberrationEffect.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React from 'react';
import { ChromaticAberration } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

/**
 * ULTRA-SAFE Chromatic Aberration Effekt
 */
const ChromaticAberrationEffect: React.FC<{ params: any }> = ({ params }) => {
  // ✅ Sichere Parameter-Zugriffe mit Fallbacks
  const baseOffsetX = params.offsetX ?? 0.005;
  const baseOffsetY = params.offsetY ?? 0.005;
  const reactivity = params.reactivity ?? 1.0;
  
  // ✅ Sichere Audio-Reaktivität
  const audioReactivity = params.audioReactivity || { bass: 0, mids: 0, highs: 0 };
  const reactiveFactor = 1 + (audioReactivity.bass * reactivity);
  
  const offset: [number, number] = [
    baseOffsetX * reactiveFactor,
    baseOffsetY * reactiveFactor
  ];

  return <ChromaticAberration offset={offset} />;
};

export const chromaticAberrationDef: EffectDefinition = {
  id: 'chromatic-aberration',
  name: 'Chromatic Aberration',
  component: ChromaticAberrationEffect,
  paramsSchema: {
    offsetX: { type: 'number', label: 'Offset X', min: 0, max: 0.1, step: 0.001 },
    offsetY: { type: 'number', label: 'Offset Y', min: 0, max: 0.1, step: 0.001 },
    reactivity: { type: 'number', label: 'Audio-Reaktivität', min: 0, max: 5, step: 0.1 },
  },
  defaultParams: {
    offsetX: 0.005,
    offsetY: 0.005,
    reactivity: 1.0,
  },
};
