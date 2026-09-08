export const GLADE_RADIUS = 15.4;
export const WALK_SPEED = 3.15;
export const RUN_SPEED = 5.85;
export const MOON = { x: 16, y: 26, z: -20 } as const;

export const TREE_MODELS = [
  '/models/tree_detailed_dark.glb',
  '/models/tree_oak_dark.glb',
  '/models/tree_thin_dark.glb',
  '/models/tree_pineTallA_detailed.glb',
  '/models/tree_pineTallC_detailed.glb',
  '/models/tree_tall_dark.glb',
] as const;

export const ROCK_MODELS = ['/models/rock_largeA.glb', '/models/rock_largeB.glb', '/models/rock_tallA.glb'] as const;

export const LOG_MODEL = '/models/log.glb';

export interface TreeSpot {
  x: number;
  z: number;
  scale: number;
  twist: number;
  lean: number;
  model: (typeof TREE_MODELS)[number];
}

function unit(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export const TREES: TreeSpot[] = Array.from({ length: 20 }, (_, index) => {
  const ring = 11.2 + unit(index + 3) * 4.6;
  const angle = (index / 20) * Math.PI * 2 + unit(index + 9) * 0.28;
  return {
    x: Math.cos(angle) * ring,
    z: Math.sin(angle) * ring * 0.92,
    scale: 0.82 + unit(index + 21) * 0.55,
    twist: unit(index + 41) * Math.PI,
    lean: (unit(index + 17) - 0.5) * 0.18,
    model: TREE_MODELS[index % TREE_MODELS.length],
  };
});

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
    const radius = 1.25 * tree.scale;
    const dist = Math.hypot(dx, dz);
    if (dist < radius && dist > 0.001) {
      const push = (radius - dist) / dist;
      nextX += dx * push;
      nextZ += dz * push;
    }
  }
  return clampToGlade(nextX, nextZ);
}
