import { useCallback, useEffect, useState } from 'react';
import { playCue, setMuted } from './audio';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import { DINERS } from './diners';
import { usePrefersReducedMotion, useRelayInput } from './hooks';
import type { HudSnapshot, Phase } from './types';

const emptyHud: HudSnapshot = {
  phase: 'select',
  selectedId: DINERS[0].id,
  countdown: 3,
  remaining: 55,
  muted: true,
  player: null,
  rivals: [],
  roster: [],
  status: 'clear',
  lastBite: 'Walk the rim. Eat when a plate lines up.',
};

export default function App() {
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedId, setSelectedId] = useState(DINERS[0].id);
  const [resetToken, setResetToken] = useState(0);
  const [muted, setMutedState] = useState(true);
  const [hud, setHud] = useState<HudSnapshot>(emptyHud);
  const reducedMotion = usePrefersReducedMotion();
  const input = useRelayInput();

  const handleHud = useCallback((snapshot: HudSnapshot) => {
    setHud(snapshot);
  }, []);

  const start = useCallback(() => {
    setPhase('countdown');
    playCue('bell');
  }, []);

  const again = useCallback(() => {
    setResetToken((value) => value + 1);
    setPhase('countdown');
  }, []);

  const seat = useCallback(() => {
    setResetToken((value) => value + 1);
    setPhase('select');
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    void setMuted(next).then(() => {
      setMutedState(next);
      if (!next) playCue('eat');
    });
  }, [muted]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'm') {
        event.preventDefault();
        toggleMute();
      }
      if (key === 'r' && phase === 'results') again();
      if ((key === 'enter' || key === ' ') && phase === 'select') {
        event.preventDefault();
        start();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [again, phase, start, toggleMute]);

  return (
    <ErrorBoundary>
      <div className="app" tabIndex={0}>
        <Scene
          phase={phase}
          selectedId={selectedId}
          reducedMotion={reducedMotion}
          input={input}
          onHud={handleHud}
          onPhase={setPhase}
          onSelect={setSelectedId}
          resetToken={resetToken}
        />
        <Hud
          hud={{ ...hud, phase, selectedId }}
          muted={muted}
          onSelect={setSelectedId}
          onStart={start}
          onAgain={again}
          onSeat={seat}
          onMute={toggleMute}
        />
      </div>
    </ErrorBoundary>
  );
}
