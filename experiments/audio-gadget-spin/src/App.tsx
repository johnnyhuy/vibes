import { useCallback, useEffect, useRef, useState } from 'react';
import { playCue, setMuted } from './audio';
import Controls from './components/Controls';
import { ErrorBoundary } from './components/ErrorBoundary';
import Scene from './components/Scene';
import { FINISHES, finishById, hotspotById, type FinishId, type HotspotId } from './finishes';
import { usePrefersReducedMotion } from './hooks';

export default function App() {
  const [finishId, setFinishId] = useState<FinishId>('studio');
  const [highlight, setHighlight] = useState<HotspotId | null>(null);
  const [muted, setMutedState] = useState(true);
  const [autoSpin, setAutoSpin] = useState(true);
  const [held, setHeld] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const heldRef = useRef(held);
  const resume = useRef<number>();
  const finish = finishById(finishId);
  const hotspot = highlight ? hotspotById(highlight) : null;
  const spinning = autoSpin && !reducedMotion && !held;

  heldRef.current = held;

  useEffect(() => {
    if (reducedMotion) {
      setAutoSpin(false);
      setHeld(true);
    }
  }, [reducedMotion]);

  useEffect(() => () => window.clearTimeout(resume.current), []);

  const chooseFinish = useCallback((id: FinishId) => {
    setFinishId(id);
    playCue('whoosh');
  }, []);

  const chooseHotspot = useCallback((id: HotspotId) => {
    setHighlight((current) => (current === id ? null : id));
    playCue('click');
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    void setMuted(next).then(() => {
      setMutedState(next);
      if (!next) playCue('click');
    });
  }, [muted]);

  const handleUserOrbit = useCallback(() => {
    window.clearTimeout(resume.current);
    setAutoSpin(false);
    resume.current = window.setTimeout(() => {
      if (!heldRef.current) setAutoSpin(true);
    }, 2200);
  }, []);

  return (
    <ErrorBoundary>
      <div className="app">
        <Scene
          finish={finish}
          highlight={highlight}
          autoSpin={spinning}
          onHotspot={chooseHotspot}
          onUserOrbit={handleUserOrbit}
        />
        <Controls
          finishId={finishId}
          muted={muted}
          spinning={spinning}
          reducedMotion={reducedMotion}
          hotspot={hotspot}
          onFinish={chooseFinish}
          onMute={toggleMute}
          onSpinning={(value) => {
            window.clearTimeout(resume.current);
            setHeld(!value);
            setAutoSpin(value);
          }}
          onCloseHotspot={() => setHighlight(null)}
        />
        <p className="sr-only">
          {FINISHES.length} finishes. Mute defaults on.
        </p>
      </div>
    </ErrorBoundary>
  );
}
