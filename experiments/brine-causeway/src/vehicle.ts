import { clampWorld, nearestOnPath, ROAD_HALF, SHOULDER, SPAWN } from './road';
import type { DriveInput, VehicleState } from './types';

export const RIDE_HEIGHT = 0.02;
const MAX_SPEED = 22;
const REVERSE = 6.4;
const ACCEL = 14.5;
const BRAKE = 22;
const DRAG = 1.18;
const STEER = 1.55;

export function createVehicle(): VehicleState {
  return resetVehicle({
    x: 0,
    y: RIDE_HEIGHT,
    z: 0,
    yaw: 0,
    speed: 0,
    wheel: 0,
  });
}

export function resetVehicle(state: VehicleState): VehicleState {
  state.x = SPAWN.x;
  state.z = SPAWN.z;
  state.yaw = SPAWN.yaw;
  state.speed = 0;
  state.wheel = 0;
  state.y = RIDE_HEIGHT;
  return state;
}

export function composeDrive(input: DriveInput): { throttle: number; steer: number; brake: boolean } {
  const throttle = Math.max(-1, Math.min(1, input.throttle + input.padThrottle));
  const steer = Math.max(-1, Math.min(1, input.steer + input.padSteer));
  return { throttle, steer, brake: input.brake };
}

export function stepVehicle(state: VehicleState, input: DriveInput, dt: number, driving: boolean): void {
  const clampedDt = Math.min(dt, 0.05);
  if (!driving) {
    state.speed = 0;
    state.y = RIDE_HEIGHT;
    return;
  }

  const drive = composeDrive(input);
  let nextSpeed = state.speed;

  if (drive.brake && nextSpeed > 0.28) {
    nextSpeed -= BRAKE * clampedDt;
  } else if (drive.throttle > 0.05) {
    nextSpeed += ACCEL * drive.throttle * clampedDt;
  } else if (drive.throttle < -0.05) {
    nextSpeed -= (nextSpeed > 0.35 ? BRAKE : ACCEL * 0.5) * Math.abs(drive.throttle) * clampedDt;
  }

  nextSpeed = Math.max(-REVERSE, Math.min(MAX_SPEED, nextSpeed));
  nextSpeed *= Math.exp(-DRAG * clampedDt * (1 + 0.28 * Math.abs(drive.steer)));

  const steerScale = 0.18 + 0.82 * Math.min(1, Math.abs(nextSpeed) / 6.2);
  if (Math.abs(nextSpeed) > 0.1) {
    state.yaw += drive.steer * STEER * steerScale * Math.sign(nextSpeed || 1) * clampedDt;
  }

  let nextX = state.x + Math.sin(state.yaw) * nextSpeed * clampedDt;
  let nextZ = state.z + Math.cos(state.yaw) * nextSpeed * clampedDt;
  const found = nearestOnPath(nextX, nextZ);
  const limit = ROAD_HALF + SHOULDER;
  if (Math.abs(found.lateral) > limit) {
    const over = Math.abs(found.lateral) - limit;
    const push = Math.min(1, over * 0.55);
    const nx = Math.cos(found.yaw);
    const nz = -Math.sin(found.yaw);
    const sign = Math.sign(found.lateral);
    nextX -= nx * sign * push;
    nextZ -= nz * sign * push;
    nextSpeed *= 0.86;
  }

  const bounded = clampWorld(nextX, nextZ);
  state.x = bounded.x;
  state.z = bounded.z;
  state.speed = nextSpeed;
  state.y = RIDE_HEIGHT;
  state.wheel += nextSpeed * clampedDt * 2.15;
}

export function paceKph(speed: number): number {
  return Math.round(Math.abs(speed) * 5.4);
}
