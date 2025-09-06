// ===== src/features/canvas/AnimationController.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
// WARNUNG: JEDE ÄNDERUNG HIER KANN REACT ERROR #185 VERURSACHEN!
import { useFrame } from '@react-three/fiber';
import { useAppStore } from '../../app/store';

// ✅ KRITISCH: Akkumulator MUSS hier außerhalb der Komponente sein!
// WARNUNG: DIESE ZEILE NICHT VERSCHIEBEN! NICHT LÖSCHEN!
// WARNUNG: DIESE ZEILE NICHT VERSCHIEBEN! NICHT LÖSCHEN!
// WARNUNG: DIESE ZEILE NICHT VERSCHIEBEN! NICHT LÖSCHEN!
let accumulator = 0;
const FIXED_TIMESTEP = 1 / 60; // 60 FPS
// WARNUNG: DIESE ZEILE NICHT VERSCHIEBEN! NICHT LÖSCHEN!
// WARNUNG: DIESE ZEILE NICHT VERSCHIEBEN! NICHT LÖSCHEN!
// WARNUNG: DIESE ZEILE NICHT VERSCHIEBEN! NICHT LÖSCHEN!

/**
 * ULTRA-SAFE AnimationController
 * WARNUNG: Dies ist die EINZIGE Komponente, die setCurrentTime aufrufen darf!
 * WARNUNG: Das Ignorieren dieser Regel führt zu Endlosschleifen!
 * WARNUNG: KEIN `let accumulator = 0;` HIER DRINNEN!
 */
export default function AnimationController() {
  // WARNUNG: KEIN `let accumulator = 0;` HIER!
  // WARNUNG: KEIN `let accumulator = 0;` HIER!
  // WARNUNG: KEIN `let accumulator = 0;` HIER!
  const isPlaying = useAppStore((s) => s.isPlaying);
  const currentTime = useAppStore((s) => s.currentTime);
  const duration = useAppStore((s) => s.duration);
  const setCurrentTime = useAppStore((s) => s.setCurrentTime);

  useFrame((state, delta) => {
    // ✅ Sichere Early Returns
    if (!isPlaying || !duration || duration <= 0) {
      accumulator = 0; // Reset, wenn pausiert
      return;
    }

    // ✅ Fixed-Timestep für deterministische Animationen
    accumulator += delta;
    
    // ✅ FIX: The original while loop called setCurrentTime multiple times per frame,
    // causing a "Maximum update depth exceeded" error. This revised logic calculates
    // the total time to advance and calls the state update function only ONCE.
    let timeToAdvance = 0;
    while (accumulator >= FIXED_TIMESTEP) {
        timeToAdvance += FIXED_TIMESTEP;
        accumulator -= FIXED_TIMESTEP;
    }

    if (timeToAdvance > 0) {
        let newTime = currentTime + timeToAdvance;

        if (newTime >= duration) {
            newTime = duration;
            // Clamp accumulator to prevent it from growing after the track ends
            accumulator = 0;
        }
        
        // ✅ KRITISCH: Nur hier darf setCurrentTime aufgerufen werden!
        // This is now safe as it's only called once per frame.
        setCurrentTime(newTime);
    }
  });

  return null; // Headless Komponente
}