
// ===== src/features/export/RecordingController.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../../app/store';
import { theme } from '../ui/theme';

/**
 * ULTRA-SAFE RecordingController
 * WARNUNG: KEIN setCurrentTime HIER!
 */
export default function RecordingController() {
  const {
    exportStatus,
    recordingCountdown,
    exportProgress,
    exportError,
    duration,
    setExportStatus,
    setRecordingCountdown,
    resetExport,
    setExportProgress,
    setExportOutputUrl,
    setCurrentTime
  } = useAppStore();

  const progressIntervalRef = useRef<number | null>(null);

  // Countdown Logic
  useEffect(() => {
    if (exportStatus === 'REQUESTED' && recordingCountdown > 0) {
      const timer = setTimeout(() => {
        if (recordingCountdown === 1) {
          setExportStatus('RECORDING');
          setRecordingCountdown(0);
        } else {
          setRecordingCountdown(recordingCountdown - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [exportStatus, recordingCountdown, setExportStatus, setRecordingCountdown]);

  // Simulated Recording/Encoding Progress Logic
  useEffect(() => {
    if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
    }
    
    if (exportStatus === 'RECORDING') {
        // REMOVED: setCurrentTime(0, true); - This was causing React Error #185
        // The recording should start from current position, not reset to 0
        const startTime = useAppStore.getState().currentTime;
        progressIntervalRef.current = window.setInterval(() => {
            const current = useAppStore.getState().currentTime;
            const total = useAppStore.getState().duration;
            if (total > 0) {
                const progress = ((current - startTime) / (total - startTime)) * 100;
                setExportProgress(Math.max(0, Math.min(100, progress)));
                if (current >= total) {
                    setExportStatus('ENCODING');
                }
            }
        }, 100);
    } else if (exportStatus === 'ENCODING') {
        let progress = 0;
        setExportProgress(0);
        progressIntervalRef.current = window.setInterval(() => {
            progress += 5; // Simulate encoding speed
            setExportProgress(progress);
            if (progress >= 100) {
                // Create a dummy file for download
                const blob = new Blob(["Auralune Video Export"], { type: "video/webm" });
                const url = URL.createObjectURL(blob);
                setExportOutputUrl(url);
                setExportStatus('DONE');
            }
        }, 100);
    }

    return () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportStatus]);

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 2000,
    color: theme.colors.text,
    fontFamily: theme.typography.mainFont,
  };

  const countdownStyles: React.CSSProperties = {
    fontSize: '120px',
    fontWeight: 'bold',
    color: theme.colors.primary,
    textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
  };

  const statusStyles: React.CSSProperties = {
    fontSize: '24px',
    marginBottom: '20px',
    color: theme.colors.primary,
  };

  const buttonStyles: React.CSSProperties = {
    ...theme.styles.button,
    margin: '0 10px',
    fontSize: '16px',
    padding: '12px 24px',
  };

  if (exportStatus === 'IDLE' || exportStatus === 'DONE') {
      return null;
  }

  if (exportStatus === 'REQUESTED' && recordingCountdown > 0) {
    return (
      <div style={overlayStyles}>
        <div style={countdownStyles} className="animate-pulse-countdown">{recordingCountdown}</div>
        <p style={{ fontSize: '18px', marginTop: '20px' }}>Aufnahme startet in...</p>
      </div>
    );
  }

  if (exportStatus === 'RECORDING') {
    return (
      <div style={overlayStyles}>
        <div style={statusStyles}>🔴 AUFNAHME LÄUFT</div>
        <div style={{
          width: '300px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '2px',
          marginBottom: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${exportProgress}%`,
            height: '100%',
            backgroundColor: theme.colors.primary,
            borderRadius: '2px',
            transition: 'width 0.1s linear',
          }} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={buttonStyles}
            onClick={() => {
                setExportStatus('PAUSED');
                if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            }}
          >
            ⏸️ Pause
          </button>
          <button
            style={buttonStyles}
            onClick={() => resetExport()}
          >
            ⏹️ Stop
          </button>
        </div>
      </div>
    );
  }

  if (exportStatus === 'PAUSED') {
    return (
      <div style={overlayStyles}>
        <div style={statusStyles}>⏸️ AUFNAHME PAUSIERT</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={buttonStyles}
            onClick={() => setExportStatus('RECORDING')}
          >
            ▶️ Weiter
          </button>
          <button
            style={buttonStyles}
            onClick={() => resetExport()}
          >
            ⏹️ Stop
          </button>
        </div>
      </div>
    );
  }

  if (exportStatus === 'ENCODING') {
    return (
      <div style={overlayStyles}>
        <div style={statusStyles}>⚙️ VIDEO WIRD ERSTELLT...</div>
        <div style={{
          width: '300px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${exportProgress}%`,
            height: '100%',
            backgroundColor: theme.colors.primary,
            borderRadius: '2px',
            transition: 'width 0.1s linear',
          }} />
        </div>
        <p style={{ marginTop: '10px' }}>{exportProgress.toFixed(0)}%</p>
      </div>
    );
  }

  if (exportStatus === 'ERROR') {
    return (
      <div style={overlayStyles}>
        <div style={{ ...statusStyles, color: theme.colors.error }}>❌ FEHLER</div>
        <p style={{ marginBottom: '20px', maxWidth: '400px', textAlign: 'center' }}>
          {exportError || 'Ein unbekannter Fehler ist aufgetreten.'}
        </p>
        <button
          style={buttonStyles}
          onClick={() => resetExport()}
        >
          OK
        </button>
      </div>
    );
  }

  return null;
}
