import { formatDistance } from '../flight';
import type { HudSnapshot } from '../types';

interface Props {
  hud: HudSnapshot;
  onReset: () => void;
  onNudge: (delta: number) => void;
  onStart: () => void;
}

export default function Hud({ hud, onReset, onNudge, onStart }: Props) {
  return (
    <>
      {hud.state !== 'flying' && (
        <nav className="topbar" aria-label="Flight">
          <p className="brand">vibes · amber longeron</p>
          <div className="top-groups">
            {hud.best > 0 && <p className="motes">best {formatDistance(hud.best)}</p>}
            <button type="button" className="ghost compact" onClick={onReset}>
              Reset
            </button>
          </div>
        </nav>
      )}

      {hud.state === 'flying' && (
        <p className="score" aria-label="Distance">
          {formatDistance(hud.distance)}
          {hud.rings > 0 ? ` · ${hud.rings}` : ''}
        </p>
      )}

      {hud.state === 'ready' && (
        <section className="editorial">
          <p className="kicker">桁</p>
          <h1>Amber Longeron</h1>
          <p className="lede">
            A shop-built spar I drew in code. Toy wood, tan studio, carnelian orbs. Not their vintage
            biplane site.
          </p>
        </section>
      )}

      {hud.state === 'crashed' && (
        <aside className="meter crash-card">
          <p className="panel-kicker">Kiln Run</p>
          <p className="percent">You flew {formatDistance(hud.distance)}</p>
          <p className="panel-copy">
            {hud.rings} rings. R or Reset puts the longeron back on the centre line.
          </p>
          <button type="button" className="ghost" onClick={onReset}>
            Fly again
          </button>
        </aside>
      )}

      {hud.state === 'ready' && (
        <aside className="meter">
          <p className="panel-kicker">Kiln Run</p>
          <p className="percent">Take off when you are ready</p>
          <p className="panel-copy">Three lanes. Red orbs are solid. Bronze rings are a count I invented.</p>
          <button type="button" className="ghost" onClick={onStart}>
            Take off
          </button>
        </aside>
      )}

      {hud.state !== 'flying' && (
        <div className="pad" aria-label="Steer">
          <div className="pad-row">
            <button
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                onNudge(-1);
              }}
            >
              ←
            </button>
            <button
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                onStart();
              }}
            >
              ↑
            </button>
            <button
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                onNudge(1);
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
