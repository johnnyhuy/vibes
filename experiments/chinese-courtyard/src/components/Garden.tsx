import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import type { ResolvedLook } from '../atmosphere';

interface Props {
  look: ResolvedLook;
  reducedMotion: boolean;
}

function Pine({
  x,
  z,
  scale,
  color,
}: {
  x: number;
  z: number;
  scale: number;
  color: string;
}) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.76, 6]} />
        <meshStandardMaterial color="#4a3828" roughness={0.86} />
      </mesh>
      {[0.78, 1.22, 1.58].map((y, i) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <coneGeometry args={[0.52 - i * 0.12, 0.62, 7]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function BambooClump({
  x,
  z,
  color,
}: {
  x: number;
  z: number;
  color: string;
}) {
  const stalks = useMemo(
    () =>
      [
        [0.0, 1.55, 0.035],
        [0.12, 1.28, 0.028],
        [-0.1, 1.72, 0.032],
        [0.2, 1.1, 0.024],
        [-0.18, 1.38, 0.026],
      ] as const,
    []
  );
  return (
    <group position={[x, 0, z]}>
      {stalks.map(([ox, h, r], i) => (
        <mesh key={i} position={[ox, h / 2, (i - 2) * 0.04]} castShadow>
          <cylinderGeometry args={[r, r, h, 6]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function Paving({ color }: { color: string }) {
  const tiles = useMemo(() => {
    const items: Array<[number, number]> = [];
    for (let x = -5; x <= 5; x++) {
      for (let z = -3; z <= 4; z++) {
        if (Math.abs(x) < 2 && Math.abs(z) < 1.2) continue;
        items.push([x * 0.92, z * 0.92]);
      }
    }
    return items;
  }, []);

  return (
    <group>
      {tiles.map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 0.03, z]} receiveShadow>
          <boxGeometry args={[0.84, 0.04, 0.84]} />
          <meshStandardMaterial color={color} roughness={0.94} />
        </mesh>
      ))}
    </group>
  );
}

function Pond({ look, reducedMotion }: { look: ResolvedLook; reducedMotion: boolean }) {
  const koi = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!koi.current || reducedMotion) return;
    const t = clock.elapsedTime * 0.35;
    koi.current.children.forEach((child, i) => {
      const a = t + i * 2.1;
      child.position.set(Math.cos(a) * 0.72, 0.04, Math.sin(a) * 0.42);
      child.rotation.y = a + Math.PI / 2;
    });
  });

  return (
    <group position={[0, 0.02, 0.35]}>
      <mesh receiveShadow>
        <boxGeometry args={[3.1, 0.08, 1.85]} />
        <meshStandardMaterial color={look.stoneColor} roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[2.72, 0.04, 1.48]} />
        <meshStandardMaterial color={look.waterColor} roughness={0.18} metalness={0.22} />
      </mesh>
      {[
        [-0.7, 0.08, 0.28],
        [0.55, -0.22, 0.22],
        [0.1, 0.35, 0.18],
      ].map(([x, z, r], i) => (
        <mesh key={i} position={[x, 0.08, z]} rotation={[-Math.PI / 2, 0, i * 0.4]}>
          <circleGeometry args={[r, 12]} />
          <meshStandardMaterial color={look.foliageColor} roughness={0.78} />
        </mesh>
      ))}
      <group ref={koi}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.5 * i, 0.04, 0]} scale={[1, 0.35, 0.45]} castShadow>
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshStandardMaterial color="#c45a28" roughness={0.4} metalness={0.15} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Lantern({
  x,
  z,
  look,
}: {
  x: number;
  z: number;
  look: ResolvedLook;
}) {
  const glow = look.lanternGain;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.44, 6]} />
        <meshStandardMaterial color={look.woodColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial
          color="#f0d8a8"
          emissive="#f0b060"
          emissiveIntensity={glow}
          roughness={0.35}
        />
      </mesh>
      {glow > 0.6 && <pointLight color="#ffc070" intensity={glow * 0.55} distance={3.4} position={[0, 0.55, 0]} />}
    </group>
  );
}

export default function Garden({ look, reducedMotion }: Props) {
  return (
    <group>
      <Paving color={look.pavingColor} />
      <Pond look={look} reducedMotion={reducedMotion} />
      <Pine x={-3.15} z={2.55} scale={0.95} color={look.pineColor} />
      <Pine x={3.05} z={2.35} scale={0.82} color={look.pineColor} />
      <Pine x={-3.35} z={-2.05} scale={0.7} color={look.pineColor} />
      <BambooClump x={3.35} z={-2.15} color={look.bambooColor} />
      <BambooClump x={-2.55} z={3.85} color={look.bambooColor} />
      {look.blossomColor && (
        <>
          <mesh position={[-3.15, 1.72, 2.55]}>
            <sphereGeometry args={[0.22, 8, 6]} />
            <meshStandardMaterial color={look.blossomColor} roughness={0.7} />
          </mesh>
          <mesh position={[3.05, 1.48, 2.35]}>
            <sphereGeometry args={[0.18, 8, 6]} />
            <meshStandardMaterial color={look.blossomColor} roughness={0.7} />
          </mesh>
        </>
      )}
      <Lantern x={-1.85} z={1.55} look={look} />
      <Lantern x={1.95} z={1.35} look={look} />
      <Lantern x={-1.15} z={4.35} look={look} />
      {[
        [6.8, -0.02, 5.4],
        [-6.6, 0.0, 5.8],
        [7.1, 0.04, -5.2],
        [-7.0, -0.03, -4.8],
        [6.2, 0.02, 0.4],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[0.18 + (i % 3) * 0.05, 8, 6]} />
          <meshStandardMaterial color={look.stoneColor} roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}
