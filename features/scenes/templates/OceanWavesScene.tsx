// ===== src/features/scenes/templates/OceanWavesScene.tsx =====
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';

const OceanWaves: React.FC = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { sceneParams, featureTrack, currentTime } = useAppStore();

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();
            const bass = featureTrack?.bass?.[Math.floor(currentTime * 60) % featureTrack.bass.length] || 0;
            const position = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
            for (let i = 0; i < position.count; i++) {
                const x = position.getX(i);
                const y = position.getY(i);
                const z = Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time) * (1 + bass * (sceneParams.waveHeight || 1));
                position.setZ(i, z);
            }
            position.needsUpdate = true;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50, 100, 100]} />
            <meshStandardMaterial
                color={sceneParams.color || '#0000ff'}
                wireframe={sceneParams.wireframe ?? false}
            />
        </mesh>
    );
};

export const oceanWavesSceneDef: SceneDefinition = {
  id: 'ocean-waves',
  name: 'Ocean Waves',
  description: 'Endless, rolling waves that crest and fall with the music.',
  component: OceanWaves,
  paramsSchema: {
    color: { type: 'color', label: 'Water Color' },
    wireframe: { type: 'boolean', label: 'Wireframe' },
    waveHeight: { type: 'number', label: 'Wave Height', min: 0, max: 5, step: 0.1 },
  },
  defaultParams: {
    color: '#0055ff',
    wireframe: false,
    waveHeight: 1.5,
  },
};
