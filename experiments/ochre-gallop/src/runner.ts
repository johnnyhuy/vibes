import { clampToWorld, heightAt, slopeAt, SPAWNS } from './terrain';
import type { BiomeId, DriveInput, RunnerState } from './types';

export const RIDE_HEIGHT = 0.62;
const MAX_SPEED = 13.8;
const REVERSE = 4.2;
const ACCEL = 13.2;
const DRAG = 1.35;
const STEER = 1.72;
const BURST_BOOST = 6.4;

export function createRunner(biome: BiomeId): RunnerState {
  return resetRunner(
    {
      x: 0,
      y: 0,
      z: 0,
      yaw: 0,
      pitch: 0,
      roll: 0,
      speed: 0,
      gait: 0,
      burst: 0,
    },
    biome
  );
}

export function resetRunner(state: RunnerState, biome: BiomeId): RunnerState {
  const spawn = SPAWNS[biome];
  state.x = spawn.x;
  state.z = spawn.z;
  state.yaw = spawn.yaw;
  state.speed = 0;
  state.gait = 0;
  state.burst = 0;
  state.y = heightAt(biome, state.x, state.z) + RIDE_HEIGHT;
  const slope = slopeAt(biome, state.x, state.z);
  state.pitch = slope.pitch;
  state.roll = slope.roll;
  return state;
}

export function composeDrive(input: DriveInput): { throttle: number; steer: number; burst: boolean } {
  const throttle = Math.max(-1, Math.min(1, input.throttle + input.padThrottle));
  const steer = Math.max(-1, Math.min(1, input.steer + input.padSteer));
  return { throttle, steer, burst: input.burst };
}

export function stepRunner(state: RunnerState, input: DriveInput, biome: BiomeId, dt: number): void {
  const clampedDt = Math.min(dt, 0.05);
  const drive = composeDrive(input);
  let nextSpeed = state.speed;

  if (drive.burst) {
    state.burst = Math.min(1, state.burst + clampedDt * 3.2);
  } else {
    state.burst = Math.max(0, state.burst - clampedDt * 1.8);
  }

  if (drive.throttle > 0.05) {
    nextSpeed += ACCEL * drive.throttle * clampedDt;
  } else if (drive.throttle < -0.05) {
    nextSpeed -= (nextSpeed > 0.35 ? 16 : ACCEL * 0.5) * Math.abs(drive.throttle) * clampedDt;
  } else if (biome === 'rim') {
    nextSpeed += 4.8 * clampedDt;
  }

  const cap = MAX_SPEED + state.burst * BURST_BOOST;
  nextSpeed = Math.max(-REVERSE, Math.min(cap, nextSpeed));
  nextSpeed *= Math.exp(-DRAG * clampedDt * (1 + 0.28 * Math.abs(drive.steer)));

  const steerScale = 0.28 + 0.72 * Math.min(1, Math.abs(nextSpeed) / 5.2);
  if (Math.abs(nextSpeed) > 0.1) {
    state.yaw += drive.steer * STEER * steerScale * Math.sign(nextSpeed || 1) * clampedDt;
  }

  const climb = heightAt(
    biome,
    state.x + Math.sin(state.yaw) * nextSpeed * clampedDt,
    state.z + Math.cos(state.yaw) * nextSpeed * clampedDt
  ) - heightAt(biome, state.x, state.z);
  nextSpeed -= Math.max(-3.4, Math.min(3.4, climb)) * 4.8 * clampedDt;

  let nextX = state.x + Math.sin(state.yaw) * nextSpeed * clampedDt;
  let nextZ = state.z + Math.cos(state.yaw) * nextSpeed * clampedDt;
  const bounded = clampToWorld(biome, nextX, nextZ);
  nextX = bounded.x;
  nextZ = bounded.z;

  const ground = heightAt(biome, nextX, nextZ);
  if (biome === 'rim' && ground < -4.5) {
    nextSpeed *= 0.35;
  }

  state.x = nextX;
  state.z = nextZ;
  state.speed = nextSpeed;
  state.y = ground + RIDE_HEIGHT;
  const slope = slopeAt(biome, nextX, nextZ);
  state.pitch += (slope.pitch - state.pitch) * Math.min(1, clampedDt * 7);
  state.roll += (slope.roll - state.roll) * Math.min(1, clampedDt * 7);
  state.gait += Math.abs(nextSpeed) * clampedDt * 3.1;
}

export function paceKph(speed: number): number {
  return Math.round(Math.abs(speed) * 4.4);
}
