import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { InputState } from './types';

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

function namesFor(event: KeyboardEvent): string[] {
  return [event.key.toLowerCase(), event.code.toLowerCase()];
}

export function useRelayInput(): MutableRefObject<InputState> {
  const input = useRef<InputState>({
    left: false,
    right: false,
    eat: false,
    dash: false,
    confirm: false,
  });

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const names = namesFor(event);
      if (names.some((name) => name === 'a' || name === 'arrowleft' || name === 'keya')) {
        event.preventDefault();
        input.current.left = true;
      }
      if (names.some((name) => name === 'd' || name === 'arrowright' || name === 'keyd')) {
        event.preventDefault();
        input.current.right = true;
      }
      if (names.some((name) => name === ' ' || name === 'space')) {
        event.preventDefault();
        input.current.eat = true;
      }
      if (names.some((name) => name === 'shift' || name === 'shiftleft' || name === 'shiftright')) {
        event.preventDefault();
        input.current.dash = true;
      }
      if (names.some((name) => name === 'enter' || name === 'w' || name === 'arrowup')) {
        event.preventDefault();
        input.current.confirm = true;
      }
    };

    const up = (event: KeyboardEvent) => {
      const names = namesFor(event);
      if (names.some((name) => name === 'a' || name === 'arrowleft' || name === 'keya')) {
        input.current.left = false;
      }
      if (names.some((name) => name === 'd' || name === 'arrowright' || name === 'keyd')) {
        input.current.right = false;
      }
      if (names.some((name) => name === ' ' || name === 'space')) {
        input.current.eat = false;
      }
      if (names.some((name) => name === 'shift' || name === 'shiftleft' || name === 'shiftright')) {
        input.current.dash = false;
      }
      if (names.some((name) => name === 'enter' || name === 'w' || name === 'arrowup')) {
        input.current.confirm = false;
      }
    };

    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return input;
}
