
// ===== src/app/ErrorBoundary.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ULTRA-SAFE Error Boundary für React-Fehler-Abfang
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ULTRA-SAFE ERROR BOUNDARY CAUGHT AN ERROR:', error, errorInfo);
    
    // ✅ Detaillierte Fehleranalyse
    if (error.message.includes('Maximum update depth exceeded')) {
      console.error('🚨🚨🚨 KRITISCHER FEHLER: REACT ERROR #185 ENTDECKT! 🚨🚨🚨');
      console.error('👉 Ursache: Eine der ULTRA-SAFE Regeln wurde verletzt.');
      console.error('🔍 Prüfe SOFORT:');
      console.error('  1. AnimationController.tsx - wurde sie exakt kopiert?');
      console.error('  2. Gibt es andere `setCurrentTime` Aufrufe?');
      console.error('  3. `useEffect` ohne Dependencies?');
      console.error('  4. `setState` im Render-Body?');
      console.error('  5. Akkumulator innerhalb einer Komponente?');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#1a1a1a',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center',
          fontFamily: '"Poppins", sans-serif',
          zIndex: 9999,
        }}>
          <h1 style={{ color: '#ff4444', marginBottom: '20px' }}>🚨 Auralune Fehler</h1>
          <p style={{ marginBottom: '20px', fontSize: '18px' }}>Ein kritischer Fehler ist aufgetreten:</p>
          <pre style={{
            backgroundColor: '#333',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '80%',
            overflow: 'auto',
            fontSize: '14px',
            border: '1px solid #D4AF37',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '30px',
              padding: '15px 30px',
              backgroundColor: '#D4AF37',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            🔄 Seite neu laden
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
