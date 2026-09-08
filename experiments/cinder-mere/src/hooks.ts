import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { DriveInput } from './types';

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

function aliases(event: KeyboardEvent): string[] {
  return [event.key.toLowerCase(), event.code.toLowerCase()];
}

export function useDriveInput(): MutableRefObject<DriveInput> {
  const input = useRef<DriveInput>({
    throttle: 0,
    steer: 0,
    brake: false,
    padThrottle: 0,
    padSteer: 0,
  });
  const keys = useRef(new Set<string>());

  useEffect(() => {
    const apply = () => {
      const held = keys.current;
      const left = held.has('a') || held.has('arrowleft') || held.has('keya');
      const right = held.has('d') || held.has('arrowright') || held.has('keyd');
      const up = held.has('w') || held.has('arrowup') || held.has('keyw');
      const down = held.has('s') || held.has('arrowdown') || held.has('keys');
      input.current.steer = (right ? 1 : 0) - (left ? 1 : 0);
      input.current.throttle = (up ? 1 : 0) - (down ? 1 : 0);
      input.current.brake = held.has(' ') || held.has('space');
    };

    const down = (event: KeyboardEvent) => {
      aliases(event).forEach((name) => keys.current.add(name));
      if (
        ['a', 'd', 'w', 's', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'space'].includes(
          event.key.toLowerCase()
        )
      ) {
        event.preventDefault();
      }
      apply();
    };

    const up = (event: KeyboardEvent) => {
      aliases(event).forEach((name) => keys.current.delete(name));
      apply();
    };

    const blur = () => {
      keys.current.clear();
      apply();
    };

    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    document.addEventListener('keydown', down, { passive: false });
    document.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, []);

  return input;
}
