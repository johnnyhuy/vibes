import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { createWoodMaps } from '../wood';

interface Props {
  crashed: boolean;
  reducedMotion: boolean;
}

export default function Biplane({ crashed, reducedMotion }: Props) {
  const prop = useRef<Group>(null);
  const wood = useMemo(() => createWoodMaps('amber'), []);
  const dark = useMemo(() => createWoodMaps('walnut'), []);

  useFrame((_, delta) => {
    if (!prop.current || reducedMotion) return;
    prop.current.rotation.z += (crashed ? 3 : 22) * delta;
  });

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0.08]}>
        <cylinderGeometry args={[0.2, 0.2, 1.72, 24]} />
        <meshStandardMaterial
          color="#9a6b42"
          map={wood.map}
          roughnessMap={wood.roughnessMap}
          roughness={0.82}
          metalness={0}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, -0.78]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />
        <meshStandardMaterial color="#8c623c" roughness={0.84} metalness={0} />
      </mesh>
      <mesh position={[0, 0.62, 0.12]}>
        <boxGeometry args={[2.48, 0.05, 0.4]} />
        <meshStandardMaterial color="#9a6b42" map={wood.map} roughness={0.84} metalness={0} />
      </mesh>
      <mesh position={[0, -0.06, 0.18]}>
        <boxGeometry args={[2.05, 0.045, 0.36]} />
        <meshStandardMaterial color="#9a6b42" map={wood.map} roughness={0.84} metalness={0} />
      </mesh>
      {[-0.78, 0.78].map((x) => (
        <mesh key={`strut-${x}`} position={[x, 0.28, 0.16]}>
          <cylinderGeometry args={[0.015, 0.015, 0.68, 8]} />
          <meshStandardMaterial color="#2a2118" roughness={0.55} metalness={0.1} />
        </mesh>
      ))}
      <mesh position={[0, 0.24, -0.86]}>
        <boxGeometry args={[0.68, 0.035, 0.26]} />
        <meshStandardMaterial color="#9a6b42" roughness={0.84} />
      </mesh>
      <mesh position={[0, 0.34, -0.9]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.04, 0.3, 0.2]} />
        <meshStandardMaterial color="#9a6b42" roughness={0.84} />
      </mesh>
      <group ref={prop} position={[0, 0.02, 1.02]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          <meshStandardMaterial color="#2a2118" roughness={0.45} />
        </mesh>
        <mesh rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.09, 0.86, 0.028]} />
          <meshStandardMaterial color="#3a2a1c" map={dark.map} roughness={0.7} />
        </mesh>
      </group>
      {[-0.26, 0.26].map((x) => (
        <mesh key={`gear-${x}`} position={[x, -0.28, 0.28]}>
          <boxGeometry args={[0.1, 0.1, 0.14]} />
          <meshStandardMaterial color="#2a2118" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
