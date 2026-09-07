export type PlayState = 'ready' | 'flying' | 'crashed';

export type HazardKind = 'orb' | 'ring';

export type Lane = 0 | 1 | 2;

export interface Hazard {
  id: number;
  kind: HazardKind;
  lane: Lane;
  z: number;
  seed: number;
  taken: boolean;
}

export interface HudSnapshot {
  distance: number;
  rings: number;
  best: number;
  state: PlayState;
}
