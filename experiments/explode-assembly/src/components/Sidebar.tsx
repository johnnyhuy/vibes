interface SidebarProps {
  selectedPart: string | null;
  onSelectPart: (part: string | null) => void;
  isolated: boolean;
  onToggleIsolate: () => void;
}

const parts = [
  { id: 'body', name: 'Body & Structure' },
  { id: 'glass', name: 'Glass & Windows' },
  { id: 'doors', name: 'Doors & Panels' },
  { id: 'interior', name: 'Interior' },
  { id: 'wheels', name: 'Wheels & Tires' },
  { id: 'lights', name: 'Lighting' },
  { id: 'trim', name: 'Trim & Details' },
];

export default function Sidebar({ selectedPart, onSelectPart, isolated, onToggleIsolate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>SEDAN</h1>
        <p className="subtitle">Kenney Car Kit — CC0</p>
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
          Car model: Kenney Car Kit (CC0)<br />
          <a href="https://kenney.nl/assets/car-kit" target="_blank" rel="noopener" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            kenney.nl/assets/car-kit
          </a>
        </p>
      </div>
    </aside>
  );
}
