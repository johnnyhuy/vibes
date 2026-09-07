import { useEffect, useMemo, useState } from 'react';
import { resolveLook, type Season } from './atmosphere';
import Controls from './components/Controls';
import { ErrorBoundary } from './components/ErrorBoundary';
import Scene from './components/Scene';
import { usePrefersReducedMotion } from './hooks';

export default function App() {
  const [season, setSeason] = useState<Season>('summer');
  const [dayNight, setDayNight] = useState(0.44);
  const [playingDay, setPlayingDay] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const look = useMemo(() => resolveLook({ season, dayNight }), [dayNight, season]);

  useEffect(() => {
    if (!playingDay || reducedMotion) return undefined;
    const id = window.setInterval(() => {
      setDayNight((value) => (value + 0.003) % 1);
    }, 32);
    return () => window.clearInterval(id);
  }, [playingDay, reducedMotion]);

  return (
    <ErrorBoundary>
      <div className="app">
        <Scene look={look} reducedMotion={reducedMotion} />
        <Controls
          season={season}
          dayNight={dayNight}
          playingDay={playingDay && !reducedMotion}
          onSeason={setSeason}
          onDayNight={setDayNight}
          onPlayingDay={setPlayingDay}
        />
        <p className="hint">
          Drag to orbit
          <span className="sep">·</span>
          season and sun retint the court
          <span className="sep">·</span>
          {reducedMotion ? 'motion paused' : 'walk the sun at night for lanterns'}
        </p>
      </div>
    </ErrorBoundary>
  );
}
