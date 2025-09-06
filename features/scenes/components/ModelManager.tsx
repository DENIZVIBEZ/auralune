// ===== src/features/scenes/components/ModelManager.tsx =====
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../../app/store';
import type { SceneObject } from '../../../types/objects';
import { theme } from '../../ui/theme';

const GOLDEN_EMISSIVE = new THREE.Color(theme.colors.primary);

/**
 * Renders a single, user-added object with transformations and audio reactivity.
 * Due to platform limitations, this renders placeholder geometry instead of loading external models.
 */
const RenderedObject: React.FC<{ object: SceneObject }> = ({ object }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { featureTrack, currentTime, selectedObjectId, globalReactivity } = useAppStore();

  const isSelected = selectedObjectId === object.id;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    let reactiveScale = 1.0;
    let reactivePositionOffset = new THREE.Vector3(0, 0, 0);

    if (featureTrack) {
        const frame = Math.floor(currentTime * 60);

        // 1. Individual Reactivity (Scale)
        if (object.reactivity.scaleOn !== 'none') {
            const band = object.reactivity.scaleOn;
            const value = featureTrack[band]?.[frame % featureTrack[band].length] || 0;
            reactiveScale = 1.0 + value * object.reactivity.intensity;
        }

        // 2. Global Reactivity (Movement)
        if (globalReactivity.objects.enabled) {
            const { band, movementType, intensity } = globalReactivity.objects;
            const value = featureTrack[band]?.[frame % featureTrack[band].length] || 0;

            if (value > 0.1) { // Threshold to avoid constant small movements
                switch(movementType) {
                    case 'jiggle':
                        reactivePositionOffset.set(
                            (Math.random() - 0.5) * value * intensity,
                            (Math.random() - 0.5) * value * intensity,
                            (Math.random() - 0.5) * value * intensity
                        );
                        break;
                    // Other movement types could be added here
                }
            }
        }
    }
    
    // Apply transformations
    const finalScale = object.scale * reactiveScale;
    meshRef.current.scale.set(finalScale, finalScale, finalScale);
    
    // Base position + reactive offset
    meshRef.current.position.fromArray(object.position).add(reactivePositionOffset);
    
    // FIX: Removed incorrect type cast that was causing a TypeScript error.
    // `object.rotation` is a 3-element array, and `fromArray` handles it correctly without a cast.
    meshRef.current.rotation.fromArray(object.rotation);
  });
  
  // Determine which geometry to render based on a keyword in the name/URL
  const getGeometry = () => {
      const name = object.name.toLowerCase();
      if (name.includes('torus')) {
          return <torusGeometry args={[0.8, 0.3, 16, 100]} />;
      }
      if (name.includes('metaball')) {
          return <sphereGeometry args={[1, 32, 32]} />;
      }
      // Default to a crystal/icosahedron shape
      return <icosahedronGeometry args={[1, 0]} />;
  };

  return (
    <mesh
      ref={meshRef}
      // Initial position/rotation are set in useFrame to combine base and reactive transforms
    >
      {getGeometry()}
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.1}
        roughness={0.05}
        transmission={0.95}
        thickness={1.5}
        ior={2.3}
        emissive={isSelected ? GOLDEN_EMISSIVE : '#000000'}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  );
};

/**
 * Manages rendering all user-added 3D objects in the scene.
 */
export default function ModelManager() {
  const sceneObjects = useAppStore(s => s.sceneObjects);

  if (sceneObjects.length === 0) {
    return null;
  }

  return (
    <group>
      {sceneObjects.map(obj => (
        <RenderedObject key={obj.id} object={obj} />
      ))}
    </group>
  );
}