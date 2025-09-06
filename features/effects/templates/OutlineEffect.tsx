import React from 'react';
import { Outline } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

const OutlineEffect: React.FC<{ params: any }> = ({ params }) => {
    return <Outline 
        edgeStrength={params.thickness ?? 2.0} 
        visibleEdgeColor={params.color ?? '#ffffff'} 
        hiddenEdgeColor={params.color ?? '#ffffff'}
        blur={false}
        kernelSize={5}
    />;
};

// ULTRA-SAFE FIX: Inform EffectComposer that this effect requires a depth texture.
(OutlineEffect as any).requiresDepthTexture = true;

export const outlineDef: EffectDefinition = {
  id: 'outline',
  name: 'Outline',
  component: OutlineEffect,
  paramsSchema: {
    thickness: { type: 'number', label: 'Dicke', min: 0, max: 10, step: 0.1 },
    color: { type: 'color', label: 'Farbe' },
  },
  defaultParams: { thickness: 2.0, color: '#ffffff' },
};
