import { BufferAttribute, PlaneGeometry } from 'three';
import type { BiomeId, Hazard } from './types';

export const WORLD_HALF = 56;
export const WORLD_SIZE = WORLD_HALF * 2;
export const TERRAIN_SEGMENTS = 104;

export interface Spawn {
  x: number;
  z: number;
  yaw: number;
}

export const SPAWNS: Record<BiomeId, Spawn> = {
  terrace: { x: 0, z: 24.5, yaw: Math.PI },
  basin: { x: 0.6, z: 30.2, yaw: Math.PI },
  rim: { x: 11.2, z: -26.4, yaw: 0 },
};

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
    frequency *= 2.08;
  }
  return value;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function terraceHeight(x: number, z: number): number {
  const r = Math.hypot(x, z);
  const ring = Math.floor(r / 6.4);
  const lip = ring * 0.78;
  const pool = -smoothstep(5.4, 0, r) * 1.55;
  const grain = (fbm(x * 0.07, z * 0.07) - 0.5) * 0.22;
  const rim = smoothstep(48, 58, r) * 4.8;
  return 0.35 + lip + pool + grain + rim;
}

function basinHeight(x: number, z: number): number {
  const r = Math.hypot(x, z) / WORLD_HALF;
  const bowl = 0.55 + r * r * 3.4;
  const vents = [
    [8.2, -6.4, 2.6],
    [-12.4, 4.8, 2.1],
    [4.6, 14.2, 1.7],
    [-7.8, -16.5, 2.4],
    [16.8, 8.2, 1.5],
  ].reduce((sum, [vx, vz, h]) => {
    const d = (x - vx) ** 2 / 18 + (z - vz) ** 2 / 18;
    return sum + Math.exp(-d) * h;
  }, 0);
  const grain = (fbm(x * 0.055, z * 0.055) - 0.45) * 0.42;
  return bowl + vents + grain;
}

function rimHeight(x: number, z: number): number {
  const canyon = -smoothstep(6.2, -18, x) * 22;
  const shelf = 1.15 + (fbm(x * 0.04, z * 0.028) - 0.5) * 0.55;
  const bench = smoothstep(16, 28, x) * 5.6;
  const ribs = Math.sin(z * 0.11) * 0.18 * smoothstep(4, 14, x);
  const drop = smoothstep(48, 58, Math.abs(z)) * 1.8;
  return shelf + canyon + bench + ribs + drop;
}

export function heightAt(biome: BiomeId, x: number, z: number): number {
  if (biome === 'terrace') return terraceHeight(x, z);
  if (biome === 'basin') return basinHeight(x, z);
  return rimHeight(x, z);
}

export function slopeAt(biome: BiomeId, x: number, z: number): { pitch: number; roll: number } {
  const sample = 0.8;
  const n = heightAt(biome, x, z - sample);
  const s = heightAt(biome, x, z + sample);
  const w = heightAt(biome, x - sample, z);
  const e = heightAt(biome, x + sample, z);
  return {
    pitch: Math.atan2(n - s, sample * 2),
    roll: Math.atan2(e - w, sample * 2),
  };
}

export function clampToWorld(biome: BiomeId, x: number, z: number): { x: number; z: number } {
  if (biome === 'rim') {
    return {
      x: Math.max(-22, Math.min(32, x)),
      z: Math.max(-WORLD_HALF * 0.94, Math.min(WORLD_HALF * 0.94, z)),
    };
  }
  const length = Math.hypot(x, z);
  const max = WORLD_HALF * 0.92;
  if (length <= max) return { x, z };
  const scale = max / length;
  return { x: x * scale, z: z * scale };
}

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

function mix(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  const k = Math.min(1, Math.max(0, t));
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

const TEAL = hexToRgb('#2f8a7c');
const OCHRE = hexToRgb('#c47a32');
const CORAL = hexToRgb('#d45a3a');
const RUST = hexToRgb('#8a4a28');
const PALE = hexToRgb('#e4d2b4');
const CREAM = hexToRgb('#e8dcc8');
const SULFUR = hexToRgb('#d4b44a');
const SINTER = hexToRgb('#c8b8a0');
const UMBER = hexToRgb('#6a3e28');
const CLIFF = hexToRgb('#a86838');
const PINE = hexToRgb('#3a4a2c');

export function colourAt(biome: BiomeId, x: number, z: number, y: number): [number, number, number] {
  if (biome === 'terrace') {
    const r = Math.hypot(x, z);
    let rgb = mix(TEAL, OCHRE, smoothstep(2.2, 9.5, r));
    rgb = mix(rgb, CORAL, smoothstep(12, 20, r));
    rgb = mix(rgb, RUST, smoothstep(22, 34, r));
    rgb = mix(rgb, PALE, smoothstep(36, 50, r));
    return rgb;
  }
  if (biome === 'basin') {
    const stain = fbm(x * 0.09 + 4, z * 0.09);
    let rgb = mix(CREAM, SINTER, smoothstep(0.8, 3.2, y));
    rgb = mix(rgb, SULFUR, stain * 0.55);
    rgb = mix(rgb, UMBER, smoothstep(3.8, 6.2, y));
    return rgb;
  }
  const west = smoothstep(10, -8, x);
  let rgb = mix(PINE, CLIFF, west);
  rgb = mix(rgb, UMBER, smoothstep(2.2, -6, y));
  rgb = mix(rgb, OCHRE, smoothstep(8, 18, x) * 0.45);
  return rgb;
}

export function buildTerrainGeometry(biome: BiomeId): PlaneGeometry {
  const geometry = new PlaneGeometry(WORLD_SIZE, WORLD_SIZE, TERRAIN_SEGMENTS, TERRAIN_SEGMENTS);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  const colours = new Float32Array(positions.count * 3);

  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    const y = heightAt(biome, x, z);
    positions.setY(i, y);
    const [r, g, b] = colourAt(biome, x, z, y);
    colours[i * 3] = r;
    colours[i * 3 + 1] = g;
    colours[i * 3 + 2] = b;
  }

  geometry.setAttribute('color', new BufferAttribute(colours, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export interface PropSpot {
  x: number;
  z: number;
  y: number;
  scale: number;
  twist: number;
}

export function coneSpots(biome: BiomeId): PropSpot[] {
  if (biome === 'terrace') {
    return Array.from({ length: 14 }, (_, index) => {
      const angle = (index / 14) * Math.PI * 2 + 0.18;
      const radius = 16 + (index % 3) * 5.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return { x, z, y: heightAt(biome, x, z), scale: 0.7 + hash2(index, 3) * 0.55, twist: hash2(index, 8) };
    });
  }
  if (biome === 'basin') {
    return [
      [8.2, -6.4, 1.4],
      [-12.4, 4.8, 1.15],
      [4.6, 14.2, 0.95],
      [-7.8, -16.5, 1.3],
      [16.8, 8.2, 0.85],
      [-18.4, -4.2, 0.9],
    ].map(([x, z, scale], index) => ({
      x,
      z,
      y: heightAt(biome, x, z),
      scale,
      twist: hash2(index, 5),
    }));
  }
  return Array.from({ length: 10 }, (_, index) => {
    const z = -28 + index * 6.4;
    const side = index % 2 === 0 ? 1 : -1;
    const x = 11.4 + side * (2.4 + hash2(index, 2) * 1.1);
    return { x, z, y: heightAt(biome, x, z), scale: 0.55 + hash2(index, 7) * 0.4, twist: hash2(index, 11) };
  });
}

export function pineSpots(): PropSpot[] {
  return Array.from({ length: 16 }, (_, index) => {
    const z = -32 + index * 4.2;
    const x = 22 + hash2(index, 4) * 6;
    return {
      x,
      z,
      y: heightAt('rim', x, z),
      scale: 0.85 + hash2(index, 9) * 0.5,
      twist: hash2(index, 13) * Math.PI,
    };
  });
}

export function ribbonGates(): Hazard[] {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = Math.PI / 2 + (index / 6) * Math.PI * 2;
    const radius = 22.4;
    return {
      id: `gate-${index}`,
      kind: 'gate' as const,
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      radius: 2.35,
      index,
    };
  });
}

export function hazardsFor(biome: BiomeId): Hazard[] {
  if (biome === 'terrace') {
    const cones = coneSpots(biome).map((spot, index) => ({
      id: `cone-${index}`,
      kind: 'cone' as const,
      x: spot.x,
      z: spot.z,
      radius: 1.05 * spot.scale,
    }));
    return [...ribbonGates(), ...cones];
  }
  if (biome === 'basin') {
    const vents = coneSpots(biome).map((spot, index) => ({
      id: `vent-${index}`,
      kind: 'vent' as const,
      x: spot.x,
      z: spot.z,
      radius: 2.1 * spot.scale,
    }));
    return [
      ...vents,
      { id: 'goal', kind: 'goal', x: 0.4, z: -34.5, radius: 3.4 },
    ];
  }
  return coneSpots(biome).map((spot, index) => ({
    id: `rock-${index}`,
    kind: 'rock' as const,
    x: spot.x,
    z: spot.z,
    radius: 1.15 * spot.scale,
  }));
}
