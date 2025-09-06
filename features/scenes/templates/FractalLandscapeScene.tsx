// ===== src/features/scenes/templates/FractalLandscapeScene.tsx =====
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';

const FractalLandscape: React.FC = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { sceneParams, featureTrack, currentTime } = useAppStore();

    useFrame(() => {
        if (meshRef.current) {
            const highs = featureTrack?.highs?.[Math.floor(currentTime * 60) % featureTrack.highs.length] || 0;
            if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
                meshRef.current.material.wireframe = (highs > (sceneParams.wireframeThreshold || 0.5));
            }
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0,-5,0]}>
            <planeGeometry args={[50, 50, 100, 100]} />
            <meshStandardMaterial
                color={sceneParams.color || '#D4AF37'}
                wireframe
            />
        </mesh>
    );
};

export const fractalLandscapeSceneDef: SceneDefinition = {
  id: 'fractal-landscape',
  name: 'Fractal Landscape',
  description: 'A wireframe mountain range that shifts and evolves.',
  component: FractalLandscape,
  paramsSchema: {
    color: { type: 'color', label: 'Color' },
    wireframeThreshold: { type: 'number', label: 'Wireframe Threshold', min: 0, max: 1, step: 0.01 },
  },
  defaultParams: {
    color: '#D4AF37',
    wireframeThreshold: 0.5,
  },
};
