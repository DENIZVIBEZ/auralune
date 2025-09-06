// ===== src/types/camera.ts =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!

/**
 * Definiert die 10+ verfügbaren Kameramodi.
 */
export type CameraMode = 
  | 'STATIC'
  | 'ORBIT'
  | 'DOLLY_ZOOM'
  | 'TRACKING'
  | 'CRANE'
  | 'HANDHELD'
  | 'DRONE'
  | 'CINEMATIC_PAN'
  | 'ZOOM_BURST'
  | 'SPIRAL'
  | 'AI'; // Neuer KI-gesteuerter Modus

/**
 * Definiert die Struktur des kompletten Kamerazustands.
 */
export interface CameraState {
  mode: CameraMode;
  target: [number, number, number]; // Das Ziel, das die Kamera anvisiert
  params: Record<string, any> & {
    MOUSE_SETTINGS: {
      orbitSensitivity: number;
      zoomSensitivity: number;
      panSensitivity: number;
    }
  }; // Parameter für jeden Modus
  reactivity: {
    bass: number; // Reaktivität auf Bass
    mids: number; // Reaktivität auf Mitten
    highs: number; // Reaktivität auf Höhen
  };
}