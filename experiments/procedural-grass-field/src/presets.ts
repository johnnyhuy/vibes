export type SpeciesId = 'rye' | 'fescue' | 'reed' | 'ink';
export type LookId = 'noon' | 'amber' | 'overcast' | 'night';
export type DensityId = 'spare' | 'full' | 'dense';

export interface Species {
  id: SpeciesId;
  label: string;
  copy: string;
  height: number;
  width: number;
  bend: number;
  tipLift: number;
  colors: [string, string, string, string];
}

export interface Look {
  id: LookId;
  label: string;
  skyZenith: string;
  skyHorizon: string;
  fogColor: string;
  fogDensity: number;
  sunColor: string;
  sunIntensity: number;
  sunElevation: number;
  sunAzimuth: number;
  hemiSky: string;
  hemiGround: string;
  ambientColor: string;
  ambientIntensity: number;
  exposure: number;
  grassShift: [number, number, number];
  starOpacity: number;
}

export const SPECIES: Species[] = [
  {
    id: 'rye',
    label: 'Rye',
    copy: 'Tall warm blades. A meadow that still remembers harvest.',
    height: 1.08,
    width: 0.046,
    bend: 0.92,
    tipLift: 0.1,
    colors: ['#35561f', '#4f7a28', '#6f9434', '#c4b15a'],
  },
  {
    id: 'fescue',
    label: 'Fescue',
    copy: 'Shorter, cooler, finer. A lawn that never wanted to be a lawn.',
    height: 0.72,
    width: 0.032,
    bend: 0.7,
    tipLift: 0.05,
    colors: ['#2a4a38', '#3d6a4c', '#5a8a62', '#a8c47a'],
  },
  {
    id: 'reed',
    label: 'Reed',
    copy: 'Long gold stems. They lean before the wind arrives.',
    height: 1.42,
    width: 0.038,
    bend: 1.18,
    tipLift: 0.16,
    colors: ['#4a4a1c', '#7a6e2a', '#b08a32', '#e4c878'],
  },
  {
    id: 'ink',
    label: 'Ink',
    copy: 'Stylised thick blades. Fewer, louder, almost printed.',
    height: 1.15,
    width: 0.07,
    bend: 0.55,
    tipLift: 0.02,
    colors: ['#16301c', '#1f5a28', '#3d8f2a', '#d6e85a'],
  },
];

export const LOOKS: Look[] = [
  {
    id: 'noon',
    label: 'Noon',
    skyZenith: '#6eafdc',
    skyHorizon: '#d5e6c4',
    fogColor: '#c8d8b8',
    fogDensity: 0.009,
    sunColor: '#fff3d2',
    sunIntensity: 2.05,
    sunElevation: 0.74,
    sunAzimuth: 0.62,
    hemiSky: '#b7d3ee',
    hemiGround: '#4a5c30',
    ambientColor: '#e7efd6',
    ambientIntensity: 0.4,
    exposure: 1.06,
    grassShift: [1, 1, 1],
    starOpacity: 0,
  },
  {
    id: 'amber',
    label: 'Amber',
    skyZenith: '#3a5f8a',
    skyHorizon: '#f0b878',
    fogColor: '#e0b888',
    fogDensity: 0.02,
    sunColor: '#ffb060',
    sunIntensity: 1.72,
    sunElevation: 0.22,
    sunAzimuth: 1.18,
    hemiSky: '#f0c090',
    hemiGround: '#5a3a20',
    ambientColor: '#f0c8a0',
    ambientIntensity: 0.36,
    exposure: 1.12,
    grassShift: [1.12, 0.92, 0.7],
    starOpacity: 0,
  },
  {
    id: 'overcast',
    label: 'Overcast',
    skyZenith: '#7a8a96',
    skyHorizon: '#c5c8c0',
    fogColor: '#b8beb8',
    fogDensity: 0.028,
    sunColor: '#e4e8ea',
    sunIntensity: 0.72,
    sunElevation: 0.5,
    sunAzimuth: 0.4,
    hemiSky: '#c8d0d4',
    hemiGround: '#4a5244',
    ambientColor: '#d8dce0',
    ambientIntensity: 0.62,
    exposure: 0.98,
    grassShift: [0.86, 0.94, 0.9],
    starOpacity: 0,
  },
  {
    id: 'night',
    label: 'Night',
    skyZenith: '#0a1220',
    skyHorizon: '#1c2a38',
    fogColor: '#141e28',
    fogDensity: 0.03,
    sunColor: '#b8c8e0',
    sunIntensity: 0.38,
    sunElevation: 0.28,
    sunAzimuth: 4.1,
    hemiSky: '#243044',
    hemiGround: '#101810',
    ambientColor: '#6a7a90',
    ambientIntensity: 0.22,
    exposure: 0.92,
    grassShift: [0.55, 0.7, 0.85],
    starOpacity: 0.85,
  },
];

export const DENSITY_COUNT: Record<DensityId, number> = {
  spare: 12000,
  full: 36000,
  dense: 64000,
};

export const DENSITIES: { id: DensityId; label: string }[] = [
  { id: 'spare', label: 'Spare' },
  { id: 'full', label: 'Full' },
  { id: 'dense', label: 'Dense' },
];

export function speciesById(id: SpeciesId): Species {
  return SPECIES.find((item) => item.id === id) ?? SPECIES[0];
}

export function lookById(id: LookId): Look {
  return LOOKS.find((item) => item.id === id) ?? LOOKS[0];
}
