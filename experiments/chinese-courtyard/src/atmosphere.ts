import { Color } from 'three';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface AtmosphereState {
  season: Season;
  dayNight: number;
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
  plasterColor: string;
  woodColor: string;
  roofColor: string;
  ridgeColor: string;
  stoneColor: string;
  pavingColor: string;
  waterColor: string;
  foliageColor: string;
  pineColor: string;
  bambooColor: string;
  blossomColor: string | null;
  snowAmount: number;
  lanternGain: number;
  exposure: number;
  starOpacity: number;
}

export const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];

const SEASON_PALETTE: Record<
  Season,
  {
    plaster: string;
    wood: string;
    roof: string;
    ridge: string;
    stone: string;
    paving: string;
    water: string;
    foliage: string;
    pine: string;
    bamboo: string;
    blossom: string | null;
    snow: number;
    zenithDay: string;
    horizonDay: string;
    twilight: string;
  }
> = {
  spring: {
    plaster: '#f3eee4',
    wood: '#c4a078',
    roof: '#4a5348',
    ridge: '#2f3530',
    stone: '#b8b4aa',
    paving: '#c8c2b4',
    water: '#4f7d78',
    foliage: '#7fbe6a',
    pine: '#3a6a42',
    bamboo: '#6a9a52',
    blossom: '#f0b6c4',
    snow: 0,
    zenithDay: '#9ec6d8',
    horizonDay: '#eef6f0',
    twilight: '#f0a070',
  },
  summer: {
    plaster: '#f6f1e6',
    wood: '#c8a882',
    roof: '#3f4a44',
    ridge: '#2a302c',
    stone: '#b0aca2',
    paving: '#c2bcae',
    water: '#3d6e72',
    foliage: '#4f8a4a',
    pine: '#2f5a38',
    bamboo: '#5a8a44',
    blossom: null,
    snow: 0,
    zenithDay: '#8eb8c8',
    horizonDay: '#dce8dc',
    twilight: '#e07a42',
  },
  autumn: {
    plaster: '#efe4d2',
    wood: '#a87850',
    roof: '#3a3832',
    ridge: '#26241e',
    stone: '#a89e8e',
    paving: '#b8a890',
    water: '#4a6260',
    foliage: '#c45a22',
    pine: '#3a4f30',
    bamboo: '#8a7a3a',
    blossom: '#e29a28',
    snow: 0,
    zenithDay: '#8aa0b4',
    horizonDay: '#eedcc4',
    twilight: '#d45a28',
  },
  winter: {
    plaster: '#f4f2ec',
    wood: '#8a7460',
    roof: '#4a4e50',
    ridge: '#2e3234',
    stone: '#c4c8cc',
    paving: '#d4d6d8',
    water: '#6a7c86',
    foliage: '#6a6e62',
    pine: '#3d4f44',
    bamboo: '#5a6254',
    blossom: '#ffffff',
    snow: 1,
    zenithDay: '#a8c0d0',
    horizonDay: '#eef4f8',
    twilight: '#c4786a',
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

  const zenithNight = '#071018';
  const horizonNight = '#121820';
  const skyZenith = mixHex(zenithNight, mixHex(season.zenithDay, season.twilight, twilight * 0.22), dayFactor);
  const skyHorizon = mixHex(
    horizonNight,
    mixHex(season.horizonDay, season.twilight, twilight * 0.8),
    clamp01(dayFactor + twilight * 0.18)
  );
  const fogColor = mixHex(skyHorizon, '#0a1014', nightFactor * 0.32);
  const ground = mixHex(season.paving, '#e8eef4', season.snow * 0.35);

  return {
    skyZenith,
    skyHorizon,
    fogColor,
    fogDensity: 0.018 + nightFactor * 0.012 + season.snow * 0.01,
    sunColor: mixHex('#f4e6c4', season.twilight, twilight * 0.7),
    sunIntensity: 0.18 + dayFactor * 1.35,
    sunElevation: elevation,
    sunAzimuth: t * Math.PI * 2,
    ambientColor: mixHex('#1a2230', '#dce6e8', dayFactor),
    ambientIntensity: 0.14 + dayFactor * 0.3,
    hemiSky: skyZenith,
    hemiGround: mixHex(ground, '#1a1814', 0.3),
    plasterColor: mixHex(season.plaster, '#9aa4ac', nightFactor * 0.18),
    woodColor: mixHex(season.wood, '#3a2a1c', nightFactor * 0.28),
    roofColor: mixHex(season.roof, '#141816', nightFactor * 0.35),
    ridgeColor: season.ridge,
    stoneColor: mixHex(season.stone, '#6a7074', nightFactor * 0.22),
    pavingColor: mixHex(ground, '#4a4e50', nightFactor * 0.25),
    waterColor: mixHex(season.water, '#0a1218', nightFactor * 0.5),
    foliageColor: season.foliage,
    pineColor: season.pine,
    bambooColor: season.bamboo,
    blossomColor: season.blossom,
    snowAmount: season.snow,
    lanternGain: 0.12 + nightFactor * 1.85,
    exposure: 0.84 + dayFactor * 0.34,
    starOpacity: nightFactor * 0.88,
  };
}
