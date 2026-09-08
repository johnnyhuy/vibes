export const VALE_RADIUS = 36;
export const WATER_LEVEL = 0.28;
export const WALK_SPEED = 3.35;
export const RUN_SPEED = 5.4;
export const SUN = { x: 22, y: 30, z: 10 } as const;

export const LANDMARKS = {
  oak: { x: 3.45, z: 5.55 },
  seat: { x: -2.35, z: 2.55 },
  cairn: { x: -8.15, z: 1.15 },
  bothy: { x: 10.35, z: 0.35 },
  wheel: { x: 8.15, z: -6.85 },
  shore: { x: 2.2, z: -8.55 },
  west: { x: -13.6, z: 0.75 },
  isleA: { x: 5.0, z: -19.5 },
  isleB: { x: -9.5, z: -24.0 },
  isleC: { x: 14.0, z: -27.0 },
} as const;

export interface TreeSpot {
  x: number;
  z: number;
  scale: number;
  twist: number;
  kind: 'pine' | 'broad';
}

function unit(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function heightAt(x: number, z: number): number {
  const knoll = Math.exp(-(x * x + (z - 3) * (z - 3)) * 0.016) * 2.55;
  const east = Math.exp(-((x - 17) ** 2 + (z - 1) ** 2) * 0.008) * 2.05;
  const west = Math.exp(-((x + 15) ** 2 + (z + 2) ** 2) * 0.01) * 1.55;
  const roll = Math.sin(x * 0.1 + 1.1) * Math.cos(z * 0.08) * 0.3;
  const slope = 0.78 - Math.max(0, -z - 1.2) * 0.12;
  const isleA = Math.exp(-((x - 5) ** 2 + (z + 19.5) ** 2) * 0.085) * 1.72;
  const isleB = Math.exp(-((x + 9.5) ** 2 + (z + 24) ** 2) * 0.065) * 1.9;
  const isleC = Math.exp(-((x - 14) ** 2 + (z + 27) ** 2) * 0.05) * 1.38;
  const ford =
    Math.exp(-((x - 4.4) ** 2) * 0.38) * Math.max(0, 1 - Math.abs(z + 12.5) / 7.6) * 1.05;
  return Math.max(-0.55, slope + knoll + east + west + roll + isleA + isleB + isleC + ford);
}

export const TREES: TreeSpot[] = Array.from({ length: 22 }, (_, index) => {
  const ring = 12.4 + unit(index + 3) * 7.2;
  const angle = (index / 22) * Math.PI * 1.15 + 0.35 + unit(index + 9) * 0.22;
  return {
    x: Math.cos(angle) * ring,
    z: Math.sin(angle) * ring * 0.55 + 1.4,
    scale: 0.78 + unit(index + 21) * 0.5,
    twist: unit(index + 41) * Math.PI,
    kind: unit(index + 7) > 0.38 ? 'pine' : 'broad',
  };
});

const BLOCKERS = [
  { x: LANDMARKS.oak.x, z: LANDMARKS.oak.z, r: 0.9 },
  { x: LANDMARKS.bothy.x, z: LANDMARKS.bothy.z, r: 1.45 },
  { x: LANDMARKS.wheel.x, z: LANDMARKS.wheel.z, r: 1.15 },
  { x: LANDMARKS.cairn.x, z: LANDMARKS.cairn.z, r: 0.7 },
  ...TREES.map((tree) => ({ x: tree.x, z: tree.z, r: 0.55 * tree.scale })),
];

export function clampToVale(x: number, z: number): { x: number; z: number } {
  const length = Math.hypot(x, z);
  if (length <= VALE_RADIUS) return { x, z };
  const scale = VALE_RADIUS / length;
  return { x: x * scale, z: z * scale };
}

export function pushFromBlockers(x: number, z: number): { x: number; z: number } {
  let nextX = x;
  let nextZ = z;
  for (const blocker of BLOCKERS) {
    const dx = nextX - blocker.x;
    const dz = nextZ - blocker.z;
    const dist = Math.hypot(dx, dz);
    if (dist < blocker.r && dist > 0.001) {
      const push = (blocker.r - dist) / dist;
      nextX += dx * push;
      nextZ += dz * push;
    }
  }
  return clampToVale(nextX, nextZ);
}

export function tryStep(fromX: number, fromZ: number, toX: number, toZ: number): { x: number; z: number } {
  const pushed = pushFromBlockers(toX, toZ);
  if (heightAt(pushed.x, pushed.z) < WATER_LEVEL - 0.34) {
    return { x: fromX, z: fromZ };
  }
  return pushed;
}

export const PATH: Array<[number, number]> = [
  [0.1, 3.2],
  [0.8, 1.4],
  [1.8, -0.6],
  [2.9, -3.2],
  [3.8, -6.4],
  [4.3, -9.6],
  [4.4, -12.5],
  [4.6, -15.4],
];
