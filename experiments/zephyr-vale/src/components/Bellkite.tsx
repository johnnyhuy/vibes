import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

export default function Bellkite({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<Group>(null);

  useFrame((state) => {
    if (!root.current) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    root.current.position.set(
      -0.42 + Math.sin(t * 0.9) * 0.08,
      1.35 + Math.sin(t * 1.3) * 0.07,
      0.28 + Math.cos(t * 0.7) * 0.05
    );
    root.current.rotation.y = Math.sin(t * 0.8) * 0.35;
    root.current.rotation.z = Math.sin(t * 1.1) * 0.12;
  });

  return (
    <group ref={root}>
      <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.28, 0.28, 0.012]} />
        <meshStandardMaterial color="#f3ead4" roughness={0.62} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.02, 0.014]} />
        <meshStandardMaterial color="#d4a05a" roughness={0.55} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.02, 0.014]} />
        <meshStandardMaterial color="#d4a05a" roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.22, 0]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshStandardMaterial color="#b08a3c" metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.16, 4]} />
        <meshStandardMaterial color="#d8c8a0" />
      </mesh>
    </group>
  );
}
