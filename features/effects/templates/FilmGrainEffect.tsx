
import React from 'react';
import { Noise } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

const FilmGrainEffect: React.FC<{ params: any }> = ({ params }) => {
  const intensity = params.intensity ?? 0.1;
  const reactivity = params.reactivity ?? 0.5;
  const audioReactivity = params.audioReactivity || { highs: 0 };
  const reactiveIntensity = intensity * (1 + audioReactivity.highs * reactivity);

  return <Noise opacity={reactiveIntensity} />;
};

export const filmGrainDef: EffectDefinition = {
  id: 'film-grain',
  name: 'Film Grain',
  component: FilmGrainEffect,
  paramsSchema: {
    intensity: { type: 'number', label: 'Intensität', min: 0, max: 1, step: 0.01 },
    reactivity: { type: 'number', label: 'Audio-Reaktivität', min: 0, max: 3, step: 0.1 },
  },
  defaultParams: { intensity: 0.1, reactivity: 0.5 },
};
