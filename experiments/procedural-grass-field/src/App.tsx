import { useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Controls from './components/Controls';
import Scene from './components/Scene';
import { usePrefersReducedMotion } from './hooks';
import {
  lookById,
  speciesById,
  type DensityId,
  type LookId,
  type SpeciesId,
} from './presets';

export default function App() {
  const [speciesId, setSpeciesId] = useState<SpeciesId>('rye');
  const [lookId, setLookId] = useState<LookId>('noon');
  const [densityId, setDensityId] = useState<DensityId>('full');
  const [wind, setWind] = useState(0.72);
  const [height, setHeight] = useState(1);
  const [orbiting, setOrbiting] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const species = speciesById(speciesId);
  const look = lookById(lookId);

  useEffect(() => {
    if (reducedMotion) setOrbiting(false);
  }, [reducedMotion]);

  return (
    <ErrorBoundary>
      <div className="app">
        <Scene
          species={species}
          look={look}
          densityId={densityId}
          wind={wind}
          height={height}
          orbiting={orbiting}
          reducedMotion={reducedMotion}
        />
        <Controls
          speciesId={speciesId}
          lookId={lookId}
          densityId={densityId}
          wind={wind}
          height={height}
          orbiting={orbiting}
          reducedMotion={reducedMotion}
          species={species}
          onSpecies={setSpeciesId}
          onLook={setLookId}
          onDensity={setDensityId}
          onWind={setWind}
          onHeight={setHeight}
          onOrbiting={setOrbiting}
        />
        <p className="sr-only">
          Procedural grass meadow. Species {species.label}. Look {look.label}.
        </p>
      </div>
    </ErrorBoundary>
  );
}
