
// ===== src/types/features.ts =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!

/**
 * Enthält alle extrahierten Audio-Merkmale für die Visualisierung.
 * WARNUNG: Alle Arrays müssen die gleiche Länge haben!
 */
export interface FeatureTrack {
  bass: number[];       // Durchschnittliche Energie im Bass-Frequenzbereich (20-250 Hz)
  mids: number[];       // Durchschnittliche Energie im Mitten-Frequenzbereich (250-4000 Hz)
  highs: number[];      // Durchschnittliche Energie im Höhen-Frequenzbereich (4000-20000 Hz)
  onsets: number[];     // Erkannte Beat-Onsets (0 oder 1)
  waveform: number[][]; // Detaillierte Wellenform-Daten für jeden Frame
  spectralCentroid: number[]; // Maß für die "Helligkeit" des Klangs
}
