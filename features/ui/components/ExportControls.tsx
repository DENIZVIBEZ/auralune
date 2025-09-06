
// ===== src/features/ui/components/ExportControls.tsx =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React from 'react';
import { useAppStore } from '../../../app/store';
import { theme } from '../theme';

/**
 * ULTRA-SAFE ExportControls
 * WARNUNG: KEIN setCurrentTime HIER!
 */
export default function ExportControls() {
  const {
    exportStatus,
    exportSettings: rawExportSettings,
    exportOutputUrl,
    isPro,
    requestExport,
    resetExport
  } = useAppStore();

  // CRITICAL FIX: Ensure exportSettings exists
  const exportSettings = rawExportSettings || { quality: '720p' };

  const controlStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const labelStyles: React.CSSProperties = {
    color: theme.colors.primary,
    fontSize: theme.typography.smallSize,
    fontWeight: 'bold',
    marginBottom: '4px',
    display: 'block'
  };

  const buttonStyles: React.CSSProperties = {
    ...theme.styles.button,
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  const downloadButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: theme.colors.primary,
    color: theme.colors.background,
  };

  const qualityOptions = isPro
    ? ['720p', '1080p', '4K']
    : ['720p', '1080p']; // 4K nur für Pro-User

  return (
    <div style={controlStyles}>
      <div>
        <label style={labelStyles}>Qualität</label>
        <select
          value={exportSettings.quality}
          style={{ ...theme.styles.input, width: '100%' }}
          disabled={exportStatus !== 'IDLE'}
        >
          {qualityOptions.map(quality => (
            <option key={quality} value={quality} style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
              {quality} {quality === '4K' && !isPro && '(Pro)'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label style={labelStyles}>Format</label>
        <select
          value={exportSettings.format}
          style={{ ...theme.styles.input, width: '100%' }}
          disabled={exportStatus !== 'IDLE'}
        >
          <option value="webm" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>WebM</option>
          <option value="mp4" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>MP4 {!isPro && '(Pro)'}</option>
        </select>
      </div>
      
      {exportStatus === 'IDLE' && (
        <button
          style={buttonStyles}
          onClick={requestExport}
        >
          🎬 Aufnahme starten
        </button>
      )}
      
      {exportStatus === 'DONE' && exportOutputUrl && (
        <>
          <a
            href={exportOutputUrl}
            download={`auralune-export.${exportSettings.format}`}
            style={{ textDecoration: 'none' }}
          >
            <button style={downloadButtonStyles}>
                💾 Video herunterladen
            </button>
          </a>
          <button
            style={buttonStyles}
            onClick={resetExport}
          >
            🔄 Neuer Export
          </button>
        </>
      )}
      
      {!isPro && (
        <div style={{
          padding: '10px',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          border: `1px solid ${theme.colors.primary}`,
          borderRadius: '4px',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '8px'
        }}>
          <p style={{ margin: '0 0 8px 0', color: theme.colors.primary, fontWeight: 'bold' }}>
            🌟 Upgrade zu Pro für:
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '11px', textAlign: 'left', display: 'inline-block' }}>
            <li>- 4K-Export</li>
            <li>- MP4-Format</li>
            <li>- Kein Wasserzeichen</li>
          </ul>
        </div>
      )}
    </div>
  );
}
