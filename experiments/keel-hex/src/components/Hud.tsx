import { BRAND, MODES, SPEEDS, STEPS } from '../catalog';
import type { ModeInfo, SpeedId, StepInfo, Toggles, ViewMode } from '../types';

interface Props {
  mode: ModeInfo;
  step: StepInfo;
  explode: number;
  playing: boolean;
  speed: SpeedId;
  toggles: Toggles;
  reducedMotion: boolean;
  onMode: (id: ViewMode) => void;
  onExplode: (value: number) => void;
  onPlay: () => void;
  onSpeed: (value: SpeedId) => void;
  onToggle: (key: keyof Toggles, value: boolean) => void;
}

export default function Hud({
  mode,
  step,
  explode,
  playing,
  speed,
  toggles,
  reducedMotion,
  onMode,
  onExplode,
  onPlay,
  onSpeed,
  onToggle,
}: Props) {
  return (
    <>
      <nav className="topbar" aria-label="Keel Hex">
        <p className="brand">{BRAND.lockup}</p>
        <div className="top-groups">
          <p className="stance">
            {BRAND.chassis} · {BRAND.chassisName}
          </p>
          <p className="chip">{BRAND.chip}</p>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">{BRAND.nameZh}</p>
        <h1>{BRAND.title}</h1>
        <p className="lede">{BRAND.lede}</p>
        <button type="button" className="cta" onClick={onPlay} disabled={reducedMotion}>
          {playing && !reducedMotion ? BRAND.ctaStop : BRAND.cta}
        </button>
        <p className="stats">
          <span>{BRAND.statA}</span>
          <span>{BRAND.statB}</span>
        </p>
      </header>

      <aside className="dock" aria-label="Bench modes">
        <p className="panel-kicker">{BRAND.panel}</p>
        <p className="panel-title">
          {mode.index} {mode.name}
        </p>
        <p className="panel-copy">{playing ? `${step.nameZh} · ${step.copy}` : mode.copy}</p>
        <div className="modes" role="tablist" aria-label="Bench modes">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode.id === item.id}
              className={mode.id === item.id ? 'active' : undefined}
              onClick={() => onMode(item.id)}
            >
              <span>{item.index}</span>
              {item.name}
            </button>
          ))}
        </div>
        <label className={`scrub ${mode.id === 'exploded' ? '' : 'dim'}`}>
          <span>Explode distance</span>
          <strong>{Math.round(explode * 100)}%</strong>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(explode * 100)}
            disabled={mode.id !== 'exploded'}
            onChange={(event) => onExplode(Number(event.target.value) / 100)}
          />
        </label>
        <div className="toggles">
          <Toggle label="Labels" checked={toggles.labels} onChange={(value) => onToggle('labels', value)} />
          <Toggle
            label="Auto rotate"
            checked={toggles.orbit && !reducedMotion}
            disabled={reducedMotion}
            onChange={(value) => onToggle('orbit', value)}
          />
          <Toggle label="Petals" checked={toggles.petals} onChange={(value) => onToggle('petals', value)} />
          <Toggle label="Loom" checked={toggles.loom} onChange={(value) => onToggle('loom', value)} />
          <Toggle label="Tide vane" checked={toggles.tide} onChange={(value) => onToggle('tide', value)} />
          <Toggle label="Sight bead" checked={toggles.sight} onChange={(value) => onToggle('sight', value)} />
        </div>
        {playing && (
          <p className="walk-line">
            Walking {String(step.id).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')} · {step.name}
          </p>
        )}
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
        </div>
      </aside>

      <p className="hint">
        <kbd>1</kbd>
        <kbd>2</kbd>
        <kbd>3</kbd>
        modes
        <span className="sep">·</span>
        <kbd>Space</kbd> play
        <span className="sep">·</span>
        drag orbit
      </p>
    </>
  );
}

function Toggle({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}
