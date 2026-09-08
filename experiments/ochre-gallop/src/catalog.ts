import type { BiomeId, PlayPhase } from './types';

export const BRAND = {
  lockup: 'vibes · ochre gallop',
  name: 'Ochre Gallop',
  nameZh: '赭奔',
  lede: 'Three invented highlands. One ash-maned runner. Cut the ribbon, break the plume, drift the shelf.',
} as const;

export const RUNNER = {
  name: 'Ashmane',
  nameZh: '灰鬃',
  code: 'AM-07',
  hide: 'umber hide, ash mane, no park brand',
} as const;

export interface BiomeSpec {
  id: BiomeId;
  name: string;
  nameZh: string;
  loop: string;
  loopZh: string;
  feel: string;
  copy: string;
  key: string;
}

export const BIOMES: BiomeSpec[] = [
  {
    id: 'terrace',
    name: 'Sulfur Terrace',
    nameZh: '硫阶',
    loop: 'Ribbon Cut',
    loopZh: '缎切',
    feel: 'weave',
    copy: 'Concentric mineral lips. Pass the ochre gates in order. Miss a cone and the ribbon resets.',
    key: '1',
  },
  {
    id: 'basin',
    name: 'Spout Basin',
    nameZh: '喷盆',
    loop: 'Plume Break',
    loopZh: '羽突',
    feel: 'escape',
    copy: 'A steam front walks the sinter. Reach Clear Crust before the plume takes the mane.',
    key: '2',
  },
  {
    id: 'rim',
    name: 'Rim Overlook',
    nameZh: '檐望',
    loop: 'Shelf Drift',
    loopZh: '檐漂',
    feel: 'endless',
    copy: 'A narrow shelf over an invented canyon. Hold the line. Distance is the score.',
    key: '3',
  },
];

export function biomeAt(id: BiomeId): BiomeSpec {
  return BIOMES.find((item) => item.id === id) ?? BIOMES[0];
}

export function cycleBiome(id: BiomeId): BiomeId {
  const index = BIOMES.findIndex((item) => item.id === id);
  return BIOMES[(index + 1) % BIOMES.length].id;
}

export function phaseLabel(phase: PlayPhase): string {
  if (phase === 'cleared') return 'cleared';
  if (phase === 'caught') return 'caught';
  if (phase === 'running') return 'in stride';
  return 'ready';
}
