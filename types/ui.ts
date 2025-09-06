// ===== src/types/ui.ts =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!

/**
 * Definiert den Zustand eines einzelnen UI-Panels.
 */
export interface PanelState {
  id: string; // Eindeutiger Identifier (z.B. 'scene')
  visible: boolean; // Ob das Panel in der UI sichtbar ist
  isCollapsed: boolean; // Ob das Panel eingeklappt ist
}

/**
 * Definiert die Struktur für den gesamten UI-Zustand.
 */
export interface UIState {
  panels: PanelState[];
  isLeftSidebarVisible: boolean;
  isRightSidebarVisible: boolean;
  isFullscreen: boolean;
  showLogo: boolean;
}
