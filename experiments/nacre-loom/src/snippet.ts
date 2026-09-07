import type { LoomState } from './recipes';

class ClipboardUnavailableError extends Error {
  constructor() {
    super('Clipboard is not available in this browser.');
    this.name = 'ClipboardUnavailableError';
  }
}

function hexToVec3(hex: string): string {
  const value = hex.replace('#', '');
  const n = Number.parseInt(value, 16);
  if (!Number.isFinite(n) || value.length !== 6) return 'vec3(1.0)';
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const fmt = (c: number) => c.toFixed(3);
  return `vec3(${fmt(r)}, ${fmt(g)}, ${fmt(b)})`;
}

export function buildLoomSnippet(state: LoomState): string {
  const config = {
    loom: 'nacre-loom',
    vessel: 'Nacre Loom / 珠络',
    recipe: state.recipeId,
    weave: state.weave,
    dyes: {
      shell: state.shell,
      attenuation: state.attenuation,
      filmA: state.filmA,
      filmB: state.filmB,
      filmC: state.filmC,
    },
    glass: {
      ior: Number(state.ior.toFixed(2)),
      thickness: Number(state.thickness.toFixed(2)),
      roughness: Number(state.roughness.toFixed(2)),
      transmission: Number(state.transmission.toFixed(2)),
      clearcoat: Number(state.clearcoat.toFixed(2)),
    },
    motion: {
      speed: Number(state.speed.toFixed(2)),
      amplitude: Number(state.amplitude.toFixed(2)),
      morph: Number(state.morph.toFixed(2)),
    },
  };

  const glsl = `// Nacre Loom film — invented for vibes, not a third-party clone
vec3 nacreFilm(vec3 p, vec3 n, vec3 v, float t) {
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.2);
  vec3 a = ${hexToVec3(state.filmA)};
  vec3 b = ${hexToVec3(state.filmB)};
  vec3 c = ${hexToVec3(state.filmC)};
  vec3 film = mix(a, b, 0.5 + 0.5 * sin(p.y * 8.0 + t + fres * 3.0));
  return mix(film, c, fres);
}`;

  return `/* Nacre Loom / 珠络 — vibes · nacre-loom */
${JSON.stringify(config, null, 2)}

${glsl}
`;
}

export async function copyLoomSnippet(state: LoomState): Promise<void> {
  if (!navigator.clipboard?.writeText) {
    throw new ClipboardUnavailableError();
  }
  await navigator.clipboard.writeText(buildLoomSnippet(state));
}
