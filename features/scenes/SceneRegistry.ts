
// ===== src/features/scenes/SceneRegistry.ts =====
// WARNUNG: DIESE DATEI EXAKT KOPIEREN! KEINE ÄNDERUNGEN VORNEHMEN!
import type { SceneDefinition } from '../../types/scene';

class SceneRegistryService {
  private scenes: Map<string, SceneDefinition> = new Map();

  public register(sceneDef: SceneDefinition) {
    console.log(`REGISTRY: Registering scene: ${sceneDef.id}`);
    this.scenes.set(sceneDef.id, sceneDef);
  }

  public get(id: string): SceneDefinition | undefined {
    return this.scenes.get(id);
  }

  public list(): SceneDefinition[] {
    return Array.from(this.scenes.values());
  }
}

export const SceneRegistry = new SceneRegistryService();
