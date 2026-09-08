import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { VehicleRef } from '../types';
import type { ResolvedLook } from '../look';

interface Props {
  vehicle: VehicleRef;
  look: ResolvedLook;
}

function Wheel({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.32, z]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.22, 14]} />
        <meshStandardMaterial color="#141414" roughness={0.62} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.24, 10]} />
        <meshStandardMaterial color="#2a2c30" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[0, x > 0 ? 0.14 : -0.14, 0]}>
        <boxGeometry args={[0.14, 0.05, 0.22]} />
        <meshStandardMaterial color="#b86a3a" metalness={0.4} roughness={0.35} />
      </mesh>
    </group>
  );
}

export default function IodineWedge({ vehicle, look }: Props) {
  const root = useRef<Group>(null);
  const wheels = useRef<Group>(null);

  useFrame(() => {
    const body = vehicle.current;
    const group = root.current;
    if (!group) return;
    group.position.set(body.x, body.y, body.z);
    group.rotation.set(0, body.yaw, 0);
    if (wheels.current) {
      wheels.current.children.forEach((child) => {
        child.rotation.x = body.wheel;
      });
    }
  });

  return (
    <group ref={root} scale={1.18}>
      <mesh position={[0, 0.34, 0.08]} castShadow>
        <boxGeometry args={[1.78, 0.26, 4.05]} />
        <meshPhysicalMaterial
          color="#14161a"
          metalness={0.82}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
      <mesh position={[0, 0.5, -0.92]} castShadow>
        <boxGeometry args={[1.9, 0.34, 1.62]} />
        <meshPhysicalMaterial
          color="#16181c"
          metalness={0.8}
          roughness={0.22}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.4, 1.78]} rotation={[0.12, 0, 0]} castShadow>
        <boxGeometry args={[1.62, 0.2, 0.92]} />
        <meshPhysicalMaterial color="#121418" metalness={0.84} roughness={0.18} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.76, -0.12]} rotation={[0.16, 0, 0]} castShadow>
        <boxGeometry args={[1.38, 0.4, 1.48]} />
        <meshPhysicalMaterial
          color="#1c2830"
          metalness={0.15}
          roughness={0.06}
          transparent
          opacity={0.78}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh position={[0, 0.58, 0.18]} castShadow>
        <boxGeometry args={[0.08, 0.04, 3.2]} />
        <meshStandardMaterial color="#b86a3a" metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.62, -1.82]} castShadow>
        <boxGeometry args={[1.55, 0.08, 0.28]} />
        <meshPhysicalMaterial color="#101214" metalness={0.75} roughness={0.24} />
      </mesh>
      <mesh position={[-0.92, 0.42, -0.15]} castShadow>
        <boxGeometry args={[0.18, 0.22, 1.15]} />
        <meshStandardMaterial color="#101214" roughness={0.4} />
      </mesh>
      <mesh position={[0.92, 0.42, -0.15]} castShadow>
        <boxGeometry args={[0.18, 0.22, 1.15]} />
        <meshStandardMaterial color="#101214" roughness={0.4} />
      </mesh>
      <mesh position={[-0.72, 0.38, 1.95]}>
        <boxGeometry args={[0.28, 0.08, 0.12]} />
        <meshStandardMaterial color="#fff4d0" emissive="#ffd080" emissiveIntensity={0.9 + look.lampGain} />
      </mesh>
      <mesh position={[0.72, 0.38, 1.95]}>
        <boxGeometry args={[0.28, 0.08, 0.12]} />
        <meshStandardMaterial color="#fff4d0" emissive="#ffd080" emissiveIntensity={0.9 + look.lampGain} />
      </mesh>
      <mesh position={[-0.62, 0.42, -2.05]}>
        <boxGeometry args={[0.32, 0.08, 0.08]} />
        <meshStandardMaterial color="#c45a3a" emissive="#c45a3a" emissiveIntensity={0.7 + look.lampGain * 0.6} />
      </mesh>
      <mesh position={[0.62, 0.42, -2.05]}>
        <boxGeometry args={[0.32, 0.08, 0.08]} />
        <meshStandardMaterial color="#c45a3a" emissive="#c45a3a" emissiveIntensity={0.7 + look.lampGain * 0.6} />
      </mesh>
      <mesh position={[-0.82, 0.78, 0.05]} rotation={[0, 0.2, 0.15]}>
        <boxGeometry args={[0.22, 0.08, 0.12]} />
        <meshPhysicalMaterial color="#14161a" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0.82, 0.78, 0.05]} rotation={[0, -0.2, -0.15]}>
        <boxGeometry args={[0.22, 0.08, 0.12]} />
        <meshPhysicalMaterial color="#14161a" metalness={0.7} roughness={0.25} />
      </mesh>
      <group ref={wheels}>
        <group>
          <Wheel x={-0.82} z={1.22} />
        </group>
        <group>
          <Wheel x={0.82} z={1.22} />
        </group>
        <group>
          <Wheel x={-0.84} z={-1.28} />
        </group>
        <group>
          <Wheel x={0.84} z={-1.28} />
        </group>
      </group>
    </group>
  );
}
