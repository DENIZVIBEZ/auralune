
// ===== src/features/ui/theme.ts =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!

/**
 * ULTRA-SAFE Theme-Definition für das goldene Design
 */
export const theme = {
  colors: {
    primary: '#D4AF37', // Elegantes Gold
    background: '#1A1A1A', // Dunkler Hintergrund
    text: '#FFFFFF', // Weißer Text
    panelBg: 'rgba(26, 26, 26, 0.9)', // Transparenter Panel-Hintergrund
    spectral: [
      '#ff0000', '#ff7f00', '#ffff00', '#00ff00', 
      '#0000ff', '#4b0082', '#9400d3'
    ], // Spektrale Farben für Visualisierungen
    accent: '#FFD700', // Helles Gold für Akzente
    success: '#00ff00',
    warning: '#ffaa00',
    error: '#ff4444',
  },
  typography: {
    mainFont: '"Poppins", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    titleSize: '24px',
    bodySize: '16px',
    smallSize: '14px',
  },
  styles: {
    button: {
      backgroundColor: 'transparent',
      border: '1px solid #D4AF37',
      color: '#D4AF37',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: '"Poppins", sans-serif',
      fontSize: '14px',
    },
    slider: {
      WebkitAppearance: 'none',
      appearance: 'none',
      width: '100%',
      height: '4px',
      background: 'rgba(212, 175, 55, 0.3)',
      outline: 'none',
      borderRadius: '2px',
      cursor: 'pointer',
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid #D4AF37',
      color: '#FFFFFF',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: '"Poppins", sans-serif',
    },
  },
};
