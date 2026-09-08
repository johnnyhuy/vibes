export type ColorKey = 'kiln' | 'ember' | 'slip' | 'soot' | 'glaze';

export type BrickKind = 'plate' | 'brick' | 'round' | 'tile';

export type ViewMode = 'assemble' | 'step' | 'explode';

export type IdeaId = 'dusk-hare' | 'clay-slip' | 'pewter-ash';

export type LookId = 'studio' | 'kiln-dusk' | 'pewter';

export type Palette = Record<ColorKey, string>;

export interface BrickSpec {
  id: string;
  step: number;
  kind: BrickKind;
  w: number;
  d: number;
  x: number;
  y: number;
  z: number;
  color: ColorKey;
  rotY?: number;
}

export interface StepInfo {
  id: number;
  name: string;
  nameZh: string;
  copy: string;
}

export interface Idea {
  id: IdeaId;
  name: string;
  nameZh: string;
  prompt: string;
  palette: Palette;
}

export interface Look {
  id: LookId;
  name: string;
  hdri: string;
  env: number;
  key: string;
  keyInt: number;
  fill: string;
  fillInt: number;
  rim: string;
  rimInt: number;
  exposure: number;
  bg: string;
  bloom: number;
}
