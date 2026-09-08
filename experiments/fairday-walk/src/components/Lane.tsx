import { STOPS } from '../itinerary';
import { wetCobble, type ResolvedLook } from '../looks';
import { lane } from '../palette';
import { Cobble, House, hash } from './Kit';

const FIRST = STOPS[0].position[2];
const LAST = STOPS[STOPS.length - 1].position[2];
const LENGTH = FIRST - LAST + 28;
const MID = (FIRST + LAST) / 2;
const WIDTH = 20;

const FILL = [
  { x: -7.2, z: -11, w: 3.4, d: 2.6, h: 3.4, plaster: lane.plasterCool },
  { x: 7.4, z: -11, w: 3.6, d: 2.8, h: 3.8, plaster: lane.plaster },
  { x: -7.6, z: -33, w: 3.8, d: 2.7, h: 4.0, plaster: lane.plasterWarm },
  { x: 7.1, z: -33, w: 3.2, d: 2.5, h: 3.3, plaster: lane.plasterShade },
  { x: -7.4, z: -55, w: 3.5, d: 2.8, h: 3.7, plaster: lane.plaster },
  { x: 7.6, z: -55, w: 3.6, d: 2.6, h: 4.2, plaster: lane.plasterCool },
  { x: -7.5, z: -77, w: 3.3, d: 2.5, h: 3.5, plaster: lane.plasterWarm },
  { x: 7.3, z: -77, w: 3.7, d: 2.9, h: 3.9, plaster: lane.plaster },
  { x: -7.7, z: -99, w: 3.6, d: 2.6, h: 4.1, plaster: lane.plasterShade },
  { x: 7.4, z: -99, w: 3.4, d: 2.7, h: 3.6, plaster: lane.plasterCool },
  { x: -7.2, z: -121, w: 3.5, d: 2.8, h: 3.8, plaster: lane.plaster },
  { x: 7.5, z: -121, w: 3.3, d: 2.5, h: 3.4, plaster: lane.plasterWarm },
  { x: -7.5, z: -143, w: 3.7, d: 2.7, h: 4.0, plaster: lane.plasterCool },
  { x: 7.3, z: -143, w: 3.5, d: 2.6, h: 3.7, plaster: lane.plaster },
] as const;

const PUDDLES = Array.from({ length: 14 }, (_, i) => ({
  x: (hash(i + 2) - 0.5) * 4.6,
  z: FIRST - 6 - i * 11.2 + hash(i) * 3,
  r: 0.28 + hash(i + 7) * 0.42,
}));

export default function Lane({ look }: { look: ResolvedLook }) {
  return (
    <group>
      <mesh position={[0, -1.15, MID]} castShadow receiveShadow>
        <boxGeometry args={[WIDTH, 2.2, LENGTH]} />
        <meshStandardMaterial color="#3a2418" roughness={0.96} />
      </mesh>
      <mesh position={[0, -0.42, MID]} receiveShadow>
        <boxGeometry args={[WIDTH - 0.35, 0.55, LENGTH - 0.35]} />
        <meshStandardMaterial color="#6a432c" roughness={0.92} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`lip-${side}`} position={[side * (WIDTH / 2 - 0.15), -0.08, MID]} castShadow>
          <boxGeometry args={[0.38, 0.28, LENGTH]} />
          <meshStandardMaterial color={lane.cobble} roughness={0.78 - look.wet * 0.3} />
        </mesh>
      ))}
      {[0.28, 0.58, 0.82].map((_, i) =>
        [-1, 1].map((side) => (
          <mesh
            key={`strata-${side}-${i}`}
            position={[side * (WIDTH / 2 - 0.04), -0.22 - i * 0.48, MID]}
            castShadow
          >
            <boxGeometry args={[0.1, 0.2, LENGTH]} />
            <meshStandardMaterial color={['#5a3822', '#472a18', '#2a1810'][i]} roughness={0.98} />
          </mesh>
        ))
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, MID]} receiveShadow>
        <planeGeometry args={[7.2, LENGTH - 1.2]} />
        <Cobble
          color={wetCobble(look.wet)}
          roughness={0.92 - look.wet * 0.62}
          metalness={0.04 + look.wet * 0.32}
        />
      </mesh>
      {[-3.7, 3.7].map((x) => (
        <mesh key={x} position={[x, 0.06, MID]} receiveShadow>
          <boxGeometry args={[2.2, 0.1, LENGTH - 1.4]} />
          <meshStandardMaterial color={lane.leaf} roughness={0.9 - look.wet * 0.15} />
        </mesh>
      ))}
      {PUDDLES.map((puddle, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, hash(i) * 1.2]}
          position={[puddle.x, 0.035, puddle.z]}
        >
          <circleGeometry args={[puddle.r, 12]} />
          <meshStandardMaterial
            color="#6a7a82"
            roughness={0.12}
            metalness={0.45}
            transparent
            opacity={0.18 + look.wet * 0.55}
          />
        </mesh>
      ))}
      {[-1, 1].map((end) => (
        <mesh key={`cut-${end}`} position={[0, -1.15, MID + end * (LENGTH / 2)]} castShadow>
          <boxGeometry args={[WIDTH, 2.2, 0.12]} />
          <meshStandardMaterial color="#2c1a12" roughness={0.97} />
        </mesh>
      ))}
      {FILL.map((house, i) => (
        <group key={i} position={[house.x, 0, house.z]} rotation={[0, house.x > 0 ? -0.08 : 0.08, 0]}>
          <House
            width={house.w}
            depth={house.d}
            height={house.h}
            plaster={house.plaster}
            bays={2}
            storeys={house.h > 3.7 ? 2 : 1}
            door={i % 3 !== 1}
          />
        </group>
      ))}
    </group>
  );
}
