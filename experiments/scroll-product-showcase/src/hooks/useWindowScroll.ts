import { useEffect, useRef } from 'react';

/** Normalised window scroll (0 at top → 1 at bottom). Updated on scroll + resize. */
export function useWindowScroll() {
  const offset = useRef(0);

  useEffect(() => {
    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      offset.current = max > 0 ? window.scrollY / max : 0;
    };

    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, []);

  return offset;
}
