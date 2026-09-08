import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isMuted, setMuted } from './audio';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Lobby from './components/Lobby';
import Scene from './components/Scene';
import { usePrefersReducedMotion, useRunInput } from './hooks';
import { createLoop, resetLoop } from './loops';
import { resolveLook } from './look';
import { createRunner, paceKph, resetRunner } from './runner';
import type { BiomeId, HudSnapshot, Screen } from './types';

export default function App() {
  const [screen, setScreen] = useState<Screen>('lobby');
  const [biome, setBiome] = useState<BiomeId>('terrace');
  const runner = useRef(createRunner('terrace'));
  const loop = useRef(createLoop());
  const input = useRunInput();
  const [muted, setMutedState] = useState(true);
  const [pace, setPace] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(loop.current.phase);
  const [caption, setCaption] = useState(loop.current.caption);
  const reducedMotion = usePrefersReducedMotion();

  const look = useMemo(() => resolveLook(biome), [biome]);

  const bank = useCallback((next: BiomeId = biome) => {
    resetRunner(runner.current, next);
    resetLoop(loop.current);
    setPace(0);
    setScore(0);
    setProgress(0);
    setPhase('ready');
    setCaption(loop.current.caption);
  }, [biome]);

  const onBiome = useCallback(
    (next: BiomeId) => {
      setBiome(next);
      if (screen === 'chase') bank(next);
    },
    [bank, screen]
  );

  const onOpen = useCallback(() => {
    bank(biome);
    setScreen('chase');
  }, [bank, biome]);

  const onLobby = useCallback(() => {
    bank(biome);
    setScreen('lobby');
  }, [bank, biome]);

  const onMute = useCallback(() => {
    const next = !isMuted();
    void setMuted(next).then(() => setMutedState(next));
  }, []);

  const onPad = useCallback(
    (axis: 'throttle' | 'steer', value: number) => {
      if (axis === 'throttle') input.current.padThrottle = value;
      else input.current.padSteer = value;
    },
    [input]
  );

  const onBurst = useCallback(
    (held: boolean) => {
      input.current.burst = held;
    },
    [input]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === '1') {
        event.preventDefault();
        onBiome('terrace');
      }
      if (key === '2') {
        event.preventDefault();
        onBiome('basin');
      }
      if (key === '3') {
        event.preventDefault();
        onBiome('rim');
      }
      if (key === 'm') {
        event.preventDefault();
        onMute();
      }
      if (screen === 'lobby' && (key === 'enter' || event.code === 'Enter')) {
        event.preventDefault();
        onOpen();
      }
      if (screen === 'chase' && key === 'escape') {
        event.preventDefault();
        onLobby();
      }
      if (screen === 'chase' && key === 'r') {
        event.preventDefault();
        bank(biome);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [bank, biome, onBiome, onLobby, onMute, onOpen, screen]);

  useEffect(() => {
    if (screen !== 'chase') return undefined;
    let frame = 0;
    const tick = () => {
      const body = runner.current;
      const stride = loop.current;
      setPace(paceKph(body.speed));
      setScore(stride.score);
      setProgress(stride.progress);
      setPhase(stride.phase);
      setCaption(stride.caption);
      if (stride.phase === 'cleared' || stride.phase === 'caught') {
        setBest((current) => Math.max(current, stride.score));
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [screen]);

  const hud = useMemo<HudSnapshot>(
    () => ({
      biome,
      phase,
      score,
      best,
      progress,
      pace,
      caption,
      muted,
    }),
    [best, biome, caption, muted, pace, phase, progress, score]
  );

  return (
    <ErrorBoundary>
      <div className="app" tabIndex={0}>
        {screen === 'lobby' ? (
          <Lobby biome={biome} muted={muted} onBiome={onBiome} onOpen={onOpen} onMute={onMute} />
        ) : (
          <>
            <Scene
              key={biome}
              biome={biome}
              runner={runner}
              input={input}
              loop={loop}
              look={look}
              reducedMotion={reducedMotion}
              onCanvasClick={() => {
                document.querySelector<HTMLElement>('.app')?.focus();
              }}
            />
            <Hud
              hud={hud}
              onBiome={onBiome}
              onMute={onMute}
              onReset={() => bank(biome)}
              onLobby={onLobby}
              onPad={onPad}
              onBurst={onBurst}
            />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
