// ===== src/features/ui/components/Logo.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React from 'react';
import { useAppStore } from '../../../app/store';
import { theme } from '../theme';

/**
 * ULTRA-SAFE Logo-Komponente
 * WARNUNG: KEIN setCurrentTime HIER!
 */
export default function Logo() {
  const ui = useAppStore(s => s.ui);

  // ✅ Sichere UI-State-Prüfung
  if (!ui.showLogo || ui.isFullscreen) {
    return null;
  }

  const logoStyles: React.CSSProperties = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '340px', // Passt zur Breite der Seitenleiste
    height: '60px', // Standard-Header-Höhe
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Zentriert den Inhalt im zugewiesenen Bereich
    gap: '12px',
    color: theme.colors.primary,
    fontFamily: theme.typography.mainFont,
    fontSize: '24px',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
    zIndex: 1001,
    pointerEvents: 'none',
    boxSizing: 'border-box',
    padding: '0 20px',
  };

  const iconStyles: React.CSSProperties = {
    width: '36px',
    height: '36px',
    backgroundColor: theme.colors.primary,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.colors.background,
    boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
    flexShrink: 0,
  };

  return (
    <div style={logoStyles}>
      <div style={iconStyles}>A</div>
      <span>AURALUNE</span>
      <span style={{ fontSize: '14px', opacity: 0.7 }}>BETA</span>
    </div>
  );
}