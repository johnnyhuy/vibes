import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { CAST_BY_KEY, type CastId } from './casts';
import type { CastEvent, InputState, PlayerState } from './types';

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
    x: 0,
    y: 0,
    z: 2.2,
    yaw: 0,
    speed: 0,
    sprinting: false,
    stance: 'idle',
    lastCast: null,
    lanternPull: 0,
  };
}

export function useGladeInput(onCast: (id: CastId) => void): MutableRefObject<InputState> {
  const input = useRef<InputState>({
    x: 0,
    z: 0,
    sprint: false,
    padX: 0,
    padZ: 0,
    padSprint: false,
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
      const names = aliases(event);
      names.forEach((name) => keys.current.add(name));
      if (
        names.some((name) =>
          ['a', 'd', 'w', 's', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'keya', 'keyd', 'keyw', 'keys', 'shift', 'shiftleft', 'shiftright'].includes(name)
        )
      ) {
        event.preventDefault();
      }
      const digit = event.key;
      if (digit in CAST_BY_KEY && !event.repeat) {
        event.preventDefault();
        onCast(CAST_BY_KEY[digit]);
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
  }, [onCast]);

  return input;
}

export function nextCastEvent(player: PlayerState, id: CastId, token: number): CastEvent {
  return {
    token,
    id,
    x: player.x,
    z: player.z,
    yaw: player.yaw,
    startedAt: performance.now(),
  };
}
