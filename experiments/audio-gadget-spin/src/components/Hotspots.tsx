import { Html } from '@react-three/drei';
import { HOTSPOTS, type HotspotId } from '../finishes';

const ANCHORS: Record<HotspotId, [number, number, number]> = {
  driver: [1.18, 0.02, 0.42],
  cushion: [-1.42, -0.42, 0.08],
  yoke: [0.08, 0.78, 0.18],
  controls: [1.02, 0.22, 0.18],
};

interface Props {
  active: HotspotId | null;
  onPick: (id: HotspotId) => void;
}

export default function Hotspots({ active, onPick }: Props) {
  return (
    <group>
      {HOTSPOTS.map((spot) => (
        <Html
          key={spot.id}
          position={ANCHORS[spot.id]}
          center
          distanceFactor={7.2}
          style={{ pointerEvents: 'none' }}
        >
          <button
            type="button"
            className={`hotspot ${active === spot.id ? 'active' : ''}`}
            onClick={() => onPick(spot.id)}
          >
            <span className="hotspot-dot" />
            {spot.label}
          </button>
        </Html>
      ))}
    </group>
  );
}
