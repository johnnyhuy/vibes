import type { MutableRefObject } from 'react';
import type { CastId } from './casts';

export type Stance = 'idle' | 'walk' | 'run';

export interface PlayerState {
  x: number;
  y: number;
  z: number;
  yaw: number;
  speed: number;
  sprinting: boolean;
  stance: Stance;
  lastCast: CastId | null;
  lanternPull: number;
}

export interface CastEvent {
  token: number;
  id: CastId;
  x: number;
  z: number;
  yaw: number;
  startedAt: number;
}

export interface InputState {
  x: number;
  z: number;
  sprint: boolean;
  padX: number;
  padZ: number;
  padSprint: boolean;
}

export type PlayerRef = MutableRefObject<PlayerState>;
export type InputRef = MutableRefObject<InputState>;
export type CastQueueRef = MutableRefObject<CastEvent[]>;
