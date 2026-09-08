import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { RunnerRef } from '../types';

interface Props {
  runner: RunnerRef;
  reducedMotion: boolean;
}

export default function Ashmane({ runner, reducedMotion }: Props) {
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const legs = useRef<Group[]>([]);

  useFrame(() => {
    const state = runner.current;
    const group = root.current;
    if (!group) return;
    group.position.set(state.x, state.y, state.z);
    group.rotation.set(state.pitch, state.yaw, state.roll);

    const gait = reducedMotion ? 0 : state.gait;
    if (body.current) {
      body.current.position.y = Math.sin(gait * 2) * 0.035;
      body.current.rotation.z = Math.sin(gait) * 0.04;
    }
    const phases = [gait, gait + Math.PI, gait + Math.PI, gait];
    legs.current.forEach((leg, index) => {
      if (!leg) return;
      const phase = phases[index];
      const lift = Math.max(0, Math.sin(phase)) * 0.18;
      leg.position.y = 0.02 + lift;
      leg.rotation.x = Math.sin(phase) * 0.42;
    });
  });

  return (
    <group ref={root}>
      <group ref={body} scale={1.08}>
        <mesh position={[0, 0.22, 0.04]} castShadow>
          <boxGeometry args={[0.52, 0.42, 1.18]} />
          <meshPhysicalMaterial color="#8a5330" roughness={0.48} clearcoat={0.18} clearcoatRoughness={0.4} />
        </mesh>
        <mesh position={[0, 0.46, 0.22]} castShadow>
          <sphereGeometry args={[0.26, 10, 8]} />
          <meshPhysicalMaterial color="#7a4a2a" roughness={0.52} />
        </mesh>
        <mesh position={[0, 0.38, 0.58]} rotation={[0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 0.2, 0.36]} />
          <meshPhysicalMaterial color="#8a5330" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.42, 0.86]} castShadow>
          <boxGeometry args={[0.28, 0.24, 0.3]} />
          <meshPhysicalMaterial color="#6e4226" roughness={0.46} />
        </mesh>
        <mesh position={[0, 0.32, 1.04]}>
          <boxGeometry args={[0.16, 0.12, 0.18]} />
          <meshPhysicalMaterial color="#5a341c" roughness={0.55} />
        </mesh>
        <mesh position={[-0.12, 0.48, 0.9]}>
          <sphereGeometry args={[0.035, 6, 5]} />
          <meshBasicMaterial color="#1a120c" />
        </mesh>
        <mesh position={[0.12, 0.48, 0.9]}>
          <sphereGeometry args={[0.035, 6, 5]} />
          <meshBasicMaterial color="#1a120c" />
        </mesh>
        <mesh position={[-0.1, 0.58, 0.78]} rotation={[0.2, 0, 0.4]}>
          <boxGeometry args={[0.06, 0.14, 0.08]} />
          <meshPhysicalMaterial color="#d8c8b4" roughness={0.7} />
        </mesh>
        <mesh position={[0.1, 0.58, 0.78]} rotation={[0.2, 0, -0.4]}>
          <boxGeometry args={[0.06, 0.14, 0.08]} />
          <meshPhysicalMaterial color="#d8c8b4" roughness={0.7} />
        </mesh>
        {[0.12, 0.28, 0.44].map((z, index) => (
          <mesh key={z} position={[0, 0.58, z]} rotation={[0.15, 0, index % 2 === 0 ? 0.12 : -0.12]}>
            <boxGeometry args={[0.12, 0.2, 0.1]} />
            <meshPhysicalMaterial color="#d4c6b2" roughness={0.62} />
          </mesh>
        ))}
        <mesh position={[0, 0.28, -0.66]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.08, 0.08, 0.28]} />
          <meshPhysicalMaterial color="#4a2c1c" roughness={0.7} />
        </mesh>
        {[
          [-0.18, 0.38],
          [0.18, 0.38],
          [-0.18, -0.38],
          [0.18, -0.38],
        ].map(([x, z], index) => (
          <group
            key={index}
            ref={(node) => {
              if (node) legs.current[index] = node;
            }}
            position={[x, 0.02, z]}
          >
            <mesh position={[0, -0.28, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.07, 0.46, 6]} />
              <meshPhysicalMaterial color="#3a2418" roughness={0.72} />
            </mesh>
            <mesh position={[0, -0.54, 0.02]}>
              <boxGeometry args={[0.1, 0.08, 0.16]} />
              <meshPhysicalMaterial color="#1c1410" roughness={0.86} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
