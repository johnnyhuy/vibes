import { clampToBasin, heightAt, slopeAt, SPAWN, WATER_LEVEL } from './terrain';
import type { DriveInput, VehicleState } from './types';

export const RIDE_HEIGHT = 0.02;
const MAX_SPEED = 15.4;
const REVERSE = 5.2;
const ACCEL = 11.5;
const BRAKE = 18;
const DRAG = 1.55;
const STEER = 1.42;

export function createVehicle(): VehicleState {
  return resetVehicle({
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
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
  const ground = heightAt(state.x, state.z);
  state.y = ground + RIDE_HEIGHT;
  const slope = slopeAt(state.x, state.z);
  state.pitch = slope.pitch;
  state.roll = slope.roll;
  return state;
}

export function composeDrive(input: DriveInput): { throttle: number; steer: number; brake: boolean } {
  const throttle = Math.max(-1, Math.min(1, input.throttle + input.padThrottle));
  const steer = Math.max(-1, Math.min(1, input.steer + input.padSteer));
  return { throttle, steer, brake: input.brake };
}

export function stepVehicle(state: VehicleState, input: DriveInput, dt: number): void {
  const clampedDt = Math.min(dt, 0.05);
  const drive = composeDrive(input);
  let nextSpeed = state.speed;

  if (drive.brake && nextSpeed > 0.35) {
    nextSpeed -= BRAKE * clampedDt;
  } else if (drive.throttle > 0.05) {
    nextSpeed += ACCEL * drive.throttle * clampedDt;
  } else if (drive.throttle < -0.05) {
    nextSpeed -= (nextSpeed > 0.4 ? BRAKE : ACCEL * 0.55) * Math.abs(drive.throttle) * clampedDt;
  }

  nextSpeed = Math.max(-REVERSE, Math.min(MAX_SPEED, nextSpeed));
  nextSpeed *= Math.exp(-DRAG * clampedDt * (1 + 0.35 * Math.abs(drive.steer)));

  const steerScale = 0.22 + 0.78 * Math.min(1, Math.abs(nextSpeed) / 5.5);
  const yawRate = drive.steer * STEER * steerScale * Math.sign(nextSpeed || 1);
  if (Math.abs(nextSpeed) > 0.12) {
    state.yaw += yawRate * clampedDt;
  }

  const aheadX = state.x + Math.sin(state.yaw) * nextSpeed * clampedDt;
  const aheadZ = state.z + Math.cos(state.yaw) * nextSpeed * clampedDt;
  const climb = heightAt(aheadX, aheadZ) - heightAt(state.x, state.z);
  nextSpeed -= Math.max(-3.2, Math.min(3.2, climb)) * 4.4 * clampedDt;

  let nextX = state.x + Math.sin(state.yaw) * nextSpeed * clampedDt;
  let nextZ = state.z + Math.cos(state.yaw) * nextSpeed * clampedDt;
  const bounded = clampToBasin(nextX, nextZ);
  nextX = bounded.x;
  nextZ = bounded.z;

  const ground = heightAt(nextX, nextZ);
  if (ground < WATER_LEVEL - 0.12) {
    nextSpeed *= 0.84;
  }
  if (ground < WATER_LEVEL - 0.95) {
    nextX = state.x;
    nextZ = state.z;
    nextSpeed *= 0.4;
  }

  state.x = nextX;
  state.z = nextZ;
  state.speed = nextSpeed;
  state.y = heightAt(nextX, nextZ) + RIDE_HEIGHT;
  const slope = slopeAt(nextX, nextZ);
  state.pitch += (slope.pitch - state.pitch) * Math.min(1, clampedDt * 6);
  state.roll += (slope.roll - state.roll) * Math.min(1, clampedDt * 6);
  state.wheel += nextSpeed * clampedDt * 2.4;
}

export function paceKph(speed: number): number {
  return Math.round(Math.abs(speed) * 4.2);
}
