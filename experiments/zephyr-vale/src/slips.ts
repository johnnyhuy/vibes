import type { Slip, SlipId } from './types';
import { LANDMARKS } from './world';

export const SLIPS: Slip[] = [
  {
    id: 'oak',
    x: LANDMARKS.oak.x + 0.85,
    z: LANDMARKS.oak.z + 0.55,
    title: 'Listening oak',
    verse: 'The hill keeps every quiet step and gives none of them back.',
  },
  {
    id: 'seat',
    x: LANDMARKS.seat.x - 0.35,
    z: LANDMARKS.seat.z - 0.55,
    title: 'Log seat',
    verse: 'Sit until the lake finishes its sentence.',
  },
  {
    id: 'cairn',
    x: LANDMARKS.cairn.x + 0.55,
    z: LANDMARKS.cairn.z - 0.35,
    title: 'Ribbon cairn',
    verse: 'Cloth on stone: a promise the wind can still read.',
  },
  {
    id: 'bothy',
    x: LANDMARKS.bothy.x - 1.05,
    z: LANDMARKS.bothy.z - 0.45,
    title: 'Reed bothy',
    verse: 'A lean-to is enough when the sun is kind.',
  },
  {
    id: 'wheel',
    x: LANDMARKS.wheel.x - 0.85,
    z: LANDMARKS.wheel.z + 0.45,
    title: 'Mill race',
    verse: 'The wheel turns; I do not hurry it.',
  },
  {
    id: 'stones',
    x: 4.15,
    z: -8.35,
    title: 'Ford stones',
    verse: 'One stone, then the next. That is the crossing.',
  },
  {
    id: 'isle',
    x: LANDMARKS.isleA.x - 0.4,
    z: LANDMARKS.isleA.z + 0.55,
    title: 'Near isle',
    verse: 'I wrote this where the water forgets the shore.',
  },
  {
    id: 'west',
    x: LANDMARKS.west.x + 0.45,
    z: LANDMARKS.west.z - 0.35,
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
