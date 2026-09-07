import { useEffect, useMemo, useState } from 'react';
import { resolveLook, type Season, type Weather } from './atmosphere';
import Controls from './components/Controls';
import { ErrorBoundary } from './components/ErrorBoundary';
import Scene from './components/Scene';
import { usePrefersReducedMotion } from './hooks';

export default function App() {
  const [season, setSeason] = useState<Season>('autumn');
  const [dayNight, setDayNight] = useState(0.72);
  const [weather, setWeather] = useState<Weather>('clear');
  const [haze, setHaze] = useState(0.32);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const look = useMemo(
    () => resolveLook({ season, dayNight, weather, haze }),
    [dayNight, haze, season, weather]
  );

  useEffect(() => {
    if (!playing || reducedMotion) return undefined;
    const id = window.setInterval(() => {
      setDayNight((value) => (value + 0.003) % 1);
    }, 32);
    return () => window.clearInterval(id);
  }, [playing, reducedMotion]);

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="header">
          <p className="brand">vibes · japanese tower</p>
          <h1>Ridge Pagoda</h1>
          <p className="lede">
            I stacked this keep from primitives — no temple GLB, no borrowed
            brand. Drag to orbit. Then push season, day, weather, and haze until
            the valley actually changes.
          </p>
        </header>

        <Scene look={look} reducedMotion={reducedMotion} />
        <Controls
          season={season}
          dayNight={dayNight}
          weather={weather}
          haze={haze}
          playing={playing && !reducedMotion}
          onSeason={setSeason}
          onDayNight={setDayNight}
          onWeather={setWeather}
          onHaze={setHaze}
          onPlaying={setPlaying}
        />

        <p className="hint">
          Drag to orbit
          <span className="sep">·</span>
          sliders are live uniforms
          <span className="sep">·</span>
          {reducedMotion ? 'day cycle paused (reduced motion)' : 'play the day to walk the sun'}
        </p>
      </div>
    </ErrorBoundary>
  );
}
