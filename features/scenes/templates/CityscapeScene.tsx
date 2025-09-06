// ===== src/features/scenes/templates/CityscapeScene.tsx =====
import React, { useMemo } from 'react';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';
import * as THREE from 'three';

const Cityscape: React.FC = () => {
  const { sceneParams } = useAppStore();
  const buildings = useMemo(() => {
    const temp: any[] = [];
    for (let x = -10; x < 10; x += 2) {
      for (let z = -10; z < 10; z += 2) {
        if (Math.random() > 0.3) {
            const height = Math.random() * 8 + 2;
            temp.push({
                position: [x, height / 2, z] as [number, number, number],
                scale: [1.5, height, 1.5] as [number, number, number],
            });
        }
      }
    }
    return temp;
  }, []);

  return (
    <group position={[0, -5, 0]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position} scale={b.scale}>
          <boxGeometry />
          <meshStandardMaterial color={sceneParams.color || '#333333'} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[25, 25]}/>
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  );
};

export const cityscapeSceneDef: SceneDefinition = {
  id: 'cityscape',
  name: 'Cityscape',
  description: 'A sprawling, neon-lit metropolis under a dark sky.',
  component: Cityscape,
  paramsSchema: {
    color: { type: 'color', label: 'Building Color' },
  },
  defaultParams: {
    color: '#555555',
  },
};
