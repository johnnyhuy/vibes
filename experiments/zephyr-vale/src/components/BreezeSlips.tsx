import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { SLIPS } from '../slips';
import { heightAt } from '../world';
import type { SlipId } from '../types';

interface Props {
  gathered: SlipId[];
  reducedMotion: boolean;
}

function SlipMesh({
  x,
  z,
  hidden,
  reducedMotion,
  phase,
}: {
  x: number;
  z: number;
  hidden: boolean;
  reducedMotion: boolean;
  phase: number;
}) {
  const root = useRef<Group>(null);
  const y = heightAt(x, z) + 0.85;

  useFrame((state) => {
    if (!root.current || hidden) return;
    const t = reducedMotion ? phase : state.clock.elapsedTime + phase;
    root.current.position.y = y + Math.sin(t * 1.15) * 0.12;
    root.current.rotation.y = t * 0.55;
    root.current.rotation.z = Math.sin(t * 1.4) * 0.18;
  });

  if (hidden) return null;

  return (
    <group ref={root} position={[x, y, z]}>
      <mesh castShadow>
        <boxGeometry args={[0.18, 0.24, 0.012]} />
        <meshStandardMaterial color="#f4ecd4" roughness={0.55} />
      </mesh>
      <mesh position={[0.04, 0.02, 0.008]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.12, 0.16, 0.008]} />
        <meshStandardMaterial color="#e8d8b0" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#f0e6c4" emissive="#f2e6b8" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

export default function BreezeSlips({ gathered, reducedMotion }: Props) {
  return (
    <group>
      {SLIPS.map((slip, index) => (
        <SlipMesh
          key={slip.id}
          x={slip.x}
          z={slip.z}
          hidden={gathered.includes(slip.id)}
          reducedMotion={reducedMotion}
          phase={index * 0.7}
        />
      ))}
    </group>
  );
}
