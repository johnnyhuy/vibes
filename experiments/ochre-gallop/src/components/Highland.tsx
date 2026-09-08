import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, type Mesh } from 'three';
import { buildTerrainGeometry, coneSpots, heightAt, pineSpots, ribbonGates } from '../terrain';
import type { ResolvedLook } from '../look';
import type { BiomeId, LoopRef } from '../types';

interface Props {
  biome: BiomeId;
  look: ResolvedLook;
  loop: LoopRef;
  reducedMotion: boolean;
}

function SinterCone({
  x,
  z,
  y,
  scale,
  twist,
  kind,
}: {
  x: number;
  z: number;
  y: number;
  scale: number;
  twist: number;
  kind: 'cone' | 'vent' | 'rock';
}) {
  const color = kind === 'vent' ? '#e8d8b8' : kind === 'rock' ? '#6a4a32' : '#c47a3a';
  return (
    <group position={[x, y, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <coneGeometry args={[0.72, 1.15, 7]} />
        <meshPhysicalMaterial color={color} roughness={0.78} clearcoat={kind === 'vent' ? 0.2 : 0.05} />
      </mesh>
      {kind === 'vent' && (
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 0.22, 8]} />
          <meshPhysicalMaterial color="#4a3a28" roughness={0.7} />
        </mesh>
      )}
    </group>
  );
}

function Pine({ x, z, y, scale, twist }: { x: number; z: number; y: number; scale: number; twist: number }) {
  return (
    <group position={[x, y, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.4, 6]} />
        <meshPhysicalMaterial color="#4a3220" roughness={0.86} />
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <coneGeometry args={[0.72, 1.5, 7]} />
        <meshPhysicalMaterial color="#3a4a28" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <coneGeometry args={[0.48, 1.05, 7]} />
        <meshPhysicalMaterial color="#4a5a30" roughness={0.78} />
      </mesh>
    </group>
  );
}

function Steam({
  spots,
  opacity,
  reducedMotion,
}: {
  spots: { x: number; z: number; y: number }[];
  opacity: number;
  reducedMotion: boolean;
}) {
  return (
    <group>
      {spots.slice(0, 8).map((spot, index) => (
        <mesh
          key={index}
          position={[spot.x, spot.y + (reducedMotion ? 1.6 : 1.8 + (index % 3) * 0.35), spot.z]}
          scale={[1.1 + index * 0.08, 0.7, 1.1 + index * 0.08]}
        >
          <sphereGeometry args={[0.85, 10, 8]} />
          <meshStandardMaterial
            color="#f4eee4"
            transparent
            opacity={opacity}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function PlumeWall({ loop, look }: { loop: LoopRef; look: ResolvedLook }) {
  const mesh = useRef<Mesh>(null);

  useFrame(() => {
    if (mesh.current) mesh.current.position.z = loop.current.plumeZ;
  });

  return (
    <mesh ref={mesh} position={[0, 4.2, loop.current.plumeZ]}>
      <boxGeometry args={[38, 8.4, 2.4]} />
      <meshPhysicalMaterial
        color={look.fogColor}
        transparent
        opacity={0.28}
        roughness={1}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Highland({ biome, look, loop, reducedMotion }: Props) {
  const geometry = useMemo(() => buildTerrainGeometry(biome), [biome]);
  const cones = useMemo(() => coneSpots(biome), [biome]);
  const pines = useMemo(() => (biome === 'rim' ? pineSpots() : []), [biome]);
  const gates = useMemo(() => (biome === 'terrace' ? ribbonGates() : []), [biome]);
  const poolY = heightAt(biome, 0, 0);

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshPhysicalMaterial
          vertexColors
          roughness={biome === 'basin' ? 0.62 : 0.78}
          metalness={0.02}
          clearcoat={biome === 'terrace' ? 0.16 : 0.06}
          clearcoatRoughness={0.55}
          envMapIntensity={0.85}
          side={DoubleSide}
        />
      </mesh>

      {biome === 'terrace' && (
        <mesh position={[0, poolY + 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5.1, 32]} />
          <meshPhysicalMaterial
            color={look.poolColor}
            roughness={0.08}
            metalness={0.12}
            transmission={0.35}
            thickness={0.4}
            transparent
            opacity={0.88}
          />
        </mesh>
      )}

      {cones.map((spot, index) => (
        <SinterCone
          key={`${biome}-cone-${index}`}
          {...spot}
          kind={biome === 'basin' ? 'vent' : biome === 'rim' ? 'rock' : 'cone'}
        />
      ))}

      {pines.map((spot, index) => (
        <Pine key={`pine-${index}`} {...spot} />
      ))}

      {gates.map((gate) => (
        <mesh key={gate.id} position={[gate.x, heightAt(biome, gate.x, gate.z) + 1.15, gate.z]}>
          <torusGeometry args={[1.15, 0.08, 8, 22]} />
          <meshPhysicalMaterial
            color="#f0b45a"
            emissive="#c47a28"
            emissiveIntensity={0.35}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>
      ))}

      {biome === 'basin' && (
        <mesh position={[0.4, heightAt(biome, 0.4, -34.5) + 1.4, -34.5]}>
          <torusGeometry args={[2.2, 0.1, 8, 28]} />
          <meshPhysicalMaterial color="#d8c8a0" emissive="#8a7050" emissiveIntensity={0.25} roughness={0.4} />
        </mesh>
      )}

      {(biome === 'terrace' || biome === 'basin') && (
        <Steam spots={cones} opacity={look.steamOpacity} reducedMotion={reducedMotion} />
      )}

      {biome === 'basin' && <PlumeWall loop={loop} look={look} />}
    </group>
  );
}
