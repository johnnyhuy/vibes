interface ControlsProps {
  explode: number;
  onExplodeChange: (value: number) => void;
}

export default function Controls({ explode, onExplodeChange }: ControlsProps) {
  return (
    <div className="explode-dock glass-panel">
      <button
        className={`dock-action ${explode === 0 ? 'active' : ''}`}
        onClick={() => onExplodeChange(0)}
        type="button"
      >
        <span className="dock-icon">▣</span>
        Assemble
      </button>

      <div className="explode-control">
        <div className="slider-caption">
          <label htmlFor="explode-slider">Explode</label>
          <output htmlFor="explode-slider">{explode}%</output>
        </div>
        <input
          id="explode-slider"
          type="range"
          min="0"
          max="100"
          value={explode}
          onChange={(e) => onExplodeChange(Number(e.target.value))}
          className="explode-slider"
        />
      </div>

      <button
        className={`dock-action ${explode === 100 ? 'active' : ''}`}
        onClick={() => onExplodeChange(100)}
        type="button"
      >
        <span className="dock-icon">⊞</span>
        All parts
      </button>
    </div>
  );
}
