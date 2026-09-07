import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { RUN_SPEED, WALK_SPEED, pushFromTrees } from '../world';
import type { InputRef, PlayerRef } from '../types';

interface Props {
  player: PlayerRef;
  input: InputRef;
  reducedMotion: boolean;
}

export default function Warden({ player, input, reducedMotion }: Props) {
  const root = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const heart = useRef<Group>(null);
  const gait = useRef(0);

  useFrame((state, delta) => {
    const body = player.current;
    const stick = input.current;
    const dt = Math.min(delta, 0.05);
    const axisX = stick.x + stick.padX;
    const axisZ = stick.z + stick.padZ;
    const moving = Math.hypot(axisX, axisZ) > 0.08;
    const sprinting = moving && (stick.sprint || stick.padSprint);
    const maxSpeed = sprinting ? RUN_SPEED : WALK_SPEED;

    if (moving) {
      const length = Math.hypot(axisX, axisZ);
      const nx = axisX / length;
      const nz = axisZ / length;
      const desired = Math.atan2(nx, -nz);
      let diff = desired - body.yaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      body.yaw += diff * Math.min(1, dt * 8);
      body.speed += (maxSpeed - body.speed) * Math.min(1, dt * 6);
      const next = pushFromTrees(
        body.x + Math.sin(body.yaw) * body.speed * dt,
        body.z - Math.cos(body.yaw) * body.speed * dt
      );
      body.x = next.x;
      body.z = next.z;
    } else {
      body.speed += (0 - body.speed) * Math.min(1, dt * 8);
    }

    body.sprinting = sprinting;
    body.stance = !moving ? 'idle' : sprinting ? 'run' : 'walk';
    body.lanternPull = Math.max(0, body.lanternPull - dt);

    if (root.current) {
      root.current.position.set(body.x, 0, body.z);
      root.current.rotation.y = body.yaw;
    }

    const pulse = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * (body.stance === 'run' ? 8 : 1.7));
    const amp = body.stance === 'idle' ? 0.08 : body.stance === 'walk' ? 0.42 : 0.62;
    gait.current += (body.stance === 'idle' ? 1.4 : body.speed * 2.1) * dt;

    if (torso.current) {
      torso.current.position.y = 0.78 + (reducedMotion ? 0 : pulse * 0.018);
      torso.current.rotation.x = body.stance === 'run' ? 0.14 : 0.04;
      torso.current.rotation.z = reducedMotion ? 0 : Math.sin(gait.current * 0.45) * 0.03;
    }
    if (leftLeg.current) leftLeg.current.rotation.x = Math.sin(gait.current) * amp;
    if (rightLeg.current) rightLeg.current.rotation.x = Math.sin(gait.current + Math.PI) * amp;
    if (leftArm.current) leftArm.current.rotation.x = Math.sin(gait.current + Math.PI) * amp * 0.7 - 0.18;
    if (rightArm.current) rightArm.current.rotation.x = Math.sin(gait.current) * amp * 0.7 - 0.18;
    if (heart.current) {
      const glow = 1 + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 2.2) * 0.12);
      heart.current.scale.setScalar(glow);
    }
  });

  return (
    <group ref={root}>
      <group ref={leftLeg} position={[-0.16, 0.42, 0.04]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.09, 0.62, 6]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.9} />
        </mesh>
        <mesh position={[0.02, -0.54, 0.08]} rotation={[0.4, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.05, 0.28, 5]} />
          <meshStandardMaterial color="#2a2016" roughness={0.88} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.16, 0.42, 0.04]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.09, 0.62, 6]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.9} />
        </mesh>
        <mesh position={[-0.02, -0.54, 0.08]} rotation={[0.4, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.05, 0.28, 5]} />
          <meshStandardMaterial color="#2a2016" roughness={0.88} />
        </mesh>
      </group>

      <group ref={torso}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.28, 0.78, 8]} />
          <meshStandardMaterial color="#4a3424" roughness={0.92} />
        </mesh>
        {[
          [0.16, 0.38, 0.1, 0.11],
          [-0.14, 0.22, 0.12, 0.1],
          [0.02, 0.5, 0.16, 0.09],
        ].map(([x, y, z, r], index) => (
          <mesh key={index} position={[x, y, z]} castShadow>
            <dodecahedronGeometry args={[r, 0]} />
            <meshStandardMaterial color="#2e2218" roughness={0.86} />
          </mesh>
        ))}
        {[
          [0.14, 0.18, -0.12],
          [-0.16, 0.42, -0.08],
          [0.08, 0.58, 0.08],
        ].map(([x, y, z], index) => (
          <mesh key={`moss-${index}`} position={[x, y, z]}>
            <sphereGeometry args={[0.08, 8, 6]} />
            <meshStandardMaterial color="#3a5a32" roughness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 0.28, 0.16]}>
          <sphereGeometry args={[0.11, 10, 8]} />
          <meshStandardMaterial color="#1a120c" roughness={0.7} />
        </mesh>
        <group ref={heart} position={[0, 0.28, 0.18]}>
          <mesh>
            <icosahedronGeometry args={[0.075, 0]} />
            <meshStandardMaterial
              color="#e8a84a"
              emissive="#ff9a32"
              emissiveIntensity={1.6}
              roughness={0.28}
            />
          </mesh>
        </group>
        <pointLight position={[0, 0.28, 0.2]} color="#ffb45a" intensity={1.1} distance={4.2} />
        <mesh position={[0, 0.82, 0.02]} castShadow>
          <boxGeometry args={[0.22, 0.2, 0.18]} />
          <meshStandardMaterial color="#6a4a30" roughness={0.78} />
        </mesh>
        <mesh position={[-0.045, 0.84, 0.11]}>
          <boxGeometry args={[0.04, 0.07, 0.02]} />
          <meshStandardMaterial color="#1a120c" roughness={0.5} />
        </mesh>
        <mesh position={[0.045, 0.84, 0.11]}>
          <boxGeometry args={[0.04, 0.07, 0.02]} />
          <meshStandardMaterial color="#1a120c" roughness={0.5} />
        </mesh>
        {[-0.16, 0.16].map((x) => (
          <mesh key={`horn-${x}`} position={[x, 1.02, -0.02]} rotation={[0.15, 0, x > 0 ? 0.4 : -0.4]} castShadow>
            <cylinderGeometry args={[0.012, 0.03, 0.38, 5]} />
            <meshStandardMaterial color="#2a2016" roughness={0.86} />
          </mesh>
        ))}
        <mesh position={[0, 1.16, -0.04]} rotation={[0.35, 0, 0]} castShadow>
          <torusGeometry args={[0.16, 0.014, 6, 14, Math.PI]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.84} />
        </mesh>
        {[-0.22, 0.22].map((x) => (
          <mesh key={`pod-${x}`} position={[x, 0.02, 0.06]}>
            <sphereGeometry args={[0.045, 8, 6]} />
            <meshStandardMaterial color="#5a3a22" roughness={0.7} />
          </mesh>
        ))}
      </group>

      <group ref={leftArm} position={[-0.3, 1.18, 0.02]}>
        <mesh position={[0, -0.22, 0]} rotation={[0, 0, 0.25]} castShadow>
          <cylinderGeometry args={[0.035, 0.055, 0.52, 6]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.88} />
        </mesh>
        {[-0.08, 0, 0.08].map((z) => (
          <mesh key={z} position={[-0.04, -0.5, z]} rotation={[0.2, 0, 0.5]}>
            <cylinderGeometry args={[0.008, 0.016, 0.16, 4]} />
            <meshStandardMaterial color="#2a2016" roughness={0.86} />
          </mesh>
        ))}
      </group>
      <group ref={rightArm} position={[0.3, 1.18, 0.02]}>
        <mesh position={[0, -0.22, 0]} rotation={[0, 0, -0.25]} castShadow>
          <cylinderGeometry args={[0.035, 0.055, 0.52, 6]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.88} />
        </mesh>
        {[-0.08, 0, 0.08].map((z) => (
          <mesh key={z} position={[0.04, -0.5, z]} rotation={[0.2, 0, -0.5]}>
            <cylinderGeometry args={[0.008, 0.016, 0.16, 4]} />
            <meshStandardMaterial color="#2a2016" roughness={0.86} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
