import type { Atmosphere } from './types';

export interface ResolvedLook {
  name: Atmosphere;
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
  waterColor: string;
  waterOpacity: number;
  exposure: number;
  envGain: number;
  roadRough: number;
  roadColor: string;
  lampGain: number;
  rain: boolean;
}

const SUN: ResolvedLook = {
  name: 'sun',
  label: 'late sun',
  skyZenith: '#6a88b0',
  skyHorizon: '#f0c48a',
  fogColor: '#e8c8a0',
  fogDensity: 0.0074,
  sunColor: '#ffc878',
  sunIntensity: 2.15,
  sunElevation: 0.22,
  sunAzimuth: 2.55,
  ambientColor: '#8a6a50',
  ambientIntensity: 0.38,
  hemiSky: '#ffd8a8',
  hemiGround: '#4a3a2c',
  waterColor: '#3a5a68',
  waterOpacity: 0.86,
  exposure: 1.02,
  envGain: 0.72,
  roadRough: 0.62,
  roadColor: '#2a2c30',
  lampGain: 0.2,
  rain: false,
};

const RAIN: ResolvedLook = {
  name: 'rain',
  label: 'after rain',
  skyZenith: '#6a7888',
  skyHorizon: '#c8d0d4',
  fogColor: '#b8c4c8',
  fogDensity: 0.012,
  sunColor: '#e8eef2',
  sunIntensity: 0.85,
  sunElevation: 0.42,
  sunAzimuth: 2.1,
  ambientColor: '#7a848c',
  ambientIntensity: 0.48,
  hemiSky: '#d0d8dc',
  hemiGround: '#3a4448',
  waterColor: '#2a4048',
  waterOpacity: 0.9,
  exposure: 0.92,
  envGain: 0.4,
  roadRough: 0.22,
  roadColor: '#1c1e22',
  lampGain: 0.55,
  rain: true,
};

const DUSK: ResolvedLook = {
  name: 'dusk',
  label: 'dusk tide',
  skyZenith: '#1c1838',
  skyHorizon: '#d07048',
  fogColor: '#b86850',
  fogDensity: 0.01,
  sunColor: '#ff8a50',
  sunIntensity: 1.35,
  sunElevation: 0.1,
  sunAzimuth: 2.7,
  ambientColor: '#3a2838',
  ambientIntensity: 0.3,
  hemiSky: '#f09060',
  hemiGround: '#2a1c22',
  waterColor: '#1a3040',
  waterOpacity: 0.88,
  exposure: 0.9,
  envGain: 0.52,
  roadRough: 0.58,
  roadColor: '#242228',
  lampGain: 1,
  rain: false,
};

export function resolveLook(mode: Atmosphere): ResolvedLook {
  if (mode === 'rain') return RAIN;
  if (mode === 'dusk') return DUSK;
  return SUN;
}

export function cycleAtmosphere(mode: Atmosphere): Atmosphere {
  if (mode === 'sun') return 'rain';
  if (mode === 'rain') return 'dusk';
  return 'sun';
}

export const ATMOSPHERE_CHIP: Record<Atmosphere, string> = {
  sun: 'SALT REACH / LATE SUN',
  rain: 'SALT REACH / AFTER RAIN',
  dusk: 'SALT REACH / DUSK TIDE',
};
