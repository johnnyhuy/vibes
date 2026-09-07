import { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Hud from './components/Hud';
import Scene from './components/Scene';
import type { CastId } from './casts';
import { createPlayer, nextCastEvent, useGladeInput, usePrefersReducedMotion } from './hooks';
import { copyWardSnippet } from './snippet';
import type { CastEvent, Stance } from './types';

export default function App() {
  const player = useRef(createPlayer());
  const casts = useRef<CastEvent[]>([]);
  const token = useRef(1);
  const [stance, setStance] = useState<Stance>('idle');
  const [lastCast, setLastCast] = useState<CastId | null>(null);
  const [sprinting, setSprinting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const fireCast = useCallback((id: CastId) => {
    const event = nextCastEvent(player.current, id, token.current);
    token.current += 1;
    player.current.lastCast = id;
    if (id === 'lantern-call') player.current.lanternPull = 1;
    casts.current.push(event);
    setLastCast(id);
  }, []);

  const input = useGladeInput(fireCast);

  const onPad = useCallback(
    (axis: 'x' | 'z', value: number) => {
      if (axis === 'x') input.current.padX = value;
      else input.current.padZ = value;
    },
    [input]
  );

  const onSprint = useCallback(
    (held: boolean) => {
      input.current.padSprint = held;
    },
    [input]
  );

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setStance(player.current.stance);
      setSprinting(player.current.sprinting);
      setLastCast(player.current.lastCast);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!copied && !copyError) return undefined;
    const id = window.setTimeout(() => {
      setCopied(false);
      setCopyError(null);
    }, 1800);
    return () => window.clearTimeout(id);
  }, [copied, copyError]);

  const handleCopy = useCallback(() => {
    void copyWardSnippet({ stance, lastCast })
      .then(() => {
        setCopyError(null);
        setCopied(true);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Copy failed.';
        console.error('Heartwood Warden copy failed', error);
        setCopied(false);
        setCopyError(message);
      });
  }, [lastCast, stance]);

  return (
    <ErrorBoundary>
      <div className="app" tabIndex={0}>
        <Scene player={player} input={input} casts={casts} reducedMotion={reducedMotion} />
        <Hud
          stance={stance}
          lastCast={lastCast}
          sprinting={sprinting}
          copied={copied}
          sourceOpen={sourceOpen}
          onCast={fireCast}
          onCopy={handleCopy}
          onSource={setSourceOpen}
          onPad={onPad}
          onSprint={onSprint}
        />
        <p className="sr-only">
          {copyError ? `Copy error: ${copyError}` : ''}
        </p>
      </div>
    </ErrorBoundary>
  );
}
