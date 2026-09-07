import { Color } from 'three';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather = 'clear' | 'rain' | 'snow' | 'mist';
export type ParticleKind = 'none' | 'rain' | 'snow' | 'blossom' | 'mist';

export interface AtmosphereState {
  season: Season;
  dayNight: number;
  weather: Weather;
  haze: number;
}

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
  groundColor: string;
  foliageColor: string;
  pineColor: string;
  blossomColor: string | null;
  roofColor: string;
  woodColor: string;
  plasterColor: string;
  stoneColor: string;
  waterColor: string;
  lanternGain: number;
  particle: ParticleKind;
  particleCount: number;
  particleColor: string;
  exposure: number;
  starOpacity: number;
}

export const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];
export const WEATHERS: Weather[] = ['clear', 'rain', 'snow', 'mist'];

const SEASON_PALETTE: Record<
  Season,
  {
    ground: string;
    foliage: string;
    pine: string;
    blossom: string | null;
    roof: string;
    wood: string;
    plaster: string;
    stone: string;
    water: string;
  }
> = {
  spring: {
    ground: '#3f6d3c',
    foliage: '#7fbe6a',
    pine: '#2f5a38',
    blossom: '#f3b6c8',
    roof: '#6a2a2c',
    wood: '#8a5a3a',
    plaster: '#efe4d2',
    stone: '#8a8478',
    water: '#3d6d78',
  },
  summer: {
    ground: '#4f8a4a',
    foliage: '#3f8a44',
    pine: '#2f6a3c',
    blossom: null,
    roof: '#5a2224',
    wood: '#7a4e30',
    plaster: '#efe6d6',
    stone: '#7d786e',
    water: '#2b5f72',
  },
  autumn: {
    ground: '#5c472c',
    foliage: '#c45a22',
    pine: '#3a4f30',
    blossom: '#e29a28',
    roof: '#4a1c1e',
    wood: '#6c3c24',
    plaster: '#ead9c0',
    stone: '#7a7064',
    water: '#355560',
  },
  winter: {
    ground: '#d5dde4',
    foliage: '#6a6e62',
    pine: '#3d4f44',
    blossom: '#ffffff',
    roof: '#3c2628',
    wood: '#5a4034',
    plaster: '#f2efe8',
    stone: '#9aa0a6',
    water: '#6a7c86',
  },
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function mixHex(a: string, b: string, t: number): string {
  const color = new Color(a).lerp(new Color(b), clamp01(t));
  return `#${color.getHexString()}`;
}

export function dayLabel(dayNight: number): string {
  const t = ((dayNight % 1) + 1) % 1;
  if (t < 0.08 || t >= 0.92) return 'Midnight';
  if (t < 0.2) return 'Dawn';
  if (t < 0.38) return 'Morning';
  if (t < 0.62) return 'Noon';
  if (t < 0.78) return 'Dusk';
  return 'Night';
}

export function resolveLook(state: AtmosphereState): ResolvedLook {
  const season = SEASON_PALETTE[state.season];
  const t = ((state.dayNight % 1) + 1) % 1;
  const elevation = Math.sin((t - 0.25) * Math.PI * 2);
  const dayFactor = clamp01(elevation * 0.72 + 0.28);
  const nightFactor = 1 - clamp01((elevation + 0.15) / 1.15);
  const twilight = clamp01(1 - Math.abs(elevation) * 2.2);

  let zenithDay = '#8eb8d8';
  let horizonDay = '#e7f1f6';
  let zenithNight = '#050814';
  let horizonNight = '#10182c';
  let twilightHorizon = '#e07a42';

  if (state.season === 'autumn') {
    zenithDay = '#7fa0be';
    horizonDay = '#eedcc4';
    twilightHorizon = '#d45a28';
  } else if (state.season === 'winter') {
    zenithDay = '#a8c0d4';
    horizonDay = '#eef4f8';
    twilightHorizon = '#c4786a';
  } else if (state.season === 'spring') {
    zenithDay = '#9bc4de';
    horizonDay = '#eef6f4';
    twilightHorizon = '#f0a070';
  } else {
    zenithDay = '#8eb8d8';
    horizonDay = '#e7f1f6';
  }

  let fogBoost = 0;
  let sunMul = 1;
  let particle: ParticleKind = 'none';
  let particleCount = 0;
  let particleColor = '#ffffff';

  if (state.weather === 'rain') {
    zenithDay = mixHex(zenithDay, '#4a5560', 0.55);
    horizonDay = mixHex(horizonDay, '#7a848c', 0.5);
    fogBoost += 0.018;
    sunMul *= 0.55;
    particle = 'rain';
    particleCount = 1400;
    particleColor = '#9eb0bc';
  } else if (state.weather === 'snow') {
    zenithDay = mixHex(zenithDay, '#8a9aaa', 0.35);
    horizonDay = mixHex(horizonDay, '#eef3f7', 0.45);
    fogBoost += 0.016;
    sunMul *= 0.7;
    particle = 'snow';
    particleCount = 1100;
    particleColor = '#f4f7fb';
  } else if (state.weather === 'mist') {
    fogBoost += 0.034;
    sunMul *= 0.42;
    particle = 'mist';
    particleCount = 420;
    particleColor = '#c8d2dc';
  } else if (state.season === 'spring') {
    particle = 'blossom';
    particleCount = 280;
    particleColor = season.blossom ?? '#f3b6c8';
  }

  const haze = clamp01(state.haze);
  const skyZenith = mixHex(zenithNight, mixHex(zenithDay, twilightHorizon, twilight * 0.25), dayFactor);
  const skyHorizon = mixHex(
    horizonNight,
    mixHex(horizonDay, twilightHorizon, twilight * 0.85),
    clamp01(dayFactor + twilight * 0.2)
  );

  const fogColor = mixHex(skyHorizon, '#0a0d14', nightFactor * 0.35);
  const fogDensity = 0.007 + haze * 0.04 + fogBoost + nightFactor * 0.01;

  const sunColor = mixHex('#f4e6c4', twilightHorizon, twilight * 0.7);
  const ground = state.weather === 'snow' || state.season === 'winter'
    ? mixHex(season.ground, '#e8eef4', state.season === 'winter' ? 0.82 : 0.55)
    : season.ground;

  return {
    skyZenith,
    skyHorizon,
    fogColor,
    fogDensity,
    sunColor,
    sunIntensity: (0.15 + dayFactor * 1.55) * sunMul,
    sunElevation: elevation,
    sunAzimuth: t * Math.PI * 2,
    ambientColor: mixHex('#1a2230', '#dce6f0', dayFactor),
    ambientIntensity: 0.12 + dayFactor * 0.32,
    hemiSky: skyZenith,
    hemiGround: mixHex(ground, '#1a1814', 0.35),
    groundColor: ground,
    foliageColor: season.foliage,
    pineColor: season.pine,
    blossomColor: season.blossom,
    roofColor: mixHex(season.roof, '#1a1010', nightFactor * 0.25),
    woodColor: season.wood,
    plasterColor: mixHex(season.plaster, '#b8c0c8', state.weather === 'snow' ? 0.2 : 0),
    stoneColor: season.stone,
    waterColor: mixHex(season.water, '#0a1018', nightFactor * 0.45),
    lanternGain: 0.15 + nightFactor * 1.7,
    particle,
    particleCount,
    particleColor,
    exposure: 0.82 + dayFactor * 0.38,
    starOpacity: nightFactor * 0.9,
  };
}
