import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { HAZE_WALK } from './course';
import { usePrefersReducedMotion, useSteerInput } from './hooks';
import type { BallKind, PlayState } from './types';

export default function App() {
  const [kind, setKind] = useState<BallKind>('wood');
  const [state, setState] = useState<PlayState>('ready');
  const [resetToken, setResetToken] = useState(0);
  const [takenMotes, setTakenMotes] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { steer, setPad } = useSteerInput();

  useEffect(() => {
    if (state !== 'rolling' || startedAt === null) return undefined;
    const id = window.setInterval(() => {
      setElapsed((performance.now() - startedAt) / 1000);
    }, 80);
    return () => window.clearInterval(id);
  }, [startedAt, state]);

  const reset = useCallback(() => {
    setState('ready');
    setTakenMotes([]);
    setElapsed(0);
    setStartedAt(null);
    setResetToken((value) => value + 1);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const code = event.code.toLowerCase();
      if (key === 'r' || code === 'keyr') reset();
      if (key === '1' || code === 'digit1') setKind('wood');
      if (key === '2' || code === 'digit2') setKind('stone');
      if (key === '3' || code === 'digit3') setKind('metal');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reset]);

  const onDrive = useCallback(() => {
    setState((current) => {
      if (current !== 'ready') return current;
      setStartedAt(performance.now());
      return 'rolling';
    });
  }, []);

  const onFallen = useCallback(() => {
    setState((current) => (current === 'rolling' || current === 'ready' ? 'fallen' : current));
  }, []);

  const onFinished = useCallback(() => {
    setState((current) => (current === 'rolling' ? 'finished' : current));
  }, []);

  const onMote = useCallback((id: string) => {
    setTakenMotes((current) => (current.includes(id) ? current : [...current, id]));
  }, []);

  const hud = useMemo(
    () => ({
      elapsed,
      motes: takenMotes.length,
      moteTotal: HAZE_WALK.motes.length,
      state
    }),
    [elapsed, state, takenMotes.length]
  );

  return (
    <ErrorBoundary>
      <div className="app" tabIndex={0}>
        <Scene
          kind={kind}
          resetToken={resetToken}
          state={state}
          steer={steer}
          reducedMotion={reducedMotion}
          takenMotes={takenMotes}
          onDrive={onDrive}
          onFallen={onFallen}
          onFinished={onFinished}
          onMote={onMote}
        />
        <Hud kind={kind} hud={hud} onKind={setKind} onReset={reset} onPad={setPad} />
        <p className="hint">
          WASD or arrows
          <span className="sep">·</span>
          1–3 swap feel
          <span className="sep">·</span>
          R resets
          <span className="sep">·</span>
          {reducedMotion ? 'camera snaps (reduced motion)' : 'camera follows the marble'}
        </p>
      </div>
    </ErrorBoundary>
  );
}
