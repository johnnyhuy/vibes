import { FINISHES, type FinishId, type Hotspot, type HotspotId } from '../finishes';

interface Props {
  finishId: FinishId;
  muted: boolean;
  spinning: boolean;
  reducedMotion: boolean;
  hotspot: Hotspot | null;
  onFinish: (id: FinishId) => void;
  onMute: () => void;
  onSpinning: (value: boolean) => void;
  onCloseHotspot: () => void;
}

export default function Controls({
  finishId,
  muted,
  spinning,
  reducedMotion,
  hotspot,
  onFinish,
  onMute,
  onSpinning,
  onCloseHotspot,
}: Props) {
  return (
    <>
      <nav className="topbar" aria-label="Studio">
        <p className="brand">vibes · audio spin</p>
        <div className="top-groups">
          <div className="chips" role="group" aria-label="Finish">
            {FINISHES.map((finish) => (
              <button
                key={finish.id}
                type="button"
                className={finish.id === finishId ? 'active' : undefined}
                onClick={() => onFinish(finish.id)}
              >
                {finish.label}
              </button>
            ))}
          </div>
          <button type="button" className={`ghost compact ${muted ? 'active' : ''}`} onClick={onMute}>
            {muted ? 'Muted' : 'Sound on'}
          </button>
          <button
            type="button"
            className="ghost compact"
            onClick={() => onSpinning(!spinning)}
            disabled={reducedMotion}
          >
            {spinning && !reducedMotion ? 'Hold spin' : 'Auto-spin'}
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">環</p>
        <h1>Lumen Cuff</h1>
        <p className="lede">
          I built a turntable for a gadget I invented — a licensed over-ear
          mesh, three finishes, mute-default clicks. Not a brand storefront.
          Sound stays off until you ask.
        </p>
      </header>

      {hotspot ? (
        <aside className="dock" aria-live="polite">
          <button type="button" className="dock-close" onClick={onCloseHotspot} aria-label="Close hotspot">
            ×
          </button>
          <p className="dock-kicker">Hotspot</p>
          <h2>{hotspot.label}</h2>
          <p className="dock-copy">{hotspot.copy}</p>
        </aside>
      ) : null}

      <p className="hint">
        Drag to orbit
        <span className="sep">·</span>
        chips swap the finish
        <span className="sep">·</span>
        {muted ? 'mute is on by default' : 'oscillator clicks are live'}
      </p>
    </>
  );
}

export type { HotspotId };
