// ===== src/types/objects.ts =====

/**
 * Defines how an object reacts to audio.
 */
export interface SceneObjectReactivity {
  scaleOn: 'bass' | 'mids' | 'highs' | 'none';
  intensity: number;
}

/**
 * Defines the structure for a single 3D object placed in the scene.
 */
export interface SceneObject {
  id: string; // Unique ID, e.g., using Date.now()
  url: string; // URL to the .gltf or .glb file, or a predefined shape identifier
  name: string; // Display name
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  reactivity: SceneObjectReactivity;
}
