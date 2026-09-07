export type BuildStage = 'podium' | 'frame' | 'storeys' | 'tiles' | 'crown';

export interface BuildLook {
  podium: number;
  storeys: number[];
  roofs: number[];
  finial: number;
  scaffold: number;
  yard: number;
  heaps: number;
  stage: BuildStage;
  stageLabel: string;
}

const STOREY_COUNT = 5;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function band(value: number, start: number, end: number): number {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

export function resolveBuild(growth: number): BuildLook {
  const g = clamp01(growth);
  const podium = band(g, 0.02, 0.2);
  const storeys = Array.from({ length: STOREY_COUNT }, (_, index) =>
    band(g, 0.22 + index * 0.09, 0.3 + index * 0.09)
  );
  const roofs = Array.from({ length: STOREY_COUNT }, (_, index) =>
    band(g, 0.28 + index * 0.09, 0.36 + index * 0.09)
  );
  const finial = band(g, 0.86, 0.98);
  const scaffold = g < 0.08 ? 0 : g < 0.88 ? clamp01((g - 0.08) / 0.18) * (1 - band(g, 0.72, 0.9)) : 0;
  const yard = g < 0.78 ? clamp01(1 - band(g, 0.55, 0.78)) : 0;
  const heaps = g < 0.08 ? band(g, 0, 0.06) : clamp01(1 - band(g, 0.16, 0.42));

  let stage: BuildStage = 'podium';
  if (g >= 0.86) stage = 'crown';
  else if (g >= 0.62) stage = 'tiles';
  else if (g >= 0.34) stage = 'storeys';
  else if (g >= 0.18) stage = 'frame';

  const stageLabel = {
    podium: 'Podium',
    frame: 'Frame',
    storeys: 'Storeys',
    tiles: 'Tiles',
    crown: 'Crown',
  }[stage];

  return { podium, storeys, roofs, finial, scaffold, yard, heaps, stage, stageLabel };
}
