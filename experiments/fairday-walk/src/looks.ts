import { lane } from './palette';

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

function mixHex(a: string, b: string, t: number) {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const to = (n: number) => n.toString(16).padStart(2, '0');
  return `#${to(Math.round(ar + (br - ar) * t))}${to(Math.round(ag + (bg - ag) * t))}${to(Math.round(ab + (bb - ab) * t))}`;
}

export function resolveLook(id: LookId, haze: number): ResolvedLook {
  const t = Math.min(1, Math.max(0, haze));
  const base = BASE[id];
  return {
    ...base,
    haze: t,
    skyZenith: mixHex(base.skyZenith, '#07161c', t * 0.92),
    skyHorizon: mixHex(base.skyHorizon, '#12282e', t * 0.94),
    fogColor: mixHex(base.fogColor, '#163038', t * 0.9),
    fogDensity: 0.012 + t * 0.036,
    sunIntensity: 1.42 - t * 0.92,
    envGain: 0.74 - t * 0.42,
    wet: t * 0.88,
    exposure: 1.1 - t * 0.32,
  };
}

export function wetCobble(wet: number) {
  return mixHex(lane.cobble, '#6e787c', Math.min(1, wet * 1.05));
}
