import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { useFlightInput, usePrefersReducedMotion } from './hooks';
import type { PlayState } from './types';

export default function App() {
  const [state, setState] = useState<PlayState>('flying');
  const [resetToken, setResetToken] = useState(0);
  const [distance, setDistance] = useState(0);
  const [rings, setRings] = useState(0);
  const [best, setBest] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const { nudgeLane, consumeLane, consumeStart } = useFlightInput();

  const reset = useCallback(() => {
    setDistance(0);
    setRings(0);
    setResetToken((value) => value + 1);
    setState('flying');
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const code = event.code.toLowerCase();
      if (key === 'r' || code === 'keyr') reset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reset]);

  const onStart = useCallback(() => {
    setState((current) => (current === 'ready' ? 'flying' : current));
  }, []);

  const onCrash = useCallback(() => {
    setState((current) => (current === 'flying' ? 'crashed' : current));
  }, []);

  const onHud = useCallback((nextDistance: number, nextRings: number) => {
    setDistance(nextDistance);
    setRings(nextRings);
    setBest((current) => Math.max(current, nextDistance));
  }, []);

  const hud = useMemo(
    () => ({
      distance,
      rings,
      best,
      state
    }),
    [best, distance, rings, state]
  );

  return (
    <ErrorBoundary>
      <div className="app" tabIndex={0}>
        <Scene
          state={state}
          resetToken={resetToken}
          reducedMotion={reducedMotion}
          consumeLane={consumeLane}
          consumeStart={consumeStart}
          nudgeLane={nudgeLane}
          onStart={onStart}
          onCrash={onCrash}
          onHud={onHud}
        />
        <Hud hud={hud} onReset={reset} />
      </div>
    </ErrorBoundary>
  );
}
