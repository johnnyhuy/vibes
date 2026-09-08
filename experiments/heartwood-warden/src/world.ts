export const GLADE_RADIUS = 15.4;
export const WALK_SPEED = 3.15;
export const RUN_SPEED = 5.85;
export const MOON = { x: 16, y: 26, z: -20 } as const;

export const HERO_TREE = '/models/quiver-hero.glb';
export const SPARE_TREE = '/models/quiver-spare.glb';
export const FIR_TREE = '/models/fir-canopy.glb';
export const STUMP_MODEL = '/models/stump.glb';
export const ROCK_MODEL = '/models/moss-rocks.glb';
export const SHRUB_MODEL = '/models/undergrowth.glb';
export const LOG_MODEL = '/models/fallen-trunk.glb';

export const FOREST_MODELS = [
  HERO_TREE,
  SPARE_TREE,
  FIR_TREE,
  STUMP_MODEL,
  ROCK_MODEL,
  SHRUB_MODEL,
  LOG_MODEL,
] as const;

export interface PropSpot {
  x: number;
  z: number;
  scale: number;
  twist: number;
  lean: number;
  model: (typeof FOREST_MODELS)[number];
  span: number;
}

function unit(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function place(
  index: number,
  ring: number,
  count: number,
  model: PropSpot['model'],
  span: number,
  scale: number
): PropSpot {
  const angle = (index / count) * Math.PI * 2 + unit(index + 9) * 0.22;
  return {
    x: Math.cos(angle) * ring,
    z: Math.sin(angle) * ring * 0.92,
    scale,
    twist: unit(index + 41) * Math.PI,
    lean: (unit(index + 17) - 0.5) * 0.08,
    model,
    span,
  };
}

/** Collision hulls — canopy trees only. Undergrowth is walkable. */
export const TREES: PropSpot[] = [
  ...Array.from({ length: 6 }, (_, index) =>
    place(index, 7.15 + unit(index + 3) * 0.7, 6, HERO_TREE, 7.4, 1.08 + unit(index + 21) * 0.22)
  ),
  ...Array.from({ length: 8 }, (_, index) =>
    place(index + 6, 11.4 + unit(index + 13) * 2.1, 8, SPARE_TREE, 5.6, 1.05 + unit(index + 33) * 0.28)
  ),
  ...Array.from({ length: 2 }, (_, index) =>
    place(index + 20, 13.6, 2, FIR_TREE, 6.8, 1.15 + unit(index + 7) * 0.12)
  ),
];

export const UNDERGROWTH: PropSpot[] = [
  ...Array.from({ length: 5 }, (_, index) =>
    place(index + 40, 5.7, 5, ROCK_MODEL, 1.35, 0.85 + unit(index + 5) * 0.2)
  ),
  ...Array.from({ length: 4 }, (_, index) =>
    place(index + 50, 8.8 + unit(index) * 1.4, 4, STUMP_MODEL, 1.15, 0.9 + unit(index + 11) * 0.18)
  ),
  ...Array.from({ length: 6 }, (_, index) =>
    place(index + 60, 6.4 + unit(index + 2) * 3.2, 6, SHRUB_MODEL, 1.45, 0.95 + unit(index + 19) * 0.25)
  ),
];

export const LOGS: PropSpot[] = [
  { x: -3.8, z: -4.2, scale: 1, twist: 1.1, lean: 0, model: LOG_MODEL, span: 2.4 },
  { x: 4.6, z: 3.2, scale: 0.86, twist: 0.7, lean: 0.04, model: LOG_MODEL, span: 2.1 },
];

export function clampToGlade(x: number, z: number): { x: number; z: number } {
  const length = Math.hypot(x, z);
  if (length <= GLADE_RADIUS) return { x, z };
  const scale = GLADE_RADIUS / length;
  return { x: x * scale, z: z * scale };
}

export function pushFromTrees(x: number, z: number): { x: number; z: number } {
  let nextX = x;
  let nextZ = z;
  for (const tree of TREES) {
    const dx = nextX - tree.x;
    const dz = nextZ - tree.z;
    const radius = 1.05 * tree.scale;
    const dist = Math.hypot(dx, dz);
    if (dist < radius && dist > 0.001) {
      const push = (radius - dist) / dist;
      nextX += dx * push;
      nextZ += dz * push;
    }
  }
  return clampToGlade(nextX, nextZ);
}
