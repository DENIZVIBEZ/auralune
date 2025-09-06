// ===== src/features/scenes/templates/NeuralNetworkScene.tsx =====
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';

const NeuralNetwork: React.FC = () => {
    const { sceneParams, featureTrack, currentTime } = useAppStore();
    const groupRef = useRef<THREE.Group>(null);

    const { points, lines } = useMemo(() => {
        const numPoints = 100;
        const points = Array.from({ length: numPoints }, () => (new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        )));

        const linePositions: number[] = [];
        points.forEach(p1 => {
            points.forEach(p2 => {
                if (p1.distanceTo(p2) < 5 && Math.random() > 0.8) {
                    linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                }
            });
        });
        return { points, lines: new Float32Array(linePositions) };
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * (sceneParams.speed || 0.1);
        }
    });
    
    const bass = featureTrack?.bass?.[Math.floor(currentTime * 60) % featureTrack.bass.length] || 0;

    return (
        <group ref={groupRef}>
            <points>
                <bufferGeometry>
                    <bufferAttribute 
                        attach="attributes-position"
                        count={points.length}
                        array={new Float32Array(points.flatMap(p => p.toArray()))}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial color={sceneParams.nodeColor || '#ffffff'} size={0.2 + bass * 0.3} />
            </points>
            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={lines.length / 3}
                        array={lines}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color={sceneParams.lineColor || '#D4AF37'} transparent opacity={0.3} />
            </lineSegments>
        </group>
    );
};

export const neuralNetworkSceneDef: SceneDefinition = {
  id: 'neural-network',
  name: 'Neural Network',
  description: 'A web of interconnected nodes and synapses reacting to audio.',
  component: NeuralNetwork,
  paramsSchema: {
    nodeColor: { type: 'color', label: 'Node Color' },
    lineColor: { type: 'color', label: 'Line Color' },
    speed: { type: 'number', label: 'Rotation Speed', min: 0, max: 1, step: 0.01 },
  },
  defaultParams: {
    nodeColor: '#ffffff',
    lineColor: '#D4AF37',
    speed: 0.1,
  },
};
