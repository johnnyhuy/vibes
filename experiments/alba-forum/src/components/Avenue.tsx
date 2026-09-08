import { STOPS } from '../itinerary';
import { chalk } from '../palette';
import { Cypress, Stone } from './Primitives';

const FIRST = STOPS[0].position[2];
const LAST = STOPS[STOPS.length - 1].position[2];
const LENGTH = FIRST - LAST + 48;

export default function Avenue() {
  const midZ = (FIRST + LAST) / 2;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, midZ]} receiveShadow>
        <planeGeometry args={[72, LENGTH]} />
        <Stone color={chalk.ground} roughness={0.96} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, midZ]} receiveShadow>
        <planeGeometry args={[11.5, LENGTH]} />
        <Stone color={chalk.avenue} roughness={0.93} />
      </mesh>
      {[-6.4, 6.4].map((x) => (
        <mesh key={`wall-${x}`} position={[x, 0.22, midZ]} castShadow receiveShadow>
          <boxGeometry args={[0.28, 0.44, LENGTH]} />
          <Stone color={chalk.ash} roughness={0.9} />
        </mesh>
      ))}
      {STOPS.flatMap((stop, i) =>
        [-8.6, 8.6].map((x) => (
          <group key={`${stop.id}-tree-${x}`} position={[x + (i % 2 === 0 ? 0.4 : -0.3), 0, stop.position[2] + 6]}>
            <Cypress height={4.1 + (i % 3) * 0.35} />
          </group>
        ))
      )}
      {[
        [18, 3.2, -20],
        [-20, 2.4, -48],
        [22, 4.1, -110],
        [-24, 2.8, -170],
        [20, 3.6, -230],
        [-18, 2.2, -280],
      ].map(([x, h, z], i) => (
        <mesh key={`grain-${i}`} position={[x, h / 2, z]} castShadow>
          <boxGeometry args={[3.4 + (i % 3), h, 2.6]} />
          <Stone color={i % 2 === 0 ? chalk.lintel : chalk.ash} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}
