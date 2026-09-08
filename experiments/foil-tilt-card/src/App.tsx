import { useCallback, useEffect, useState } from 'react';
import { CARD, DEFAULTS, type Face } from './card';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { usePrefersReducedMotion } from './hooks';

export default function App() {
  const [foil, setFoil] = useState(DEFAULTS.foil);
  const [tilt, setTilt] = useState(DEFAULTS.tilt);
  const [spread, setSpread] = useState(DEFAULTS.spread);
  const [face, setFace] = useState<Face>('recto');
  const [sway, setSway] = useState(true);
  const [resetToken, setResetToken] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) setSway(false);
  }, [reducedMotion]);

  const flip = useCallback(() => {
    setFace((current) => (current === 'recto' ? 'verso' : 'recto'));
  }, []);

  const reset = useCallback(() => {
    setResetToken((value) => value + 1);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'f') {
        event.preventDefault();
        flip();
      }
      if (key === 'r') {
        event.preventDefault();
        reset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flip, reset]);

  return (
    <ErrorBoundary>
      <div className="app">
        <Scene
          foil={foil}
          tilt={tilt}
          spread={spread}
          flipped={face === 'verso'}
          sway={sway}
          reducedMotion={reducedMotion}
          resetToken={resetToken}
        />
        <Hud
          foil={foil}
          tilt={tilt}
          spread={spread}
          face={face}
          sway={sway}
          reducedMotion={reducedMotion}
          onFoil={setFoil}
          onTilt={setTilt}
          onSpread={setSpread}
          onFlip={flip}
          onReset={reset}
          onSway={setSway}
        />
        <p className="sr-only">
          {CARD.brand}. {CARD.name} {CARD.number}. {face} face. {CARD.motto}.
        </p>
      </div>
    </ErrorBoundary>
  );
}
