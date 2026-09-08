import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import type { VehicleRef } from '../types';
import { paintSoot } from '../vehicle';
import type { ResolvedLook } from '../look';

interface Props {
  vehicle: VehicleRef;
  look: ResolvedLook;
}

function Wheel() {
  return (
    <>
      <mesh castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.22, 12]} />
        <meshStandardMaterial color="#1c1612" roughness={0.7} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.14, 0.14, 0.24, 8]} />
        <meshStandardMaterial color="#8a6a3c" metalness={0.35} roughness={0.4} />
      </mesh>
    </>
  );
}

const WHEELS = [
  [-0.55, 0.22, 0.68],
  [0.55, 0.22, 0.68],
  [-0.55, 0.22, -0.72],
  [0.55, 0.22, -0.72],
] as const;

export default function SootRunner({ vehicle, look }: Props) {
  const group = useRef<Group>(null);
  const soot = useMemo(() => paintSoot(), []);

  useFrame(() => {
    const body = vehicle.current;
    const root = group.current;
    if (!root) return;
    root.position.set(body.x, body.y, body.z);
    root.rotation.set(body.pitch, body.yaw, body.roll);
    root.children.forEach((child) => {
      if (child.userData.wheel) child.rotation.x = body.wheel;
    });
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.38, 0.08]} castShadow>
        <boxGeometry args={[1.15, 0.38, 2.05]} />
        <meshStandardMaterial map={soot} color="#8a5a42" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.62, -0.55]} castShadow>
        <boxGeometry args={[1.02, 0.42, 0.72]} />
        <meshStandardMaterial color="#3a2a22" roughness={0.64} />
      </mesh>
      <mesh position={[0, 0.72, 0.72]} castShadow>
        <boxGeometry args={[1.08, 0.22, 0.55]} />
        <meshStandardMaterial color="#6a4030" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.05, -0.15]} castShadow>
        <torusGeometry args={[0.55, 0.035, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#2a221c" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[-0.42, 0.48, 1.08]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial
          color="#ffd080"
          emissive="#ff9a40"
          emissiveIntensity={1.1 * look.lampGain}
        />
      </mesh>
      <mesh position={[0.42, 0.48, 1.08]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial
          color="#ffd080"
          emissive="#ff9a40"
          emissiveIntensity={1.1 * look.lampGain}
        />
      </mesh>
      <pointLight
        color="#ffb060"
        intensity={2.4 * look.lampGain}
        distance={9}
        position={[0, 0.55, 1.2]}
      />
      {WHEELS.map(([x, y, z], index) => (
        <group key={index} userData={{ wheel: true }} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <Wheel />
        </group>
      ))}
    </group>
  );
}
