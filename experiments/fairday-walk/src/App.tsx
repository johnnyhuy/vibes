import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { scrollToStop, usePrefersReducedMotion, useWindowScroll } from './hooks';
import { BRAND, STOPS, stopIndexFromOffset } from './itinerary';
import { resolveLook, type LookId } from './looks';

export default function App() {
  const [index, setIndex] = useState(0);
  const [exploring, setExploring] = useState(false);
  const [lookId, setLookId] = useState<LookId>('folio');
  const [haze, setHaze] = useState(0.18);
  const [recast, setRecast] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const look = useMemo(() => resolveLook(lookId, haze), [haze, lookId]);

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

  const onRecast = useCallback(() => {
    if (exploring) {
      setRecast((value) => value + 1);
      return;
    }
    scrollToStop(index, STOPS.length, reducedMotion);
  }, [exploring, index, reducedMotion]);

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
      if ((event.target as HTMLElement | null)?.closest?.('.topbar, .meter, .ticks, .dock, .pills, .haze')) return;
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
      if (key === 'o' || key === 'e') {
        event.preventDefault();
        setExploring((current) => !current);
        return;
      }
      if (key === 'r') {
        event.preventDefault();
        onRecast();
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
  }, [exploring, goTo, index, onRecast]);

  return (
    <ErrorBoundary>
      <div className={`app ${exploring ? 'exploring' : ''}`}>
        <Scene
          offset={offset}
          stop={stop}
          exploring={exploring}
          reducedMotion={reducedMotion}
          look={look}
          recast={recast}
          onRecast={onRecast}
        />
        <Hud
          stop={stop}
          index={index}
          exploring={exploring}
          lookId={lookId}
          haze={haze}
          onExplore={onExplore}
          onStep={goTo}
          onLook={setLookId}
          onHaze={setHaze}
          onRecast={onRecast}
        />
        <div className="page" aria-hidden={exploring}>
          {STOPS.map((item) => (
            <section key={item.id} id={item.id} className="stop-spacer">
              <h2 className="sr-only">{item.name}</h2>
              <p className="sr-only">{item.caption}</p>
            </section>
          ))}
        </div>
        <p className="sr-only">
          {BRAND.lockup}. {BRAND.slip}. {stop.name}. {exploring ? 'Orbit.' : 'Folio walk.'}
        </p>
      </div>
    </ErrorBoundary>
  );
}
