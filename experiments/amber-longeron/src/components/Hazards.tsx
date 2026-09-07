import { useMemo } from 'react';
import { ExtrudeGeometry, Shape } from 'three';
import { hash, laneX } from '../flight';
import type { Hazard } from '../types';

function rockGeometry(seed: number) {
  const shape = new Shape();
  const sides = 5 + Math.floor(hash(seed, 2) * 3);
  for (let i = 0; i < sides; i += 1) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const radius = 0.42 + hash(seed, i + 4) * 0.38;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new ExtrudeGeometry(shape, {
    depth: 0.55 + hash(seed, 9) * 0.5,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 1
  });
}

function Rock({ seed }: { seed: number }) {
  const geometry = useMemo(() => rockGeometry(seed), [seed]);
  const tilt = hash(seed, 12) * 0.6 - 0.3;
  return (
    <mesh geometry={geometry} castShadow receiveShadow rotation={[0.2, tilt, 0.1]} position={[0, 0.15, 0]}>
      <meshStandardMaterial color="#6b5344" roughness={0.92} metalness={0.02} />
    </mesh>
  );
}

function Cloud({ seed }: { seed: number }) {
  const puffs = useMemo(
    () =>
      [0, 1, 2, 3].map((i) => ({
        x: (hash(seed, i) - 0.5) * 0.9,
        y: 0.15 + hash(seed, i + 3) * 0.35,
        z: (hash(seed, i + 6) - 0.5) * 0.5,
        s: 0.42 + hash(seed, i + 9) * 0.28
      })),
    [seed]
  );

  return (
    <group>
      {puffs.map((puff, i) => (
        <mesh key={i} position={[puff.x, puff.y, puff.z]} scale={puff.s}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color="#efe0d0" roughness={1} transparent opacity={0.78} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Ring() {
  return (
    <mesh rotation={[0, Math.PI / 2, 0]}>
      <torusGeometry args={[0.72, 0.045, 10, 28]} />
      <meshStandardMaterial color="#d7a15a" emissive="#8a5a22" emissiveIntensity={0.35} metalness={0.55} roughness={0.28} />
    </mesh>
  );
}

export default function Hazards({ items }: { items: Hazard[] }) {
  return (
    <group>
      {items.map((item) => {
        if (item.taken) return null;
        return (
          <group key={item.id} position={[laneX(item.lane), 0.85, item.z]}>
            {item.kind === 'rock' && <Rock seed={item.seed} />}
            {item.kind === 'cloud' && <Cloud seed={item.seed} />}
            {item.kind === 'ring' && <Ring />}
          </group>
        );
      })}
    </group>
  );
}
