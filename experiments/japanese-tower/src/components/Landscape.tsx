import { useMemo } from 'react';
import type { ResolvedLook } from '../atmosphere';

interface Props {
  look: ResolvedLook;
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
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.9, 6]} />
        <meshStandardMaterial color="#4a3426" roughness={0.85} />
      </mesh>
      {[0.9, 1.45, 1.95].map((y, i) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <coneGeometry args={[0.85 - i * 0.18, 0.85, 7]} />
          <meshStandardMaterial color={color} roughness={0.78} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

function Maple({
  x,
  z,
  scale,
  foliage,
  wood,
  blossom,
}: {
  x: number;
  z: number;
  scale: number;
  foliage: string;
  wood: string;
  blossom: string | null;
}) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 1.4, 6]} />
        <meshStandardMaterial color={wood} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.72, 10, 8]} />
        <meshStandardMaterial color={foliage} roughness={0.72} />
      </mesh>
      {blossom && (
        <mesh position={[0.15, 1.85, 0.1]}>
          <sphereGeometry args={[0.28, 8, 6]} />
          <meshStandardMaterial color={blossom} roughness={0.6} />
        </mesh>
      )}
    </group>
  );
}

function Lantern({
  x,
  z,
  stone,
  gain,
}: {
  x: number;
  z: number;
  stone: string;
  gain: number;
}) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.24, 6]} />
        <meshStandardMaterial color={stone} roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.36, 6]} />
        <meshStandardMaterial color={stone} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.34, 0.28, 0.34]} />
        <meshStandardMaterial
          color="#f0d48a"
          emissive="#f0c060"
          emissiveIntensity={gain}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <coneGeometry args={[0.24, 0.16, 4]} />
        <meshStandardMaterial color={stone} roughness={0.8} />
      </mesh>
      <pointLight position={[0, 0.72, 0]} color="#ffb45a" intensity={gain * 1.4} distance={7} />
    </group>
  );
}

export default function Landscape({ look }: Props) {
  const trees = useMemo(() => {
    const items: Array<{ kind: 'pine' | 'maple'; x: number; z: number; scale: number }> = [];
    const ring = 11.5;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + 0.2;
      items.push({
        kind: i % 3 === 0 ? 'maple' : 'pine',
        x: Math.cos(a) * ring,
        z: Math.sin(a) * (ring * 0.78),
        scale: 0.85 + (i % 4) * 0.12,
      });
    }
    items.push({ kind: 'maple', x: -6.2, z: 4.8, scale: 0.7 });
    items.push({ kind: 'pine', x: 6.8, z: 3.4, scale: 0.95 });
    return items;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[34, 48]} />
        <meshStandardMaterial color={look.groundColor} roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 6.4]} receiveShadow>
        <planeGeometry args={[3.2, 9.2]} />
        <meshStandardMaterial color="#9a9284" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 8.6]} receiveShadow>
        <circleGeometry args={[2.35, 28]} />
        <meshStandardMaterial
          color={look.waterColor}
          roughness={0.12}
          metalness={0.65}
          transparent
          opacity={0.88}
        />
      </mesh>
      {[
        [-16, -2, 1.8, 9],
        [18, -4, 2.2, 11],
        [-6, -18, 1.4, 14],
        [12, -22, 3.2, 16],
        [-22, -16, 2.6, 13],
      ].map(([x, z, y, s], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, y, 0]} scale={[s, 2.4, s * 0.7]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color={look.groundColor} roughness={0.96} />
          </mesh>
          <mesh position={[0, y + 1.6, 0]} scale={[s * 0.38, 1.1, s * 0.28]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial
              color={look.blossomColor === '#ffffff' || look.groundColor.startsWith('#d') ? '#f6f8fb' : look.groundColor}
              roughness={0.92}
            />
          </mesh>
        </group>
      ))}
      {trees.map((tree, i) =>
        tree.kind === 'pine' ? (
          <Pine key={i} x={tree.x} z={tree.z} scale={tree.scale} color={look.pineColor} />
        ) : (
          <Maple
            key={i}
            x={tree.x}
            z={tree.z}
            scale={tree.scale}
            foliage={look.foliageColor}
            wood={look.woodColor}
            blossom={look.blossomColor}
          />
        )
      )}
      <Lantern x={-3.4} z={4.6} stone={look.stoneColor} gain={look.lanternGain} />
      <Lantern x={3.4} z={4.6} stone={look.stoneColor} gain={look.lanternGain} />
      <Lantern x={-4.8} z={-2.2} stone={look.stoneColor} gain={look.lanternGain} />
      <Lantern x={4.8} z={-2.2} stone={look.stoneColor} gain={look.lanternGain} />
    </group>
  );
}
