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
        <h1>CAR</h1>
        <p className="subtitle">Exploded View Demo</p>
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
          Demo using procedural geometry.<br />
          Load your own GLB at <code>/models/car.glb</code>
        </p>
      </div>
    </aside>
  );
}
