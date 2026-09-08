export type LookId = 'clothlight' | 'porchwash' | 'lanehaze' | 'ridgegold' | 'folio';

export const LOOKS: { id: LookId; name: string }[] = [
  { id: 'clothlight', name: 'Clothlight' },
  { id: 'porchwash', name: 'Porchwash' },
  { id: 'lanehaze', name: 'Lanehaze' },
  { id: 'ridgegold', name: 'Ridgegold' },
  { id: 'folio', name: 'Folio' },
];

export interface ResolvedLook {
  id: LookId;
  name: string;
  haze: number;
  skyZenith: string;
  skyHorizon: string;
  fogColor: string;
  fogDensity: number;
  sunColor: string;
  sunIntensity: number;
  sun: [number, number, number];
  fill: [number, number, number];
  fillColor: string;
  fillIntensity: number;
  ambient: number;
  hemiSky: string;
  hemiGround: string;
  exposure: number;
  envGain: number;
  wet: number;
}

const BASE: Record<LookId, Omit<ResolvedLook, 'haze' | 'fogDensity' | 'sunIntensity' | 'envGain' | 'wet' | 'exposure'>> = {
  clothlight: {
    id: 'clothlight',
    name: 'Clothlight',
    skyZenith: '#8eb4d4',
    skyHorizon: '#f2e4c8',
    fogColor: '#efe2cc',
    sunColor: '#fff1d2',
    sun: [22, 14, 4],
    fill: [-8, 6, -6],
    fillColor: '#d8e4f0',
    fillIntensity: 0.28,
    ambient: 0.4,
    hemiSky: '#9bb8d0',
    hemiGround: '#b89a78',
  },
  porchwash: {
    id: 'porchwash',
    name: 'Porchwash',
    skyZenith: '#7aa0c4',
    skyHorizon: '#f0d4b0',
    fogColor: '#ecd8be',
    sunColor: '#ffd8a8',
    sun: [6, 8, 16],
    fill: [-4, 5, -10],
    fillColor: '#f0c27a',
    fillIntensity: 0.42,
    ambient: 0.46,
    hemiSky: '#f0d0a8',
    hemiGround: '#c4a078',
  },
  lanehaze: {
    id: 'lanehaze',
    name: 'Lanehaze',
    skyZenith: '#9aafc0',
    skyHorizon: '#e8e0d4',
    fogColor: '#e4ddd2',
    sunColor: '#f4eee4',
    sun: [10, 20, 10],
    fill: [-10, 8, 4],
    fillColor: '#d0d8e0',
    fillIntensity: 0.34,
    ambient: 0.52,
    hemiSky: '#c8d4dc',
    hemiGround: '#b8b0a4',
  },
  ridgegold: {
    id: 'ridgegold',
    name: 'Ridgegold',
    skyZenith: '#6a88b0',
    skyHorizon: '#f0c090',
    fogColor: '#e8c8a0',
    sunColor: '#ffb060',
    sun: [28, 6, -8],
    fill: [-12, 4, 8],
    fillColor: '#f0a060',
    fillIntensity: 0.22,
    ambient: 0.32,
    hemiSky: '#f0b878',
    hemiGround: '#8a6a48',
  },
  folio: {
    id: 'folio',
    name: 'Folio',
    skyZenith: '#87b0d4',
    skyHorizon: '#f3ead8',
    fogColor: '#efe2cc',
    sunColor: '#fff6ea',
    sun: [18, 22, 10],
    fill: [-10, 6, -8],
    fillColor: '#f0c27a',
    fillIntensity: 0.22,
    ambient: 0.38,
    hemiSky: '#87b0d4',
    hemiGround: '#b89a78',
  },
};

export function resolveLook(id: LookId, haze: number): ResolvedLook {
  const t = Math.min(1, Math.max(0, haze));
  const base = BASE[id];
  return {
    ...base,
    haze: t,
    fogDensity: 0.011 + t * 0.02,
    sunIntensity: 1.48 - t * 0.72,
    envGain: 0.78 - t * 0.32,
    wet: t * 0.55,
    exposure: 1.14 - t * 0.18,
  };
}
