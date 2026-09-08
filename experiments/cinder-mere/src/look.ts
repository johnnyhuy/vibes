import type { TimeMode, TimeName } from './types';

export interface ResolvedLook {
  name: TimeName;
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
  lampGain: number;
  groundTint: string;
  cloudOpacity: number;
}

const DUSK: ResolvedLook = {
  name: 'dusk',
  skyZenith: '#1a1733',
  skyHorizon: '#e07a42',
  fogColor: '#c46a48',
  fogDensity: 0.011,
  sunColor: '#ffb070',
  sunIntensity: 1.55,
  sunElevation: 0.18,
  sunAzimuth: 0.92,
  ambientColor: '#4a2c28',
  ambientIntensity: 0.32,
  hemiSky: '#f0a070',
  hemiGround: '#3a2a22',
  waterColor: '#2a3d48',
  waterOpacity: 0.78,
  exposure: 0.96,
  lampGain: 1,
  groundTint: '#e0c4a4',
  cloudOpacity: 0.18,
};

const DAY: ResolvedLook = {
  name: 'day',
  skyZenith: '#7a8fa8',
  skyHorizon: '#e4d4c0',
  fogColor: '#d4c4ae',
  fogDensity: 0.0082,
  sunColor: '#ffe6c4',
  sunIntensity: 1.85,
  sunElevation: 0.62,
  sunAzimuth: 0.48,
  ambientColor: '#b8a890',
  ambientIntensity: 0.44,
  hemiSky: '#e8dcc8',
  hemiGround: '#6a5840',
  waterColor: '#4a5a58',
  waterOpacity: 0.72,
  lampGain: 0.22,
  exposure: 1.04,
  groundTint: '#c8b080',
  cloudOpacity: 0.42,
};

function mixHex(a: string, b: string, t: number): string {
  const parse = (hex: string) => Number.parseInt(hex.slice(1), 16);
  const av = parse(a);
  const bv = parse(b);
  const mix = (shift: number) => {
    const left = (av >> shift) & 255;
    const right = (bv >> shift) & 255;
    return Math.round(left + (right - left) * t);
  };
  const r = mix(16);
  const g = mix(8);
  const bch = mix(0);
  return `#${((r << 16) | (g << 8) | bch).toString(16).padStart(6, '0')}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function blendLook(from: ResolvedLook, to: ResolvedLook, t: number): ResolvedLook {
  const k = Math.min(1, Math.max(0, t));
  return {
    name: k < 0.5 ? from.name : to.name,
    skyZenith: mixHex(from.skyZenith, to.skyZenith, k),
    skyHorizon: mixHex(from.skyHorizon, to.skyHorizon, k),
    fogColor: mixHex(from.fogColor, to.fogColor, k),
    fogDensity: lerp(from.fogDensity, to.fogDensity, k),
    sunColor: mixHex(from.sunColor, to.sunColor, k),
    sunIntensity: lerp(from.sunIntensity, to.sunIntensity, k),
    sunElevation: lerp(from.sunElevation, to.sunElevation, k),
    sunAzimuth: lerp(from.sunAzimuth, to.sunAzimuth, k),
    ambientColor: mixHex(from.ambientColor, to.ambientColor, k),
    ambientIntensity: lerp(from.ambientIntensity, to.ambientIntensity, k),
    hemiSky: mixHex(from.hemiSky, to.hemiSky, k),
    hemiGround: mixHex(from.hemiGround, to.hemiGround, k),
    waterColor: mixHex(from.waterColor, to.waterColor, k),
    waterOpacity: lerp(from.waterOpacity, to.waterOpacity, k),
    exposure: lerp(from.exposure, to.exposure, k),
    lampGain: lerp(from.lampGain, to.lampGain, k),
    groundTint: mixHex(from.groundTint, to.groundTint, k),
    cloudOpacity: lerp(from.cloudOpacity, to.cloudOpacity, k),
  };
}

export function resolveLook(mode: TimeMode, elapsed: number): ResolvedLook {
  if (mode === 'dusk') return DUSK;
  if (mode === 'day') return DAY;
  const wave = (Math.sin(elapsed / 42) + 1) / 2;
  return blendLook(DUSK, DAY, wave);
}

export function cycleTimeMode(mode: TimeMode): TimeMode {
  if (mode === 'dusk') return 'day';
  if (mode === 'day') return 'cycle';
  return 'dusk';
}
