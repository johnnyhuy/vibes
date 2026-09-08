import { useCallback, useEffect, useState } from 'react';
import { BRAND, STEPS, stepById } from './catalog';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { usePrefersReducedMotion } from './hooks';
import type { SpeedId } from './types';

export default function App() {
  const [step, setStep] = useState(STEPS.length);
  const [playing, setPlaying] = useState(false);
  const [orbiting, setOrbiting] = useState(true);
  const [speed, setSpeed] = useState<SpeedId>(1);
  const reducedMotion = usePrefersReducedMotion();
  const stepInfo = stepById(step);

  const changeStep = useCallback((id: number) => {
    const clamped = Math.min(STEPS.length, Math.max(1, id));
    setStep(clamped);
    if (clamped >= STEPS.length) setPlaying(false);
  }, []);

  const replay = useCallback(() => {
    setStep(1);
    setPlaying(!reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setPlaying(false);
      setOrbiting(false);
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (!playing || reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setStep((current) => Math.min(STEPS.length, current + 1));
    }, 1600 / speed);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion, speed]);

  useEffect(() => {
    if (playing && step >= STEPS.length) setPlaying(false);
  }, [playing, step]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      const key = event.key.toLowerCase();
      if (event.key === 'ArrowRight' || key === ']') {
        event.preventDefault();
        changeStep(step + 1);
      }
      if (event.key === 'ArrowLeft' || key === '[') {
        event.preventDefault();
        changeStep(step - 1);
      }
      if (key === 'r') {
        event.preventDefault();
        replay();
      }
      if (event.key === ' ') {
        event.preventDefault();
        setPlaying((value) => !value);
      }
      if (key === '1' || key === '2' || key === '4') {
        setSpeed(Number(key) as SpeedId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [changeStep, replay, step]);

  return (
    <ErrorBoundary>
      <div className="app">
        <Scene step={step} orbiting={orbiting} reducedMotion={reducedMotion} />
        <Hud
          step={stepInfo}
          playing={playing}
          orbiting={orbiting}
          speed={speed}
          reducedMotion={reducedMotion}
          onStep={changeStep}
          onPlay={setPlaying}
          onReplay={replay}
          onOrbit={setOrbiting}
          onSpeed={setSpeed}
        />
        <p className="sr-only">
          {BRAND.lockup}. {BRAND.chassis} {BRAND.chassisName}. {stepInfo.name}. Arrow keys step.
          R replays. Space walks the marks.
        </p>
      </div>
    </ErrorBoundary>
  );
}
