// ===== src/features/camera/CameraDirector.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useAppStore } from '../../app/store';
import * as THREE from 'three';

// ✅ Sichere Konstanten außerhalb der Komponente
const INITIAL_CAMERA_POS = new THREE.Vector3(0, 0, 5);
const INITIAL_LOOK_AT = new THREE.Vector3(0, 0, 0);

/**
 * ULTRA-SAFE CameraDirector-Implementierung
 * WARNUNG: KEIN setCurrentTime HIER!
 */
export default function CameraDirector() {
  const { camera } = useThree();
  const isCameraUserControlled = useAppStore(s => s.isCameraUserControlled);
  const prevIsUserControlled = useRef(isCameraUserControlled);

  // State für Kameramodi, um sanfte Übergänge zu ermöglichen
  const orbitState = useRef({ theta: 0, phi: Math.PI / 2, radius: 5 });

  // Temporäre Vektoren, um Neu-Allokationen in der Render-Schleife zu vermeiden
  const tempPrevPos = new THREE.Vector3();
  const tempNextPos = new THREE.Vector3();
  const tempPrevLookAt = new THREE.Vector3();
  const tempNextLookAt = new THREE.Vector3();
  const tempCurrentLookAt = new THREE.Vector3();
  const targetLookAt = new THREE.Vector3();

  useFrame((state, delta) => {
    // Get fresh state on every frame to ensure responsiveness
    const { camera: cameraState, featureTrack, currentTime } = useAppStore.getState();
    const isUserControlledNow = useAppStore.getState().isCameraUserControlled;

    // Wenn der Benutzer die Kamera steuert, lassen Sie ihn. Der Director ist pausiert.
    if (isUserControlledNow) {
      prevIsUserControlled.current = true;
      return;
    }

    const justReleased = prevIsUserControlled.current && !isUserControlledNow;
    if (justReleased) {
      // Benutzer hat gerade die Steuerung losgelassen, initialisiere den Modus-State neu
      // basierend auf der aktuellen Kameraposition.
      const spherical = new THREE.Spherical().setFromVector3(camera.position);
      orbitState.current = {
        theta: spherical.theta,
        phi: spherical.phi,
        radius: spherical.radius,
      };
      // Hier könnten weitere Initialisierungen für andere Modi hinzugefügt werden
    }
    prevIsUserControlled.current = isUserControlledNow;

    targetLookAt.fromArray(cameraState.target);

    // Fix: Add a type guard to ensure camera is a PerspectiveCamera before accessing fov.
    if (!(camera instanceof THREE.PerspectiveCamera)) {
      return;
    }
    // ✅ Sichere FeatureTrack-Prüfung
    if (!featureTrack) {
      return;
    }
    const { mode, params, reactivity } = cameraState;
    
    // ✅ Sichere Audio-Reaktivitäts-Werte mit Fallbacks
    let bass = 0, mids = 0, highs = 0;
    const frameIndex = Math.floor(currentTime * 60);
    
    if (featureTrack.bass?.length > 0) bass = featureTrack.bass[frameIndex % featureTrack.bass.length] || 0;
    if (featureTrack.mids?.length > 0) mids = featureTrack.mids[frameIndex % featureTrack.mids.length] || 0;
    if (featureTrack.highs?.length > 0) highs = featureTrack.highs[frameIndex % featureTrack.highs.length] || 0;
    
    // BUGFIX: Multipliziert die Roh-Audio-Werte mit den Reaktivitäts-Slidern aus dem Store.
    // Wenn die Slider auf 0 stehen, ist totalReactivity auch 0.
    const totalReactivity = (bass * reactivity.bass) + (mids * reactivity.mids) + (highs * reactivity.highs);
    
    // ✅ Sichere Kamera-Modi mit Fallbacks
    switch (mode) {
      case 'STATIC':
        // Hält die aktuelle Position bei, anstatt zu resetten.
        break;
      case 'AI':
        const aiParams = params.AI;
        if (!aiParams?.path || aiParams.path.length < 2) {
            // Sanfter Übergang zur Standardposition, falls kein Pfad vorhanden ist
            camera.position.lerp(INITIAL_CAMERA_POS, 0.05);
            camera.lookAt(targetLookAt.lerp(INITIAL_LOOK_AT, 0.05));
            if (camera.fov !== 75) {
                camera.fov = THREE.MathUtils.lerp(camera.fov, 75, 0.1);
                camera.updateProjectionMatrix();
            }
            break;
        }

        const path = aiParams.path;
        const pathStartTime = path[0].time;
        const pathEndTime = path[path.length - 1].time;
        const time = Math.max(pathStartTime, Math.min(currentTime, pathEndTime));

        let segmentIndex = path.findIndex(k => k.time > time);
        if (segmentIndex === -1) segmentIndex = path.length - 1;
        if (segmentIndex === 0) segmentIndex = 1;
        
        const prevKeyframe = path[segmentIndex - 1];
        const nextKeyframe = path[segmentIndex];

        const segmentDuration = nextKeyframe.time - prevKeyframe.time;
        const alpha = segmentDuration > 1e-5 ? (time - prevKeyframe.time) / segmentDuration : 1.0;

        tempPrevPos.fromArray(prevKeyframe.position);
        tempNextPos.fromArray(nextKeyframe.position);
        camera.position.lerpVectors(tempPrevPos, tempNextPos, alpha);

        tempPrevLookAt.fromArray(prevKeyframe.lookAt);
        tempNextLookAt.fromArray(nextKeyframe.lookAt);
        tempCurrentLookAt.lerpVectors(tempPrevLookAt, tempNextLookAt, alpha);
        camera.lookAt(tempCurrentLookAt);

        camera.fov = THREE.MathUtils.lerp(prevKeyframe.fov, nextKeyframe.fov, alpha);
        camera.updateProjectionMatrix();
        break;
      case 'ORBIT':
        const orbitParams = params.ORBIT || { speed: 0.5 };
        orbitState.current.theta += delta * orbitParams.speed * 0.5 * (1 + totalReactivity);
        
        const newRadius = orbitState.current.radius + bass * reactivity.bass * 2;
        camera.position.setFromSphericalCoords(newRadius, orbitState.current.phi, orbitState.current.theta);
        camera.position.add(targetLookAt); // Orbit um das Ziel
        break;
      // ... (Andere Modi würden ähnlich zustandsbehaftet gemacht werden) ...
      default:
        // Standardmäßig die Position halten
        break;
    }
    
    // ✅ Sichere LookAt (außer für AI-Modus, der sein eigenes Ziel hat)
    if (mode !== 'AI') {
      camera.lookAt(targetLookAt);
    }
  });

  return null; // Headless Komponente
}