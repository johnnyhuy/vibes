export const CARD = {
  name: 'Lumen Fox',
  nameZh: '流光狐',
  number: 'No.042',
  serial: 'LX-042 · VIBES',
  grade: 'Nightbound',
  motto: 'light that remembers',
  brand: 'vibes · foil tilt card',
} as const;

export const CARD_W = 2.18;
export const CARD_H = 3.05;
export const CARD_R = 0.11;
export const ART_INSET = 0.075;

export const DEFAULTS = {
  foil: 0.68,
  tilt: 0.92,
  spread: 0.3,
} as const;

export type Face = 'recto' | 'verso';
