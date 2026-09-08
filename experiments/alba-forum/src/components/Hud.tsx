import { BRAND, STOPS, type Stop } from '../itinerary';

interface Props {
  stop: Stop;
  index: number;
  exploring: boolean;
  onExplore: (next: boolean) => void;
  onStep: (index: number) => void;
}

export default function Hud({ stop, index, exploring, onExplore, onStep }: Props) {
  const total = STOPS.length;
  const label = String(index + 1).padStart(2, '0');

  return (
    <>
      <nav className="topbar" aria-label="Alba Forum">
        <p className="brand">{BRAND.lockup}</p>
        <div className="top-groups">
          <p className="stance">
            {label} / {String(total).padStart(2, '0')}
          </p>
          <div className="chips">
            <button type="button" onClick={() => onStep(index - 1)} disabled={index <= 0} aria-label="Previous stop">
              Prev
            </button>
            <button
              type="button"
              onClick={() => onStep(index + 1)}
              disabled={index >= total - 1}
              aria-label="Next stop"
            >
              Next
            </button>
          </div>
          <button
            type="button"
            className={`ghost compact ${exploring ? 'active' : ''}`}
            onClick={() => onExplore(!exploring)}
          >
            {exploring ? 'Leave' : 'Explore'}
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">{BRAND.placeZh}</p>
        <h1>{BRAND.place}</h1>
        <p className="lede">
          A chalk-city itinerary I invented. Scroll the avenue. Explore orbits the mesh in front of you.
        </p>
      </header>

      <aside className="meter" aria-label="Current landmark">
        <p className="panel-kicker">{stop.kicker}</p>
        <p className="landmark">{stop.name}</p>
        <p className="caption">{stop.caption}</p>
      </aside>

      <ol className="ticks" aria-label="Stops">
        {STOPS.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              className={i === index ? 'active' : undefined}
              onClick={() => onStep(i)}
              aria-current={i === index ? 'step' : undefined}
              aria-label={item.name}
            />
          </li>
        ))}
      </ol>

      <p className="hint">
        {exploring ? (
          <>
            drag to orbit
            <span className="sep">·</span>
            wheel zoom
            <span className="sep">·</span>
            <kbd>Esc</kbd> leave
          </>
        ) : (
          <>
            scroll the avenue
            <span className="sep">·</span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> step
            <span className="sep">·</span>
            <kbd>E</kbd> explore
          </>
        )}
      </p>
    </>
  );
}
