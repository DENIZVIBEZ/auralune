
import React from 'react';
import { Vignette } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

const VignetteEffect: React.FC<{ params: any }> = ({ params }) => {
  return <Vignette darkness={params.darkness ?? 0.5} offset={params.offset ?? 0.3} />;
};

export const vignetteDef: EffectDefinition = {
  id: 'vignette',
  name: 'Vignette',
  component: VignetteEffect,
  paramsSchema: {
    darkness: { type: 'number', label: 'Dunkelheit', min: 0, max: 1, step: 0.01 },
    offset: { type: 'number', label: 'Versatz', min: 0, max: 1, step: 0.01 },
  },
  defaultParams: { darkness: 0.5, offset: 0.3 },
};
