import { useState } from 'react';
import Scene from './components/Scene';

export default function App() {
  const [engineSpeed, setEngineSpeed] = useState(3);
  const [rpm, setRpm] = useState(700);
  const [strokeCycle, setStrokeCycle] = useState('INTAKE');
  const [pressure, setPressure] = useState('1.5');

  return (
    <div className="app">
      <header className="header">
        <h1>V8 · Four-Stroke</h1>
        <p className="subtitle">90° V-ANGLE · FIRING ORDER 1-8-4-3-6-5-7-2 · 5.5L DISPLACEMENT</p>
      </header>

      <Scene 
        engineSpeed={engineSpeed}
        setRpm={setRpm}
        setStrokeCycle={setStrokeCycle}
        setPressure={setPressure}
      />

      <div className="gauges">
        <div className="gauge">
          <div className="gauge-value">{rpm}</div>
          <div className="gauge-label">REV / MIN</div>
          <div className="gauge-subtext">Crankshaft</div>
        </div>
        
        <div className="gauge">
          <div className="gauge-value">{strokeCycle}</div>
          <div className="gauge-label">CYCLE</div>
          <div className="gauge-subtext">4-Stroke</div>
        </div>
        
        <div className="gauge">
          <div className="gauge-value">{pressure}</div>
          <div className="gauge-label">BAR</div>
          <div className="gauge-subtext">Chamber Pressure</div>
        </div>
      </div>

      <div className="controls-panel">
        <div className="speed-control">
          <label>ENGINE SPEED</label>
          <input 
            type="range" 
            id="speed-slider" 
            min="1" 
            max="10" 
            value={engineSpeed}
            onChange={(e) => setEngineSpeed(parseInt(e.target.value))}
          />
          <div className="speed-value">{engineSpeed}x</div>
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ef4444' }}></span>
          <span>Crankshaft</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#3b82f6' }}></span>
          <span>Pistons</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#8b5cf6' }}></span>
          <span>Valves</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#10b981' }}></span>
          <span>Block</span>
        </div>
      </div>
    </div>
  );
}
