import type { Mark } from './types';

export const BRAND = {
  lockup: 'vibes · breakwater',
  name: 'Breakwater',
  nameZh: '防波',
  lede: 'A harbour walker on a dusk pier. One chassis I named. No war zone.',
};

export const WALKER = {
  name: 'Spile Frame',
  nameZh: '桩架',
  code: 'SF-04 HARBOUR',
  mass: '4,820 t',
  plant: 'Ballast pile-ram / hook',
  stance: 'Tide settle',
};

export const MARKS: Mark[] = [
  {
    id: 'spile',
    name: 'Spile Frame',
    nameZh: '桩架',
    copy: 'Harbour walker I modelled from boxes. Pile-shoes on the seaward deck.',
    target: [0, 3.05, 1.6],
    camera: [-10.4, 5.7, 13.2],
    minDistance: 7,
    maxDistance: 26,
  },
  {
    id: 'groyne',
    name: 'Groyne Head',
    nameZh: '丁坝头',
    copy: 'Tetrapod arm I laid into the swell. Concrete jacks, not a highway berm.',
    target: [-11.2, 1.15, -5.4],
    camera: [-2.4, 6.8, 8.6],
    minDistance: 8,
    maxDistance: 30,
  },
  {
    id: 'gate',
    name: 'Tide Gate',
    nameZh: '潮闸',
    copy: 'Two lock towers and a sluice. A mark, not a chassis picker.',
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
