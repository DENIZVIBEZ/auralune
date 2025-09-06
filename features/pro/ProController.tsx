
// ===== src/features/pro/ProController.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import { useEffect } from 'react';
import { useAppStore } from '../../app/store';

/**
 * ULTRA-SAFE ProController
 * WARNUNG: KEIN setCurrentTime HIER!
 */
export default function ProController() {
  const isPro = useAppStore(s => s.isPro);

  useEffect(() => {
    if (isPro) {
      console.log('PRO_CONTROLLER: Pro-Modus aktiviert - 4K-Export verfügbar');
    } else {
      console.log('PRO_CONTROLLER: Free-Modus - Export auf 1080p begrenzt');
    }
  }, [isPro]);

  return null; // Headless Komponente
}
