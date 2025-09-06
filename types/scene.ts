
// ===== src/types/scene.ts =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React from 'react';

/**
 * Definiert die Struktur für eine 3D-Szene.
 */
export interface SceneDefinition {
  id: string; // Eindeutiger Identifier (z.B. 'cosmic-tunnel')
  name: string; // Angezeigter Name (z.B. 'Cosmic Tunnel')
  description: string; // Kurze Beschreibung der Szene
  component: React.FC; // Die React-Komponente, die die Szene rendert
  paramsSchema: Record<string, SceneParam>; // Schema für die UI-Controls
  defaultParams: Record<string, any>; // Standardwerte für die Parameter
  inSceneEffects?: Record<string, InSceneEffect>; // Optionale, szenen-spezifische Effekte
}

/**
 * Definiert einen Parameter für die UI-Steuerung einer Szene.
 */
export interface SceneParam {
  type: 'number' | 'color' | 'boolean' | 'select';
  label: string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[]; // Für 'select' Typ
}

/**
 * Definiert einen optionalen, szenen-internen Effekt.
 */
export interface InSceneEffect {
  label: string;
  enabled: boolean;
}
