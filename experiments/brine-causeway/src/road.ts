import { BufferAttribute, BufferGeometry } from 'three';
import type { MarkId, PathSample } from './types';

const Z_MIN = -70;
const Z_MAX = 66;
const OUT_BASE = 2.2;
const IN_BASE = -9.4;
const NORTH_R = 8.6;
const SOUTH_R = 8.2;
const SAMPLES = 220;

export const ROAD_HALF = 4.15;
export const SHOULDER = 1.35;
export const WATER_Y = -0.55;

export interface PathPoint {
  x: number;
  z: number;
}

function outboundX(z: number): number {
  return OUT_BASE + 4.8 * Math.sin(z / 18.5);
}

function inboundX(z: number): number {
  return IN_BASE + 3.4 * Math.sin(z / 21);
}

function northCenter(): { cx: number; cz: number; r: number } {
  const startX = outboundX(Z_MAX);
  const endX = inboundX(Z_MAX);
  const cx = (startX + endX) / 2;
  const r = Math.max(NORTH_R, Math.abs(startX - endX) / 2 + 0.4);
  return { cx, cz: Z_MAX, r };
}

function southCenter(): { cx: number; cz: number; r: number } {
  const startX = inboundX(Z_MIN);
  const endX = outboundX(Z_MIN);
  const cx = (startX + endX) / 2;
  const r = Math.max(SOUTH_R, Math.abs(startX - endX) / 2 + 0.4);
  return { cx, cz: Z_MIN, r };
}

function rawPoint(u: number): PathPoint {
  const t = ((u % 1) + 1) % 1;
  if (t < 0.38) {
    const s = t / 0.38;
    const z = Z_MIN + (Z_MAX - Z_MIN) * s;
    return { x: outboundX(z), z };
  }
  if (t < 0.5) {
    const s = (t - 0.38) / 0.12;
    const { cx, cz, r } = northCenter();
    const a = Math.PI * s;
    return {
      x: cx + r * Math.cos(Math.PI - a),
      z: cz + r * Math.sin(a),
    };
  }
  if (t < 0.88) {
    const s = (t - 0.5) / 0.38;
    const z = Z_MAX - (Z_MAX - Z_MIN) * s;
    return { x: inboundX(z), z };
  }
  const s = (t - 0.88) / 0.12;
  const { cx, cz, r } = southCenter();
  const a = Math.PI * s;
  return {
    x: cx + r * Math.cos(a),
    z: cz - r * Math.sin(a),
  };
}

export function pathAt(t: number): Omit<PathSample, 'lateral'> {
  const a = rawPoint(t);
  const b = rawPoint(t + 0.0015);
  const yaw = Math.atan2(b.x - a.x, b.z - a.z);
  return { t: ((t % 1) + 1) % 1, x: a.x, z: a.z, yaw };
}

const CACHE: Omit<PathSample, 'lateral'>[] = Array.from({ length: SAMPLES }, (_, i) =>
  pathAt(i / SAMPLES)
);

export const SPAWN = pathAt(0.118);

export function nearestOnPath(x: number, z: number): PathSample {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < CACHE.length; i += 1) {
    const p = CACHE[i];
    const dx = p.x - x;
    const dz = p.z - z;
    const d = dx * dx + dz * dz;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  const p = CACHE[best];
  const ox = x - p.x;
  const oz = z - p.z;
  const lateral = ox * Math.cos(p.yaw) - oz * Math.sin(p.yaw);
  return { ...p, lateral };
}

export function nearestMark(x: number, z: number): MarkId {
  if (z > 58) return 'span';
  if (z > 48 && x < -2) return 'cut';
  return 'reach';
}

export const MARKS: Record<MarkId, { name: string; nameZh: string }> = {
  reach: { name: 'Salt Reach', nameZh: '盐岸' },
  span: { name: 'Vermilion Span', nameZh: '朱跨' },
  cut: { name: 'Kelp Cut', nameZh: '藻口' },
};

export function clampWorld(x: number, z: number): { x: number; z: number } {
  return {
    x: Math.max(-42, Math.min(36, x)),
    z: Math.max(-92, Math.min(92, z)),
  };
}

export function pineSpots(count: number): { x: number; z: number; scale: number; twist: number }[] {
  const spots = [];
  for (let i = 0; i < count; i += 1) {
    const seed = (i * 17.13 + 4.2) % 1;
    const seedB = (i * 9.71 + 0.37) % 1;
    const z = -74 + (150 * i) / Math.max(1, count - 1) + (seed - 0.5) * 6;
    const band = i % 7 === 0 ? 20 + seedB * 7 : 9.2 + seedB * 8.5;
    spots.push({
      x: band,
      z,
      scale: 1.05 + seed * 1.15,
      twist: seedB * Math.PI * 2,
    });
  }
  return spots;
}

export function cliffCypress(count: number): { x: number; z: number; scale: number; twist: number }[] {
  const spots = [];
  for (let i = 0; i < count; i += 1) {
    const seed = (i * 11.4 + 2.8) % 1;
    const z = -66 + (128 * i) / Math.max(1, count - 1);
    spots.push({
      x: -18 - seed * 5,
      z: z + (seed - 0.5) * 4,
      scale: 0.55 + seed * 0.45,
      twist: seed * 4,
    });
  }
  return spots;
}

export function dashSpots(): { x: number; z: number; yaw: number }[] {
  const spots = [];
  for (let i = 0; i < 70; i += 1) {
    if (i % 2 === 1) continue;
    spots.push(pathAt(i / 70));
  }
  return spots;
}

export function buildRoadGeometry(): BufferGeometry {
  const segs = 168;
  const half = ROAD_HALF;
  const positions = new Float32Array((segs + 1) * 2 * 3);
  const uvs = new Float32Array((segs + 1) * 2 * 2);
  const indices: number[] = [];

  for (let i = 0; i <= segs; i += 1) {
    const p = pathAt(i / segs);
    const rx = Math.cos(p.yaw);
    const rz = -Math.sin(p.yaw);
    const left = i * 2;
    const right = left + 1;
    positions[left * 3] = p.x - rx * half;
    positions[left * 3 + 1] = 0.02;
    positions[left * 3 + 2] = p.z - rz * half;
    positions[right * 3] = p.x + rx * half;
    positions[right * 3 + 1] = 0.02;
    positions[right * 3 + 2] = p.z + rz * half;
    uvs[left * 2] = 0;
    uvs[left * 2 + 1] = i / 8;
    uvs[right * 2] = 1;
    uvs[right * 2 + 1] = i / 8;
    if (i < segs) {
      indices.push(left, right, left + 2, right, right + 2, left + 2);
    }
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(positions, 3));
  geo.setAttribute('uv', new BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function railSpots(): { x: number; z: number; yaw: number }[] {
  const spots = [];
  for (let i = 0; i < 90; i += 1) {
    const p = pathAt(i / 90);
    const rx = Math.cos(p.yaw);
    const rz = -Math.sin(p.yaw);
    // ocean / inbound side
    spots.push({
      x: p.x - rx * (ROAD_HALF + 0.55),
      z: p.z - rz * (ROAD_HALF + 0.55),
      yaw: p.yaw,
    });
  }
  return spots;
}

export function bridgeAnchor() {
  const { cx, cz, r } = northCenter();
  return {
    cx,
    cz: cz + r * 0.15,
    deckZ: cz + r * 0.55,
    westX: cx - r - 3.2,
    eastX: cx + r + 3.2,
    r,
  };
}
