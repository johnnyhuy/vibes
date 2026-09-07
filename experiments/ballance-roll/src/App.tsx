import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { HAZE_WALK } from './course';
import { readSteer, useHeldKeys, usePrefersReducedMotion } from './hooks';
import type { BallKind, PlayState } from './types';

export default function App() {
  const [kind, setKind] = useState<BallKind>('wood');
  const [state, setState] = useState<PlayState>('ready');
  const [resetToken, setResetToken] = useState(0);
  const [takenMotes, setTakenMotes] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [pad, setPad] = useState({ x: 0, z: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const keys = useHeldKeys();
  const [steer, setSteer] = useState({ x: 0, z: 0 });

  useEffect(() => {
    const id = window.setInterval(() => {
      setSteer(readSteer(keys.current, pad));
    }, 32);
    return () => window.clearInterval(id);
  }, [keys, pad]);

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
      if (key === 'r') reset();
      if (key === '1') setKind('wood');
      if (key === '2') setKind('stone');
      if (key === '3') setKind('metal');
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

  const onPad = useCallback((axis: 'x' | 'z', value: number) => {
    setPad((current) => ({ ...current, [axis]: value }));
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
      <div className="app">
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
        <Hud kind={kind} hud={hud} onKind={setKind} onReset={reset} onPad={onPad} />
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
