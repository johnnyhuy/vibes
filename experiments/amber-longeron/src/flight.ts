import type { Hazard, HazardKind, Lane } from './types';

export const LANES = [-2.2, 0, 2.2] as const;
export const LANE_COUNT = 3;
export const BASE_SPEED = 15;
export const MAX_SPEED = 26;
export const LANE_LERP = 12;
export const BANK_GAIN = 0.38;
export const PLANE_Y = 0.92;
export const HIT_DEPTH = 0.78;
export const RING_DEPTH = 0.74;
export const SPAWN_AHEAD = 48;
export const DESPAWN_BEHIND = 12;
export const FIRST_SPAWN = 18;

export function laneX(lane: Lane): number {
  return LANES[lane];
}

export function clampLane(lane: number): Lane {
  return Math.max(0, Math.min(2, lane)) as Lane;
}

export function flightSpeed(distance: number): number {
  return Math.min(MAX_SPEED, BASE_SPEED + distance * 0.024);
}

export function hash(seed: number, salt = 0): number {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function pickLane(seed: number, blocked: Lane[] = []): Lane {
  const open = ([0, 1, 2] as Lane[]).filter((lane) => !blocked.includes(lane));
  const pool = open.length > 0 ? open : ([0, 1, 2] as Lane[]);
  return pool[Math.floor(hash(seed, 3) * pool.length)];
}

interface Beat {
  kind: HazardKind;
  lane: Lane;
}

export function planBeat(seed: number, distance = 0): Beat[] {
  const roll = hash(seed, 1);
  if (distance < 40) {
    if (roll < 0.22) return [{ kind: 'ring', lane: pickLane(seed) }];
    return [{ kind: 'orb', lane: pickLane(seed) }];
  }
  if (roll < 0.16) {
    return [{ kind: 'ring', lane: pickLane(seed) }];
  }
  if (roll < 0.42) {
    const first = pickLane(seed);
    const second = pickLane(seed + 7, [first]);
    return [
      { kind: 'orb', lane: first },
      { kind: 'orb', lane: second }
    ];
  }
  return [{ kind: 'orb', lane: pickLane(seed) }];
}

export function spawnBeat(
  nextId: number,
  z: number,
  seed: number,
  distance = 0
): { hazards: Hazard[]; nextId: number } {
  const beats = planBeat(seed, distance);
  const hazards = beats.map((beat, index) => ({
    id: nextId + index,
    kind: beat.kind,
    lane: beat.lane,
    z,
    seed: seed + index * 17,
    taken: false
  }));
  return { hazards, nextId: nextId + hazards.length };
}

export function nextGap(seed: number, distance: number): number {
  const squeeze = Math.min(3.8, distance * 0.007);
  return 11 + hash(seed, 5) * 5.5 - squeeze;
}

export function collide(kind: HazardKind, planeZ: number, hazardZ: number): boolean {
  const depth = kind === 'ring' ? RING_DEPTH : HIT_DEPTH;
  return Math.abs(planeZ - hazardZ) < depth;
}

export function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.floor(metres)} m`;
  return `${(metres / 1000).toFixed(2)} km`;
}
