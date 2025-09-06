import React, { useMemo } from 'react';
import { useAppStore } from '../../app/store';
import { SceneRegistry } from './SceneRegistry';
import './index'; // Ensure registry is populated

export default function SceneManager() {
  const activeSceneId = useAppStore(s => s.activeSceneId);

  const ActiveSceneComponent = useMemo(() => {
    const sceneDef = SceneRegistry.get(activeSceneId);
    if (!sceneDef) {
      console.error(`SceneManager: Scene with id "${activeSceneId}" not found in registry.`);
      // Fallback to the first registered scene
      const fallbackScene = SceneRegistry.list()[0];
      return fallbackScene ? fallbackScene.component : null;
    }
    return sceneDef.component;
  }, [activeSceneId]);

  if (!ActiveSceneComponent) {
    return null; // Or render a fallback placeholder
  }

  // By adding a `key`, we tell React to create a new component instance
  // whenever the scene ID changes, ensuring the old scene is properly unmounted.
  return <ActiveSceneComponent key={activeSceneId} />;
}