
import React from 'react';
import { HueSaturation } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';

const ColorGradingEffect: React.FC<{ params: any }> = ({ params }) => {
    const hue = (params.hue ?? 0) * (Math.PI / 180);
    const saturation = params.saturation ?? 0;

  return <HueSaturation hue={hue} saturation={saturation} />;
};

export const colorGradingDef: EffectDefinition = {
  id: 'color-grading',
  name: 'Color Grading',
  component: ColorGradingEffect,
  paramsSchema: {
    hue: { type: 'number', label: 'Farbton', min: 0, max: 360, step: 1 },
    saturation: { type: 'number', label: 'Sättigung', min: -1, max: 1, step: 0.01 },
  },
  defaultParams: { hue: 0, saturation: 0 },
};
