import type { MutableRefObject } from 'react';

export type TimeMode = 'dusk' | 'day' | 'cycle';
export type TimeName = 'dusk' | 'day';
export type LandmarkId = 'wick' | 'jetty' | 'kiln' | 'ford';

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
  pitch: number;
  roll: number;
  speed: number;
  wheel: number;
}

export interface HudSnapshot {
  pace: number;
  landmark: LandmarkId;
  landmarkRange: number;
  timeName: TimeName;
  timeMode: TimeMode;
  muted: boolean;
}

export type InputRef = MutableRefObject<DriveInput>;
export type VehicleRef = MutableRefObject<VehicleState>;
