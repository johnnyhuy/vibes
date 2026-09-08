import { BRAND, STOPS, type Stop } from '../itinerary';
import { LOOKS, type LookId } from '../looks';

interface Props {
  stop: Stop;
  index: number;
  exploring: boolean;
  lookId: LookId;
  haze: number;
  onExplore: (next: boolean) => void;
  onStep: (index: number) => void;
  onLook: (id: LookId) => void;
  onHaze: (value: number) => void;
  onRecast: () => void;
}

export default function Hud({
  stop,
  index,
  exploring,
  lookId,
  haze,
  onExplore,
  onStep,
  onLook,
  onHaze,
  onRecast,
}: Props) {
  const total = STOPS.length;
  const label = String(index + 1).padStart(2, '0');

  return (
    <>
      <nav className="topbar" aria-label="Fairday Walk">
        <p className="brand">{BRAND.lockup}</p>
        <div className="top-groups">
          <p className="stance">
            {BRAND.slip} · {label} / {String(total).padStart(2, '0')}
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
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">{BRAND.placeZh}</p>
        <h1>{BRAND.place}</h1>
        <p className="lede">
          A breezy lane I invented. Folio walks the stops. Orbit inspects. Recast returns the pose.
        </p>
      </header>

      <aside className="meter" aria-label="Current place">
        <p className="panel-kicker">{stop.kicker}</p>
        <p className="landmark">{stop.name}</p>
        <p className="caption">{stop.caption}</p>
        <p className="panel-kicker haze-label">Line haze</p>
        <input
          className="haze"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={haze}
          onChange={(event) => onHaze(Number(event.target.value))}
          aria-label="Line haze"
        />
        <p className="haze-ticks">
          <span>Sheet</span>
          <span>Drift</span>
          <span>Mist</span>
        </p>
        <div className="chips looks">
          {LOOKS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === lookId ? 'active' : undefined}
              onClick={() => onLook(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </aside>

      <div className="dock">
        <div className="pills" aria-label="Modes">
          <button type="button" className={!exploring ? 'active' : undefined} onClick={() => onExplore(false)}>
            Folio
          </button>
          <button type="button" className={exploring ? 'active' : undefined} onClick={() => onExplore(true)}>
            Orbit
          </button>
          <button type="button" onClick={onRecast}>
            Recast
          </button>
        </div>
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
      </div>

      <p className="hint">
        {exploring ? (
          <>
            drag to orbit
            <span className="sep">·</span>
            wheel zoom
            <span className="sep">·</span>
            double-click Recast
          </>
        ) : (
          <>
            scroll the folio
            <span className="sep">·</span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> step
            <span className="sep">·</span>
            <kbd>O</kbd> orbit
          </>
        )}
      </p>
    </>
  );
}
