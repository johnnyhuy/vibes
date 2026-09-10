export type LightingId = 'pale-lift' | 'ember-slide' | 'lumen-watch';

export interface LightingPreset {
  id: LightingId;
  name: string;
  hint: string;
  /** HTML / WebGL stage. */
  background: string;
  stageHi: string;
  stageLo: string;
  royal: string;
  ink: string;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  ambient: number;
  keyColor: string;
  keyIntensity: number;
  fillColor: string;
  fillIntensity: number;
  formerA: string;
  formerB: string;
  formerC: string;
  envIntensity: number;
  glassColor: string;
  attenuation: string;
  attenuationDistance: number;
  roughness: number;
  envMapIntensity: number;
  shadowColor: string;
  graphLine: string;
  graphPoint: string;
}

/**
 * Three invented stage tints. The public pitch is Dawn / Dusk / Moonlight;
 * these names and hexes are mine. Pale Lift is the original clinical stage.
 */
export const LIGHTING: LightingPreset[] = [
  {
    id: 'pale-lift',
    name: 'Pale Lift',
    hint: 'First light on the clinical stage',
    background: '#e6edf5',
    stageHi: '#f5f8fc',
    stageLo: '#d5e0ec',
    royal: '#1d4ed8',
    ink: '#1b2430',
    hemiSky: '#f4f7fb',
    hemiGround: '#c5d0dc',
    hemiIntensity: 0.85,
    ambient: 0.55,
    keyColor: '#fffaf2',
    keyIntensity: 1.15,
    fillColor: '#9db4cc',
    fillIntensity: 0.35,
    formerA: '#ffffff',
    formerB: '#d7e6f5',
    formerC: '#f3e8ff',
    envIntensity: 0.42,
    glassColor: '#f7fbff',
    attenuation: '#d7e4f2',
    attenuationDistance: 3.2,
    roughness: 0.18,
    envMapIntensity: 0.55,
    shadowColor: '#8aa0b5',
    graphLine: '#8aaac8',
    graphPoint: '#b7cce0',
  },
  {
    id: 'ember-slide',
    name: 'Ember Slide',
    hint: 'Late sun through the frost',
    background: '#efe0d2',
    stageHi: '#f8ece0',
    stageLo: '#ddc4ae',
    royal: '#c2410c',
    ink: '#2a1c14',
    hemiSky: '#f8e6d4',
    hemiGround: '#b88978',
    hemiIntensity: 0.72,
    ambient: 0.42,
    keyColor: '#ffd4a8',
    keyIntensity: 1.05,
    fillColor: '#c4786a',
    fillIntensity: 0.48,
    formerA: '#ffe8cc',
    formerB: '#f0b48a',
    formerC: '#e8a0a8',
    envIntensity: 0.38,
    glassColor: '#fff6ee',
    attenuation: '#e8c4a8',
    attenuationDistance: 2.7,
    roughness: 0.16,
    envMapIntensity: 0.62,
    shadowColor: '#a67c64',
    graphLine: '#c4a08a',
    graphPoint: '#e0c4a8',
  },
  {
    id: 'lumen-watch',
    name: 'Lumen Watch',
    hint: 'Night glass, silver fill',
    background: '#cfd8e6',
    stageHi: '#e4ebf5',
    stageLo: '#a8b6c9',
    royal: '#334e8a',
    ink: '#141a26',
    hemiSky: '#e8eef8',
    hemiGround: '#6b7c94',
    hemiIntensity: 0.58,
    ambient: 0.36,
    keyColor: '#dce8ff',
    keyIntensity: 0.82,
    fillColor: '#7b8fb8',
    fillIntensity: 0.52,
    formerA: '#f2f6ff',
    formerB: '#9eb4d8',
    formerC: '#c4b8e8',
    envIntensity: 0.3,
    glassColor: '#eef4ff',
    attenuation: '#9eb0cc',
    attenuationDistance: 2.4,
    roughness: 0.22,
    envMapIntensity: 0.48,
    shadowColor: '#5a6d84',
    graphLine: '#7a90b0',
    graphPoint: '#a8bdd4',
  },
];

export const DEFAULT_LIGHTING_ID: LightingId = 'pale-lift';

export function lightingById(id: LightingId): LightingPreset {
  const found = LIGHTING.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown lighting preset: ${id}`);
  return found;
}

export function nextLightingId(current: LightingId): LightingId {
  const index = LIGHTING.findIndex((item) => item.id === current);
  return LIGHTING[(index + 1) % LIGHTING.length].id;
}
