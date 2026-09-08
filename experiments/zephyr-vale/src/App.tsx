import { useCallback, useEffect, useRef, useState } from 'react';
import { isMuted, setMuted } from './audio';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { createPlayer, usePrefersReducedMotion, useValeInput } from './hooks';
import type { SlipId, Stance } from './types';

export default function App() {
  const player = useRef(createPlayer());
  const input = useValeInput();
  const [stance, setStance] = useState<Stance>('idle');
  const [sprinting, setSprinting] = useState(false);
  const [gathered, setGathered] = useState<SlipId[]>([]);
  const [lastSlip, setLastSlip] = useState<SlipId | null>(null);
  const [muted, setMutedState] = useState(true);
  const [looking, setLooking] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const onPad = useCallback(
    (axis: 'x' | 'z', value: number) => {
      if (axis === 'x') input.current.padX = value;
      else input.current.padZ = value;
    },
    [input]
  );

  const onSprint = useCallback(
    (held: boolean) => {
      input.current.padSprint = held;
    },
    [input]
  );

  const onMute = useCallback(() => {
    const next = !isMuted();
    void setMuted(next).then(() => setMutedState(next));
  }, []);

  const lockLook = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    void canvas.requestPointerLock();
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (document.pointerLockElement == null) return;
      player.current.lookYaw -= event.movementX * 0.0021;
      player.current.lookPitch = Math.max(
        -0.32,
        Math.min(0.42, player.current.lookPitch - event.movementY * 0.0015)
      );
    };
    const change = () => {
      const locked = document.pointerLockElement != null;
      input.current.lookLocked = locked;
      setLooking(locked);
    };
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerlockchange', change);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerlockchange', change);
    };
  }, [input]);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setStance(player.current.stance);
      setSprinting(player.current.sprinting);
      setGathered(player.current.gathered);
      setLastSlip(player.current.lastSlip);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <ErrorBoundary>
      <div className="app" tabIndex={0}>
        <Scene
          player={player}
          input={input}
          gathered={gathered}
          reducedMotion={reducedMotion}
          onCanvasClick={lockLook}
        />
        <Hud
          stance={stance}
          sprinting={sprinting}
          gathered={gathered}
          lastSlip={lastSlip}
          muted={muted}
          looking={looking}
          onMute={onMute}
          onPad={onPad}
          onSprint={onSprint}
        />
      </div>
    </ErrorBoundary>
  );
}
