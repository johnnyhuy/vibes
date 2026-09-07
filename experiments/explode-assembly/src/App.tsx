import { useCallback, useState } from 'react';
import Scene from './components/Scene';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EMPTY_LAYOUT, type ExplosionLayout } from './utils/explosion';
import './styles.css';

function initialExplode() {
  if (typeof window === 'undefined') return 0;
  const raw = new URLSearchParams(window.location.search).get('explode');
  const value = raw == null ? 0 : Number(raw);
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

export default function App() {
  const [explode, setExplode] = useState(initialExplode);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isolated, setIsolated] = useState(false);
  const [layout, setLayout] = useState<ExplosionLayout>(EMPTY_LAYOUT);

  const onLayoutReady = useCallback((next: ExplosionLayout) => {
    setLayout(next);
  }, []);

  return (
    <div className="studio">
      <div className="stage">
        <ErrorBoundary>
          <Scene
            explode={explode}
            selectedPart={selectedPart}
            isolated={isolated}
            onSelectPart={setSelectedPart}
            layout={layout}
            onLayoutReady={onLayoutReady}
          />
        </ErrorBoundary>
      </div>

      <div className="plaque">
        <span>Tesla</span>
        <h1>MODEL 3</h1>
        <p>2021 Long Range · Educational unofficial</p>
      </div>

      <Sidebar
        selectedPart={selectedPart}
        onSelectPart={setSelectedPart}
        isolated={isolated}
        onToggleIsolate={() => setIsolated(!isolated)}
      />

      <Controls explode={explode} onExplodeChange={setExplode} />
    </div>
  );
}
