import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { PlayerRef } from '../types';

interface Spirit {
  orbit: number;
  radius: number;
  height: number;
  speed: number;
  phase: number;
  lit: boolean;
}

const SPIRITS: Spirit[] = [
  { orbit: 0.1, radius: 2.4, height: 1.15, speed: 0.55, phase: 0.2, lit: true },
  { orbit: 1.4, radius: 3.1, height: 1.55, speed: 0.38, phase: 1.1, lit: true },
  { orbit: 2.6, radius: 2.7, height: 0.95, speed: 0.48, phase: 2.0, lit: true },
  { orbit: 3.7, radius: 3.6, height: 1.8, speed: 0.32, phase: 0.6, lit: false },
  { orbit: 4.8, radius: 2.2, height: 1.35, speed: 0.62, phase: 1.7, lit: false },
  { orbit: 5.5, radius: 4.0, height: 1.05, speed: 0.28, phase: 2.4, lit: false },
  { orbit: 0.8, radius: 3.4, height: 2.05, speed: 0.42, phase: 0.9, lit: false },
];

interface Props {
  player: PlayerRef;
  reducedMotion: boolean;
}

export default function Spirits({ player, reducedMotion }: Props) {
  const group = useRef<Group>(null);
  const anchors = useMemo(() => SPIRITS.map((spirit) => ({ ...spirit })), []);

  useFrame((state) => {
    const nodes = group.current?.children;
    if (!nodes) return;
    const body = player.current;
    const pull = 0.22 + body.lanternPull * 0.55;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;

    anchors.forEach((spirit, index) => {
      const node = nodes[index];
      if (!node) return;
      const angle = spirit.orbit + t * spirit.speed;
      const wander = reducedMotion ? 0 : Math.sin(t * 0.7 + spirit.phase) * 0.35;
      const tx = body.x + Math.cos(angle) * (spirit.radius * (1 - pull) + 0.7);
      const tz = body.z + Math.sin(angle) * (spirit.radius * (1 - pull) + 0.7);
      const ty = spirit.height + wander;
      node.position.x += (tx - node.position.x) * 0.045;
      node.position.z += (tz - node.position.z) * 0.045;
      node.position.y += (ty - node.position.y) * 0.05;
    });
  });

  return (
    <group ref={group}>
      {anchors.map((spirit, index) => (
        <group key={index} position={[Math.cos(spirit.orbit) * spirit.radius, spirit.height, Math.sin(spirit.orbit) * spirit.radius]}>
          <mesh>
            <sphereGeometry args={[0.1, 10, 8]} />
            <meshStandardMaterial
              color="#ffe4b0"
              emissive="#ffb45a"
              emissiveIntensity={2.2}
              roughness={0.2}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.26, 10, 8]} />
            <meshBasicMaterial color="#ffd08a" transparent opacity={0.22} depthWrite={false} />
          </mesh>
          {spirit.lit && (
            <pointLight color="#ffb45a" intensity={1.15} distance={5.5} decay={2} />
          )}
        </group>
      ))}
    </group>
  );
}
