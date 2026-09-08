import type { LookName } from './types';

export interface ResolvedLook {
  name: LookName;
  label: string;
  skyZenith: string;
  skyHorizon: string;
  fogColor: string;
  fogDensity: number;
  sunColor: string;
  sunIntensity: number;
  sunElevation: number;
  sunAzimuth: number;
  ambientColor: string;
  ambientIntensity: number;
  hemiSky: string;
  hemiGround: string;
  waterShallow: string;
  waterDeep: string;
  foam: string;
  exposure: number;
  envGain: number;
  lampGain: number;
  pierTint: string;
}

export const LOOKS: { id: LookName; label: string }[] = [
  { id: 'dusk', label: 'Dusk tide' },
  { id: 'glow', label: 'Afterglow' },
  { id: 'fog', label: 'Fog bank' },
];

const TABLE: Record<LookName, ResolvedLook> = {
  dusk: {
    name: 'dusk',
    label: 'dusk tide',
    skyZenith: '#1a1733',
    skyHorizon: '#e07a42',
    fogColor: '#c46a48',
    fogDensity: 0.012,
    sunColor: '#ffb070',
    sunIntensity: 1.62,
    sunElevation: 0.16,
    sunAzimuth: 2.42,
    ambientColor: '#4a2c28',
    ambientIntensity: 0.34,
    hemiSky: '#f0a070',
    hemiGround: '#3a2a22',
    waterShallow: '#5a8a92',
    waterDeep: '#1e3a48',
    foam: '#ead4c0',
    exposure: 0.96,
    envGain: 0.58,
    lampGain: 1,
    pierTint: '#8a8276',
  },
  glow: {
    name: 'glow',
    label: 'afterglow',
    skyZenith: '#24182a',
    skyHorizon: '#f0a060',
    fogColor: '#d88858',
    fogDensity: 0.0094,
    sunColor: '#ffc488',
    sunIntensity: 1.88,
    sunElevation: 0.12,
    sunAzimuth: 2.55,
    ambientColor: '#5a3428',
    ambientIntensity: 0.4,
    hemiSky: '#ffc090',
    hemiGround: '#4a3228',
    waterShallow: '#6a9aa0',
    waterDeep: '#244858',
    foam: '#f0dcc4',
    exposure: 1.02,
    envGain: 0.7,
    lampGain: 0.72,
    pierTint: '#9a8e80',
  },
  fog: {
    name: 'fog',
    label: 'fog bank',
    skyZenith: '#2a3038',
    skyHorizon: '#8a8e96',
    fogColor: '#7a8088',
    fogDensity: 0.022,
    sunColor: '#d8d0c4',
    sunIntensity: 0.72,
    sunElevation: 0.28,
    sunAzimuth: 2.1,
    ambientColor: '#5a6068',
    ambientIntensity: 0.48,
    hemiSky: '#c8ccd0',
    hemiGround: '#3a3e42',
    waterShallow: '#6a787c',
    waterDeep: '#2a3a42',
    foam: '#d4d0c8',
    exposure: 0.9,
    envGain: 0.34,
    lampGain: 1.35,
    pierTint: '#7a7670',
  },
};

export function resolveLook(name: LookName): ResolvedLook {
  return TABLE[name];
}

export function cycleLook(name: LookName): LookName {
  if (name === 'dusk') return 'glow';
  if (name === 'glow') return 'fog';
  return 'dusk';
}
