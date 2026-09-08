import type { MutableRefObject } from 'react';

export type Stance = 'idle' | 'walk' | 'run';

export type SlipId =
  | 'oak'
  | 'seat'
  | 'cairn'
  | 'bothy'
  | 'wheel'
  | 'stones'
  | 'isle'
  | 'west';

export interface Slip {
  id: SlipId;
  x: number;
  z: number;
  title: string;
  verse: string;
}

export interface PlayerState {
  x: number;
  y: number;
  z: number;
  yaw: number;
  lookYaw: number;
  lookPitch: number;
  speed: number;
  sprinting: boolean;
  stance: Stance;
  gathered: SlipId[];
  lastSlip: SlipId | null;
}

export interface InputState {
  x: number;
  z: number;
  sprint: boolean;
  padX: number;
  padZ: number;
  padSprint: boolean;
  lookLocked: boolean;
}

export type PlayerRef = MutableRefObject<PlayerState>;
export type InputRef = MutableRefObject<InputState>;
