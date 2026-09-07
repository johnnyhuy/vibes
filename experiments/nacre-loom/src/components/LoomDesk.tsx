import { RECIPES, type LoomState, type RecipeId, type StageId } from '../recipes';

interface Props {
  loom: LoomState;
  stage: StageId;
  orbiting: boolean;
  reducedMotion: boolean;
  copied: boolean;
  onRecipe: (id: RecipeId) => void;
  onPatch: (patch: Partial<LoomState>) => void;
  onStage: (stage: StageId) => void;
  onOrbiting: (value: boolean) => void;
  onCopy: () => void;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="inline-slider">
      <span>
        {label} {value.toFixed(2)}
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

function Dye({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="dye">
      <span>{label}</span>
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default function LoomDesk({
  loom,
  stage,
  orbiting,
  reducedMotion,
  copied,
  onRecipe,
  onPatch,
  onStage,
  onOrbiting,
  onCopy,
}: Props) {
  const recipe = RECIPES.find((item) => item.id === loom.recipeId);

  return (
    <>
      <nav className="topbar" aria-label="Nacre Loom">
        <p className="brand">vibes · nacre loom</p>
        <div className="top-groups">
          <div className="chips" role="group" aria-label="Stage">
            <button
              type="button"
              className={stage === 'well' ? 'active' : undefined}
              onClick={() => onStage('well')}
            >
              Well
            </button>
            <button
              type="button"
              className={stage === 'kiln' ? 'active' : undefined}
              onClick={() => onStage('kiln')}
            >
              Kiln
            </button>
          </div>
          <button
            type="button"
            className="ghost compact"
            onClick={() => onOrbiting(!orbiting)}
            disabled={reducedMotion}
          >
            {orbiting && !reducedMotion ? 'Hold orbit' : 'Auto-orbit'}
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">珠络</p>
        <h1>Nacre Loom</h1>
        <p className="lede">
          I wove a nacreous film inside a lobed glass vessel — no generator
          catalogue, no borrowed GLSL. The recipes are ones I mixed. Tune the
          dyes, the swell, and the glass, then copy a snippet that is mine.
        </p>
      </header>

      <aside className="desk" aria-label="Loom settings">
        <p className="panel-kicker">Recipe</p>
        <p className="panel-title">{recipe?.label ?? 'Tuned'}</p>
        <p className="panel-copy">{recipe?.copy}</p>
        <div className="chips" role="group" aria-label="Recipes">
          {RECIPES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === loom.recipeId ? 'active' : undefined}
              onClick={() => onRecipe(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="dyes" role="group" aria-label="Dyes">
          <Dye label="Film A" value={loom.filmA} onChange={(filmA) => onPatch({ filmA })} />
          <Dye label="Film B" value={loom.filmB} onChange={(filmB) => onPatch({ filmB })} />
          <Dye label="Shell" value={loom.shell} onChange={(shell) => onPatch({ shell })} />
        </div>

        <div className="sliders">
          <Slider
            label="Speed"
            value={loom.speed}
            min={0}
            max={1.6}
            step={0.01}
            onChange={(speed) => onPatch({ speed })}
          />
          <Slider
            label="Amplitude"
            value={loom.amplitude}
            min={0.1}
            max={1.2}
            step={0.01}
            onChange={(amplitude) => onPatch({ amplitude })}
          />
          <Slider
            label="Lobe"
            value={loom.morph}
            min={0}
            max={1.1}
            step={0.01}
            onChange={(morph) => onPatch({ morph })}
          />
          <Slider
            label="IOR"
            value={loom.ior}
            min={1.2}
            max={1.8}
            step={0.01}
            onChange={(ior) => onPatch({ ior })}
          />
          <Slider
            label="Thickness"
            value={loom.thickness}
            min={0.3}
            max={2.6}
            step={0.01}
            onChange={(thickness) => onPatch({ thickness })}
          />
          <Slider
            label="Roughness"
            value={loom.roughness}
            min={0}
            max={0.7}
            step={0.01}
            onChange={(roughness) => onPatch({ roughness })}
          />
        </div>

        <button type="button" className="copy" onClick={onCopy}>
          {copied ? 'Copied loom snippet' : 'Copy loom snippet'}
        </button>
      </aside>

      <p className="hint">
        Drag to orbit
        <span className="sep">·</span>
        chips pick a recipe
        <span className="sep">·</span>
        Well is the close look, Kiln shows the other mixes
      </p>
    </>
  );
}
