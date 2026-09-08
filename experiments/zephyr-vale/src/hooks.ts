import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { InputState, PlayerState } from './types';

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

export function createPlayer(): PlayerState {
  return {
    x: -0.6,
    y: 0,
    z: 1.45,
    yaw: 0,
    lookYaw: 0.18,
    lookPitch: 0.08,
    speed: 0,
    sprinting: false,
    stance: 'idle',
    gathered: [],
    lastSlip: null,
  };
}

export function useValeInput(): MutableRefObject<InputState> {
  const input = useRef<InputState>({
    x: 0,
    z: 0,
    sprint: false,
    padX: 0,
    padZ: 0,
    padSprint: false,
    lookLocked: false,
  });
  const keys = useRef(new Set<string>());

  useEffect(() => {
    const apply = () => {
      const held = keys.current;
      const left = held.has('a') || held.has('arrowleft') || held.has('keya');
      const right = held.has('d') || held.has('arrowright') || held.has('keyd');
      const up = held.has('w') || held.has('arrowup') || held.has('keyw');
      const downKey = held.has('s') || held.has('arrowdown') || held.has('keys');
      input.current.x = (right ? 1 : 0) - (left ? 1 : 0);
      input.current.z = (downKey ? 1 : 0) - (up ? 1 : 0);
      input.current.sprint = held.has('shift') || held.has('shiftleft') || held.has('shiftright');
    };

    const down = (event: KeyboardEvent) => {
      aliases(event).forEach((name) => keys.current.add(name));
      if (
        ['a', 'd', 'w', 's', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'keya', 'keyd', 'keyw', 'keys', 'shift', 'shiftleft', 'shiftright'].some(
          (name) => aliases(event).includes(name)
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
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  return input;
}
