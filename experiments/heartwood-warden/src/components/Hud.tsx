import { CASTS, type CastId } from '../casts';
import { buildWardSnippet } from '../snippet';
import type { Stance } from '../types';

interface Props {
  stance: Stance;
  lastCast: CastId | null;
  sprinting: boolean;
  copied: boolean;
  sourceOpen: boolean;
  onCast: (id: CastId) => void;
  onCopy: () => void;
  onSource: (open: boolean) => void;
  onPad: (axis: 'x' | 'z', value: number) => void;
  onSprint: (held: boolean) => void;
}

function PadButton({
  children,
  onHold,
}: {
  children: string;
  onHold: (held: boolean) => void;
}) {
  return (
    <button
      type="button"
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        onHold(true);
      }}
      onPointerUp={() => onHold(false)}
      onPointerCancel={() => onHold(false)}
    >
      {children}
    </button>
  );
}

export default function Hud({
  stance,
  lastCast,
  sprinting,
  copied,
  sourceOpen,
  onCast,
  onCopy,
  onSource,
  onPad,
  onSprint,
}: Props) {
  const active = CASTS.find((cast) => cast.id === lastCast);

  return (
    <>
      <nav className="topbar" aria-label="Heartwood Warden">
        <p className="brand">vibes · heartwood warden</p>
        <div className="top-groups">
          <p className="stance">{sprinting && stance !== 'idle' ? 'sprint' : stance}</p>
          <button
            type="button"
            className="ghost compact"
            onClick={() => onSource(!sourceOpen)}
          >
            {sourceOpen ? 'Hide ward snippet' : 'Show ward snippet'}
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">心木守</p>
        <h1>Heartwood Warden</h1>
        <p className="lede">
          I raised a moss-bound shrine guardian from primitives — bark plates,
          a resin heart, lantern spirits. A mesh is only the start; the glade
          is the experience. Walk it. Cast.
        </p>
      </header>

      <aside className="desk" aria-label="Ward casts">
        <p className="panel-kicker">Cast</p>
        <p className="panel-title">{active?.label ?? 'Still wood'}</p>
        <p className="panel-copy">
          {active?.copy ?? 'Number keys layer a ward I invented. The snippet is generated from this stance, not imported.'}
        </p>
        <div className="chips" role="group" aria-label="Casts">
          {CASTS.map((cast) => (
            <button
              key={cast.id}
              type="button"
              className={cast.id === lastCast ? 'active' : undefined}
              onClick={() => onCast(cast.id)}
            >
              {cast.key} {cast.label}
            </button>
          ))}
        </div>
        {sourceOpen && (
          <>
            <pre className="snippet">{buildWardSnippet({ stance, lastCast })}</pre>
            <button type="button" className="copy" onClick={onCopy}>
              {copied ? 'Copied ward snippet' : 'Copy ward snippet'}
            </button>
          </>
        )}
      </aside>

      <p className="hint">
        WASD or arrows walk
        <span className="sep">·</span>
        Shift sprints
        <span className="sep">·</span>
        1–0 cast
      </p>

      <div className="pad" aria-label="Move">
        <PadButton onHold={(held) => onPad('z', held ? -1 : 0)}>↑</PadButton>
        <div className="pad-row">
          <PadButton onHold={(held) => onPad('x', held ? -1 : 0)}>←</PadButton>
          <PadButton onHold={(held) => onPad('z', held ? 1 : 0)}>↓</PadButton>
          <PadButton onHold={(held) => onPad('x', held ? 1 : 0)}>→</PadButton>
        </div>
        <PadButton onHold={onSprint}>⇧</PadButton>
      </div>

      <p className="sr-only">
        Heartwood Warden. Stance {stance}. {active ? `Last cast ${active.label}.` : 'No cast yet.'}
      </p>
    </>
  );
}
