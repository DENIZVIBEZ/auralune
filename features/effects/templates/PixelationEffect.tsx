
import React from 'react';
import { Pixelation } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

const PixelationEffect: React.FC<{ params: any }> = ({ params }) => {
    const pixelSize = params.pixelSize ?? 4;
    const reactivity = params.reactivity ?? 1.0;
    const audioReactivity = params.audioReactivity || { mids: 0 };
    const reactivePixelSize = Math.max(1, pixelSize + Math.floor(audioReactivity.mids * reactivity * 10));

  return <Pixelation granularity={reactivePixelSize} />;
};

export const pixelationDef: EffectDefinition = {
  id: 'pixelation',
  name: 'Pixelation',
  component: PixelationEffect,
  paramsSchema: {
    pixelSize: { type: 'number', label: 'Pixel-Größe', min: 1, max: 20, step: 1 },
    reactivity: { type: 'number', label: 'Audio-Reaktivität', min: 0, max: 5, step: 0.1 },
  },
  defaultParams: { pixelSize: 4, reactivity: 1.0 },
};
