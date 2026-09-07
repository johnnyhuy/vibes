import * as CANNON from 'cannon-es';
import { Euler, Quaternion } from 'three';
import { BALL_FEEL, GRAVITY_Y, PATH_FRICTION, PATH_RESTITUTION } from './materials';
import type { BallKind } from './types';
import { PlayError } from './types';

const euler = new Euler();
const quat = new Quaternion();

export const PATH_MATERIAL = new CANNON.Material('path');
export const BALL_MATERIALS: Record<BallKind, CANNON.Material> = {
  wood: new CANNON.Material('wood'),
  stone: new CANNON.Material('stone'),
  metal: new CANNON.Material('metal')
};

export function createWorld(): CANNON.World {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, GRAVITY_Y, 0)
  });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = false;
  world.defaultContactMaterial.friction = PATH_FRICTION;
  world.defaultContactMaterial.restitution = PATH_RESTITUTION;

  (Object.keys(BALL_MATERIALS) as BallKind[]).forEach((kind) => {
    const feel = BALL_FEEL[kind];
    world.addContactMaterial(
      new CANNON.ContactMaterial(BALL_MATERIALS[kind], PATH_MATERIAL, {
        friction: feel.friction,
        restitution: feel.restitution,
        contactEquationStiffness: 1e7,
        contactEquationRelaxation: 3
      })
    );
  });

  return world;
}

export function createPathBody(segment: {
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
}): CANNON.Body {
  const [w, h, d] = segment.size;
  const body = new CANNON.Body({
    mass: 0,
    material: PATH_MATERIAL,
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2))
  });
  body.position.set(...segment.position);
  euler.set(segment.rotation[0], segment.rotation[1], segment.rotation[2], 'YXZ');
  quat.setFromEuler(euler);
  body.quaternion.set(quat.x, quat.y, quat.z, quat.w);
  return body;
}

export function createBallBody(kind: BallKind, origin: [number, number, number]): CANNON.Body {
  const feel = BALL_FEEL[kind];
  if (feel.radius <= 0 || feel.mass <= 0) {
    throw new PlayError('bad-feel', `Ball feel ${kind} has invalid mass or radius`);
  }

  const body = new CANNON.Body({
    mass: feel.mass,
    material: BALL_MATERIALS[kind],
    linearDamping: feel.linearDamping,
    angularDamping: feel.angularDamping,
    shape: new CANNON.Sphere(feel.radius),
    allowSleep: false
  });
  body.position.set(...origin);
  return body;
}

export function applyDrive(
  body: CANNON.Body,
  kind: BallKind,
  input: { x: number; z: number }
): boolean {
  const feel = BALL_FEEL[kind];
  const length = Math.hypot(input.x, input.z);
  if (length < 0.05) return false;
  const scale = feel.drive / length;
  body.applyForce(new CANNON.Vec3(input.x * scale, 0, input.z * scale), body.position);
  return true;
}
