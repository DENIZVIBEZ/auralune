// ===== src/features/scenes/templates/HolographicInterfaceScene.tsx =====
import React, { useMemo } from 'react';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';
import * as THREE from 'three';

const HolographicInterface: React.FC = () => {
  const { sceneParams } = useAppStore();
  const planes = useMemo(() => {
    return Array.from({ length: 10 }, () => ({
      position: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5] as [number, number, number],
      scale: [Math.random() * 2 + 1, Math.random() * 2 + 1, 1] as [number, number, number],
    }));
  }, []);

  return (
    <group>
      {planes.map((plane, i) => (
        <mesh key={i} position={plane.position} scale={plane.scale}>
          <planeGeometry />
          <meshBasicMaterial
            color={sceneParams.color || '#00ffff'}
            transparent
            opacity={sceneParams.opacity ?? 0.3}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
};

export const holographicInterfaceSceneDef: SceneDefinition = {
  id: 'holographic-interface',
  name: 'Holographic Interface',
  description: 'A futuristic display of floating, translucent data panels.',
  component: HolographicInterface,
  paramsSchema: {
    color: { type: 'color', label: 'Panel Color' },
    opacity: { type: 'number', label: 'Opacity', min: 0, max: 1, step: 0.01 },
  },
  defaultParams: {
    color: '#00ffff',
    opacity: 0.3,
  },
};
