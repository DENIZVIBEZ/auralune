
// ===== src/features/effects/EffectRegistry.ts =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import type { EffectDefinition } from '../../types/effects';

class EffectRegistryService {
  private effects: Map<string, EffectDefinition> = new Map();

  public register(effectDef: EffectDefinition) {
    console.log(`EFFECT_REGISTRY: Registering effect: ${effectDef.id}`);
    this.effects.set(effectDef.id, effectDef);
  }

  public get(id: string): EffectDefinition | undefined {
    return this.effects.get(id);
  }

  public list(): EffectDefinition[] {
    return Array.from(this.effects.values());
  }
}

export const EffectRegistry = new EffectRegistryService();
