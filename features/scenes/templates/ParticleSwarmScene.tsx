// ===== src/features/scenes/templates/ParticleSwarmScene.tsx =====
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneDefinition } from '../../../types/scene';
import { useAppStore } from '../../../app/store';

const Particles: React.FC = () => {
    const meshRef = useRef<THREE.Points>(null);
    const { sceneParams, featureTrack, currentTime } = useAppStore();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 5000; i++) {
            temp.push(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
        }
        return new Float32Array(temp);
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();
            const bass = featureTrack?.bass?.[Math.floor(currentTime * 60) % featureTrack.bass.length] || 0;
            const pulse = 1 + (bass * (sceneParams.beatPulse || 1));
            meshRef.current.rotation.y = time * 0.1;
            meshRef.current.scale.set(pulse, pulse, pulse);
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={sceneParams.particleSize || 0.1} color={sceneParams.baseColor || '#ffffff'} sizeAttenuation />
        </points>
    );
};

export const particleSwarmSceneDef: SceneDefinition = {
  id: 'particle-swarm',
  name: 'Particle Swarm',
  description: 'A dynamic cloud of particles reacting to the music.',
  component: Particles,
  paramsSchema: {
    visualizerMode: { type: 'select', label: 'Visualizer Mode', options: ['Swarm', 'Galaxy', 'Physics Box'] },
    particleShape: { type: 'select', label: 'Particle Shape', options: ['Dot', 'Square'] },
    particleSize: { type: 'number', label: 'Particle Size', min: 0.01, max: 0.5, step: 0.01 },
    beatPulse: { type: 'number', label: 'Beat Pulse Intensity', min: 0, max: 5, step: 0.1 },
    baseColor: { type: 'color', label: 'Base Color' },
    colorMode: { type: 'select', label: 'Color Mode', options: ['Static', 'Velocity', 'Bass Glow'] },
    velocityColor: { type: 'color', label: 'Velocity Color' },
    bassGlowColor: { type: 'color', label: 'Bass Glow Color' },
    bassReactivity: { type: 'number', label: 'Bass Reactivity', min: 0, max: 5, step: 0.1 },
    swirlIntensity: { type: 'number', label: 'Swirl Intensity', min: 0, max: 5, step: 0.1 },
    introDuration: { type: 'number', label: 'Intro Duration', min: 0, max: 10, step: 0.1 },
    galaxyRadius: { type: 'number', label: 'Galaxy Radius', min: 1, max: 20, step: 0.1 },
    rotationSpeed: { type: 'number', label: 'Rotation Speed', min: 0, max: 2, step: 0.05 },
    pulseReactivity: { type: 'number', label: 'Pulse Reactivity', min: 0, max: 5, step: 0.1 },
    twinkleSpeed: { type: 'number', label: 'Twinkle Speed', min: 0, max: 10, step: 0.1 },
    twinkleIntensity: { type: 'number', label: 'Twinkle Intensity', min: 0, max: 2, step: 0.05 },
    gravity: { type: 'number', label: 'Gravity', min: -20, max: 20, step: 0.1 },
    boxSize: { type: 'number', label: 'Box Size', min: 5, max: 30, step: 1 },
    bounciness: { type: 'number', label: 'Bounciness', min: 0, max: 1, step: 0.05 },
    friction: { type: 'number', label: 'Friction', min: 0, max: 1, step: 0.05 },
    initialVelocityBoost: { type: 'number', label: 'Initial Velocity Boost', min: 0, max: 10, step: 0.1 },
  },
  defaultParams: {
    visualizerMode: 'Swarm',
    particleShape: 'Dot',
    particleSize: 0.05,
    beatPulse: 2.0,
    baseColor: '#D4AF37',
    colorMode: 'Static',
    velocityColor: '#ff00ff',
    bassGlowColor: '#ffff00',
    bassReactivity: 1.0,
    swirlIntensity: 1.0,
    introDuration: 2.0,
    galaxyRadius: 10,
    rotationSpeed: 0.1,
    pulseReactivity: 1.0,
    twinkleSpeed: 5.0,
    twinkleIntensity: 1.0,
    gravity: -9.8,
    boxSize: 15,
    bounciness: 0.8,
    friction: 0.1,
    initialVelocityBoost: 1,
  },
};
