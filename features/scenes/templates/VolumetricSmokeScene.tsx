// ===== src/features/scenes/templates/VolumetricSmokeScene.tsx =====
import React, { useMemo } from 'react';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';
import * as THREE from 'three';

const VolumetricSmoke: React.FC = () => {
    const { sceneParams } = useAppStore();
    const planes = useMemo(() => {
        return Array.from({ length: 30 }, () => ({
            position: [Math.random() * 15 - 7.5, Math.random() * 15 - 7.5, Math.random() * 15 - 7.5] as [number, number, number],
            scale: Math.random() * 5 + 2,
        }));
    }, []);

    return (
        <group>
            {planes.map((plane, i) => (
                <mesh key={i} position={plane.position} scale={[plane.scale, plane.scale, plane.scale]}>
                    <planeGeometry />
                    <meshBasicMaterial
                        color={sceneParams.color || '#ffffff'}
                        transparent
                        opacity={sceneParams.density ?? 0.1}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
};

export const volumetricSmokeSceneDef: SceneDefinition = {
  id: 'volumetric-smoke',
  name: 'Volumetric Smoke',
  description: 'Wisps of ethereal smoke that drift and glow.',
  component: VolumetricSmoke,
  paramsSchema: {
    color: { type: 'color', label: 'Smoke Color' },
    density: { type: 'number', label: 'Density', min: 0, max: 0.3, step: 0.01 },
  },
  defaultParams: {
    color: '#ffffff',
    density: 0.1,
  },
};
