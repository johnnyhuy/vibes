import { STOPS } from '../itinerary';
import { lane } from '../palette';
import { Cobble, House, Plaster } from './Kit';

const FIRST = STOPS[0].position[2];
const LAST = STOPS[STOPS.length - 1].position[2];
const LENGTH = FIRST - LAST + 36;
const MID = (FIRST + LAST) / 2;

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

export default function Lane() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, MID]} receiveShadow>
        <planeGeometry args={[48, LENGTH]} />
        <Plaster color={lane.earth} roughness={0.97} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, MID]} receiveShadow>
        <planeGeometry args={[7.4, LENGTH]} />
        <Cobble />
      </mesh>
      {[-3.85, 3.85].map((x) => (
        <mesh key={x} position={[x, 0.08, MID]} receiveShadow>
          <boxGeometry args={[0.55, 0.1, LENGTH]} />
          <meshStandardMaterial color={lane.plasterShade} roughness={0.9} />
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
