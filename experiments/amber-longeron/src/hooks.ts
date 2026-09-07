import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';

export interface Steer {
  laneDelta: number;
  start: boolean;
}

function aliasesFor(event: KeyboardEvent): string[] {
  const key = event.key.toLowerCase();
  const code = event.code.toLowerCase();
  return [key, code];
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return reduced;
}

export function useFlightInput(): {
  steer: MutableRefObject<Steer>;
  nudgeLane: (delta: number) => void;
  consumeLane: () => number;
  consumeStart: () => boolean;
} {
  const steer = useRef<Steer>({ laneDelta: 0, start: false });
  const pad = useRef(0);

  const nudgeLane = useCallback((delta: number) => {
    steer.current.laneDelta += delta;
  }, []);

  const consumeLane = useCallback(() => {
    const value = steer.current.laneDelta + pad.current;
    steer.current.laneDelta = 0;
    pad.current = 0;
    if (value > 0.4) return 1;
    if (value < -0.4) return -1;
    return 0;
  }, []);

  const consumeStart = useCallback(() => {
    if (!steer.current.start) return false;
    steer.current.start = false;
    return true;
  }, []);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const names = aliasesFor(event);
      if (names.some((name) => name === 'a' || name === 'arrowleft' || name === 'keya')) {
        event.preventDefault();
        steer.current.laneDelta -= 1;
      }
      if (names.some((name) => name === 'd' || name === 'arrowright' || name === 'keyd')) {
        event.preventDefault();
        steer.current.laneDelta += 1;
      }
      if (names.some((name) => name === ' ' || name === 'space' || name === 'enter' || name === 'w' || name === 'arrowup')) {
        event.preventDefault();
        steer.current.start = true;
      }
    };

    window.addEventListener('keydown', down, { passive: false });
    return () => window.removeEventListener('keydown', down);
  }, []);

  return { steer, nudgeLane, consumeLane, consumeStart };
}
