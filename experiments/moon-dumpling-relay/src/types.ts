export type Phase = 'select' | 'countdown' | 'play' | 'results';

export type Species = 'fox' | 'raccoon' | 'owl' | 'badger' | 'hare';

export type PlateKind = 'pleat' | 'soup' | 'moon' | 'chili' | 'tea';

export type AiStyle = 'orbit' | 'savour';

export type StatusKind = 'clear' | 'chili' | 'tea';

export interface DinerDef {
  id: string;
  species: Species;
  name: string;
  nameZh: string;
  hue: string;
  accent: string;
  lede: string;
}

export interface PlateState {
  id: number;
  kind: PlateKind;
  slot: number;
  hiddenUntil: number;
}

export interface ActorState {
  dinerId: string;
  angle: number;
  score: number;
  eaten: number;
  chain: number;
  bestChain: number;
  chiliUntil: number;
  teaUntil: number;
  dashUntil: number;
  dashReadyAt: number;
  eatUntil: number;
  lean: number;
  lastKind?: PlateKind;
  lastBiteAt: number;
  isPlayer: boolean;
  ai: AiStyle | null;
}

export interface HudSnapshot {
  phase: Phase;
  selectedId: string;
  countdown: number;
  remaining: number;
  muted: boolean;
  player: ActorState | null;
  rivals: ActorState[];
  roster: ActorState[];
  status: StatusKind;
  lastBite: string;
}

export interface InputState {
  left: boolean;
  right: boolean;
  eat: boolean;
  dash: boolean;
  confirm: boolean;
}
