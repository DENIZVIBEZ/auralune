
// ===== src/types/effects.ts =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import React from 'react';
import type { SceneParam } from './scene';

/**
 * Definiert einen Post-Processing-Effekt.
 */
export interface EffectDefinition {
  id: string; // Eindeutiger Identifier (z.B. 'chromatic-aberration')
  name: string; // Angezeigter Name
  component: React.FC<{ params: Record<string, any> }>; // Die Effekt-Komponente
  paramsSchema: Record<string, SceneParam>; // Schema für die UI-Controls
  defaultParams: Record<string, any>; // Standardwerte
}

/**
 * Repräsentiert einen aktiven Effekt im Effekt-Stack.
 */
export interface ActiveEffect {
  instanceId: string; // Eindeutige ID für diese Instanz
  effectId: string; // ID der Effekt-Definition
  params: Record<string, any>; // Überschriebene Parameter
}
