import React from 'react';
import { SSAO } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

const SSAOEffect: React.FC<{ params: any }> = ({ params }) => {
  return (
    <SSAO
      intensity={params.intensity ?? 1.0}
      radius={params.radius ?? 0.1}
      luminanceInfluence={0.5}
      bias={0.035}
    />
  );
};

// ULTRA-SAFE FIX: Inform EffectComposer that this effect requires a normal pass.
(SSAOEffect as any).requiresNormalTexture = true;

export const ssaoDef: EffectDefinition = {
  id: 'ssao',
  name: 'Ambient Occlusion',
  component: SSAOEffect,
  paramsSchema: {
    intensity: { type: 'number', label: 'Intensität', min: 0, max: 10, step: 0.1 },
    radius: { type: 'number', label: 'Radius', min: 0, max: 1, step: 0.01 },
  },
  defaultParams: {
    intensity: 1.0,
    radius: 0.1,
  },
};
