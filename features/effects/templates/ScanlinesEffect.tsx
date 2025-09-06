
import React from 'react';
import { Scanline } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

const ScanlinesEffect: React.FC<{ params: any }> = ({ params }) => {
  return <Scanline density={params.density ?? 1.0} opacity={params.opacity ?? 0.3} />;
};

export const scanlinesDef: EffectDefinition = {
  id: 'scanlines',
  name: 'Scanlines',
  component: ScanlinesEffect,
  paramsSchema: {
    density: { type: 'number', label: 'Dichte', min: 0.1, max: 2, step: 0.1 },
    opacity: { type: 'number', label: 'Deckkraft', min: 0, max: 1, step: 0.01 },
  },
  defaultParams: { density: 1.0, opacity: 0.3 },
};
