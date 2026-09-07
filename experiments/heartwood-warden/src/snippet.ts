import { castById, type CastId } from './casts';
import type { Stance } from './types';

class ClipboardUnavailableError extends Error {
  constructor() {
    super('Clipboard is not available in this browser.');
    this.name = 'ClipboardUnavailableError';
  }
}

export interface WardSnippetState {
  stance: Stance;
  lastCast: CastId | null;
}

export function buildWardSnippet(state: WardSnippetState): string {
  const cast = state.lastCast ? castById(state.lastCast) : null;
  const config = {
    loom: 'heartwood-warden',
    vessel: 'Heartwood Warden / 心木守',
    stance: state.stance,
    lastCast: cast
      ? {
          id: cast.id,
          label: cast.label,
          duration: cast.duration,
        }
      : null,
  };

  const helper = `// Heartwood Warden — invented for vibes.
// A generated mesh is the start; the walkable glade is the rebuild.
function rootPulse(origin, t) {
  const radius = 0.4 + t * 4.8;
  const fade = Math.max(0, 1 - t / 1.6);
  return { radius, y: 0.04, opacity: fade * 0.72 };
}`;

  return `/* Heartwood Warden / 心木守 — vibes · heartwood-warden */
${JSON.stringify(config, null, 2)}

${helper}
`;
}

export async function copyWardSnippet(state: WardSnippetState): Promise<void> {
  if (!navigator.clipboard?.writeText) {
    throw new ClipboardUnavailableError();
  }
  await navigator.clipboard.writeText(buildWardSnippet(state));
}
