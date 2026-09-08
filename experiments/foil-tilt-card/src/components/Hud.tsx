import { CARD, type Face } from '../card';

interface Props {
  foil: number;
  tilt: number;
  spread: number;
  face: Face;
  sway: boolean;
  reducedMotion: boolean;
  onFoil: (value: number) => void;
  onTilt: (value: number) => void;
  onSpread: (value: number) => void;
  onFlip: () => void;
  onReset: () => void;
  onSway: (value: boolean) => void;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  digits,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  digits: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="inline-slider">
      <span>
        {label} {value.toFixed(digits)}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default function Hud({
  foil,
  tilt,
  spread,
  face,
  sway,
  reducedMotion,
  onFoil,
  onTilt,
  onSpread,
  onFlip,
  onReset,
  onSway,
}: Props) {
  return (
    <>
      <nav className="topbar" aria-label="Foil Tilt Card">
        <p className="brand">{CARD.brand}</p>
        <div className="top-groups">
          <p className="clock">{face === 'recto' ? 'recto · face' : 'verso · reverse'}</p>
          <button type="button" className="ghost compact" onClick={onFlip}>
            Flip card
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">{CARD.nameZh}</p>
        <h1>{CARD.name}</h1>
        <p className="lede">
          I painted a moon-fox on four runtime canvases — night field, subject,
          filigree, type — then stacked them with a view-tied foil. Drag to
          tilt. No Blender, no upstream skill, no borrowed character.
        </p>
      </header>

      <aside className="desk">
        <p className="panel-kicker">{CARD.grade}</p>
        <p className="panel-title">
          {CARD.name} · {CARD.number}
        </p>
        <p className="panel-copy">
          {CARD.motto}. Serial {CARD.serial}. The rainbow is a fresnel film I
          wrote, not a packed laser node tree.
        </p>
        <div className="sliders">
          <Slider
            label="Foil"
            value={foil}
            min={0}
            max={1.2}
            step={0.01}
            digits={2}
            onChange={onFoil}
          />
          <Slider
            label="Tilt feel"
            value={tilt}
            min={0.35}
            max={1.6}
            step={0.01}
            digits={2}
            onChange={onTilt}
          />
          <Slider
            label="Spread"
            value={spread}
            min={0.08}
            max={0.55}
            step={0.01}
            digits={2}
            onChange={onSpread}
          />
        </div>
        <div className="chips">
          <button type="button" className="ghost" onClick={onFlip}>
            {face === 'recto' ? 'Show verso' : 'Show recto'}
          </button>
          <button type="button" className="ghost" onClick={onReset}>
            Reset pose
          </button>
          <button
            type="button"
            className={sway && !reducedMotion ? 'active' : undefined}
            onClick={() => onSway(!sway)}
            disabled={reducedMotion}
          >
            {sway && !reducedMotion ? 'Sway on' : 'Sway off'}
          </button>
        </div>
      </aside>

      <p className="hint">
        Drag to tilt <span className="sep">·</span> Wheel zoom{' '}
        <span className="sep">·</span> F flip <span className="sep">·</span> R reset
      </p>
    </>
  );
}
