import { useCallback, useEffect, useState } from 'react';
import { isMuted, setMuted } from './audio';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { usePrefersReducedMotion } from './hooks';
import { cycleLook, resolveLook } from './look';
import { MARKS, markById, nextMarkId } from './marks';
import type { LookName } from './types';

export default function App() {
  const [look, setLook] = useState<LookName>('dusk');
  const [markId, setMarkId] = useState(MARKS[0].id);
  const [muted, setMutedState] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const mark = markById(markId);
  const resolved = resolveLook(look);

  const onMute = useCallback(() => {
    const next = !isMuted();
    void setMuted(next).then(() => setMutedState(next));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      const key = event.key.toLowerCase();
      if (key === '1' || key === '2' || key === '3') {
        event.preventDefault();
        const next = MARKS[Number(key) - 1];
        if (next) setMarkId(next.id);
        return;
      }
      if (key === 't') {
        event.preventDefault();
        setLook((current) => cycleLook(current));
        return;
      }
      if (key === 'm') {
        event.preventDefault();
        onMute();
        return;
      }
      if (key === ']' || event.key === 'ArrowRight') {
        event.preventDefault();
        setMarkId((current) => nextMarkId(current));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onMute]);

  return (
    <ErrorBoundary>
      <div className="app">
        <Scene look={resolved} mark={mark} reducedMotion={reducedMotion} />
        <Hud mark={mark} look={look} muted={muted} onMark={setMarkId} onLook={setLook} onMute={onMute} />
      </div>
    </ErrorBoundary>
  );
}
