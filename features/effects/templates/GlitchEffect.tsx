
import React, { useMemo } from 'react';
import { Glitch } from '@react-three/postprocessing';
import type { EffectDefinition } from '../../../types/effects';
import * as THREE from 'three';

const GlitchEffect: React.FC<{ params: any }> = ({ params }) => {
    const strength = params.strength ?? 0.2;
    const reactivity = params.reactivity ?? 3.0;
    const audioReactivity = params.audioReactivity || { bass: 0 };
    const active = audioReactivity.bass > 0.5;

    const strengthVec = useMemo(() => new THREE.Vector2(strength, strength * 2), [strength]);

  return <Glitch delay={new THREE.Vector2(1.5, 3.5)} duration={new THREE.Vector2(0.2, 0.5)} strength={strengthVec} active={active} />;
};

export const glitchDef: EffectDefinition = {
  id: 'glitch',
  name: 'Glitch',
  component: GlitchEffect,
  paramsSchema: {
    strength: { type: 'number', label: 'Stärke', min: 0, max: 1, step: 0.01 },
    reactivity: { type: 'number', label: 'Audio-Reaktivität', min: 0, max: 5, step: 0.1 },
  },
  defaultParams: { strength: 0.2, reactivity: 3.0 },
};
