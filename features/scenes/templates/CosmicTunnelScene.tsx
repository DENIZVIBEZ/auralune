// ===== src/features/scenes/templates/CosmicTunnelScene.tsx =====
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';

const CosmicTunnel: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { sceneParams, featureTrack, currentTime } = useAppStore();

  useFrame((state, delta) => {
    if (meshRef.current) {
      const bass = featureTrack?.bass?.[Math.floor(currentTime * 60) % featureTrack.bass.length] || 0;
      meshRef.current.rotation.z += ((sceneParams.speed || 0.1) + bass * (sceneParams.reactivity || 1)) * delta;
    }
  });

  return (
    <mesh ref={meshRef} position={[0,0,-15]}>
      <cylinderGeometry args={[10, 10, 40, 32, 1, true]} />
      <meshStandardMaterial 
        color={sceneParams.color || '#ff00ff'} 
        side={THREE.BackSide}
        wireframe={sceneParams.wireframe ?? true}
       />
    </mesh>
  );
};

export const cosmicTunnelSceneDef: SceneDefinition = {
  id: 'cosmic-tunnel',
  name: 'Cosmic Tunnel',
  description: 'An endless journey through a vibrant, twisting vortex.',
  component: CosmicTunnel,
  paramsSchema: {
    speed: { type: 'number', label: 'Tunnel Speed', min: 0, max: 2, step: 0.05 },
    reactivity: { type: 'number', label: 'Bass Reactivity', min: 0, max: 5, step: 0.1 },
    color: { type: 'color', label: 'Tunnel Color' },
    wireframe: { type: 'boolean', label: 'Wireframe' },
  },
  defaultParams: {
    speed: 0.2,
    reactivity: 1.5,
    color: '#D4AF37',
    wireframe: true,
  },
};
