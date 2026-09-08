import { Html } from '@react-three/drei';
import { HOTSPOTS, type HotspotId } from '../finishes';

interface Props {
  active: HotspotId | null;
  onPick: (id: HotspotId) => void;
  anchors: Record<HotspotId, [number, number, number]>;
}

export default function Hotspots({ active, onPick, anchors }: Props) {
  return (
    <group>
      {HOTSPOTS.map((spot) => (
        <Html
          key={spot.id}
          position={anchors[spot.id]}
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
