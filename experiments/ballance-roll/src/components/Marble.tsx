import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Body } from 'cannon-es';
import { Mesh, Vector3 } from 'three';
import { HAZE_WALK, pointInAabb, segmentAabb } from '../course';
import { applyDrive, BALL_MATERIALS, createBallBody } from '../physics';
import { BALL_FEEL, FALL_Y } from '../materials';
import type { BallKind, PlayState } from '../types';
import { useCannonWorld } from './PhysicsWorld';

const drive = new Vector3();
const right = new Vector3();
const look = new Vector3();
const desired = new Vector3();

interface Props {
  kind: BallKind;
  resetToken: number;
  state: PlayState;
  steer: { x: number; z: number };
  reducedMotion: boolean;
  takenMotes: string[];
  onDrive: () => void;
  onFallen: () => void;
  onFinished: () => void;
  onMote: (id: string) => void;
}

export default function Marble({
  kind,
  resetToken,
  state,
  steer,
  reducedMotion,
  takenMotes,
  onDrive,
  onFallen,
  onFinished,
  onMote
}: Props) {
  const world = useCannonWorld();
  const mesh = useRef<Mesh>(null);
  const bodyRef = useRef<Body | null>(null);
  const { camera } = useThree();
  const feel = BALL_FEEL[kind];
  const finish = HAZE_WALK.segments.find((segment) => segment.id === HAZE_WALK.finishId);
  const finishBox = finish ? segmentAabb(finish, 0.15) : null;

  useLayoutEffect(() => {
    const body = createBallBody(kind, HAZE_WALK.start);
    bodyRef.current = body;
    world.addBody(body);
    return () => {
      world.removeBody(body);
      bodyRef.current = null;
    };
  }, [resetToken, world]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.mass = feel.mass;
    body.updateMassProperties();
    body.material = BALL_MATERIALS[kind];
    body.linearDamping = feel.linearDamping;
    body.angularDamping = feel.angularDamping;
  }, [feel, kind]);

  useFrame((_, delta) => {
    const body = bodyRef.current;
    const ball = mesh.current;
    if (!body || !ball) return;

    if (state === 'ready' || state === 'rolling') {
      camera.getWorldDirection(drive);
      drive.y = 0;
      if (drive.lengthSq() < 1e-5) drive.set(0, 0, -1);
      drive.normalize();
      right.set(-drive.z, 0, drive.x);
      const wishX = right.x * steer.x + drive.x * -steer.z;
      const wishZ = right.z * steer.x + drive.z * -steer.z;
      const pushing = applyDrive(body, kind, { x: wishX, z: wishZ });
      if (pushing && state === 'ready') onDrive();
    }

    ball.position.set(body.position.x, body.position.y, body.position.z);
    ball.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);

    const speed = Math.hypot(body.velocity.x, body.velocity.z);
    if (speed > 0.35) {
      look.set(-body.velocity.x, 0, -body.velocity.z).normalize();
    } else {
      camera.getWorldDirection(look);
      look.y = 0;
      look.normalize();
    }
    desired.set(
      body.position.x + look.x * 6.4,
      body.position.y + 3.6,
      body.position.z + look.z * 6.4
    );
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-delta * 4.2);
    camera.position.lerp(desired, alpha);
    camera.lookAt(body.position.x, body.position.y + 0.35, body.position.z);

    if (state === 'rolling' || state === 'ready') {
      if (body.position.y < FALL_Y) {
        onFallen();
        return;
      }
      if (finishBox && pointInAabb(body.position, finishBox) && state === 'rolling') {
        onFinished();
      }
      HAZE_WALK.motes.forEach((mote) => {
        if (takenMotes.includes(mote.id)) return;
        const dist = Math.hypot(
          body.position.x - mote.position[0],
          body.position.y - mote.position[1],
          body.position.z - mote.position[2]
        );
        if (dist < 0.72) onMote(mote.id);
      });
    }
  });

  return (
    <mesh ref={mesh} castShadow>
      <sphereGeometry args={[feel.radius, 32, 24]} />
      <meshStandardMaterial
        color={feel.color}
        roughness={feel.roughness}
        metalness={feel.metalness}
        envMapIntensity={1.1}
      />
    </mesh>
  );
}
