import type { Mark } from './types';

export const BRAND = {
  lockup: 'vibes · breakwater',
  name: 'Breakwater',
  nameLabel: 'Harbour study',
  lede: 'Explore a mechanical walker on a dusk pier. Move between three viewpoints and change the light.',
};

export const WALKER = {
  name: 'Spile Frame',
  nameLabel: 'Harbour walker',
  code: 'SF-04 HARBOUR',
  mass: '4,820 t',
  plant: 'Ballast pile-ram / hook',
  stance: 'Tide settle',
};

export const MARKS: Mark[] = [
  {
    id: 'spile',
    name: 'Spile Frame',
    nameLabel: 'Harbour walker',
    copy: 'A heavy harbour walker, balanced on broad feet above the seaward deck.',
    target: [0, 3.05, 1.6],
    camera: [-10.4, 5.7, 13.2],
    minDistance: 7,
    maxDistance: 26,
  },
  {
    id: 'groyne',
    name: 'Groyne Head',
    nameLabel: 'Groyne Head',
    copy: 'Interlocking concrete tetrapods break the incoming swell.',
    target: [-11.2, 1.15, -5.4],
    camera: [-2.4, 6.8, 8.6],
    minDistance: 8,
    maxDistance: 30,
  },
  {
    id: 'gate',
    name: 'Tide Gate',
    nameLabel: 'Tide Gate',
    copy: 'Twin lock towers frame the sluice at the edge of the harbour.',
    target: [7.8, 2.6, 16.4],
    camera: [-2.2, 6.2, 24.5],
    minDistance: 7,
    maxDistance: 28,
  },
];

export function markById(id: string): Mark {
  return MARKS.find((mark) => mark.id === id) ?? MARKS[0];
}

export function nextMarkId(id: string): string {
  const index = MARKS.findIndex((mark) => mark.id === id);
  return MARKS[(index + 1 + MARKS.length) % MARKS.length].id;
}
