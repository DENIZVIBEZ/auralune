// ===== src/features/scenes/templates/CrystalFormationScene.tsx =====
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';

const CrystalFormation: React.FC = () => {
  const { sceneParams, featureTrack, currentTime } = useAppStore();
  const groupRef = useRef<THREE.Group>(null);
  const crystals = useMemo(() => {
    const temp: any[] = [];
    for (let i = 0; i < 50; i++) {
      const pos = [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10];
      const rot = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
      const scale = Math.random() * (sceneParams.maxSize || 1.5) + (sceneParams.minSize || 0.5);
      temp.push({ pos, rot, scale, initialRotation: new THREE.Euler().fromArray(rot as any) });
    }
    return temp;
  }, [sceneParams.minSize, sceneParams.maxSize]);

  useFrame((state, delta) => {
    if (groupRef.current) {
        const bass = featureTrack?.bass?.[Math.floor(currentTime * 60) % featureTrack.bass.length] || 0;
        groupRef.current.rotation.y += (sceneParams.rotationSpeed || 0.001) * (1 + bass * 2) * delta * 60;
    }
  });

  const bassGlow = featureTrack?.bass?.[Math.floor(currentTime * 60) % featureTrack.bass.length] || 0;

  return (
    <group ref={groupRef}>
      {crystals.map((c, i) => (
        <mesh key={i} position={c.pos as any} rotation={c.initialRotation} scale={c.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial 
            color={sceneParams.color || '#ffffff'} 
            roughness={0.1} 
            transmission={0.9} 
            thickness={1.0}
            emissive={sceneParams.glowColor || '#000000'}
            emissiveIntensity={bassGlow * (sceneParams.glowIntensity || 1)}
          />
        </mesh>
      ))}
    </group>
  );
};

export const crystalFormationSceneDef: SceneDefinition = {
  id: 'crystal-formation',
  name: 'Crystal Formation',
  description: 'A scattered field of glowing, crystalline structures.',
  component: CrystalFormation,
  paramsSchema: {
    color: { type: 'color', label: 'Crystal Color' },
    glowColor: { type: 'color', label: 'Glow Color' },
    glowIntensity: { type: 'number', label: 'Glow Intensity', min: 0, max: 5, step: 0.1 },
    minSize: { type: 'number', label: 'Min Size', min: 0.1, max: 2, step: 0.1 },
    maxSize: { type: 'number', label: 'Max Size', min: 0.5, max: 5, step: 0.1 },
    rotationSpeed: { type: 'number', label: 'Rotation Speed', min: 0, max: 0.1, step: 0.001 },
  },
  defaultParams: {
    color: '#ffffff',
    glowColor: '#D4AF37',
    glowIntensity: 2.0,
    minSize: 0.5,
    maxSize: 1.5,
    rotationSpeed: 0.01,
  },
};
