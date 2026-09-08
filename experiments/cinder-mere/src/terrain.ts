import { BufferAttribute, PlaneGeometry } from 'three';
import type { LandmarkId } from './types';

export const WORLD_HALF = 64;
export const WORLD_SIZE = WORLD_HALF * 2;
export const TERRAIN_SEGMENTS = 96;
export const WATER_LEVEL = 0.72;

export interface Landmark {
  id: LandmarkId;
  name: string;
  nameZh: string;
  copy: string;
  x: number;
  z: number;
}

export const LANDMARKS: Landmark[] = [
  {
    id: 'wick',
    name: 'Wick Spire',
    nameZh: '芯标',
    copy: 'A ridge beacon I stacked from brick drums. The wick is a warm lamp, not a radio tower.',
    x: 6.4,
    z: -41.2,
  },
  {
    id: 'jetty',
    name: 'Pewter Jetty',
    nameZh: '锡栈',
    copy: 'A reed pier that steps into the mere. I kept it short so the water still reads.',
    x: 23.6,
    z: 3.8,
  },
  {
    id: 'kiln',
    name: 'Low Kiln',
    nameZh: '矮窑',
    copy: 'A squat chimney and a brick belly. Smoke is three pale spheres. Not a factory.',
    x: -33.4,
    z: -11.2,
  },
  {
    id: 'ford',
    name: 'Flint Ford',
    nameZh: '燧津',
    copy: 'Stepping stones on the southwest tongue. The Soot Runner wakes on the dry bank above them.',
    x: -22.2,
    z: 10.4,
  },
];

export const SPAWN = {
  x: -24.2,
  z: 18.4,
  yaw: Math.atan2(24.2, -18.4),
} as const;

function hash2(x: number, z: number): number {
  const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function fade(t: number): number {
  return t * t * (3 - 2 * t);
}

function noise2(x: number, z: number): number {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const ux = fade(fx);
  const uz = fade(fz);
  const a = hash2(ix, iz);
  const b = hash2(ix + 1, iz);
  const c = hash2(ix, iz + 1);
  const d = hash2(ix + 1, iz + 1);
  return (a + (b - a) * ux) * (1 - uz) + (c + (d - c) * ux) * uz;
}

function fbm(x: number, z: number): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < 5; i += 1) {
    value += amplitude * noise2(x * frequency, z * frequency);
    amplitude *= 0.5;
    frequency *= 2.05;
  }
  return value;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function heightAt(x: number, z: number): number {
  const nx = x / WORLD_HALF;
  const nz = z / WORLD_HALF;
  const r = Math.hypot(nx, nz);
  const bowl = 0.18 + smoothstep(0.13, 0.86, r) * 7.4;
  const rim = smoothstep(0.8, 1.12, r) * 11.2;
  const mere = -smoothstep(0.24, 0.0, r) * 1.28;
  const ford = Math.exp(-((x + 26) ** 2) / 38 - ((z - 8) ** 2) / 118) * -4.1;
  const ridges = (fbm(x * 0.032, z * 0.032) - 0.46) * 2.35 * smoothstep(0.2, 0.88, r);
  const lumps = (fbm(x * 0.086 + 18, z * 0.086) - 0.5) * 0.62;
  const ring = Math.abs(r - 0.39);
  const ash = Math.exp(-ring * ring * 210) * -0.28;
  return bowl + rim + mere + ford + ridges + lumps + ash;
}

export function slopeAt(x: number, z: number): { pitch: number; roll: number } {
  const sample = 0.85;
  const n = heightAt(x, z - sample);
  const s = heightAt(x, z + sample);
  const w = heightAt(x - sample, z);
  const e = heightAt(x + sample, z);
  return {
    pitch: Math.atan2(n - s, sample * 2),
    roll: Math.atan2(e - w, sample * 2),
  };
}

export function clampToBasin(x: number, z: number): { x: number; z: number } {
  const length = Math.hypot(x, z);
  const max = WORLD_HALF * 0.93;
  if (length <= max) return { x, z };
  const scale = max / length;
  return { x: x * scale, z: z * scale };
}

export function nearestLandmark(x: number, z: number): { landmark: Landmark; range: number } {
  let best = LANDMARKS[0];
  let bestRange = Number.POSITIVE_INFINITY;
  for (const landmark of LANDMARKS) {
    const range = Math.hypot(x - landmark.x, z - landmark.z);
    if (range < bestRange) {
      best = landmark;
      bestRange = range;
    }
  }
  return { landmark: best, range: bestRange };
}

export function landmarkAt(id: LandmarkId): Landmark {
  return LANDMARKS.find((item) => item.id === id) ?? LANDMARKS[0];
}

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

const SILT = hexToRgb('#6a5340');
const REED = hexToRgb('#7a6a3a');
const GRASS = hexToRgb('#4d5a32');
const ASH = hexToRgb('#5a4638');
const ROCK = hexToRgb('#6d645c');

function mix(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  const k = Math.min(1, Math.max(0, t));
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

export function colourAt(x: number, z: number, y: number): [number, number, number] {
  const r = Math.hypot(x, z) / WORLD_HALF;
  const wet = smoothstep(WATER_LEVEL + 0.55, WATER_LEVEL - 0.05, y);
  const ring = Math.exp(-((r - 0.39) ** 2) * 180);
  const steep = smoothstep(0.72, 0.95, r);
  let rgb = mix(GRASS, REED, smoothstep(WATER_LEVEL + 1.4, WATER_LEVEL + 0.2, y));
  rgb = mix(rgb, SILT, wet);
  rgb = mix(rgb, ASH, ring);
  rgb = mix(rgb, ROCK, steep);
  return rgb;
}

export function buildTerrainGeometry(): PlaneGeometry {
  const geometry = new PlaneGeometry(WORLD_SIZE, WORLD_SIZE, TERRAIN_SEGMENTS, TERRAIN_SEGMENTS);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  const colours = new Float32Array(positions.count * 3);

  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    const y = heightAt(x, z);
    positions.setY(i, y);
    const [r, g, b] = colourAt(x, z, y);
    colours[i * 3] = r;
    colours[i * 3 + 1] = g;
    colours[i * 3 + 2] = b;
  }

  geometry.setAttribute('color', new BufferAttribute(colours, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export interface ReedSpot {
  x: number;
  z: number;
  y: number;
  scale: number;
  twist: number;
}

export function reedSpots(count = 220): ReedSpot[] {
  const spots: ReedSpot[] = [];
  for (let i = 0; i < count * 3 && spots.length < count; i += 1) {
    const seed = i + 11;
    const angle = hash2(seed, 3) * Math.PI * 2;
    const radius = (0.17 + hash2(seed, 7) * 0.16) * WORLD_HALF;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.92;
    const y = heightAt(x, z);
    if (y > WATER_LEVEL + 0.9 || y < WATER_LEVEL - 0.15) continue;
    spots.push({
      x,
      z,
      y,
      scale: 0.7 + hash2(seed, 13) * 0.7,
      twist: hash2(seed, 19) * Math.PI,
    });
  }
  return spots;
}

export interface PineSpot {
  x: number;
  z: number;
  y: number;
  scale: number;
  twist: number;
}

export interface ScrubSpot {
  x: number;
  z: number;
  y: number;
  scale: number;
  twist: number;
}

export function scrubSpots(count = 90): ScrubSpot[] {
  const spots: ScrubSpot[] = [];
  for (let i = 0; i < count * 4 && spots.length < count; i += 1) {
    const seed = i + 61;
    const angle = hash2(seed, 4) * Math.PI * 2;
    const radius = (0.28 + hash2(seed, 9) * 0.42) * WORLD_HALF;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = heightAt(x, z);
    const r = Math.hypot(x, z) / WORLD_HALF;
    if (y < WATER_LEVEL + 0.35 || y > WATER_LEVEL + 5.4) continue;
    if (Math.abs(r - 0.39) < 0.035) continue;
    spots.push({
      x,
      z,
      y,
      scale: 0.55 + hash2(seed, 15) * 0.7,
      twist: hash2(seed, 21) * Math.PI,
    });
  }
  return spots;
}

export function pineSpots(): PineSpot[] {
  return Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2 + hash2(index, 2) * 0.28;
    const radius = (0.58 + hash2(index, 5) * 0.22) * WORLD_HALF;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    return {
      x,
      z,
      y: heightAt(x, z),
      scale: 0.85 + hash2(index, 8) * 0.55,
      twist: hash2(index, 12) * Math.PI,
    };
  }).filter((spot) => spot.y > WATER_LEVEL + 1.4);
}

export function broadSpots(): PineSpot[] {
  const seeds = [0.85, 1.15, 1.55, 2.05, 4.55, 4.95, 5.35];
  return seeds.map((angle, index) => {
    const radius = (0.46 + hash2(index, 6) * 0.08) * WORLD_HALF;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    return {
      x,
      z,
      y: heightAt(x, z),
      scale: 0.95 + hash2(index, 14) * 0.4,
      twist: hash2(index, 18) * Math.PI,
    };
  }).filter((spot) => spot.y > WATER_LEVEL + 0.6);
}
