import type { MutableRefObject } from 'react';

export type Atmosphere = 'sun' | 'rain' | 'dusk';
export type Quality = 'pretty' | 'performance';
export type CamMode = 'chase' | 'close';
export type MarkId = 'reach' | 'span' | 'cut';

export interface DriveInput {
  throttle: number;
  steer: number;
  brake: boolean;
  padThrottle: number;
  padSteer: number;
}

export interface VehicleState {
  x: number;
  y: number;
  z: number;
  yaw: number;
  speed: number;
  wheel: number;
}

export interface PathSample {
  t: number;
  x: number;
  z: number;
  yaw: number;
  lateral: number;
}

export interface HudSnapshot {
  pace: number;
  mark: MarkId;
  atmosphere: Atmosphere;
  muted: boolean;
  driving: boolean;
  quality: Quality;
  cam: CamMode;
}

export type InputRef = MutableRefObject<DriveInput>;
export type VehicleRef = MutableRefObject<VehicleState>;
