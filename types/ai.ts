// ===== src/types/ai.ts =====

/**
 * Definiert einen einzelnen Keyframe in einem KI-generierten Kamerapfad.
 */
export interface CameraKeyframe {
  time: number; // Zeit in Sekunden
  position: [number, number, number]; // [x, y, z]
  lookAt: [number, number, number]; // [x, y, z]
  fov: number; // Vertikales Sichtfeld
}
