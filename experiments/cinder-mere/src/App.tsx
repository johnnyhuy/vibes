import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isMuted, setMuted } from './audio';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { useDriveInput, usePrefersReducedMotion } from './hooks';
import { cycleTimeMode, resolveLook } from './look';
import { nearestLandmark } from './terrain';
import type { HudSnapshot, LandmarkId, TimeMode } from './types';
import { createVehicle, paceKph, resetVehicle } from './vehicle';

export default function App() {
  const vehicle = useRef(createVehicle());
  const input = useDriveInput();
  const [timeMode, setTimeMode] = useState<TimeMode>('dusk');
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMutedState] = useState(true);
  const [pace, setPace] = useState(0);
  const [landmark, setLandmark] = useState<LandmarkId>('ford');
  const [range, setRange] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const look = useMemo(() => resolveLook(timeMode, elapsed), [elapsed, timeMode]);

  const onMute = useCallback(() => {
    const next = !isMuted();
    void setMuted(next).then(() => setMutedState(next));
  }, []);

  const onReset = useCallback(() => {
    resetVehicle(vehicle.current);
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
        setTimeMode((current) => cycleTimeMode(current));
      }
      if (key === 'r') {
        event.preventDefault();
        onReset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onReset]);

  useEffect(() => {
    let frame = 0;
    let lastPace = -1;
    let lastLandmark: LandmarkId = 'ford';
    let lastRange = -1;
    const tick = () => {
      const body = vehicle.current;
      const nextPace = paceKph(body.speed);
      const found = nearestLandmark(body.x, body.z);
      if (nextPace !== lastPace) {
        lastPace = nextPace;
        setPace(nextPace);
      }
      if (found.landmark.id !== lastLandmark) {
        lastLandmark = found.landmark.id;
        setLandmark(found.landmark.id);
      }
      if (Math.abs(found.range - lastRange) > 0.5) {
        lastRange = found.range;
        setRange(found.range);
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (timeMode !== 'cycle' || reducedMotion) return undefined;
    let frame = 0;
    const started = performance.now();
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 90) {
        setElapsed((now - started) / 1000);
        last = now;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [reducedMotion, timeMode]);

  const hud = useMemo<HudSnapshot>(
    () => ({
      pace,
      landmark,
      landmarkRange: range,
      timeName: look.name,
      timeMode,
      muted,
    }),
    [landmark, look.name, muted, pace, range, timeMode]
  );

  return (
    <ErrorBoundary>
      <div className="app" tabIndex={0}>
        <Scene
          vehicle={vehicle}
          input={input}
          look={look}
          reducedMotion={reducedMotion}
          onCanvasClick={() => {
            document.querySelector<HTMLElement>('.app')?.focus();
          }}
        />
        <Hud
          hud={hud}
          onMute={onMute}
          onTime={setTimeMode}
          onReset={onReset}
          onPad={onPad}
          onBrake={onBrake}
        />
      </div>
    </ErrorBoundary>
  );
}
