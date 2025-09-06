// ===== src/features/scenes/templates/AbstractGeometryScene.tsx =====
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';

const AbstractGeometry: React.FC = () => {
  const { sceneParams, featureTrack, currentTime } = useAppStore();
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      const mids = featureTrack?.mids?.[Math.floor(currentTime * 60) % featureTrack.mids.length] || 0;
      groupRef.current.rotation.x += delta * (sceneParams.speed || 0.2);
      groupRef.current.rotation.y += delta * (sceneParams.speed || 0.2) * (1 + mids * 2);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-3, 0, 0]}>
        <torusKnotGeometry args={[1, 0.3, 100, 16]} />
        <meshStandardMaterial color={sceneParams.color1 || '#ff00ff'} roughness={0.2} />
      </mesh>
      <mesh position={[3, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={sceneParams.color2 || '#00ffff'} roughness={0.2} />
      </mesh>
       <mesh position={[0, 3, 0]} scale={0.5}>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial color={sceneParams.color3 || '#ffff00'} roughness={0.2} />
      </mesh>
    </group>
  );
};

export const abstractGeometrySceneDef: SceneDefinition = {
  id: 'abstract-geometry',
  name: 'Abstract Geometry',
  description: 'A collection of primitive shapes dancing in space.',
  component: AbstractGeometry,
  paramsSchema: {
    color1: { type: 'color', label: 'Shape 1 Color' },
    color2: { type: 'color', label: 'Shape 2 Color' },
    color3: { type: 'color', label: 'Shape 3 Color' },
    speed: { type: 'number', label: 'Rotation Speed', min: 0, max: 1, step: 0.01 },
  },
  defaultParams: {
    color1: '#D4AF37',
    color2: '#c0c0c0',
    color3: '#ffffff',
    speed: 0.2,
  },
};
