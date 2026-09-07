import { useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoomDesk from './components/LoomDesk';
import Scene from './components/Scene';
import { usePrefersReducedMotion } from './hooks';
import { loomFromRecipe, recipeById, type LoomState, type RecipeId, type StageId } from './recipes';
import { copyLoomSnippet } from './snippet';

export default function App() {
  const [loom, setLoom] = useState<LoomState>(() => loomFromRecipe(recipeById('tide-film')));
  const [stage, setStage] = useState<StageId>('well');
  const [orbiting, setOrbiting] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) setOrbiting(false);
  }, [reducedMotion]);

  useEffect(() => {
    if (!copied && !copyError) return undefined;
    const id = window.setTimeout(() => {
      setCopied(false);
      setCopyError(null);
    }, 1800);
    return () => window.clearTimeout(id);
  }, [copied, copyError]);

  const chooseRecipe = useCallback((id: RecipeId) => {
    setLoom(loomFromRecipe(recipeById(id)));
  }, []);

  const patchLoom = useCallback((patch: Partial<LoomState>) => {
    setLoom((current) => ({ ...current, ...patch }));
  }, []);

  const handleCopy = useCallback(() => {
    void copyLoomSnippet(loom)
      .then(() => {
        setCopyError(null);
        setCopied(true);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Copy failed.';
        console.error('Nacre Loom copy failed', error);
        setCopied(false);
        setCopyError(message);
      });
  }, [loom]);

  return (
    <ErrorBoundary>
      <div className="app">
        <Scene
          loom={loom}
          stage={stage}
          orbiting={orbiting}
          reducedMotion={reducedMotion}
        />
        <LoomDesk
          loom={loom}
          stage={stage}
          orbiting={orbiting}
          reducedMotion={reducedMotion}
          copied={copied}
          onRecipe={chooseRecipe}
          onPatch={patchLoom}
          onStage={setStage}
          onOrbiting={setOrbiting}
          onCopy={handleCopy}
        />
        <p className="sr-only">
          Nacre Loom glass vessel. Recipe {loom.recipeId}. Stage {stage}.
          {copyError ? ` Copy error: ${copyError}` : ''}
        </p>
      </div>
    </ErrorBoundary>
  );
}
