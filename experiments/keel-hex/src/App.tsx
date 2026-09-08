import { useCallback, useEffect, useState } from 'react';
import { BRAND, DEFAULT_TOGGLES, STEPS, modeById, stepById } from './catalog';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { usePrefersReducedMotion } from './hooks';
import type { SpeedId, Toggles, ViewMode } from './types';

export default function App() {
  const [mode, setMode] = useState<ViewMode>('assembled');
  const [step, setStep] = useState(STEPS.length);
  const [explode, setExplode] = useState(0.62);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<SpeedId>(1);
  const [toggles, setToggles] = useState<Toggles>(DEFAULT_TOGGLES);
  const reducedMotion = usePrefersReducedMotion();
  const stepInfo = stepById(step);
  const modeInfo = modeById(mode);

  const changeMode = useCallback((next: ViewMode) => {
    setMode(next);
    setPlaying(false);
    setStep(STEPS.length);
    if (next === 'exploded') setExplode((current) => (current < 0.12 ? 0.62 : current));
  }, []);

  const play = useCallback(() => {
    if (reducedMotion) return;
    setPlaying((current) => {
      if (current) return false;
      setMode('assembled');
      setStep(1);
      return true;
    });
  }, [reducedMotion]);

  const changeToggle = useCallback((key: keyof Toggles, value: boolean) => {
    setToggles((current) => ({ ...current, [key]: value }));
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setPlaying(false);
      setToggles((current) => ({ ...current, orbit: false }));
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (!playing || reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setStep((current) => Math.min(STEPS.length, current + 1));
    }, 1400 / speed);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion, speed]);

  useEffect(() => {
    if (playing && step >= STEPS.length) {
      setPlaying(false);
      setMode('assembled');
    }
  }, [playing, step]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      const key = event.key.toLowerCase();
      if (key === '1') changeMode('assembled');
      if (key === '2') changeMode('inside');
      if (key === '3') changeMode('exploded');
      if (event.key === ' ') {
        event.preventDefault();
        play();
      }
      if (key === 'l') changeToggle('labels', !toggles.labels);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [changeMode, changeToggle, play, toggles.labels]);

  return (
    <ErrorBoundary>
      <div className="app">
        <Scene
          step={step}
          mode={mode}
          explode={explode}
          playing={playing}
          toggles={toggles}
          reducedMotion={reducedMotion}
        />
        <Hud
          mode={modeInfo}
          step={stepInfo}
          explode={explode}
          playing={playing}
          speed={speed}
          toggles={toggles}
          reducedMotion={reducedMotion}
          onMode={changeMode}
          onExplode={setExplode}
          onPlay={play}
          onSpeed={setSpeed}
          onToggle={changeToggle}
        />
        <p className="sr-only">
          {BRAND.lockup}. {BRAND.chassis} {BRAND.chassisName}. {modeInfo.name}. {stepInfo.name}. One two
          three switch modes. Space plays the marks.
        </p>
      </div>
    </ErrorBoundary>
  );
}
