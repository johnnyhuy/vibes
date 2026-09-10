import { useCallback, useEffect, useRef, useState } from 'react';
import { playGlassPing, setMuted } from './audio';
import { CAPABILITIES, KEY_TO_ID, nextTourId, type CapabilityId } from './capabilities';
import Dock from './components/Dock';
import { ErrorBoundary } from './components/ErrorBoundary';
import LightingStrip from './components/LightingStrip';
import Scene from './components/Scene';
import { usePrefersReducedMotion } from './hooks';
import {
  DEFAULT_LIGHTING_ID,
  lightingById,
  nextLightingId,
  type LightingId,
} from './lighting';
import type { HudStats } from './types';

const IDLE_MS = 8000;
const TOUR_STEP_MS = 3600;

export default function App() {
  const [selectedId, setSelectedId] = useState<CapabilityId | null>(null);
  const [hoveredId, setHoveredId] = useState<CapabilityId | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [lightingId, setLightingId] = useState<LightingId>(DEFAULT_LIGHTING_ID);
  const [rippleNonce, setRippleNonce] = useState(0);
  const [muted, setMutedState] = useState(true);
  const [stats, setStats] = useState<HudStats>({
    fps: 0,
    triangles: 0,
    draws: 0,
    revision: '…',
  });
  const reducedMotion = usePrefersReducedMotion();
  const lastInteract = useRef(typeof performance === 'undefined' ? 0 : performance.now());
  const tourDriven = useRef(false);

  const bumpInteract = useCallback(() => {
    lastInteract.current = performance.now();
    tourDriven.current = false;
  }, []);

  const select = useCallback((id: CapabilityId) => {
    bumpInteract();
    setSelectedId(id);
  }, [bumpInteract]);

  const close = useCallback(() => {
    bumpInteract();
    setSelectedId(null);
  }, [bumpInteract]);

  const chooseLighting = useCallback(
    (id: LightingId) => {
      if (id === lightingId) return;
      bumpInteract();
      setLightingId(id);
      setRippleNonce((nonce) => nonce + 1);
      if (!muted && !reducedMotion) playGlassPing();
    },
    [bumpInteract, lightingId, muted, reducedMotion],
  );

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    void setMuted(next);
  }, [muted]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'l' || event.key === 'L') {
        chooseLighting(nextLightingId(lightingId));
        return;
      }
      const id = KEY_TO_ID[event.key];
      if (id) select(id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chooseLighting, close, lightingId, select]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = window.setInterval(() => {
      if (performance.now() - lastInteract.current < IDLE_MS) return;
      tourDriven.current = true;
      setSelectedId((current) => nextTourId(current));
    }, TOUR_STEP_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const fpsLabel = stats.fps > 0 ? Math.round(stats.fps) : '—';
  const trisLabel = stats.triangles.toLocaleString('en-AU');
  const lighting = lightingById(lightingId);

  return (
    <ErrorBoundary>
      <div className="app" data-lighting={lightingId}>
        <header className="header">
          <p className="brand">vibes · glass brain</p>
          <h1>Capability Map</h1>
          <p className="lede">
            An interactive map of what I practise in this kitchen sink. Every node is a live
            micro-demo or an honest stub — not a slide. Hover to inspect, click to open.
          </p>
        </header>

        <LightingStrip
          lightingId={lightingId}
          muted={muted}
          reducedMotion={reducedMotion}
          onLighting={chooseLighting}
          onMute={toggleMute}
        />

        <Scene
          selectedId={selectedId}
          hoveredId={hoveredId}
          lighting={lighting}
          rippleNonce={rippleNonce}
          reducedMotion={reducedMotion}
          onSelect={select}
          onHover={setHoveredId}
          onInteract={bumpInteract}
          onStats={setStats}
          onCanvas={setCanvas}
        />

        <Dock selectedId={selectedId} canvas={canvas} onClose={close} />

        <p className="controls">
          Drag to orbit
          <span className="sep">·</span>
          {CAPABILITIES.map((node) => (
            <kbd key={node.id}>{node.key}</kbd>
          ))}
          jump to a node
          <span className="sep">·</span>
          <kbd>Esc</kbd> back
          <span className="sep">·</span>
          <kbd>L</kbd> cycle tint
          <span className="sep">·</span>
          {reducedMotion ? 'tour paused (reduced motion)' : 'idle for 8s starts the tour'}
        </p>

        <p className="hud">
          {fpsLabel} fps · {trisLabel} tris · {stats.draws} draws · three r{stats.revision}
        </p>
      </div>
    </ErrorBoundary>
  );
}
