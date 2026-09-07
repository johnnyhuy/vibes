import type { BallKind } from './types';

export interface BallFeel {
  kind: BallKind;
  label: string;
  note: string;
  mass: number;
  friction: number;
  restitution: number;
  linearDamping: number;
  angularDamping: number;
  drive: number;
  radius: number;
  color: string;
  roughness: number;
  metalness: number;
}

export const BALL_FEEL: Record<BallKind, BallFeel> = {
  wood: {
    kind: 'wood',
    label: 'Wood',
    note: 'Light, grippy, easy to steer',
    mass: 1.15,
    friction: 0.82,
    restitution: 0.16,
    linearDamping: 0.18,
    angularDamping: 0.12,
    drive: 38,
    radius: 0.42,
    color: '#c4a06a',
    roughness: 0.62,
    metalness: 0.04
  },
  stone: {
    kind: 'stone',
    label: 'Stone',
    note: 'Heavy, planted, slow to turn',
    mass: 2.7,
    friction: 0.58,
    restitution: 0.06,
    linearDamping: 0.1,
    angularDamping: 0.22,
    drive: 52,
    radius: 0.42,
    color: '#8b8680',
    roughness: 0.88,
    metalness: 0.08
  },
  metal: {
    kind: 'metal',
    label: 'Metal',
    note: 'Dense, slippery, keeps momentum',
    mass: 4.1,
    friction: 0.16,
    restitution: 0.11,
    linearDamping: 0.02,
    angularDamping: 0.04,
    drive: 64,
    radius: 0.42,
    color: '#d7b56a',
    roughness: 0.18,
    metalness: 0.92
  }
};

export const PATH_FRICTION = 0.62;
export const PATH_RESTITUTION = 0.04;
export const GRAVITY_Y = -22;
export const FALL_Y = -10;
