import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';

export type Steer = { x: number; z: number };

const CODE_TO_ALIAS: Record<string, string> = {
  keyw: 'w',
  keya: 'a',
  keys: 's',
  keyd: 'd',
  arrowup: 'arrowup',
  arrowdown: 'arrowdown',
  arrowleft: 'arrowleft',
  arrowright: 'arrowright'
};

function aliasesFor(event: KeyboardEvent): string[] {
  const key = event.key.toLowerCase();
  const code = event.code.toLowerCase();
  const mapped = CODE_TO_ALIAS[code];
  return [key, code, mapped].filter((value): value is string => Boolean(value));
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

function composeSteer(keys: Set<string>, pad: Steer): Steer {
  let x = pad.x;
  let z = pad.z;
  if (keys.has('a') || keys.has('arrowleft')) x -= 1;
  if (keys.has('d') || keys.has('arrowright')) x += 1;
  if (keys.has('w') || keys.has('arrowup')) z -= 1;
  if (keys.has('s') || keys.has('arrowdown')) z += 1;
  return { x, z };
}

export function useSteerInput(): {
  steer: MutableRefObject<Steer>;
  setPad: (axis: 'x' | 'z', value: number) => void;
} {
  const steer = useRef<Steer>({ x: 0, z: 0 });
  const keys = useRef(new Set<string>());
  const pad = useRef<Steer>({ x: 0, z: 0 });

  const write = useCallback(() => {
    steer.current = composeSteer(keys.current, pad.current);
  }, []);

  const setPad = useCallback(
    (axis: 'x' | 'z', value: number) => {
      pad.current = { ...pad.current, [axis]: value };
      write();
    },
    [write]
  );

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      aliasesFor(event).forEach((alias) => keys.current.add(alias));
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
      write();
    };
    const up = (event: KeyboardEvent) => {
      aliasesFor(event).forEach((alias) => keys.current.delete(alias));
      write();
    };
    const blur = () => {
      keys.current.clear();
      write();
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
  }, [write]);

  return { steer, setPad };
}
