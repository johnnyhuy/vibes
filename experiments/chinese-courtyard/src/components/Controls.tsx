import { SEASONS, dayLabel, type Season } from '../atmosphere';

interface Props {
  season: Season;
  dayNight: number;
  playingDay: boolean;
  onSeason: (season: Season) => void;
  onDayNight: (value: number) => void;
  onPlayingDay: (value: boolean) => void;
}

export default function Controls({
  season,
  dayNight,
  playingDay,
  onSeason,
  onDayNight,
  onPlayingDay,
}: Props) {
  return (
    <>
      <nav className="topbar" aria-label="Atmosphere">
        <p className="brand">vibes · siheyuan</p>
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
          <button type="button" className="ghost compact" onClick={() => onPlayingDay(!playingDay)}>
            {playingDay ? 'Hold the sun' : 'Walk the sun'}
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">北庭</p>
        <h1>North Court</h1>
        <p className="lede">
          I drew a four-sided siheyuan from primitives — halls, a moon gate,
          a pond. Season and the sun retint the plaster. No courtyard GLB.
        </p>
      </header>
    </>
  );
}
