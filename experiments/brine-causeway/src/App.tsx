import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isMuted, setMuted } from './audio';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { useDriveInput, usePrefersReducedMotion } from './hooks';
import { cycleAtmosphere, resolveLook } from './look';
import { nearestMark } from './road';
import type { Atmosphere, CamMode, HudSnapshot, MarkId, Quality } from './types';
import { createVehicle, paceKph, resetVehicle } from './vehicle';

export default function App() {
  const vehicle = useRef(createVehicle());
  const input = useDriveInput();
  const [atmosphere, setAtmosphere] = useState<Atmosphere>('sun');
  const [muted, setMutedState] = useState(true);
  const [driving, setDriving] = useState(false);
  const [quality, setQuality] = useState<Quality>('pretty');
  const [cam, setCam] = useState<CamMode>('chase');
  const [pace, setPace] = useState(0);
  const [mark, setMark] = useState<MarkId>('reach');
  const reducedMotion = usePrefersReducedMotion();
  const look = useMemo(() => resolveLook(atmosphere), [atmosphere]);

  const onMute = useCallback(() => {
    const next = !isMuted();
    void setMuted(next).then(() => setMutedState(next));
  }, []);

  const onReset = useCallback(() => {
    resetVehicle(vehicle.current);
  }, []);

  const onStart = useCallback(() => {
    setDriving(true);
    document.querySelector<HTMLElement>('.app')?.focus();
  }, []);

  const onPad = useCallback(
    (axis: 'throttle' | 'steer', value: number) => {
      if (axis === 'throttle') input.current.padThrottle = value;
      else input.current.padSteer = value;
    },
    [input]
  );

  const onBrake = useCallback(
    (held: boolean) => {
      input.current.brake = held;
    },
    [input]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 't') {
        event.preventDefault();
        setAtmosphere((current) => cycleAtmosphere(current));
      }
      if (key === 'r') {
        event.preventDefault();
        onReset();
      }
      if (key === 'c') {
        event.preventDefault();
        setCam((current) => (current === 'chase' ? 'close' : 'chase'));
      }
      if (key === 'enter' && !driving) {
        event.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [driving, onReset, onStart]);

  useEffect(() => {
    let frame = 0;
    let lastPace = -1;
    let lastMark: MarkId = 'reach';
    const tick = () => {
      const body = vehicle.current;
      const nextPace = paceKph(body.speed);
      const nextMark = nearestMark(body.x, body.z);
      if (nextPace !== lastPace) {
        lastPace = nextPace;
        setPace(nextPace);
      }
      if (nextMark !== lastMark) {
        lastMark = nextMark;
        setMark(nextMark);
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const hud = useMemo<HudSnapshot>(
    () => ({
      pace,
      mark,
      atmosphere,
      muted,
      driving,
      quality,
      cam,
    }),
    [atmosphere, cam, driving, mark, muted, pace, quality]
  );

  return (
    <ErrorBoundary>
      <div className={`app ${driving ? 'is-live' : ''}`} tabIndex={0}>
        <Scene
          vehicle={vehicle}
          input={input}
          look={look}
          driving={driving}
          cam={cam}
          quality={quality}
          reducedMotion={reducedMotion}
          onCanvasClick={() => {
            document.querySelector<HTMLElement>('.app')?.focus();
          }}
        />
        <Hud
          hud={hud}
          onMute={onMute}
          onAtmosphere={setAtmosphere}
          onQuality={setQuality}
          onStart={onStart}
          onReset={onReset}
          onPad={onPad}
          onBrake={onBrake}
        />
      </div>
    </ErrorBoundary>
  );
}
