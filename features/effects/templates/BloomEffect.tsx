
import React from 'react';
import { Bloom } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

const BloomEffect: React.FC<{ params: any }> = ({ params }) => {
  const intensity = params.intensity ?? 1.0;
  const threshold = params.threshold ?? 0.8;
  const reactivity = params.reactivity ?? 2.0;
  const audioReactivity = params.audioReactivity || { bass: 0 };
  const reactiveIntensity = intensity * (1 + audioReactivity.bass * reactivity);

  return <Bloom intensity={reactiveIntensity} luminanceThreshold={threshold} mipmapBlur />;
};

export const bloomDef: EffectDefinition = {
  id: 'bloom',
  name: 'Bloom',
  component: BloomEffect,
  paramsSchema: {
    intensity: { type: 'number', label: 'Intensität', min: 0, max: 5, step: 0.1 },
    threshold: { type: 'number', label: 'Schwellwert', min: 0, max: 1, step: 0.01 },
    reactivity: { type: 'number', label: 'Audio-Reaktivität', min: 0, max: 5, step: 0.1 },
  },
  defaultParams: { intensity: 1.0, threshold: 0.8, reactivity: 2.0 },
};
