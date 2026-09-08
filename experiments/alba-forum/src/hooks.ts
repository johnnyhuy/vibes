import { useEffect, useRef, useState } from 'react';

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

/** Native window scroll, 0 at the first stop → 1 at the last. */
export function useWindowScroll(onChange?: (offset: number) => void) {
  const offset = useRef(0);

  useEffect(() => {
    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? window.scrollY / max : 0;
      offset.current = next;
      onChange?.(next);
    };

    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, [onChange]);

  return offset;
}

export function scrollToStop(index: number, stopCount: number, instant: boolean) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0 || stopCount <= 1) return;
  const clamped = Math.min(stopCount - 1, Math.max(0, index));
  window.scrollTo({
    top: (clamped / (stopCount - 1)) * max,
    behavior: instant ? 'auto' : 'smooth',
  });
}
