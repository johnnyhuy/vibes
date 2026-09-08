import { useMemo } from 'react';
import {
  buildRoadGeometry,
  cliffCypress,
  dashSpots,
  pineSpots,
  railSpots,
  WATER_Y,
} from '../road';
import type { ResolvedLook } from '../look';
import type { Quality } from '../types';

interface Props {
  look: ResolvedLook;
  quality: Quality;
}

function Pine({
  x,
  z,
  scale,
  twist,
}: {
  x: number;
  z: number;
  scale: number;
  twist: number;
}) {
  return (
    <group position={[x, 0, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.14, 1.4, 6]} />
        <meshStandardMaterial color="#4a3424" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.15, 0]} castShadow>
        <coneGeometry args={[0.95, 2.1, 7]} />
        <meshStandardMaterial color="#1e3a28" roughness={0.86} />
      </mesh>
      <mesh position={[0, 3.15, 0]} castShadow>
        <coneGeometry args={[0.68, 1.45, 7]} />
        <meshStandardMaterial color="#244a30" roughness={0.84} />
      </mesh>
      <mesh position={[0, 3.95, 0]}>
        <coneGeometry args={[0.4, 0.95, 6]} />
        <meshStandardMaterial color="#2c5a38" roughness={0.82} />
      </mesh>
    </group>
  );
}

export default function Coast({ look, quality }: Props) {
  const road = useMemo(() => buildRoadGeometry(), []);
  const pines = useMemo(() => pineSpots(quality === 'pretty' ? 64 : 28), [quality]);
  const cypress = useMemo(() => cliffCypress(quality === 'pretty' ? 14 : 7), [quality]);
  const dashes = useMemo(() => dashSpots(), []);
  const rails = useMemo(() => railSpots(), []);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[16, -0.06, 0]} receiveShadow>
        <planeGeometry args={[48, 200]} />
        <meshStandardMaterial color="#3f4d30" roughness={0.96} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.6, -0.03, 0]} receiveShadow>
        <planeGeometry args={[18, 200]} />
        <meshStandardMaterial color="#3a342c" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-34, WATER_Y, 6]} receiveShadow>
        <planeGeometry args={[70, 230]} />
        <meshStandardMaterial
          color={look.waterColor}
          roughness={0.16}
          metalness={0.28}
          transparent
          opacity={look.waterOpacity}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-16.5, WATER_Y + 0.08, 2]}>
        <planeGeometry args={[6.5, 200]} />
        <meshStandardMaterial color="#d8c4a0" roughness={0.82} />
      </mesh>
      <mesh position={[30, 1.6, 2]} rotation={[0, 0, -0.18]} receiveShadow>
        <boxGeometry args={[16, 4.2, 150]} />
        <meshStandardMaterial color="#4a5834" roughness={0.94} />
      </mesh>
      <mesh geometry={road} receiveShadow>
        <meshStandardMaterial color={look.roadColor} roughness={look.roadRough} metalness={0.08} />
      </mesh>
      {dashes.map((dash, index) => (
        <mesh key={`dash-${index}`} position={[dash.x, 0.035, dash.z]} rotation={[0, dash.yaw, 0]}>
          <boxGeometry args={[0.12, 0.01, 1.55]} />
          <meshStandardMaterial color="#d4b44a" roughness={0.45} />
        </mesh>
      ))}
      {rails.filter((_, index) => index % 2 === 0).map((rail, index) => (
        <group key={`rail-${index}`} position={[rail.x, 0, rail.z]} rotation={[0, rail.yaw, 0]}>
          <mesh position={[0, 0.34, 0]} castShadow>
            <boxGeometry args={[0.05, 0.68, 0.05]} />
            <meshStandardMaterial color="#c8ccd0" metalness={0.62} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.04, 0.05, 2.15]} />
            <meshStandardMaterial color="#d0d4d8" metalness={0.7} roughness={0.24} />
          </mesh>
        </group>
      ))}
      {pines.map((pine, index) => (
        <Pine key={`pine-${index}`} {...pine} />
      ))}
      {cypress.map((tree, index) => (
        <Pine key={`cypress-${index}`} {...tree} />
      ))}
    </>
  );
}
