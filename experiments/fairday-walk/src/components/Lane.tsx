import { STOPS } from '../itinerary';
import type { ResolvedLook } from '../looks';
import { lane } from '../palette';
import { Cobble, House, Plaster } from './Kit';

const FIRST = STOPS[0].position[2];
const LAST = STOPS[STOPS.length - 1].position[2];
const LENGTH = FIRST - LAST + 28;
const MID = (FIRST + LAST) / 2;
const WIDTH = 22;

const FILL = [
  { x: -7.4, z: -11, w: 3.4, d: 2.6, h: 3.4, plaster: lane.plasterCool },
  { x: 7.6, z: -11, w: 3.6, d: 2.8, h: 3.8, plaster: lane.plaster },
  { x: -7.8, z: -33, w: 3.8, d: 2.7, h: 4.0, plaster: lane.plasterWarm },
  { x: 7.2, z: -33, w: 3.2, d: 2.5, h: 3.3, plaster: lane.plasterShade },
  { x: -7.5, z: -55, w: 3.5, d: 2.8, h: 3.7, plaster: lane.plaster },
  { x: 7.8, z: -55, w: 3.6, d: 2.6, h: 4.2, plaster: lane.plasterCool },
  { x: -7.6, z: -77, w: 3.3, d: 2.5, h: 3.5, plaster: lane.plasterWarm },
  { x: 7.4, z: -77, w: 3.7, d: 2.9, h: 3.9, plaster: lane.plaster },
  { x: -7.9, z: -99, w: 3.6, d: 2.6, h: 4.1, plaster: lane.plasterShade },
  { x: 7.5, z: -99, w: 3.4, d: 2.7, h: 3.6, plaster: lane.plasterCool },
  { x: -7.3, z: -121, w: 3.5, d: 2.8, h: 3.8, plaster: lane.plaster },
  { x: 7.7, z: -121, w: 3.3, d: 2.5, h: 3.4, plaster: lane.plasterWarm },
  { x: -7.6, z: -143, w: 3.7, d: 2.7, h: 4.0, plaster: lane.plasterCool },
  { x: 7.4, z: -143, w: 3.5, d: 2.6, h: 3.7, plaster: lane.plaster },
] as const;

export default function Lane({ look }: { look: ResolvedLook }) {
  return (
    <group>
      <mesh position={[0, -0.55, MID]} castShadow receiveShadow>
        <boxGeometry args={[WIDTH, 1.05, LENGTH]} />
        <meshStandardMaterial color={lane.earth} roughness={0.94} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`bevel-${side}`} position={[side * (WIDTH / 2 + 0.35), -0.85, MID]} rotation={[0, 0, side * 0.4]} castShadow>
          <boxGeometry args={[1.2, 0.7, LENGTH]} />
          <meshStandardMaterial color={lane.plasterShade} roughness={0.9} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, MID]} receiveShadow>
        <planeGeometry args={[7.4, LENGTH]} />
        <Cobble />
      </mesh>
      {[-3.85, 3.85].map((x) => (
        <mesh key={x} position={[x, 0.05, MID]} receiveShadow>
          <boxGeometry args={[1.15, 0.08, LENGTH]} />
          <meshStandardMaterial color={lane.moss} roughness={0.92 - look.wet * 0.2} />
        </mesh>
      ))}
      {[-1, 1].map((end) => (
        <mesh key={`end-${end}`} position={[0, -0.2, MID + end * (LENGTH / 2 + 0.2)]} castShadow>
          <boxGeometry args={[WIDTH * 0.72, 0.7, 0.7]} />
          <Plaster color={lane.plasterShade} />
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
