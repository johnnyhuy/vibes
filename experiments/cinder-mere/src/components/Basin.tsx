import { useMemo } from 'react';
import { DoubleSide } from 'three';
import {
  buildTerrainGeometry,
  broadSpots,
  pineSpots,
  reedSpots,
  scrubSpots,
  WATER_LEVEL,
  WORLD_HALF,
} from '../terrain';
import type { ResolvedLook } from '../look';

interface Props {
  look: ResolvedLook;
}

function Reed({
  x,
  z,
  y,
  scale,
  twist,
}: {
  x: number;
  z: number;
  y: number;
  scale: number;
  twist: number;
}) {
  return (
    <group position={[x, y, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.03, 0.84, 4]} />
        <meshStandardMaterial color="#6a5a2c" roughness={0.9} />
      </mesh>
      <mesh position={[0.02, 0.78, 0.01]}>
        <sphereGeometry args={[0.05, 5, 4]} />
        <meshStandardMaterial color="#8a6a32" roughness={0.82} />
      </mesh>
    </group>
  );
}

function Scrub({
  x,
  z,
  y,
  scale,
  twist,
}: {
  x: number;
  z: number;
  y: number;
  scale: number;
  twist: number;
}) {
  return (
    <group position={[x, y, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <sphereGeometry args={[0.38, 6, 5]} />
        <meshStandardMaterial color="#3a4a28" roughness={0.92} />
      </mesh>
      <mesh position={[0.18, 0.18, 0.08]}>
        <sphereGeometry args={[0.22, 5, 4]} />
        <meshStandardMaterial color="#4a3a22" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Broadleaf({
  x,
  z,
  y,
  scale,
  twist,
}: {
  x: number;
  z: number;
  y: number;
  scale: number;
  twist: number;
}) {
  return (
    <group position={[x, y, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.7, 6]} />
        <meshStandardMaterial color="#5a4030" roughness={0.86} />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[1.05, 8, 6]} />
        <meshStandardMaterial color="#4a6a34" roughness={0.78} />
      </mesh>
      <mesh position={[0.45, 1.85, 0.2]}>
        <sphereGeometry args={[0.55, 7, 5]} />
        <meshStandardMaterial color="#3f5a2c" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Pine({
  x,
  z,
  y,
  scale,
  twist,
}: {
  x: number;
  z: number;
  y: number;
  scale: number;
  twist: number;
}) {
  return (
    <group position={[x, y, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.2, 1.1, 6]} />
        <meshStandardMaterial color="#4a3428" roughness={0.88} />
      </mesh>
      {[1.15, 1.85, 2.45].map((height, index) => (
        <mesh key={height} position={[0, height, 0]} castShadow>
          <coneGeometry args={[1.05 - index * 0.22, 1.05, 7]} />
          <meshStandardMaterial color="#3a4a2c" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function Basin({ look }: Props) {
  const terrain = useMemo(() => buildTerrainGeometry(), []);
  const reeds = useMemo(() => reedSpots(), []);
  const scrub = useMemo(() => scrubSpots(), []);
  const pines = useMemo(() => pineSpots(), []);
  const broads = useMemo(() => broadSpots(), []);

  return (
    <group>
      <mesh geometry={terrain} receiveShadow>
        <meshStandardMaterial vertexColors color={look.groundTint} roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, WATER_LEVEL, 0]}>
        <circleGeometry args={[WORLD_HALF * 0.34, 48]} />
        <meshPhysicalMaterial
          color={look.waterColor}
          roughness={0.18}
          metalness={0.08}
          transmission={0.22}
          thickness={0.6}
          transparent
          opacity={look.waterOpacity}
          side={DoubleSide}
        />
      </mesh>
      {reeds.map((reed, index) => (
        <Reed key={`reed-${index}`} {...reed} />
      ))}
      {scrub.map((clump, index) => (
        <Scrub key={`scrub-${index}`} {...clump} />
      ))}
      {pines.map((pine, index) => (
        <Pine key={`pine-${index}`} {...pine} />
      ))}
      {broads.map((tree, index) => (
        <Broadleaf key={`broad-${index}`} {...tree} />
      ))}
    </group>
  );
}
