export type LookName = 'dusk' | 'glow' | 'fog';

export interface Mark {
  id: string;
  name: string;
  nameZh: string;
  copy: string;
  target: [number, number, number];
  camera: [number, number, number];
  minDistance: number;
  maxDistance: number;
}
