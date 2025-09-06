
// ===== src/features/pro/Watermark.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React from 'react';
import { useAppStore } from '../../app/store';
import { theme } from '../ui/theme';

/**
 * ULTRA-SAFE Watermark-Komponente
 * WARNUNG: KEIN setCurrentTime HIER!
 */
export default function Watermark() {
  const isPro = useAppStore(s => s.isPro);
  const ui = useAppStore(s => s.ui);

  // ✅ Sichere Pro-Status-Prüfung
  if (isPro) {
    return null; // Kein Wasserzeichen für Pro-User
  }
  
  // ✅ Sichere Vollbildschirm-Prüfung
  if (ui.isFullscreen) {
    return null; // Kein Wasserzeichen im Vollbildschirm
  }

  const watermarkStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '16px',
    fontFamily: theme.typography.mainFont,
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    pointerEvents: 'none',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const logoStyles: React.CSSProperties = {
    width: '24px',
    height: '24px',
    backgroundColor: theme.colors.primary,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    color: theme.colors.background,
  };

  return (
    <div style={watermarkStyles}>
      <div style={logoStyles}>A</div>
      <span>Made with Auralune</span>
    </div>
  );
}
