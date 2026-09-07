export type RecipeId =
  | 'tide-film'
  | 'pearl-drift'
  | 'brine-glass'
  | 'copper-wake'
  | 'ink-nacre'
  | 'cinder-milk';

export type WeaveId = 'belt' | 'coil' | 'bloom' | 'wake' | 'veil' | 'seed';
export type StageId = 'well' | 'kiln';

export interface Recipe {
  id: RecipeId;
  label: string;
  copy: string;
  weave: WeaveId;
  shell: string;
  attenuation: string;
  filmA: string;
  filmB: string;
  filmC: string;
  ior: number;
  thickness: number;
  roughness: number;
  transmission: number;
  clearcoat: number;
  morph: number;
  speed: number;
  amplitude: number;
}

export interface LoomState {
  recipeId: RecipeId;
  weave: WeaveId;
  shell: string;
  attenuation: string;
  filmA: string;
  filmB: string;
  filmC: string;
  ior: number;
  thickness: number;
  roughness: number;
  transmission: number;
  clearcoat: number;
  morph: number;
  speed: number;
  amplitude: number;
}

export const RECIPES: Recipe[] = [
  {
    id: 'tide-film',
    label: 'Tide Film',
    copy: 'A horizontal nacre belt. Cyan slips into magenta, then a warm orange, the way wet silk holds a tide line.',
    weave: 'belt',
    shell: '#eef6fb',
    attenuation: '#9fd4e8',
    filmA: '#4ce0d2',
    filmB: '#e56ad6',
    filmC: '#ff9a4a',
    ior: 1.48,
    thickness: 1.35,
    roughness: 0.12,
    transmission: 1,
    clearcoat: 0.72,
    morph: 0.22,
    speed: 0.62,
    amplitude: 0.72,
  },
  {
    id: 'pearl-drift',
    label: 'Pearl Drift',
    copy: 'Milk glass with a slow interior bloom. The vessel wants to be a seed, not a jewel.',
    weave: 'bloom',
    shell: '#f7f2ea',
    attenuation: '#e8d8c4',
    filmA: '#fff6ea',
    filmB: '#d9c4ff',
    filmC: '#b8e4d8',
    ior: 1.42,
    thickness: 1.7,
    roughness: 0.28,
    transmission: 0.94,
    clearcoat: 0.4,
    morph: 0.28,
    speed: 0.28,
    amplitude: 0.38,
  },
  {
    id: 'brine-glass',
    label: 'Brine Glass',
    copy: 'A helical brine coil. Thicker shell, colder dye, the sort of bottle a tide pool would keep.',
    weave: 'coil',
    shell: '#d7eef2',
    attenuation: '#2f7a86',
    filmA: '#1ec8c0',
    filmB: '#3a6cff',
    filmC: '#8affd2',
    ior: 1.56,
    thickness: 2.1,
    roughness: 0.08,
    transmission: 1,
    clearcoat: 0.85,
    morph: 0.55,
    speed: 0.48,
    amplitude: 0.7,
  },
  {
    id: 'copper-wake',
    label: 'Copper Wake',
    copy: 'Warm metal-adjacent film that trails itself. A kiln leftover, still moving.',
    weave: 'wake',
    shell: '#fff1e4',
    attenuation: '#c97a3a',
    filmA: '#ffb35a',
    filmB: '#ff5a3a',
    filmC: '#ffe7a8',
    ior: 1.52,
    thickness: 1.15,
    roughness: 0.16,
    transmission: 0.88,
    clearcoat: 0.55,
    morph: 0.5,
    speed: 0.74,
    amplitude: 0.62,
  },
  {
    id: 'ink-nacre',
    label: 'Ink Nacre',
    copy: 'Near-black glass. The film only speaks at the rim, like ink catching a lamp.',
    weave: 'veil',
    shell: '#1a1d24',
    attenuation: '#0b0d12',
    filmA: '#7a5cff',
    filmB: '#3ee0ff',
    filmC: '#f2f6ff',
    ior: 1.62,
    thickness: 0.85,
    roughness: 0.22,
    transmission: 0.72,
    clearcoat: 0.9,
    morph: 0.36,
    speed: 0.4,
    amplitude: 0.48,
  },
  {
    id: 'cinder-milk',
    label: 'Cinder Milk',
    copy: 'Pale frost with a concentrated ember seed. Soft outside, restless in the middle.',
    weave: 'seed',
    shell: '#f4f0ea',
    attenuation: '#ead8c8',
    filmA: '#ffe6c8',
    filmB: '#ff6b4a',
    filmC: '#fff8f0',
    ior: 1.4,
    thickness: 1.9,
    roughness: 0.34,
    transmission: 0.9,
    clearcoat: 0.3,
    morph: 0.22,
    speed: 0.34,
    amplitude: 0.44,
  },
];

export function recipeById(id: RecipeId): Recipe {
  const found = RECIPES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown nacre recipe: ${id}`);
  return found;
}

export function loomFromRecipe(recipe: Recipe): LoomState {
  return {
    recipeId: recipe.id,
    weave: recipe.weave,
    shell: recipe.shell,
    attenuation: recipe.attenuation,
    filmA: recipe.filmA,
    filmB: recipe.filmB,
    filmC: recipe.filmC,
    ior: recipe.ior,
    thickness: recipe.thickness,
    roughness: recipe.roughness,
    transmission: recipe.transmission,
    clearcoat: recipe.clearcoat,
    morph: recipe.morph,
    speed: recipe.speed,
    amplitude: recipe.amplitude,
  };
}

export function weaveIndex(weave: WeaveId): number {
  switch (weave) {
    case 'belt':
      return 0;
    case 'coil':
      return 1;
    case 'bloom':
      return 2;
    case 'wake':
      return 3;
    case 'veil':
      return 4;
    case 'seed':
      return 5;
    default: {
      const _never: never = weave;
      return _never;
    }
  }
}
