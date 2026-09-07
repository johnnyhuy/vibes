import { useState } from 'react';
import Scene from './components/Scene';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import './styles.css';

export default function App() {
  const [explode, setExplode] = useState(0);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isolated, setIsolated] = useState(false);

  return (
    <div className="app">
      <Sidebar 
        selectedPart={selectedPart}
        onSelectPart={setSelectedPart}
        isolated={isolated}
        onToggleIsolate={() => setIsolated(!isolated)}
      />
      
      <div className="viewport">
        <Scene 
          explode={explode}
          selectedPart={selectedPart}
          isolated={isolated}
          onSelectPart={setSelectedPart}
        />
        
        <Controls 
          explode={explode}
          onExplodeChange={setExplode}
        />
      </div>
    </div>
  );
}
