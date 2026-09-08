import type { MutableRefObject } from 'react';

export type BiomeId = 'terrace' | 'basin' | 'rim';
export type PlayPhase = 'ready' | 'running' | 'cleared' | 'caught';
export type HazardKind = 'cone' | 'vent' | 'rock' | 'gate' | 'goal';

export interface DriveInput {
  throttle: number;
  steer: number;
  burst: boolean;
  padThrottle: number;
  padSteer: number;
}

export interface RunnerState {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  roll: number;
  speed: number;
  gait: number;
  burst: number;
}

export interface Hazard {
  id: string;
  kind: HazardKind;
  x: number;
  z: number;
  radius: number;
  index?: number;
}

export interface LoopState {
  phase: PlayPhase;
  score: number;
  progress: number;
  caption: string;
  nextGate: number;
  plumeZ: number;
  elapsed: number;
  distance: number;
}

export interface HudSnapshot {
  biome: BiomeId;
  phase: PlayPhase;
  score: number;
  best: number;
  progress: number;
  pace: number;
  caption: string;
  muted: boolean;
}

export type InputRef = MutableRefObject<DriveInput>;
export type RunnerRef = MutableRefObject<RunnerState>;
export type LoopRef = MutableRefObject<LoopState>;
