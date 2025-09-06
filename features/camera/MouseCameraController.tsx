import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import * as THREE from 'three';
import { useAppStore } from '../../app/store';

// Konstanten für das Zurücksetzen der Kamera
const INITIAL_POSITION = new THREE.Vector3(0, 2, 8);
const INITIAL_TARGET = new THREE.Vector3(0, 0, 0);

/**
 * ULTRA-SAFE MouseCameraController
 * Diese Komponente ermöglicht die direkte Benutzersteuerung der Kamera über Mausgesten
 * und überschreibt vorübergehend den automatischen CameraDirector.
 */
export default function MouseCameraController() {
  const { camera, gl, invalidate } = useThree();
  const { setCameraUserControlled, setCameraTarget } = useAppStore();
  const mouseSettings = useAppStore(s => s.camera.params.MOUSE_SETTINGS);
  
  // Ref zur Verfolgung von Rechtsklicks für die Doppelklick-Erkennung
  const lastRightClick = useRef(0);

  // Speichert den Anfangszustand zu Beginn einer Ziehgeste für das Schwenken
  const initialDragState = useRef({
      position: new THREE.Vector3(),
      target: new THREE.Vector3(),
  }).current;

  useEffect(() => {
    const domElement = gl.domElement;
    // Verhindert das Standard-Kontextmenü bei Rechtsklick
    const preventDefault = (e: Event) => e.preventDefault();
    domElement.addEventListener('contextmenu', preventDefault);
    return () => {
      domElement.removeEventListener('contextmenu', preventDefault);
    };
  }, [gl]);

  // Haupt-Gesten-Handler
  useGesture({
    onPointerDown: ({ event }) => {
      // Prüft auf Drücken der rechten Maustaste (event.button === 2)
      if (event.button === 2) {
        const now = Date.now();
        // Wenn der letzte Rechtsklick weniger als 300ms her ist, ist es ein Doppelklick
        if (now - lastRightClick.current < 300) {
          // Kamera-Position und -Ziel zurücksetzen
          camera.position.copy(INITIAL_POSITION);
          setCameraTarget(INITIAL_TARGET.toArray());
          camera.lookAt(INITIAL_TARGET);
          invalidate(); // Szene neu zeichnen
          lastRightClick.current = 0; // Timer zurücksetzen, um Probleme mit Dreifachklicks zu vermeiden
        } else {
          lastRightClick.current = now;
        }
      }
    },
    onDrag: ({ buttons, movement: [mx, my], first, last }) => {
      // Verhindert das Ziehen, wenn es Teil eines Doppelklick-Resets war
      if (Date.now() - lastRightClick.current < 50) return;

      const cameraState = useAppStore.getState().camera;
      const sensitivity = mouseSettings;

      if (first) {
        setCameraUserControlled(true);
        // Speichert die initiale Kamera- und Zielposition für das Schwenken
        initialDragState.position.copy(camera.position);
        initialDragState.target.fromArray(cameraState.target);
        return;
      }
      
      // --- Linke Maustaste: Orbit-Steuerung ---
      if (buttons === 1) {
        const target = new THREE.Vector3().fromArray(cameraState.target);
        // Position relativ zum Ziel berechnen
        const relativePos = new THREE.Vector3().subVectors(camera.position, target);
        const spherical = new THREE.Spherical().setFromVector3(relativePos);
        
        // Theta (horizontal) und Phi (vertikal) basierend auf der Mausbewegung anpassen
        spherical.theta -= mx * 0.005 * sensitivity.orbitSensitivity;
        // KORREKTUR: Geändert auf +=, um die vertikale Orbit-Bewegung intuitiver zu machen (nach unten ziehen -> nach oben schauen)
        spherical.phi += my * 0.005 * sensitivity.orbitSensitivity;
        // Klemmt Phi, um ein Überschlagen über die Pole zu verhindern
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        
        relativePos.setFromSpherical(spherical);
        camera.position.copy(target).add(relativePos);
        camera.lookAt(target);

      // --- Rechte Maustaste: Schwenk-Steuerung (Pan) ---
      } else if (buttons === 2) {
        // Stellt sicher, dass die Kameramatrix aktuell ist, bevor Vektoren extrahiert werden
        camera.updateMatrixWorld(true);

        // KORREKTUR: Empfindlichkeitsfaktor deutlich erhöht, um das Schwenken effektiv zu machen
        const panFactor = 0.002 * camera.position.distanceTo(initialDragState.target) * sensitivity.panSensitivity;
        
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
        const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
        
        // Berechnet den Versatz basierend auf der Mausbewegung
        const panOffset = right.multiplyScalar(-mx * panFactor).add(up.multiplyScalar(my * panFactor));
        
        // Wendet den Versatz auf den Anfangszustand an, um den neuen Zustand zu erhalten
        const newPosition = initialDragState.position.clone().add(panOffset);
        const newTarget = initialDragState.target.clone().add(panOffset);
        
        camera.position.copy(newPosition);
        setCameraTarget(newTarget.toArray());
        camera.lookAt(newTarget);
      }

      invalidate(); // Erzwingt ein Neuzeichnen der Szene

      if (last) {
        setCameraUserControlled(false);
      }
    },
    onWheel: ({ movement: [, my], first, last }) => {
      if (first) setCameraUserControlled(true);
      const sensitivity = mouseSettings.zoomSensitivity;

      const zoomFactor = 1.0 - my * 0.0008 * sensitivity;
      
      const target = new THREE.Vector3().fromArray(useAppStore.getState().camera.target);
      const relativePos = new THREE.Vector3().subVectors(camera.position, target);
      
      // Klemmt den Zoom-Abstand, um zu verhindern, dass man zu nah oder zu weit weg ist
      const newLength = Math.max(1.0, Math.min(50.0, relativePos.length() * zoomFactor));
      relativePos.setLength(newLength);
      
      camera.position.copy(target).add(relativePos);
      
      invalidate(); // Erzwingt ein Neuzeichnen
      
      if (last) setCameraUserControlled(false);
    }
  }, {
    target: gl.domElement,
    eventOptions: { passive: false },
    // Fügt Pointer-Events zur Konfiguration hinzu, um onPointerDown zu erhalten
    pointer: {
        capture: true,
    }
  });

  return null; // Dies ist eine "Headless"-Komponente
}