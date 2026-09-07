import { useEffect, useMemo, useState } from 'react';
import { resolveLook, type Season, type Weather } from './atmosphere';
import Controls from './components/Controls';
import { ErrorBoundary } from './components/ErrorBoundary';
import Scene from './components/Scene';
import { resolveBuild } from './growth';
import { usePrefersReducedMotion } from './hooks';

export default function App() {
  const [season, setSeason] = useState<Season>('summer');
  const [dayNight, setDayNight] = useState(0.46);
  const [weather, setWeather] = useState<Weather>('clear');
  const [haze, setHaze] = useState(0.14);
  const [growth, setGrowth] = useState(0.26);
  const [raising, setRaising] = useState(false);
  const [playingDay, setPlayingDay] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const look = useMemo(
    () => resolveLook({ season, dayNight, weather, haze }),
    [dayNight, haze, season, weather]
  );
  const build = useMemo(() => resolveBuild(growth), [growth]);

  useEffect(() => {
    if (!playingDay || reducedMotion) return undefined;
    const id = window.setInterval(() => {
      setDayNight((value) => (value + 0.003) % 1);
    }, 32);
    return () => window.clearInterval(id);
  }, [playingDay, reducedMotion]);

  useEffect(() => {
    if (!raising || reducedMotion) return undefined;
    const id = window.setInterval(() => {
      setGrowth((value) => {
        if (value >= 1) {
          setRaising(false);
          return 1;
        }
        return Math.min(1, value + 0.006);
      });
    }, 32);
    return () => window.clearInterval(id);
  }, [raising, reducedMotion]);

  const raiseAgain = () => {
    setGrowth(0);
    if (!reducedMotion) setRaising(true);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Scene look={look} build={build} reducedMotion={reducedMotion} />
        <Controls
          season={season}
          dayNight={dayNight}
          weather={weather}
          haze={haze}
          growth={growth}
          build={build}
          raising={raising && !reducedMotion}
          playingDay={playingDay && !reducedMotion}
          onSeason={setSeason}
          onDayNight={setDayNight}
          onWeather={setWeather}
          onHaze={setHaze}
          onGrowth={(value) => {
            setRaising(false);
            setGrowth(value);
          }}
          onRaising={setRaising}
          onPlayingDay={setPlayingDay}
          onRaiseAgain={raiseAgain}
        />
        <p className="hint">
          Drag to orbit
          <span className="sep">·</span>
          lift is a second axis
          <span className="sep">·</span>
          {reducedMotion ? 'motion paused' : 'play lift or walk the sun'}
        </p>
      </div>
    </ErrorBoundary>
  );
}
