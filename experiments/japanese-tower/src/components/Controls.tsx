import {
  SEASONS,
  WEATHERS,
  dayLabel,
  type Season,
  type Weather,
} from '../atmosphere';

interface Props {
  season: Season;
  dayNight: number;
  weather: Weather;
  haze: number;
  playing: boolean;
  onSeason: (season: Season) => void;
  onDayNight: (value: number) => void;
  onWeather: (weather: Weather) => void;
  onHaze: (value: number) => void;
  onPlaying: (playing: boolean) => void;
}

export default function Controls({
  season,
  dayNight,
  weather,
  haze,
  playing,
  onSeason,
  onDayNight,
  onWeather,
  onHaze,
  onPlaying,
}: Props) {
  return (
    <aside className="panel" aria-label="Atmosphere controls">
      <p className="panel-kicker">Scene state</p>
      <h2>Season / weather / air</h2>
      <p className="panel-copy">
        These are first-class uniforms. Change a control and the lighting, fog,
        particles, and materials all resolve from one look.
      </p>

      <fieldset>
        <legend>Season</legend>
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
      </fieldset>

      <fieldset>
        <legend>Day / night — {dayLabel(dayNight)}</legend>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={dayNight}
          onChange={(event) => onDayNight(Number(event.target.value))}
        />
        <button type="button" className="ghost" onClick={() => onPlaying(!playing)}>
          {playing ? 'Pause the day' : 'Play the day'}
        </button>
      </fieldset>

      <fieldset>
        <legend>Weather</legend>
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
      </fieldset>

      <fieldset>
        <legend>Atmosphere — {Math.round(haze * 100)}%</legend>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={haze}
          onChange={(event) => onHaze(Number(event.target.value))}
        />
      </fieldset>
    </aside>
  );
}
