import { formatDistance } from '../flight';
import type { HudSnapshot } from '../types';

interface Props {
  hud: HudSnapshot;
  onReset: () => void;
  onStart: () => void;
}

export default function Hud({ hud, onReset, onStart }: Props) {
  return (
    <>
      {hud.state === 'ready' && <header className="flight-intro"><p className="kicker">Flight study / 01</p><h1>Amber Longeron</h1><p>Steer between the red orbs. Use A / D, arrow keys, or swipe to change lanes.</p><button type="button" onClick={onStart}>Start flight</button></header>}
      {hud.state === 'flying' && (
        <p className="score" aria-label="Distance">
          {formatDistance(hud.distance)}
        </p>
      )}

      {hud.state === 'crashed' && (
        <aside className="meter crash-card">
          <p className="panel-kicker">Kiln Run</p>
          <p className="percent">{formatDistance(hud.distance)}</p>
          <p className="panel-copy">R puts the longeron back on the centre line.</p>
          <button type="button" className="ghost" onClick={onReset}>
            Fly again
          </button>
        </aside>
      )}

      <p className="sr-only">
        Amber Longeron. A and D or swipe change lane. R resets. Red orbs are solid.
      </p>
    </>
  );
}
