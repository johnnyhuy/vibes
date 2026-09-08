import type { PlateKind } from './types';

export const PLATE_COUNT = 10;

export const PLATE_POINTS: Record<PlateKind, number> = {
  pleat: 12,
  soup: 20,
  moon: 36,
  chili: 0,
  tea: 4,
};

export const PLATE_LABEL: Record<PlateKind, string> = {
  pleat: 'pleat dumpling',
  soup: 'soup dumpling',
  moon: 'moon coin',
  chili: 'chili slick',
  tea: 'tea-leaf sprig',
};

export function hash(seed: number, salt = 0): number {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function pickPlateKind(seed: number): PlateKind {
  const roll = hash(seed, 11);
  if (roll < 0.1) return 'chili';
  if (roll < 0.18) return 'tea';
  if (roll < 0.26) return 'moon';
  if (roll < 0.5) return 'soup';
  return 'pleat';
}

export function isEdibleScore(kind: PlateKind): boolean {
  return kind === 'pleat' || kind === 'soup' || kind === 'moon';
}

export function plateValue(kind: PlateKind, chain: number): number {
  const base = PLATE_POINTS[kind];
  if (!isEdibleScore(kind) || chain <= 1) return base;
  return base + Math.min(12, (chain - 1) * 4);
}
