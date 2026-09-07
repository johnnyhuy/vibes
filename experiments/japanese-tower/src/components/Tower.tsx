import { useMemo, type ReactNode } from 'react';
import type { BuildLook } from '../growth';
import type { ResolvedLook } from '../atmosphere';

interface Props {
  look: ResolvedLook;
  build: BuildLook;
}

const STOREYS = [
  { body: 5.15, height: 1.58, roof: 7.35, roofH: 1.32 },
  { body: 4.15, height: 1.36, roof: 6.15, roofH: 1.18 },
  { body: 3.3, height: 1.2, roof: 5.05, roofH: 1.06 },
  { body: 2.55, height: 1.06, roof: 4.1, roofH: 0.94 },
  { body: 1.85, height: 0.94, roof: 3.15, roofH: 0.86 },
] as const;

function Reveal({
  amount,
  children,
}: {
  amount: number;
  children: ReactNode;
}) {
  if (amount <= 0.02) return null;
  const scale = 0.18 + 0.82 * amount;
  return (
    <group scale={[scale, scale, scale]}>
      <group position={[0, (1 - amount) * -0.35, 0]}>{children}</group>
    </group>
  );
}

function HipRoof({
  size,
  height,
  roof,
  wood,
}: {
  size: number;
  height: number;
  roof: string;
  wood: string;
}) {
  const corners = useMemo(() => {
    return [0, 1, 2, 3].map((i) => {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const r = size * 0.46;
      return { x: Math.cos(a) * r, z: Math.sin(a) * r, rot: -a };
    });
  }, [size]);

  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[size / 2, height, 4]} />
        <meshStandardMaterial color={roof} roughness={0.58} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[size * 0.96, 0.07, size * 0.96]} />
        <meshStandardMaterial color={wood} roughness={0.7} metalness={0.04} />
      </mesh>
      {corners.map((corner, i) => (
        <mesh
          key={i}
          position={[corner.x, height * 0.1, corner.z]}
          rotation={[0.42, corner.rot, 0]}
          castShadow
        >
          <coneGeometry args={[0.11, 0.32, 4]} />
          <meshStandardMaterial color={roof} roughness={0.5} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Storey({
  body,
  height,
  roof,
  roofH,
  look,
  bodyAmount,
  roofAmount,
}: {
  body: number;
  height: number;
  roof: number;
  roofH: number;
  look: ResolvedLook;
  bodyAmount: number;
  roofAmount: number;
}) {
  return (
    <group>
      <Reveal amount={bodyAmount}>
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[body, height, body]} />
          <meshStandardMaterial color={look.plasterColor} roughness={0.82} metalness={0.02} />
        </mesh>
        {[
          [body / 2 + 0.04, 0, 0, body * 0.12, height, 0.1],
          [-body / 2 - 0.04, 0, 0, body * 0.12, height, 0.1],
          [0, 0, body / 2 + 0.04, 0.1, height, body * 0.12],
          [0, 0, -body / 2 - 0.04, 0.1, height, body * 0.12],
        ].map(([x, , z, w, h, d], i) => (
          <mesh key={i} position={[x, height / 2, z]} castShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={look.woodColor} roughness={0.68} metalness={0.05} />
          </mesh>
        ))}
      </Reveal>
      <Reveal amount={roofAmount}>
        <group position={[0, height, 0]}>
          <HipRoof size={roof} height={roofH} roof={look.roofColor} wood={look.woodColor} />
        </group>
      </Reveal>
    </group>
  );
}

function Scaffold({ amount, wood }: { amount: number; wood: string }) {
  const height = 2.2 + amount * 8.2;
  const posts = useMemo(() => {
    const width = 7.1;
    const items: Array<[number, number]> = [];
    for (const x of [-1, 0, 1]) {
      for (const z of [-1, 0, 1]) {
        if (x === 0 && z === 0) continue;
        items.push([x * (width / 2), z * (width / 2)]);
      }
    }
    return items;
  }, []);
  if (amount <= 0.02) return null;
  const width = 7.1;

  return (
    <group>
      {posts.map(([x, z], i) => (
        <mesh key={`p-${i}`} position={[x, height / 2, z]} castShadow>
          <boxGeometry args={[0.09, height, 0.09]} />
          <meshStandardMaterial color={wood} roughness={0.75} transparent opacity={0.38 + amount * 0.35} />
        </mesh>
      ))}
      {[0.35, 0.62, 0.88].map((t) => (
        <mesh key={t} position={[0, height * t, 0]}>
          <boxGeometry args={[width + 0.1, 0.07, width + 0.1]} />
          <meshStandardMaterial color={wood} roughness={0.7} transparent opacity={0.22 + amount * 0.25} />
        </mesh>
      ))}
    </group>
  );
}

function TimberYard({ amount, wood }: { amount: number; wood: string }) {
  if (amount <= 0.02) return null;
  return (
    <group>
      {[
        [-5.6, 3.8, 1.4],
        [-6.2, 4.6, 0.9],
        [5.8, 3.2, 1.1],
      ].map(([x, z, len], i) => (
        <mesh key={i} position={[x, 0.18 * amount, z]} rotation={[0, i * 0.4, 0.08]} castShadow>
          <boxGeometry args={[len, 0.22, 0.28]} />
          <meshStandardMaterial color={wood} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function Tower({ look, build }: Props) {
  let y = 0;
  const storeyNodes = STOREYS.map((storey, index) => {
    const node = (
      <group key={index} position={[0, y + 0.02, 0]}>
        <Storey
          {...storey}
          look={look}
          bodyAmount={build.storeys[index] ?? 0}
          roofAmount={build.roofs[index] ?? 0}
        />
      </group>
    );
    y += storey.height + storey.roofH * 0.52;
    return node;
  });

  return (
    <group>
      {[0, 1, 2].map((step) => (
        <Reveal key={step} amount={Math.min(1, Math.max(0, build.podium * 3 - step))}>
          <mesh position={[0, step * 0.42 + 0.21, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[(8.4 - step * 0.85) / 2 - 0.35, (8.4 - step * 0.85) / 2, 0.42, 8]} />
            <meshStandardMaterial color={look.stoneColor} roughness={0.9} metalness={0.04} />
          </mesh>
        </Reveal>
      ))}
      <group position={[0, 1.32, 0]}>{storeyNodes}</group>
      <Reveal amount={build.finial}>
        <mesh position={[0, y + 1.55, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 1.7, 10]} />
          <meshStandardMaterial color={look.woodColor} metalness={0.35} roughness={0.35} />
        </mesh>
        <mesh position={[0, y + 2.45, 0]} castShadow>
          <sphereGeometry args={[0.16, 14, 12]} />
          <meshStandardMaterial color="#c4a056" metalness={0.75} roughness={0.28} />
        </mesh>
        <mesh position={[0, y + 2.68, 0]} castShadow>
          <sphereGeometry args={[0.11, 12, 10]} />
          <meshStandardMaterial color="#d8b45a" metalness={0.8} roughness={0.22} />
        </mesh>
        <mesh position={[0, y + 2.9, 0]} castShadow>
          <coneGeometry args={[0.08, 0.32, 8]} />
          <meshStandardMaterial color="#e6c56a" metalness={0.82} roughness={0.2} />
        </mesh>
      </Reveal>
      <Scaffold amount={build.scaffold} wood={look.woodColor} />
      <TimberYard amount={build.yard} wood={look.woodColor} />
    </group>
  );
}
