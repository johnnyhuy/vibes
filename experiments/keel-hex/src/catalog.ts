import type { SpeedId, StepInfo } from './types';

export const BRAND = {
  lockup: 'vibes · keel hex',
  name: 'Keel Hex',
  nameZh: '龙骨盘',
  chassis: 'KH-55',
  chassisName: 'Spool Plate',
  chassisZh: '卷盘板',
  bench: 'Spool Bay',
  benchZh: '卷湾',
  lede: 'A hex trainer I laid on a white bench. Twelve marks from plate to petals. Not a product explode.',
};

export const SPEEDS: SpeedId[] = [1, 2, 4];

export const STEPS: StepInfo[] = [
  {
    id: 1,
    name: 'Spool Plate',
    nameZh: '卷盘板',
    copy: 'Hex deck first. Pockets, keel well, six standoffs. The chassis I named KH-55.',
  },
  {
    id: 2,
    name: 'Keel spars',
    nameZh: '龙骨梁',
    copy: 'Six carbon spars walk out from the well. Cable channels face the nest.',
  },
  {
    id: 3,
    name: 'Rotor cups',
    nameZh: '旋杯',
    copy: 'Motor bells seat on the spar rings. Fins, bells, a short shaft each.',
  },
  {
    id: 4,
    name: 'Nest Board',
    nameZh: '巢板',
    copy: 'Celadon nest drops onto the standoffs. Pads, headers, a quiet compass rose.',
  },
  {
    id: 5,
    name: 'Loom traces',
    nameZh: '络线',
    copy: 'Six ribbons leave the nest and find the cups. No brand harness.',
  },
  {
    id: 6,
    name: 'Spool Cell',
    nameZh: '卷芯',
    copy: 'Pewter pack sits in the well. Four cells, two posts, a printed keel mark.',
  },
  {
    id: 7,
    name: 'Bind straps',
    nameZh: '束带',
    copy: 'Two teal cinches hold the cell. Tight enough to fly the bench, not a shop SKU.',
  },
  {
    id: 8,
    name: 'Petal rotors',
    nameZh: '瓣桨',
    copy: 'Six two-blade petals lock onto the shafts. Copper, not a toy orange pack.',
  },
  {
    id: 9,
    name: 'Skid feet',
    nameZh: '滑足',
    copy: 'A pair of landing skids rise under opposite spars. Soft contact on the paper floor.',
  },
  {
    id: 10,
    name: 'Bind pin',
    nameZh: '缚针',
    copy: 'Rear mast and a brass bead. The pin I use to find the bay, not a radio brand.',
  },
  {
    id: 11,
    name: 'Canopy spine',
    nameZh: '脊罩',
    copy: 'A short fairing over the nest. Graphite shell, a slit for the pin.',
  },
  {
    id: 12,
    name: 'Bench complete',
    nameZh: '落台',
    copy: 'Trainer sealed. Orbit the KH-55. Replay walks the twelve marks again.',
  },
];

export function stepById(id: number): StepInfo {
  const clamped = Math.min(STEPS.length, Math.max(1, id));
  return STEPS[clamped - 1];
}

export function clampStep(id: number): number {
  return Math.min(STEPS.length, Math.max(1, Math.round(id)));
}

export const LOOK = {
  hdri: '/hdri/studio-small.hdr',
  bg: '#f3f0ea',
  env: 0.82,
  exposure: 1.12,
  key: '#fff6ea',
  keyInt: 1.15,
  fill: '#d8e4ee',
  fillInt: 0.38,
  rim: '#ffffff',
  rimInt: 0.55,
};
