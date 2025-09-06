// ===== src/features/scenes/templates/LiquidMetalScene.tsx =====
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';

const LiquidMetal: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { sceneParams, featureTrack, currentTime } = useAppStore();

  useFrame(() => {
    if (meshRef.current) {
        const bass = featureTrack?.bass?.[Math.floor(currentTime * 60) % featureTrack.bass.length] || 0;
        const scale = 1 + bass * (sceneParams.pulseIntensity || 0.5);
        meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        color={sceneParams.color || '#c0c0c0'}
        metalness={sceneParams.metalness ?? 1.0}
        roughness={sceneParams.roughness ?? 0.1}
      />
    </mesh>
  );
};

export const liquidMetalSceneDef: SceneDefinition = {
  id: 'liquid-metal',
  name: 'Liquid Metal',
  description: 'A metallic sphere that pulses and warps with the sound.',
  component: LiquidMetal,
  paramsSchema: {
    color: { type: 'color', label: 'Color' },
    metalness: { type: 'number', label: 'Metalness', min: 0, max: 1, step: 0.01 },
    roughness: { type: 'number', label: 'Roughness', min: 0, max: 1, step: 0.01 },
    pulseIntensity: { type: 'number', label: 'Pulse Intensity', min: 0, max: 2, step: 0.1 },
  },
  defaultParams: {
    color: '#D4AF37',
    metalness: 1.0,
    roughness: 0.2,
    pulseIntensity: 0.5,
  },
};
