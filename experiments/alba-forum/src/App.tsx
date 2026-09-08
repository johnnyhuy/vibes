import { useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { scrollToStop, usePrefersReducedMotion, useWindowScroll } from './hooks';
import { BRAND, STOPS, stopIndexFromOffset } from './itinerary';

export default function App() {
  const [index, setIndex] = useState(0);
  const [exploring, setExploring] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const onScroll = useCallback((offset: number) => {
    setIndex(stopIndexFromOffset(offset));
  }, []);

  const offset = useWindowScroll(onScroll);
  const stop = STOPS[index];

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(STOPS.length - 1, Math.max(0, next));
      setIndex(clamped);
      scrollToStop(clamped, STOPS.length, reducedMotion);
    },
    [reducedMotion]
  );

  const onExplore = useCallback((next: boolean) => {
    setExploring(next);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-explore', exploring);
    document.body.classList.toggle('is-explore', exploring);
    return () => {
      document.documentElement.classList.remove('is-explore');
      document.body.classList.remove('is-explore');
    };
  }, [exploring]);

  useEffect(() => {
    if (!exploring) return undefined;
    const block = (event: WheelEvent) => {
      if ((event.target as HTMLElement | null)?.closest?.('.topbar, .meter, .ticks')) return;
      event.preventDefault();
    };
    window.addEventListener('wheel', block, { passive: false });
    return () => window.removeEventListener('wheel', block);
  }, [exploring]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      const key = event.key.toLowerCase();
      if (event.key === 'Escape' && exploring) {
        event.preventDefault();
        setExploring(false);
        return;
      }
      if (key === 'e') {
        event.preventDefault();
        setExploring((current) => !current);
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || key === ']') {
        event.preventDefault();
        goTo(index + 1);
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp' || key === '[') {
        event.preventDefault();
        goTo(index - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exploring, goTo, index]);

  return (
    <ErrorBoundary>
      <div className={`app ${exploring ? 'exploring' : ''}`}>
        <Scene offset={offset} stop={stop} exploring={exploring} reducedMotion={reducedMotion} />
        <Hud stop={stop} index={index} exploring={exploring} onExplore={onExplore} onStep={goTo} />
        <div className="page" aria-hidden={exploring}>
          {STOPS.map((item) => (
            <section key={item.id} id={item.id} className="stop-spacer">
              <h2 className="sr-only">{item.name}</h2>
              <p className="sr-only">{item.caption}</p>
            </section>
          ))}
        </div>
        <p className="sr-only">
          {BRAND.lockup}. {stop.name}. {exploring ? 'Explore orbit.' : 'Scroll itinerary.'}
        </p>
      </div>
    </ErrorBoundary>
  );
}
