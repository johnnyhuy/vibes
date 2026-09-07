interface ControlsProps {
  explode: number;
  onExplodeChange: (value: number) => void;
}

export default function Controls({ explode, onExplodeChange }: ControlsProps) {
  return (
    <div className="controls">
      <div className="explode-control">
        <label>
          <span>Explode</span>
          <span className="value">{explode}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={explode}
          onChange={(e) => onExplodeChange(Number(e.target.value))}
          className="explode-slider"
        />
        <div className="labels">
          <span>Assembled</span>
          <span>Exploded</span>
        </div>
      </div>
    </div>
  );
}
