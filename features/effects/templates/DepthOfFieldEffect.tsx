import React from 'react';
import { DepthOfField } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

const DepthOfFieldEffect: React.FC<{ params: any }> = ({ params }) => {
  return (
    <DepthOfField
      focusDistance={params.focusDistance ?? 0.02}
      focalLength={params.focalLength ?? 0.05}
      bokehScale={params.bokehScale ?? 2.0}
    />
  );
};

// ULTRA-SAFE FIX: Inform EffectComposer that this effect requires a depth texture.
(DepthOfFieldEffect as any).requiresDepthTexture = true;

export const depthOfFieldDef: EffectDefinition = {
  id: 'depth-of-field',
  name: 'Depth of Field',
  component: DepthOfFieldEffect,
  paramsSchema: {
    focusDistance: { type: 'number', label: 'Fokus-Distanz', min: 0, max: 1, step: 0.01 },
    focalLength: { type: 'number', label: 'Brennweite', min: 0, max: 1, step: 0.01 },
    bokehScale: { type: 'number', label: 'Bokeh-Skalierung', min: 0, max: 10, step: 0.1 },
  },
  defaultParams: { focusDistance: 0.02, focalLength: 0.05, bokehScale: 2.0 },
};
