interface SidebarProps {
  selectedPart: string | null;
  onSelectPart: (part: string | null) => void;
  isolated: boolean;
  onToggleIsolate: () => void;
}

const parts = [
  { id: 'body', name: 'Body & structure' },
  { id: 'glass', name: 'Panoramic glass' },
  { id: 'doors', name: 'Doors & closures' },
  { id: 'interior', name: 'Passenger cabin' },
  { id: 'battery', name: 'Battery pack' },
  { id: 'motors', name: 'Dual motors' },
  { id: 'thermal', name: 'Thermal system' },
  { id: 'suspension', name: 'Suspension' },
  { id: 'wheels', name: 'Wheels & brakes' },
  { id: 'charging', name: 'Charging & HV' },
  { id: 'electronics', name: 'Computers & 12V' },
  { id: 'lights', name: 'Exterior lighting' },
];

export default function Sidebar({ selectedPart, onSelectPart, isolated, onToggleIsolate }: SidebarProps) {
  return (
    <aside className="components-panel glass-panel">
      <div className="panel-heading">
        <h2>Components</h2>
      </div>

      <div className="parts-list">
        {parts.map((part, index) => (
          <button
            key={part.id}
            className={`part-row ${selectedPart === part.id ? 'selected' : ''}`}
            onClick={() => onSelectPart(part.id === selectedPart ? null : part.id)}
          >
            <span className="part-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="part-name">{part.name}</span>
            <span className="part-chevron" aria-hidden>
              ›
            </span>
          </button>
        ))}
      </div>

      <div className="panel-footer">
        <button
          className={`isolate-btn ${isolated ? 'active' : ''}`}
          onClick={onToggleIsolate}
        >
          {isolated ? 'Show everything' : 'Isolate component'}
        </button>
        <p className="disclaimer">
          David_Holiday · CC-BY-4.0<br />
          Not affiliated with Tesla, Inc.
        </p>
      </div>
    </aside>
  );
}
