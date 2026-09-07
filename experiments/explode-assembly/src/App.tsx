import { useState } from 'react';
import Scene from './components/Scene';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import { ErrorBoundary } from './components/ErrorBoundary';
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
        <ErrorBoundary>
          <Scene 
            explode={explode}
            selectedPart={selectedPart}
            isolated={isolated}
            onSelectPart={setSelectedPart}
          />
        </ErrorBoundary>
        
        <Controls 
          explode={explode}
          onExplodeChange={setExplode}
        />
      </div>
    </div>
  );
}
