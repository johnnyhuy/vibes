import {
  SEASONS,
  WEATHERS,
  dayLabel,
  type Season,
  type Weather,
} from '../atmosphere';
import type { BuildLook } from '../growth';

interface Props {
  season: Season;
  dayNight: number;
  weather: Weather;
  haze: number;
  growth: number;
  build: BuildLook;
  raising: boolean;
  playingDay: boolean;
  onSeason: (season: Season) => void;
  onDayNight: (value: number) => void;
  onWeather: (weather: Weather) => void;
  onHaze: (value: number) => void;
  onGrowth: (value: number) => void;
  onRaising: (value: boolean) => void;
  onPlayingDay: (value: boolean) => void;
  onRaiseAgain: () => void;
}

export default function Controls({
  season,
  dayNight,
  weather,
  haze,
  growth,
  build,
  raising,
  playingDay,
  onSeason,
  onDayNight,
  onWeather,
  onHaze,
  onGrowth,
  onRaising,
  onPlayingDay,
  onRaiseAgain,
}: Props) {
  const percent = Math.round(growth * 100);

  return (
    <>
      <nav className="topbar" aria-label="Atmosphere">
        <p className="brand">vibes · japanese tower</p>
        <div className="top-groups">
          <div className="chips">
            {SEASONS.map((value) => (
              <button
                key={value}
                type="button"
                className={value === season ? 'active' : undefined}
                onClick={() => onSeason(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="chips">
            {WEATHERS.map((value) => (
              <button
                key={value}
                type="button"
                className={value === weather ? 'active' : undefined}
                onClick={() => onWeather(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <label className="inline-slider">
            <span>{dayLabel(dayNight)}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={dayNight}
              onChange={(event) => onDayNight(Number(event.target.value))}
            />
          </label>
          <label className="inline-slider">
            <span>Haze {Math.round(haze * 100)}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={haze}
              onChange={(event) => onHaze(Number(event.target.value))}
            />
          </label>
          <button type="button" className="ghost compact" onClick={onRaiseAgain}>
            Raise again
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">尾根</p>
        <h1>Ridge Pagoda</h1>
        <p className="lede">
          I raise this keep from primitives — stone, then timber, then tile.
          No temple GLB. No borrowed brand. You scrub the lift, then you
          change the air until the valley disagrees with noon.
        </p>
      </header>

      <aside className="meter" aria-label="Lift progress">
        <p className="panel-kicker">{build.stageLabel}</p>
        <p className="percent">{percent}%</p>
        <p className="panel-copy">
          {build.stage === 'podium' && 'Stone terraces first. The hill gets a plinth.'}
          {build.stage === 'frame' && 'Scaffold and a timber yard. Nothing tiled yet.'}
          {build.stage === 'storeys' && 'Plaster boxes stack. Each floor is a smaller square.'}
          {build.stage === 'tiles' && 'Hip roofs land. Eaves first, then the upturned corners.'}
          {build.stage === 'crown' && 'Finial last. Scaffold comes down.'}
        </p>
        <button type="button" className="ghost" onClick={() => onPlayingDay(!playingDay)}>
          {playingDay ? 'Hold the sun' : 'Walk the sun'}
        </button>
      </aside>

      <div className="scrubber">
        <div className="scrubber-head">
          <span>Lift the keep</span>
          <button type="button" className="text-btn" onClick={() => onRaising(!raising)}>
            {raising ? 'Pause lift' : 'Play lift'}
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={growth}
          onChange={(event) => onGrowth(Number(event.target.value))}
        />
      </div>
    </>
  );
}
