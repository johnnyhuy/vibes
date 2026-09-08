import type { BiomeId } from './types';

export interface ResolvedLook {
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
  poolColor: string;
  exposure: number;
  envGain: number;
  steamOpacity: number;
}

const LOOKS: Record<BiomeId, ResolvedLook> = {
  terrace: {
    skyZenith: '#3a2a48',
    skyHorizon: '#f0a060',
    fogColor: '#d88858',
    fogDensity: 0.0094,
    sunColor: '#ffc080',
    sunIntensity: 1.72,
    sunElevation: 0.22,
    sunAzimuth: 1.05,
    ambientColor: '#6a3a28',
    ambientIntensity: 0.36,
    hemiSky: '#f0b080',
    hemiGround: '#6a3a22',
    poolColor: '#2a8a7a',
    exposure: 1.02,
    envGain: 0.72,
    steamOpacity: 0.22,
  },
  basin: {
    skyZenith: '#6a7480',
    skyHorizon: '#e8d8c4',
    fogColor: '#d8d0c4',
    fogDensity: 0.013,
    sunColor: '#ffe8c8',
    sunIntensity: 1.28,
    sunElevation: 0.48,
    sunAzimuth: 0.62,
    ambientColor: '#b8b0a4',
    ambientIntensity: 0.48,
    hemiSky: '#e8e4dc',
    hemiGround: '#8a7a68',
    poolColor: '#7aa0a0',
    exposure: 1.06,
    envGain: 0.54,
    steamOpacity: 0.38,
  },
  rim: {
    skyZenith: '#2a3858',
    skyHorizon: '#f2b070',
    fogColor: '#c88858',
    fogDensity: 0.0076,
    sunColor: '#ffb068',
    sunIntensity: 1.88,
    sunElevation: 0.16,
    sunAzimuth: 1.28,
    ambientColor: '#4a2c20',
    ambientIntensity: 0.3,
    hemiSky: '#f0a060',
    hemiGround: '#4a3224',
    poolColor: '#3a4a48',
    exposure: 0.98,
    envGain: 0.66,
    steamOpacity: 0.08,
  },
};

export function resolveLook(biome: BiomeId): ResolvedLook {
  return LOOKS[biome];
}
