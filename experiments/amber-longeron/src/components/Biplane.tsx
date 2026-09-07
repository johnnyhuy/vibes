import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
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
    prop.current.rotation.z += (crashed ? 4 : 28) * delta;
  });

  return (
    <group>
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0.05]}>
        <cylinderGeometry args={[0.22, 0.26, 1.85, 18]} />
        <meshStandardMaterial map={wood.map} roughnessMap={wood.roughnessMap} roughness={0.78} metalness={0.04} />
      </mesh>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 1.08]}>
        <coneGeometry args={[0.22, 0.42, 16]} />
        <meshStandardMaterial map={wood.map} roughnessMap={wood.roughnessMap} roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.2, 0.05]}>
        <boxGeometry args={[0.28, 0.16, 0.42]} />
        <meshStandardMaterial color="#3a2418" roughness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.58, 0.08]}>
        <boxGeometry args={[2.55, 0.045, 0.42]} />
        <meshStandardMaterial map={wood.map} roughnessMap={wood.roughnessMap} roughness={0.8} metalness={0.03} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.08, 0.16]}>
        <boxGeometry args={[2.15, 0.04, 0.38]} />
        <meshStandardMaterial map={wood.map} roughnessMap={wood.roughnessMap} roughness={0.8} metalness={0.03} />
      </mesh>
      {[-0.72, 0.72].map((x) =>
        [-0.22, 0.22].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.25, z]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.66, 8]} />
            <meshStandardMaterial color="#1a1410" metalness={0.55} roughness={0.35} />
          </mesh>
        ))
      )}
      <mesh castShadow position={[0, 0.28, -0.92]}>
        <boxGeometry args={[0.72, 0.035, 0.28]} />
        <meshStandardMaterial map={wood.map} roughnessMap={wood.roughnessMap} roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 0.38, -0.98]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.04, 0.34, 0.22]} />
        <meshStandardMaterial map={wood.map} roughnessMap={wood.roughnessMap} roughness={0.78} />
      </mesh>
      <group ref={prop} position={[0, 0.04, 1.32]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
          <meshStandardMaterial color="#2a2118" metalness={0.65} roughness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.1, 0.92, 0.03]} />
          <meshStandardMaterial map={dark.map} roughnessMap={dark.roughnessMap} roughness={0.62} />
        </mesh>
      </group>
      {[-0.28, 0.28].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.28, 0.42]} rotation={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.34, 8]} />
            <meshStandardMaterial color="#1a1410" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[x, -0.42, 0.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 12]} />
            <meshStandardMaterial color="#1f1a16" roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
