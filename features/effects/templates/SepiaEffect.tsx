
import React from 'react';
import { Sepia } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

const SepiaEffect: React.FC<{ params: any }> = ({ params }) => {
  return <Sepia intensity={params.intensity ?? 0.8} />;
};

export const sepiaDef: EffectDefinition = {
  id: 'sepia',
  name: 'Sepia',
  component: SepiaEffect,
  paramsSchema: {
    intensity: { type: 'number', label: 'Intensität', min: 0, max: 1, step: 0.01 },
  },
  defaultParams: { intensity: 0.8 },
};
