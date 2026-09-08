import type { BrickSpec, Idea, Look, StepInfo } from './types';

export const BRAND = {
  lockup: 'vibes · kiln studs',
  name: 'Kiln Studs',
  nameZh: '窑钉',
  setName: 'Ember Hare',
  setNameZh: '烬兔',
  setNo: '8',
  motto: 'A sitting hare I named. No loop, no catalog.',
  lede: 'A kiln-hearth hare in studs I laid. Idea to palette only. No buy link, no borrowed set.',
};

export const STUD = 0.32;
export const PLATE_H = STUD * 0.4;
export const BRICK_H = STUD * 1.2;
export const STUD_R = STUD * 0.3;
export const STUD_H = STUD * 0.22;

function spec(
  id: string,
  step: number,
  kind: BrickSpec['kind'],
  w: number,
  d: number,
  x: number,
  y: number,
  z: number,
  color: BrickSpec['color']
): BrickSpec {
  return { id, step, kind, w, d, x, y, z, color };
}

export const SET: BrickSpec[] = [
  spec('plinth', 1, 'plate', 8, 8, 0, 0, 0, 'soot'),
  spec('hearth', 1, 'plate', 6, 6, 0, 1, 0, 'glaze'),
  spec('lip-n', 1, 'plate', 6, 1, 0, 2, -2.5, 'soot'),
  spec('lip-s', 1, 'plate', 6, 1, 0, 2, 2.5, 'soot'),
  spec('lip-w', 1, 'plate', 1, 4, -2.5, 2, 0, 'soot'),
  spec('lip-e', 1, 'plate', 1, 4, 2.5, 2, 0, 'soot'),
  spec('lip-nw', 1, 'plate', 1, 1, -2.5, 2, -2.5, 'soot'),
  spec('lip-ne', 1, 'plate', 1, 1, 2.5, 2, -2.5, 'soot'),
  spec('lip-sw', 1, 'plate', 1, 1, -2.5, 2, 2.5, 'soot'),
  spec('lip-se', 1, 'plate', 1, 1, 2.5, 2, 2.5, 'soot'),

  spec('haunch-l', 2, 'brick', 2, 2, -1.5, 3, -2, 'kiln'),
  spec('haunch-r', 2, 'brick', 2, 2, 1.5, 3, -2, 'kiln'),
  spec('pelvis', 2, 'brick', 2, 2, 0, 3, -1, 'kiln'),
  spec('paw-l', 2, 'plate', 2, 1, -1.5, 3, 2, 'kiln'),
  spec('paw-r', 2, 'plate', 2, 1, 1.5, 3, 2, 'kiln'),
  spec('toe-l', 2, 'plate', 1, 1, -1.5, 4, 2.5, 'slip'),
  spec('toe-r', 2, 'plate', 1, 1, 1.5, 4, 2.5, 'slip'),

  spec('belly', 3, 'brick', 4, 2, 0, 3, 0.5, 'kiln'),
  spec('saddle', 3, 'plate', 4, 2, 0, 6, 0, 'kiln'),
  spec('flank-l', 3, 'plate', 1, 2, -2, 6, 0.5, 'kiln'),
  spec('flank-r', 3, 'plate', 1, 2, 2, 6, 0.5, 'kiln'),
  spec('rump', 3, 'brick', 2, 2, 0, 6, -1.5, 'kiln'),

  spec('chest', 4, 'plate', 2, 2, 0, 7, 1, 'slip'),
  spec('bib', 4, 'plate', 2, 1, 0, 8, 1.5, 'slip'),
  spec('sternum', 4, 'plate', 2, 1, 0, 6, 1.5, 'slip'),

  spec('head', 5, 'brick', 2, 2, 0, 9, 1.5, 'kiln'),
  spec('muzzle', 5, 'plate', 2, 1, 0, 9, 2.5, 'slip'),
  spec('chin', 5, 'plate', 2, 1, 0, 10, 2.5, 'slip'),
  spec('crown', 5, 'plate', 2, 2, 0, 12, 1.5, 'kiln'),

  spec('ear-l', 6, 'brick', 1, 1, -0.5, 13, 1, 'kiln'),
  spec('ear-r', 6, 'brick', 1, 1, 0.5, 13, 1, 'kiln'),
  spec('tip-l', 6, 'plate', 1, 1, -0.5, 16, 1, 'ember'),
  spec('tip-r', 6, 'plate', 1, 1, 0.5, 16, 1, 'ember'),

  spec('tail', 7, 'round', 1, 1, 0, 6, -2.5, 'kiln'),
  spec('puff', 7, 'plate', 1, 1, 0, 9, -2.5, 'ember'),
  spec('puff-2', 7, 'tile', 1, 1, 0, 10, -2.5, 'slip'),

  spec('eye-l', 8, 'tile', 1, 1, -0.5, 11, 2.5, 'soot'),
  spec('eye-r', 8, 'tile', 1, 1, 0.5, 11, 2.5, 'soot'),
  spec('nose', 8, 'tile', 1, 1, 0, 9, 3, 'ember'),
  spec('pot', 8, 'round', 2, 2, -3, 3, -1.5, 'glaze'),
  spec('pot-lip', 8, 'plate', 2, 2, -3, 6, -1.5, 'soot'),
  spec('coal', 8, 'round', 1, 1, -3, 7, -1.5, 'ember'),
];

export const STEPS: StepInfo[] = [
  { id: 1, name: 'Kiln plinth', nameZh: '窑座', copy: 'Soot plate, glaze hearth, a shallow lip.' },
  { id: 2, name: 'Haunches', nameZh: '后腿', copy: 'Two haunches, a pelvis, cream toe pads.' },
  { id: 3, name: 'Torso', nameZh: '躯', copy: 'Belly, saddle, flanks, a raised rump.' },
  { id: 4, name: 'Chest slip', nameZh: '陶浆胸', copy: 'Cream plates on the breast.' },
  { id: 5, name: 'Head', nameZh: '头', copy: 'A 2×2 head, muzzle, chin, crown.' },
  { id: 6, name: 'Ears', nameZh: '耳', copy: 'Two tall ears with ember tips.' },
  { id: 7, name: 'Tail', nameZh: '尾', copy: 'A round puff behind the rump.' },
  { id: 8, name: 'Marks', nameZh: '火记', copy: 'Eyes, a nose, and a small kiln pot.' },
];

export const IDEAS: Idea[] = [
  {
    id: 'dusk-hare',
    name: 'Dusk hare',
    nameZh: '昏兔',
    prompt: 'A sitting hare on a kiln hearth at dusk.',
    palette: {
      kiln: '#b85a32',
      ember: '#e07a38',
      slip: '#e8d2b4',
      soot: '#241814',
      glaze: '#8a3a28',
    },
  },
  {
    id: 'clay-slip',
    name: 'Clay slip',
    nameZh: '陶浆',
    prompt: 'Wet clay and cream slip on a potter’s bench.',
    palette: {
      kiln: '#c48a54',
      ember: '#d46838',
      slip: '#f3ead8',
      soot: '#3a2a22',
      glaze: '#a06040',
    },
  },
  {
    id: 'pewter-ash',
    name: 'Pewter ash',
    nameZh: '锡灰',
    prompt: 'Cool ash after the last firing.',
    palette: {
      kiln: '#8a7a72',
      ember: '#c47858',
      slip: '#ddd6cc',
      soot: '#1c1a1c',
      glaze: '#5a5458',
    },
  },
];

export const LOOKS: Look[] = [
  {
    id: 'studio',
    name: 'Studio',
    preset: 'apartment',
    env: 0.34,
    key: '#f2e6d4',
    keyInt: 1.22,
    fill: '#8aa0b8',
    fillInt: 0.32,
    rim: '#c47858',
    rimInt: 0.38,
    exposure: 1.04,
    bg: '#0c0a0c',
    bloom: 0.42,
  },
  {
    id: 'kiln-dusk',
    name: 'Kiln dusk',
    preset: 'sunset',
    env: 0.3,
    key: '#f0b078',
    keyInt: 1.4,
    fill: '#6a4058',
    fillInt: 0.28,
    rim: '#e07a38',
    rimInt: 0.55,
    exposure: 0.94,
    bg: '#140e0c',
    bloom: 0.58,
  },
  {
    id: 'pewter',
    name: 'Pewter',
    preset: 'night',
    env: 0.4,
    key: '#d8dde4',
    keyInt: 1.08,
    fill: '#6a7888',
    fillInt: 0.42,
    rim: '#9aa8b8',
    rimInt: 0.28,
    exposure: 1.1,
    bg: '#0a0c10',
    bloom: 0.34,
  },
];

export const DEFAULTS = {
  idea: 'dusk-hare' as const,
  look: 'studio' as const,
  mode: 'assemble' as const,
  step: STEPS.length,
};

export function ideaById(id: Idea['id']): Idea {
  return IDEAS.find((idea) => idea.id === id) ?? IDEAS[0];
}

export function lookById(id: Look['id']): Look {
  return LOOKS.find((look) => look.id === id) ?? LOOKS[0];
}

export function stepById(id: number): StepInfo {
  return STEPS.find((step) => step.id === id) ?? STEPS[STEPS.length - 1];
}

export function nextIdea(id: Idea['id']): Idea['id'] {
  const index = IDEAS.findIndex((idea) => idea.id === id);
  return IDEAS[(index + 1) % IDEAS.length].id;
}

export function nextLook(id: Look['id']): Look['id'] {
  const index = LOOKS.findIndex((look) => look.id === id);
  return LOOKS[(index + 1) % LOOKS.length].id;
}
