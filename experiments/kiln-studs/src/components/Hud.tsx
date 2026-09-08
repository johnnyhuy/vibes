import { BRAND, IDEAS, LOOKS, STEPS } from '../catalog';
import type { Idea, Look, StepInfo, ViewMode } from '../types';

interface Props {
  idea: Idea;
  look: Look;
  step: StepInfo;
  mode: ViewMode;
  playing: boolean;
  orbiting: boolean;
  reducedMotion: boolean;
  onIdea: (id: Idea['id']) => void;
  onLook: (id: Look['id']) => void;
  onMode: (mode: ViewMode) => void;
  onStep: (id: number) => void;
  onPlay: (value: boolean) => void;
  onOrbit: (value: boolean) => void;
}

export default function Hud({
  idea,
  look,
  step,
  mode,
  playing,
  orbiting,
  reducedMotion,
  onIdea,
  onLook,
  onMode,
  onStep,
  onPlay,
  onOrbit,
}: Props) {
  const max = STEPS.length;

  return (
    <>
      <nav className="topbar" aria-label="Kiln Studs">
        <p className="brand">{BRAND.lockup}</p>
        <div className="top-groups">
          <p className="stance">{idea.name}</p>
          <div className="chips" aria-label="Looks">
            {LOOKS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={look.id === item.id ? 'active' : undefined}
                onClick={() => onLook(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">{BRAND.nameZh}</p>
        <h1>{BRAND.name}</h1>
        <p className="lede">{BRAND.lede}</p>
      </header>

      <aside className="desk" aria-label="Build card">
        <p className="panel-kicker">{BRAND.setNameZh}</p>
        <p className="panel-title">
          {BRAND.setName} · {BRAND.setNo}
        </p>
        <p className="panel-copy">
          {idea.prompt} Local remap only — I did not call a model.
        </p>
        <div className="chips" aria-label="Ideas">
          {IDEAS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={idea.id === item.id ? 'active' : undefined}
              onClick={() => onIdea(item.id)}
            >
              {item.nameZh} · {item.name}
            </button>
          ))}
        </div>
        <p className="step-line">
          <span>
            {step.id} / {max}
          </span>
          {step.nameZh} · {step.name}
        </p>
        <p className="panel-copy tight">{step.copy}</p>
        <label className="inline-slider">
          <span>Step</span>
          <input
            type="range"
            min={1}
            max={max}
            step={1}
            value={step.id}
            onChange={(event) => {
              onMode('step');
              onStep(Number(event.target.value));
            }}
          />
        </label>
        <div className="chips">
          <button type="button" className={mode === 'assemble' ? 'active' : undefined} onClick={() => onMode('assemble')}>
            Assemble
          </button>
          <button type="button" className={mode === 'step' ? 'active' : undefined} onClick={() => onMode('step')}>
            Step
          </button>
          <button type="button" className={mode === 'explode' ? 'active' : undefined} onClick={() => onMode('explode')}>
            Explode
          </button>
        </div>
        <div className="chips second">
          <button
            type="button"
            className="ghost"
            onClick={() => onStep(Math.max(1, step.id - 1))}
            disabled={step.id <= 1}
          >
            Prev
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => onStep(Math.min(max, step.id + 1))}
            disabled={step.id >= max}
          >
            Next
          </button>
          <button
            type="button"
            className={playing && !reducedMotion ? 'active' : undefined}
            onClick={() => onPlay(!playing)}
            disabled={reducedMotion}
          >
            {playing && !reducedMotion ? 'Playing' : 'Play'}
          </button>
          <button
            type="button"
            className={orbiting && !reducedMotion ? 'active' : undefined}
            onClick={() => onOrbit(!orbiting)}
            disabled={reducedMotion}
          >
            {orbiting && !reducedMotion ? 'Orbit' : 'Hold'}
          </button>
        </div>
      </aside>

      <p className="hint">
        <kbd>←</kbd>
        <kbd>→</kbd>
        step
        <span className="sep">·</span>
        <kbd>E</kbd> explode
        <span className="sep">·</span>
        <kbd>R</kbd> assemble
        <span className="sep">·</span>
        drag orbit
      </p>
    </>
  );
}
