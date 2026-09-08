import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { heightAt, LANDMARKS, WATER_LEVEL } from '../terrain';
import type { ResolvedLook } from '../look';

interface Props {
  look: ResolvedLook;
  reducedMotion: boolean;
}

function WickSpire({ x, z, lampGain }: { x: number; z: number; lampGain: number }) {
  const y = heightAt(x, z);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.85, 1.05, 0.7, 8]} />
        <meshStandardMaterial color="#6a4032" roughness={0.86} />
      </mesh>
      <mesh position={[0, 2.15, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.55, 2.9, 8]} />
        <meshStandardMaterial color="#7a4a38" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.85, 0]}>
        <sphereGeometry args={[0.28, 10, 8]} />
        <meshStandardMaterial
          color="#ffc878"
          emissive="#ff9a40"
          emissiveIntensity={1.4 * lampGain}
        />
      </mesh>
      <pointLight color="#ffb060" intensity={6 * lampGain} distance={18} position={[0, 3.85, 0]} />
    </group>
  );
}

function PewterJetty({ x, z }: { x: number; z: number }) {
  const y = Math.max(heightAt(x, z), WATER_LEVEL - 0.05);
  return (
    <group position={[x, y, z]} rotation={[0, -0.55, 0]}>
      {[0, 1.15, 2.3, 3.4].map((step) => (
        <mesh key={step} position={[0, 0.08, -step]} receiveShadow>
          <boxGeometry args={[1.15, 0.12, 1.05]} />
          <meshStandardMaterial color="#6d6558" roughness={0.78} />
        </mesh>
      ))}
      {[0.45, 1.6, 2.75].map((post) => (
        <mesh key={post} position={[0.48, 0.55, -post]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 1.05, 6]} />
          <meshStandardMaterial color="#4a4034" roughness={0.88} />
        </mesh>
      ))}
    </group>
  );
}

function LowKiln({
  x,
  z,
  lampGain,
  reducedMotion,
}: {
  x: number;
  z: number;
  lampGain: number;
  reducedMotion: boolean;
}) {
  const y = heightAt(x, z);
  const smoke = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!smoke.current || reducedMotion) return;
    const t = clock.elapsedTime;
    smoke.current.children.forEach((child, index) => {
      child.position.y = 3.1 + ((t * 0.28 + index * 0.35) % 1.6);
      const fade = 1 - (child.position.y - 3.1) / 1.6;
      child.scale.setScalar(0.45 + (1 - fade) * 0.7);
    });
  });

  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[1.35, 1.55, 1.7, 10]} />
        <meshStandardMaterial color="#8a4030" roughness={0.84} />
      </mesh>
      <mesh position={[0, 2.35, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.48, 2.2, 8]} />
        <meshStandardMaterial color="#6a3228" roughness={0.8} />
      </mesh>
      <mesh position={[1.15, 0.55, 0.2]} castShadow>
        <boxGeometry args={[1.1, 1.05, 1.25]} />
        <meshStandardMaterial color="#6a3a2c" roughness={0.86} />
      </mesh>
      <pointLight color="#ff7a30" intensity={3.2 * lampGain} distance={12} position={[0, 2.6, 0]} />
      <group ref={smoke}>
        {[0, 1, 2].map((index) => (
          <mesh key={index} position={[0.08, 3.2 + index * 0.4, 0.04]}>
            <sphereGeometry args={[0.28, 8, 6]} />
            <meshStandardMaterial color="#d8c8b8" transparent opacity={0.28} roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function FlintFord({ x, z }: { x: number; z: number }) {
  const stones = [
    [0, 0],
    [1.15, 0.55],
    [2.25, 0.15],
    [3.35, 0.7],
    [-1.05, 0.4],
  ] as const;

  return (
    <group>
      {stones.map(([dx, dz], index) => {
        const sx = x + dx;
        const sz = z + dz;
        const y = Math.max(heightAt(sx, sz), WATER_LEVEL - 0.08);
        return (
          <mesh key={index} position={[sx, y + 0.12, sz]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.42 + index * 0.04, 0]} />
            <meshStandardMaterial color="#7a7268" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Landmarks({ look, reducedMotion }: Props) {
  const wick = LANDMARKS[0];
  const jetty = LANDMARKS[1];
  const kiln = LANDMARKS[2];
  const ford = LANDMARKS[3];

  return (
    <group>
      <WickSpire x={wick.x} z={wick.z} lampGain={look.lampGain} />
      <PewterJetty x={jetty.x} z={jetty.z} />
      <LowKiln x={kiln.x} z={kiln.z} lampGain={look.lampGain} reducedMotion={reducedMotion} />
      <FlintFord x={ford.x} z={ford.z} />
    </group>
  );
}
