// ===== src/features/ui/components/FloatingPanel.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React from 'react';
import type { PanelState } from '../../../types/ui';

interface FloatingPanelProps {
  children: React.ReactNode;
  panelState: PanelState;
}

/**
 * ULTRA-SAFE FloatingPanel-Implementierung
 * WARNUNG: KEIN setCurrentTime HIER!
 * FIX: This component is obsolete due to a UI refactor. The entire floating
 * panel system and its related state management have been removed. This now 
 * returns null to prevent compilation errors.
 */
export default function FloatingPanel({ children, panelState }: FloatingPanelProps) {
  return null;
}
