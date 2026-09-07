import { useState } from 'react';
import Scene from './components/Scene';
import { TimelineData } from './types';

const timeline: TimelineData[] = [
  {
    time: 0,
    era: 'Formation',
    date: '4.54 Ga',
    desc: 'Violent accretion of planetesimals forms proto-Earth. Molten surface churns with magma oceans. No atmosphere, no water — just primordial chaos.',
    color: '#8b4513',
    cloudOpacity: 0,
    atmosphereOpacity: 0,
  },
  {
    time: 20,
    era: 'Hadean Eon',
    date: '4.0 Ga',
    desc: 'Heavy bombardment continues. The Moon forms from a catastrophic impact. Primitive crust begins to solidify from the inferno.',
    color: '#a0522d',
    cloudOpacity: 0,
    atmosphereOpacity: 0,
  },
  {
    time: 35,
    era: 'First oceans',
    date: '3.8 Ga',
    desc: 'The surface cools enough for liquid water. First oceans cover most of the young planet. A primitive atmosphere of CO₂, nitrogen, and vapour.',
    color: '#1e3a8a',
    cloudOpacity: 0.2,
    atmosphereOpacity: 0.05,
  },
  {
    time: 50,
    era: 'Life emerges',
    date: '3.5 Ga',
    desc: 'First single-celled organisms appear in hydrothermal vents. Stromatolites form in shallow seas. Photosynthesis begins to reshape the world.',
    color: '#0e7490',
    cloudOpacity: 0.3,
    atmosphereOpacity: 0.08,
  },
  {
    time: 65,
    era: 'Great Oxidation',
    date: '2.4 Ga',
    desc: 'Cyanobacteria flood the atmosphere with oxygen. The sky transforms from methane haze to blue. Snowball Earth glaciations nearly freeze the planet.',
    color: '#0891b2',
    cloudOpacity: 0.35,
    atmosphereOpacity: 0.1,
  },
  {
    time: 80,
    era: 'Complex life',
    date: '600 Ma',
    desc: 'Ediacaran fauna evolve — Earth’s first complex organisms. The Cambrian explosion brings unprecedented diversity. Plants colonise barren land.',
    color: '#059669',
    cloudOpacity: 0.4,
    atmosphereOpacity: 0.12,
  },
  {
    time: 90,
    era: 'Age of dinosaurs',
    date: '200 Ma',
    desc: 'Mesozoic. Pangaea breaks apart. Dinosaurs dominate. Flowering plants transform the landscape into vibrant green.',
    color: '#10b981',
    cloudOpacity: 0.4,
    atmosphereOpacity: 0.15,
  },
  {
    time: 98,
    era: 'Human evolution',
    date: '2 Ma',
    desc: 'Quaternary. Ice ages cycle across millennia. The Homo genus evolves, discovers fire, agriculture, and civilisation.',
    color: '#22c55e',
    cloudOpacity: 0.4,
    atmosphereOpacity: 0.15,
  },
  {
    time: 100,
    era: 'Our world',
    date: 'Today',
    desc: 'Modern Earth. Complex ecosystems in every biome. Human technological civilisation reaches beyond the atmosphere. The Anthropocene.',
    color: '#3b82f6',
    cloudOpacity: 0.4,
    atmosphereOpacity: 0.15,
  },
];

const ticks = [
  { time: 0, label: '4.54 Ga', note: 'Formation' },
  { time: 20, label: '4.0 Ga', note: '' },
  { time: 35, label: '3.8 Ga', note: 'Oceans' },
  { time: 65, label: '2.4 Ga', note: '' },
  { time: 80, label: '650 Ma', note: '' },
  { time: 90, label: '200 Ma', note: '' },
  { time: 100, label: 'Today', note: 'Our world' },
];

export default function App() {
  const [timelineValue, setTimelineValue] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentEra =
    timeline.find((era, i) => {
      const next = timeline[i + 1];
      return timelineValue >= era.time && (!next || timelineValue < next.time);
    }) || timeline[timeline.length - 1];

  const goToOrigin = () => {
    setTimelineValue(0);
    setIsPlaying(true);
  };

  const goToToday = () => {
    setIsPlaying(false);
    setTimelineValue(100);
  };

  return (
    <div className="app">
      <nav className="topbar">
        <p className="brand">earth.</p>
        <div className="nav-links">
          <span className="nav-link active">The planet</span>
          <span className="nav-link">Deep time</span>
        </div>
        <a
          className="nav-link ext"
          href="https://x.com/alwayspriyesh/status/2096819464688005440"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sources ↗
        </a>
      </nav>

      <header className="hero">
        <h1>Explore our planet.</h1>
        <p className="lede">{currentEra.desc}</p>
        <div className="hero-actions">
          <button type="button" className="pill solid" onClick={goToOrigin}>
            ← Go back in time
          </button>
          <button type="button" className="text-link" onClick={goToToday}>
            Read the record
          </button>
        </div>
      </header>

      <aside className="now-card">
        <p className="now-date">{currentEra.date}</p>
        <p className="now-kicker">{currentEra.era}</p>
        <button type="button" className="text-link" onClick={goToToday}>
          Back to today
        </button>
      </aside>

      <Scene
        currentEra={currentEra}
        isPlaying={isPlaying}
        timelineValue={timelineValue}
        setTimelineValue={setTimelineValue}
        setIsPlaying={setIsPlaying}
      />

      <div className="timeline">
        <label className="sr-only" htmlFor="era-slider">
          Deep-time scrubber
        </label>
        <input
          id="era-slider"
          type="range"
          className="timeline-slider"
          min="0"
          max="100"
          value={timelineValue}
          onChange={(e) => setTimelineValue(parseInt(e.target.value, 10))}
        />
        <div className="timeline-ticks" aria-hidden>
          {ticks.map((tick) => (
            <button
              key={tick.time}
              type="button"
              className="tick"
              style={{ left: `${tick.time}%` }}
              onClick={() => setTimelineValue(tick.time)}
            >
              <span className="tick-mark" />
              <span className="tick-label">{tick.label}</span>
              {tick.note && <span className="tick-note">{tick.note}</span>}
            </button>
          ))}
        </div>
      </div>

      <footer className="dock">
        <p className="coords">
          Orbital perspective
          <span>23.4° tilt · 1 AU</span>
        </p>
        <div className="modes" aria-hidden>
          <span className="mode active">Natural</span>
          <span className="mode">After dark</span>
          <span className="mode">Blue hour</span>
        </div>
        <div className="play-row">
          <button type="button" className="pill glass" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? 'Pause the story' : 'Play the story'}
          </button>
          <span className="speed">1×</span>
        </div>
      </footer>
    </div>
  );
}
