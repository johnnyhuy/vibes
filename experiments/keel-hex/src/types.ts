export type SpeedId = 1 | 2 | 4;

export type ViewMode = 'assembled' | 'inside' | 'exploded';

export interface StepInfo {
  id: number;
  name: string;
  nameZh: string;
  copy: string;
}

export interface ModeInfo {
  id: ViewMode;
  index: string;
  name: string;
  copy: string;
}

export interface Toggles {
  labels: boolean;
  orbit: boolean;
  petals: boolean;
  loom: boolean;
  tide: boolean;
  sight: boolean;
}

export type Vec3 = [number, number, number];
