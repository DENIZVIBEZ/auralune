// ===== src/features/canvas/GlobalReactivityManager.tsx =====
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../app/store';

export default function GlobalReactivityManager() {
  const { camera } = useThree();
  const lastShake = new THREE.Vector3();

  useFrame(() => {
    const { globalReactivity, featureTrack, currentTime, isCameraUserControlled } = useAppStore.getState();
    const cameraReactivity = globalReactivity.camera;
    
    // Reset previous shake
    camera.position.sub(lastShake);
    lastShake.set(0, 0, 0);

    if (cameraReactivity.enabled && featureTrack && !isCameraUserControlled) {
      const frame = Math.floor(currentTime * 60);
      const value = featureTrack[cameraReactivity.band]?.[frame % featureTrack[cameraReactivity.band].length] || 0;
      
      if (value > 0.1) {
        const intensity = cameraReactivity.intensity * value;
        lastShake.set(
            (Math.random() - 0.5) * intensity,
            (Math.random() - 0.5) * intensity,
            0 // Usually better to avoid Z-axis shake
        );
        camera.position.add(lastShake);
      }
    }
  });

  return null;
}
