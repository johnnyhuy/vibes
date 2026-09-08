import { useCallback, useEffect, useState } from 'react';
import {
  BRAND,
  DEFAULTS,
  STEPS,
  ideaById,
  lookById,
  nextIdea,
  nextLook,
  stepById,
} from './catalog';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { usePrefersReducedMotion } from './hooks';
import type { IdeaId, LookId, ViewMode } from './types';

export default function App() {
  const [ideaId, setIdeaId] = useState<IdeaId>(DEFAULTS.idea);
  const [lookId, setLookId] = useState<LookId>(DEFAULTS.look);
  const [mode, setMode] = useState<ViewMode>(DEFAULTS.mode);
  const [step, setStep] = useState(DEFAULTS.step);
  const [playing, setPlaying] = useState(false);
  const [orbiting, setOrbiting] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  const idea = ideaById(ideaId);
  const look = lookById(lookId);
  const stepInfo = stepById(step);

  const changeMode = useCallback((next: ViewMode) => {
    setMode(next);
    if (next === 'assemble' || next === 'explode') {
      setStep(STEPS.length);
      setPlaying(false);
    }
    if (next === 'step') {
      setStep((current) => (current < 1 ? 1 : current));
    }
  }, []);

  const changeStep = useCallback((id: number) => {
    const clamped = Math.min(STEPS.length, Math.max(1, id));
    setStep(clamped);
    setMode('step');
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setPlaying(false);
      setOrbiting(false);
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (!playing || reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setMode('step');
      setStep((current) => {
        if (current >= STEPS.length) return 1;
        return current + 1;
      });
    }, 1400);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

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
      if (key === 'e') {
        event.preventDefault();
        changeMode(mode === 'explode' ? 'assemble' : 'explode');
      }
      if (key === 'r') {
        event.preventDefault();
        changeMode('assemble');
      }
      if (key === ' ') {
        event.preventDefault();
        setPlaying((value) => !value);
      }
      if (key === 'i') {
        event.preventDefault();
        setIdeaId((current) => nextIdea(current));
      }
      if (key === 'l') {
        event.preventDefault();
        setLookId((current) => nextLook(current));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [changeMode, changeStep, mode, step]);

  return (
    <ErrorBoundary>
      <div className="app">
        <Scene
          look={look}
          palette={idea.palette}
          step={step}
          mode={mode}
          orbiting={orbiting}
          reducedMotion={reducedMotion}
        />
        <Hud
          idea={idea}
          look={look}
          step={stepInfo}
          mode={mode}
          playing={playing}
          orbiting={orbiting}
          reducedMotion={reducedMotion}
          onIdea={setIdeaId}
          onLook={setLookId}
          onMode={changeMode}
          onStep={changeStep}
          onPlay={setPlaying}
          onOrbit={setOrbiting}
        />
        <p className="sr-only">
          {BRAND.lockup}. {BRAND.setName} {BRAND.setNo}. {idea.name}. {look.name}. {stepInfo.name}.
          Arrow keys step. E explodes. R assembles. I cycles the idea palette. L cycles the look.
        </p>
      </div>
    </ErrorBoundary>
  );
}
