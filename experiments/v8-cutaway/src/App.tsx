import { useState } from 'react';
import Scene from './components/Scene';

const FIRING_ORDER = [1, 8, 4, 3, 6, 5, 7, 2];

const CYCLES = [
  { id: 'INTAKE', label: 'Air & fuel', swatch: '#60a5fa' },
  { id: 'COMPRESSION', label: 'Compressed', swatch: '#94a3b8' },
  { id: 'POWER', label: 'Combustion', swatch: '#ef4444' },
  { id: 'EXHAUST', label: 'Exhaust', swatch: '#c084fc' },
];

export default function App() {
  const [engineSpeed, setEngineSpeed] = useState(3);
  const [paused, setPaused] = useState(false);
  const [rpm, setRpm] = useState(700);
  const [strokeCycle, setStrokeCycle] = useState('INTAKE');
  const [pressure, setPressure] = useState('1.5');
  const [firingIndex, setFiringIndex] = useState(0);

  const speed = paused ? 0 : engineSpeed;
  const activeCycle = CYCLES.find((cycle) => cycle.id === strokeCycle) ?? CYCLES[0];

  return (
    <div className="app">
      <header className="header">
        <p className="kicker">Study in motion</p>
        <h1>V8 · Four-Stroke</h1>
        <p className="subtitle">Licensed V8 mesh · 1-8-4-3-6-5-7-2 · four-stroke</p>
        <div className="cycle-legend" aria-hidden>
          {CYCLES.map((cycle) => (
            <span
              key={cycle.id}
              className={`cycle-chip ${cycle.id === strokeCycle ? 'active' : ''}`}
            >
              <i style={{ background: cycle.swatch }} />
              {cycle.label}
            </span>
          ))}
        </div>
      </header>

      <Scene
        engineSpeed={speed}
        setRpm={setRpm}
        setStrokeCycle={setStrokeCycle}
        setPressure={setPressure}
        setFiringIndex={setFiringIndex}
      />

      <aside className="gauges">
        <div className="gauge">
          <div className="gauge-value">{rpm}</div>
          <div className="gauge-label">Rev / min</div>
          <div className="gauge-bar" style={{ width: `${Math.min(100, (rpm / 2300) * 100)}%` }} />
        </div>
        <div className="gauge">
          <div className="gauge-value cycle">{activeCycle.label}</div>
          <div className="gauge-label">Cycle</div>
          <div className="gauge-subtext">{strokeCycle}</div>
        </div>
        <div className="gauge">
          <div className="gauge-value">{pressure}</div>
          <div className="gauge-label">Bar</div>
          <div className="gauge-subtext">Chamber pressure</div>
        </div>
      </aside>

      <div className="firing">
        <p>Firing order</p>
        <ol>
          {FIRING_ORDER.map((cyl, index) => (
            <li key={cyl} className={index === firingIndex ? 'hot' : ''}>
              {cyl}
            </li>
          ))}
        </ol>
      </div>

      <div className="dock">
        <button
          type="button"
          className={`pill ${paused ? '' : 'active'}`}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? 'Play' : 'Pause'}
        </button>
        <label className="speed-control">
          <span>Engine speed</span>
          <input
            type="range"
            id="speed-slider"
            min="1"
            max="10"
            value={engineSpeed}
            onChange={(e) => setEngineSpeed(parseInt(e.target.value, 10))}
          />
          <output>{engineSpeed}×</output>
        </label>
        <p className="hint">Drag to orbit · scroll to zoom</p>
      </div>
    </div>
  );
}
