import {
  DENSITIES,
  LOOKS,
  SPECIES,
  type DensityId,
  type LookId,
  type Species,
  type SpeciesId,
} from '../presets';

interface Props {
  speciesId: SpeciesId;
  lookId: LookId;
  densityId: DensityId;
  wind: number;
  height: number;
  orbiting: boolean;
  reducedMotion: boolean;
  species: Species;
  onSpecies: (id: SpeciesId) => void;
  onLook: (id: LookId) => void;
  onDensity: (id: DensityId) => void;
  onWind: (value: number) => void;
  onHeight: (value: number) => void;
  onOrbiting: (value: boolean) => void;
}

export default function Controls({
  speciesId,
  lookId,
  densityId,
  wind,
  height,
  orbiting,
  reducedMotion,
  species,
  onSpecies,
  onLook,
  onDensity,
  onWind,
  onHeight,
  onOrbiting,
}: Props) {
  return (
    <>
      <nav className="topbar" aria-label="Meadow">
        <p className="brand">vibes · grass field</p>
        <div className="top-groups">
          <div className="chips" role="group" aria-label="Species">
            {SPECIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === speciesId ? 'active' : undefined}
                onClick={() => onSpecies(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="chips" role="group" aria-label="Look">
            {LOOKS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === lookId ? 'active' : undefined}
                onClick={() => onLook(item.id)}
              >
                {item.label}
              </button>
            ))}
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
        <p className="kicker">青原</p>
        <h1>Wind Lea</h1>
        <p className="lede">
          I grew this meadow from instanced blades and a wind shader — no turf
          GLB, no borrowed brand. The species are ones I invented. Poke the
          field and the blades part.
        </p>
      </header>

      <aside className="meter" aria-label="Field settings">
        <p className="panel-kicker">Species</p>
        <p className="panel-title">{species.label}</p>
        <p className="panel-copy">{species.copy}</p>
        <div className="chips" role="group" aria-label="Density">
          {DENSITIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === densityId ? 'active' : undefined}
              onClick={() => onDensity(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="sliders">
          <label className="inline-slider">
            <span>Wind {Math.round(wind * 100)}</span>
            <input
              type="range"
              min={0}
              max={1.6}
              step={0.01}
              value={wind}
              onChange={(event) => onWind(Number(event.target.value))}
            />
          </label>
          <label className="inline-slider">
            <span>Height {Math.round(height * 100)}</span>
            <input
              type="range"
              min={0.45}
              max={1.45}
              step={0.01}
              value={height}
              onChange={(event) => onHeight(Number(event.target.value))}
            />
          </label>
        </div>
      </aside>

      <p className="hint">
        Drag to orbit
        <span className="sep">·</span>
        poke the lea for a gust
        <span className="sep">·</span>
        chips swap species and sky
      </p>
    </>
  );
}
