import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { playSlipCue } from '../audio';
import { gatherNearby } from '../slips';
import { heightAt, RUN_SPEED, tryStep, WALK_SPEED } from '../world';
import type { InputRef, PlayerRef } from '../types';
import Bellkite from './Bellkite';

interface Props {
  player: PlayerRef;
  input: InputRef;
  reducedMotion: boolean;
}

export default function Wanderer({ player, input, reducedMotion }: Props) {
  const root = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
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
      const look = body.lookYaw;
      const fx = Math.sin(look);
      const fz = -Math.cos(look);
      const rx = Math.cos(look);
      const rz = Math.sin(look);
      const dirX = rx * nx + fx * -nz;
      const dirZ = rz * nx + fz * -nz;
      const desired = Math.atan2(dirX, -dirZ);
      let diff = desired - body.yaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      body.yaw += diff * Math.min(1, dt * 8);
      body.speed += (maxSpeed - body.speed) * Math.min(1, dt * 6);
      const next = tryStep(
        body.x,
        body.z,
        body.x + Math.sin(body.yaw) * body.speed * dt,
        body.z - Math.cos(body.yaw) * body.speed * dt
      );
      body.x = next.x;
      body.z = next.z;
    } else {
      body.speed += (0 - body.speed) * Math.min(1, dt * 8);
    }

    body.y = heightAt(body.x, body.z);
    body.sprinting = sprinting;
    body.stance = !moving ? 'idle' : sprinting ? 'run' : 'walk';

    const found = gatherNearby(body.gathered, body.x, body.z);
    if (found) {
      body.gathered = [...body.gathered, found.id];
      body.lastSlip = found.id;
      playSlipCue();
    }

    if (root.current) {
      root.current.position.set(body.x, body.y, body.z);
      root.current.rotation.y = body.yaw;
    }

    const amp = body.stance === 'idle' ? 0.06 : body.stance === 'walk' ? 0.38 : 0.55;
    gait.current += (body.stance === 'idle' ? 1.2 : body.speed * 2.05) * dt;
    const breathe = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.6) * 0.012;

    if (torso.current) {
      torso.current.position.y = 0.72 + breathe;
      torso.current.rotation.x = body.stance === 'run' ? 0.12 : 0.03;
    }
    if (leftLeg.current) leftLeg.current.rotation.x = Math.sin(gait.current) * amp;
    if (rightLeg.current) rightLeg.current.rotation.x = Math.sin(gait.current + Math.PI) * amp;
    if (leftArm.current) leftArm.current.rotation.x = Math.sin(gait.current + Math.PI) * amp * 0.55 - 0.12;
    if (rightArm.current) rightArm.current.rotation.x = Math.sin(gait.current) * amp * 0.35 - 0.35;
  });

  return (
    <group ref={root}>
      <group ref={leftLeg} position={[-0.12, 0.38, 0.02]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.07, 0.52, 6]} />
          <meshStandardMaterial color="#5c4a38" roughness={0.88} />
        </mesh>
        <mesh position={[0.02, -0.48, 0.06]} rotation={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.16]} />
          <meshStandardMaterial color="#3d2e22" roughness={0.86} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.12, 0.38, 0.02]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.07, 0.52, 6]} />
          <meshStandardMaterial color="#5c4a38" roughness={0.88} />
        </mesh>
        <mesh position={[-0.02, -0.48, 0.06]} rotation={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.16]} />
          <meshStandardMaterial color="#3d2e22" roughness={0.86} />
        </mesh>
      </group>

      <group ref={torso}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.62, 8]} />
          <meshStandardMaterial color="#d2c4a0" roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.18, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.03, 8, 16]} />
          <meshStandardMaterial color="#8e4a32" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.68, 0.02]} castShadow>
          <sphereGeometry args={[0.13, 10, 8]} />
          <meshStandardMaterial color="#c9b08a" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.78, 0]} rotation={[0.08, 0, 0]} castShadow>
          <coneGeometry args={[0.22, 0.2, 8]} />
          <meshStandardMaterial color="#b08a4a" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.03, 8, 18]} />
          <meshStandardMaterial color="#9a7540" roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.42, -0.16]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 0.32, 6]} />
          <meshStandardMaterial color="#8a7048" roughness={0.84} />
        </mesh>
      </group>

      <group ref={leftArm} position={[-0.22, 1.05, 0]}>
        <mesh position={[0, -0.18, 0]} rotation={[0, 0, 0.22]} castShadow>
          <cylinderGeometry args={[0.03, 0.045, 0.42, 6]} />
          <meshStandardMaterial color="#d2c4a0" roughness={0.84} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.22, 1.05, 0]}>
        <mesh position={[0, -0.18, 0]} rotation={[0, 0, -0.18]} castShadow>
          <cylinderGeometry args={[0.03, 0.045, 0.42, 6]} />
          <meshStandardMaterial color="#d2c4a0" roughness={0.84} />
        </mesh>
        <mesh position={[0.04, -0.42, 0.18]} rotation={[0.55, 0, -0.1]} castShadow>
          <cylinderGeometry args={[0.018, 0.024, 1.05, 5]} />
          <meshStandardMaterial color="#6a4a30" roughness={0.86} />
        </mesh>
      </group>

      <Bellkite reducedMotion={reducedMotion} />
    </group>
  );
}
