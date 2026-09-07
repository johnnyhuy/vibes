import { useState } from 'react';
import Scene from './components/Scene';
import { TimelineData } from './types';

const timeline: TimelineData[] = [
  { 
    time: 0, 
    era: 'Formation', 
    date: '4.5 Ga', 
    desc: 'Violent accretion of planetesimals forms proto-Earth. Molten surface churns with magma oceans. No atmosphere, no water — just primordial chaos.', 
    color: '#8b4513',
    cloudOpacity: 0,
    atmosphereOpacity: 0
  },
  { 
    time: 20, 
    era: 'Hadean Eon', 
    date: '4.0 Ga', 
    desc: 'Heavy bombardment continues. Moon forms from a catastrophic impact. Primitive crust begins to solidify from the inferno.', 
    color: '#a0522d',
    cloudOpacity: 0,
    atmosphereOpacity: 0
  },
  { 
    time: 35, 
    era: 'First Oceans', 
    date: '3.8 Ga', 
    desc: 'Surface cools enough for liquid water. First oceans form, covering most of the young planet. Primitive atmosphere of CO₂, nitrogen, and water vapour.', 
    color: '#1e3a8a',
    cloudOpacity: 0.2,
    atmosphereOpacity: 0.05
  },
  { 
    time: 50, 
    era: 'Life Emerges', 
    date: '3.5 Ga', 
    desc: 'First single-celled organisms appear in hydrothermal vents. Stromatolites form in shallow seas. Photosynthesis begins to reshape the world.', 
    color: '#0e7490',
    cloudOpacity: 0.3,
    atmosphereOpacity: 0.08
  },
  { 
    time: 65, 
    era: 'Great Oxidation', 
    date: '2.4 Ga', 
    desc: 'Cyanobacteria flood the atmosphere with oxygen. The sky transforms from methane haze to blue. Snowball Earth glaciations nearly freeze the planet.', 
    color: '#0891b2',
    cloudOpacity: 0.35,
    atmosphereOpacity: 0.1
  },
  { 
    time: 80, 
    era: 'Complex Life', 
    date: '600 Ma', 
    desc: 'Ediacaran fauna evolve — Earth\'s first complex organisms. Cambrian explosion brings unprecedented diversity. Plants colonize the barren land.', 
    color: '#059669',
    cloudOpacity: 0.4,
    atmosphereOpacity: 0.12
  },
  { 
    time: 90, 
    era: 'Age of Dinosaurs', 
    date: '200 Ma', 
    desc: 'Mesozoic Era. Pangaea breaks apart, continents drift. Dinosaurs dominate. Flowering plants transform the landscape into vibrant green.', 
    color: '#10b981',
    cloudOpacity: 0.4,
    atmosphereOpacity: 0.15
  },
  { 
    time: 98, 
    era: 'Human Evolution', 
    date: '2 Ma', 
    desc: 'Quaternary Period. Ice ages cycle across millennia. Homo genus evolves, discovers fire, agriculture, and civilization.', 
    color: '#22c55e',
    cloudOpacity: 0.4,
    atmosphereOpacity: 0.15
  },
  { 
    time: 100, 
    era: 'Present Day', 
    date: 'Now', 
    desc: 'Modern Earth. Complex ecosystems spanning every biome. Human technological civilisation reaches beyond the atmosphere. The Anthropocene epoch.', 
    color: '#3b82f6',
    cloudOpacity: 0.4,
    atmosphereOpacity: 0.15
  }
];

export default function App() {
  const [timelineValue, setTimelineValue] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentEra = timeline.find((e, i) => {
    const next = timeline[i + 1];
    return timelineValue >= e.time && (!next || timelineValue < next.time);
  }) || timeline[timeline.length - 1];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>earth.</h1>
        <p className="tagline">4.5 billion years in the making</p>
      </header>

      <Scene 
        currentEra={currentEra} 
        isPlaying={isPlaying}
        timelineValue={timelineValue}
        setTimelineValue={setTimelineValue}
        setIsPlaying={setIsPlaying}
      />

      <div className="timeline-control">
        <div className="timeline-header">
          <h2 className="era-title">{currentEra.era}</h2>
          <span className="era-time">{currentEra.date}</span>
        </div>
        
        <input 
          type="range" 
          className="timeline-slider"
          min="0" 
          max="100" 
          value={timelineValue}
          onChange={(e) => setTimelineValue(parseInt(e.target.value))}
        />
        
        <div className="timeline-labels">
          <span>4.5 Ga</span>
          <span>2.5 Ga</span>
          <span>500 Ma</span>
          <span>Now</span>
        </div>
        
        <button className="play-btn" onClick={handlePlayPause}>
          {isPlaying ? '⏸ Pause' : '▶ Play the story'}
        </button>
      </div>

      <div className="info-card">
        <p>{currentEra.desc}</p>
      </div>
    </div>
  );
}
