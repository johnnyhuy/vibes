import { Vector3 } from 'three';
import { BRICK_H, PLATE_H, SET, STUD } from './catalog';
import type { BrickSpec, ViewMode } from './types';

export function brickHeight(brick: BrickSpec): number {
  if (brick.kind === 'plate' || brick.kind === 'tile') return PLATE_H;
  return BRICK_H;
}

export function brickSize(brick: BrickSpec): [number, number, number] {
  return [brick.w * STUD, brickHeight(brick), brick.d * STUD];
}

export function brickRest(brick: BrickSpec): Vector3 {
  const height = brickHeight(brick);
  return new Vector3(brick.x * STUD, brick.y * PLATE_H + height / 2, brick.z * STUD);
}

const RESTS = new Map(SET.map((brick) => [brick.id, brickRest(brick)]));

export function restOf(brick: BrickSpec): Vector3 {
  return RESTS.get(brick.id) ?? brickRest(brick);
}

export function setCentroid(bricks: BrickSpec[]): Vector3 {
  const centre = new Vector3();
  if (bricks.length === 0) return centre;
  for (const brick of bricks) centre.add(restOf(brick));
  return centre.divideScalar(bricks.length);
}

export function explodeOffset(brick: BrickSpec, centroid: Vector3): Vector3 {
  const rest = restOf(brick);
  const dir = rest.clone().sub(centroid);
  if (dir.lengthSq() < 1e-4) {
    dir.set(brick.x, brick.y * 0.2, brick.z);
  }
  dir.normalize();
  const lift = 0.18 + brick.step * 0.07;
  return dir.multiplyScalar(0.42 + brick.step * 0.11).add(new Vector3(0, lift, 0));
}

export function hashShade(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ((hash % 9) - 4) * 0.012;
}

export function visibleBricks(step: number, mode: ViewMode): BrickSpec[] {
  if (mode !== 'step') return SET;
  return SET.filter((brick) => brick.step <= step);
}
