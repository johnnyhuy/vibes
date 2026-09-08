export const VALE_RADIUS = 38;
export const WATER_LEVEL = 0.46;
export const WALK_SPEED = 3.35;
export const RUN_SPEED = 5.4;
export const SUN = { x: 18, y: 34, z: 14 } as const;

export const LANDMARKS = {
  oak: { x: 1.55, z: 2.35 },
  seat: { x: -1.85, z: 0.15 },
  cairn: { x: -5.15, z: 2.05 },
  bothy: { x: 5.85, z: 1.45 },
  wheel: { x: 4.95, z: -4.35 },
  shore: { x: 1.15, z: -6.25 },
  west: { x: -5.85, z: 2.55 },
  isleA: { x: 7.2, z: -14.5 },
} as const;

export const ISLES = [
  { x: 7.2, z: -14.5, s: 3.15 },
  { x: -11.4, z: -18.2, s: 3.55 },
  { x: 16.8, z: -21.4, s: 2.95 },
  { x: -3.4, z: -26.2, s: 2.75 },
  { x: 20.4, z: -8.6, s: 2.45 },
  { x: -18.6, z: -11.8, s: 2.25 },
  { x: 12.2, z: -32.0, s: 2.85 },
] as const;

export interface TreeSpot {
  x: number;
  z: number;
  scale: number;
  twist: number;
  kind: 'pine' | 'broad';
}

export function unit(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function heightAt(x: number, z: number): number {
  const dx = x;
  const dz = z - 1.15;
  const r2 = dx * dx + dz * dz;
  const main = Math.exp(-r2 * 0.021) * 4.55;
  const skirt = Math.exp(-r2 * 0.0085) * 0.72;
  let isles = 0;
  for (const isle of ISLES) {
    const ir = (x - isle.x) ** 2 + (z - isle.z) ** 2;
    isles += Math.exp(-ir * 0.048) * isle.s;
  }
  const ford = Math.exp(-((x - 4.15) ** 2) * 0.4) * Math.exp(-((z + 8.4) ** 2) * 0.068) * 1.62;
  const roll = Math.sin(x * 0.28) * Math.cos(z * 0.22) * 0.1 * Math.exp(-r2 * 0.012);
  return Math.max(-0.2, main + skirt + isles + ford + roll);
}

export const TREES: TreeSpot[] = [
  ...Array.from({ length: 14 }, (_, index) => {
    const ring = 6.4 + unit(index + 3) * 2.8;
    const angle = (index / 14) * Math.PI * 1.7 + 0.4 + unit(index + 9) * 0.2;
    return {
      x: Math.cos(angle) * ring,
      z: Math.sin(angle) * ring * 0.72 + 1.1,
      scale: 0.72 + unit(index + 21) * 0.42,
      twist: unit(index + 41) * Math.PI,
      kind: (unit(index + 7) > 0.42 ? 'pine' : 'broad') as TreeSpot['kind'],
    };
  }),
  ...ISLES.flatMap((isle, isleIndex) =>
    Array.from({ length: 7 }, (_, index) => {
      const seed = isleIndex * 17 + index;
      const angle = (index / 7) * Math.PI * 2 + unit(seed + 2);
      const radius = 0.7 + unit(seed + 5) * (1.1 + isle.s * 0.18);
      return {
        x: isle.x + Math.cos(angle) * radius,
        z: isle.z + Math.sin(angle) * radius,
        scale: 0.55 + unit(seed + 8) * 0.45,
        twist: unit(seed + 11) * Math.PI,
        kind: (unit(seed + 4) > 0.3 ? 'pine' : 'broad') as TreeSpot['kind'],
      };
    })
  ),
];

const BLOCKERS = [
  { x: LANDMARKS.oak.x, z: LANDMARKS.oak.z, r: 1.05 },
  { x: LANDMARKS.bothy.x, z: LANDMARKS.bothy.z, r: 1.35 },
  { x: LANDMARKS.wheel.x, z: LANDMARKS.wheel.z, r: 1.05 },
  { x: LANDMARKS.cairn.x, z: LANDMARKS.cairn.z, r: 0.65 },
  ...TREES.filter((tree) => heightAt(tree.x, tree.z) > WATER_LEVEL + 0.4).map((tree) => ({
    x: tree.x,
    z: tree.z,
    r: 0.48 * tree.scale,
  })),
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
  if (heightAt(pushed.x, pushed.z) < WATER_LEVEL - 0.28) {
    return { x: fromX, z: fromZ };
  }
  return pushed;
}

export const PATH: Array<[number, number]> = [
  [0.15, 2.4],
  [0.55, 0.85],
  [1.35, -0.85],
  [2.45, -2.85],
  [3.45, -4.85],
  [4.05, -6.85],
  [4.2, -8.55],
  [5.15, -11.2],
];
