import { BRAND, SPEEDS, STEPS } from '../catalog';
import type { SpeedId, StepInfo } from '../types';

interface Props {
  step: StepInfo;
  playing: boolean;
  orbiting: boolean;
  speed: SpeedId;
  reducedMotion: boolean;
  onStep: (id: number) => void;
  onPlay: (value: boolean) => void;
  onReplay: () => void;
  onOrbit: (value: boolean) => void;
  onSpeed: (value: SpeedId) => void;
}

export default function Hud({
  step,
  playing,
  orbiting,
  speed,
  reducedMotion,
  onStep,
  onPlay,
  onReplay,
  onOrbit,
  onSpeed,
}: Props) {
  const max = STEPS.length;
  const complete = step.id >= max;
  const fraction = `${Math.round((step.id / max) * 100)}%`;

  return (
    <>
      <nav className="topbar" aria-label="Keel Hex">
        <p className="brand">{BRAND.lockup}</p>
        <div className="top-groups">
          <p className="stance">
            {BRAND.chassis} · {BRAND.chassisName}
          </p>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">{BRAND.nameZh}</p>
        <h1>{BRAND.name}</h1>
        <p className="lede">{BRAND.lede}</p>
      </header>

      <aside className="dock" aria-label="Bench marks">
        <div className="dock-head">
          <p className="panel-kicker">{complete ? 'Sealed' : BRAND.bench}</p>
          <p className="stance">
            {String(step.id).padStart(2, '0')} / {String(max).padStart(2, '0')}
            <span className="frac">{fraction}</span>
          </p>
        </div>
        <p className="panel-title">
          {step.nameZh} · {step.name}
        </p>
        <p className="panel-copy">{step.copy}</p>
        <label className="scrub">
          <span className="sr-only">Bench progress</span>
          <input
            type="range"
            min={1}
            max={max}
            step={1}
            value={step.id}
            onChange={(event) => onStep(Number(event.target.value))}
          />
        </label>
        <div className="chips">
          <button type="button" className="ghost" onClick={() => onStep(step.id - 1)} disabled={step.id <= 1}>
            Previous
          </button>
          <button type="button" className="ghost" onClick={() => onStep(step.id + 1)} disabled={step.id >= max}>
            Next
          </button>
          <button type="button" className="ghost" onClick={onReplay}>
            Replay
          </button>
          <button
            type="button"
            className={orbiting && !reducedMotion ? 'active' : undefined}
            onClick={() => onOrbit(!orbiting)}
            disabled={reducedMotion}
          >
            {orbiting && !reducedMotion ? 'Explore' : 'Hold'}
          </button>
        </div>
        <div className="chips second" aria-label="Pace">
          {SPEEDS.map((item) => (
            <button
              key={item}
              type="button"
              className={speed === item ? 'active' : undefined}
              onClick={() => onSpeed(item)}
            >
              {item}x
            </button>
          ))}
          <button
            type="button"
            className={playing && !reducedMotion ? 'active' : undefined}
            onClick={() => onPlay(!playing)}
            disabled={reducedMotion}
          >
            {playing && !reducedMotion ? 'Walking' : 'Walk'}
          </button>
        </div>
      </aside>

      <p className="hint">
        <kbd>←</kbd>
        <kbd>→</kbd>
        marks
        <span className="sep">·</span>
        <kbd>R</kbd> replay
        <span className="sep">·</span>
        drag orbit
      </p>
    </>
  );
}
