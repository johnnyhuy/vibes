interface SidebarProps {
  selectedPart: string | null;
  onSelectPart: (part: string | null) => void;
  isolated: boolean;
  onToggleIsolate: () => void;
}

// Tesla Model 3 2021 Long Range systems
const parts = [
  { id: 'body', name: 'Body & Structure' },
  { id: 'glass', name: 'Panoramic Glass' },
  { id: 'doors', name: 'Doors & Closures' },
  { id: 'interior', name: 'Passenger Cabin' },
  { id: 'battery', name: 'Battery Pack (82 kWh)' },
  { id: 'motors', name: 'Dual Motors (AWD)' },
  { id: 'thermal', name: 'Thermal System' },
  { id: 'suspension', name: 'Suspension' },
  { id: 'wheels', name: 'Wheels & Brakes' },
  { id: 'charging', name: 'Charging & HV' },
  { id: 'electronics', name: 'Computers & 12V' },
  { id: 'lights', name: 'Exterior Lighting' },
];

export default function Sidebar({ selectedPart, onSelectPart, isolated, onToggleIsolate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>MODEL 3</h1>
        <p className="subtitle">2021 Long Range</p>
        <p className="subtitle" style={{ marginTop: '4px', fontSize: '9px', opacity: 0.5 }}>
          Educational Unofficial
        </p>
      </div>
      
      <div className="parts-list">
        <h2>Components</h2>
        {parts.map(part => (
          <button
            key={part.id}
            className={`part-item ${selectedPart === part.id ? 'active' : ''}`}
            onClick={() => onSelectPart(part.id === selectedPart ? null : part.id)}
          >
            <span className="indicator"></span>
            {part.name}
          </button>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <button 
          className={`isolate-btn ${isolated ? 'active' : ''}`}
          onClick={onToggleIsolate}
        >
          {isolated ? 'Show All' : 'Isolate Selected'}
        </button>
        
        <p className="disclaimer">
          Model: David_Holiday (CC-BY-4.0)<br />
          Unofficial educational recreation<br />
          Not affiliated with Tesla, Inc.
        </p>
      </div>
    </aside>
  );
}
