import type { Slip, SlipId } from './types';

export const SLIPS: Slip[] = [
  {
    id: 'oak',
    x: 2.55,
    z: 4.15,
    title: 'Listening oak',
    verse: 'The hill keeps every quiet step and gives none of them back.',
  },
  {
    id: 'seat',
    x: -2.55,
    z: 2.15,
    title: 'Log seat',
    verse: 'Sit until the lake finishes its sentence.',
  },
  {
    id: 'cairn',
    x: -7.55,
    z: 0.85,
    title: 'Ribbon cairn',
    verse: 'Cloth on stone: a promise the wind can still read.',
  },
  {
    id: 'bothy',
    x: 9.55,
    z: -0.35,
    title: 'Reed bothy',
    verse: 'A lean-to is enough when the sun is kind.',
  },
  {
    id: 'wheel',
    x: 7.45,
    z: -6.15,
    title: 'Mill race',
    verse: 'The wheel turns; I do not hurry it.',
  },
  {
    id: 'stones',
    x: 4.35,
    z: -12.4,
    title: 'Ford stones',
    verse: 'One stone, then the next. That is the crossing.',
  },
  {
    id: 'isle',
    x: 4.85,
    z: -18.85,
    title: 'Near isle',
    verse: 'I wrote this where the water forgets the shore.',
  },
  {
    id: 'west',
    x: -12.8,
    z: 0.4,
    title: 'West knoll',
    verse: 'West light makes the reeds look like writing.',
  },
];

export const SLIP_COUNT = SLIPS.length;

export function slipById(id: SlipId): Slip {
  const found = SLIPS.find((slip) => slip.id === id);
  if (!found) throw new Error(`Unknown breeze slip: ${id}`);
  return found;
}

export function gatherNearby(
  gathered: readonly SlipId[],
  x: number,
  z: number,
  radius = 1.5
): Slip | null {
  for (const slip of SLIPS) {
    if (gathered.includes(slip.id)) continue;
    if (Math.hypot(slip.x - x, slip.z - z) <= radius) return slip;
  }
  return null;
}
