export type BallKind = 'wood' | 'stone' | 'metal';

export type PlayState = 'ready' | 'rolling' | 'fallen' | 'finished';

export const BALL_KINDS: BallKind[] = ['wood', 'stone', 'metal'];

export interface HudSnapshot {
  elapsed: number;
  motes: number;
  moteTotal: number;
  state: PlayState;
}

export class PlayError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'PlayError';
    this.code = code;
  }
}
