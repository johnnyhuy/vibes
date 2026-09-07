export type FinishId = 'studio' | 'midnight' | 'citrus';

export type HotspotId = 'driver' | 'cushion' | 'yoke' | 'controls';

export interface Finish {
  id: FinishId;
  label: string;
  housing: string;
  pad: string;
  driver: string;
  metal: string;
  glass: string;
  accent: string;
}

export interface Hotspot {
  id: HotspotId;
  label: string;
  copy: string;
}

export const FINISHES: Finish[] = [
  {
    id: 'studio',
    label: 'Studio',
    housing: '#f3f1ea',
    pad: '#9aa88a',
    driver: '#d46a2c',
    metal: '#c9cdd3',
    glass: '#f4f7fb',
    accent: '#e8a15a',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    housing: '#1b1d22',
    pad: '#3a3d44',
    driver: '#c56a3a',
    metal: '#8b9098',
    glass: '#d7dde6',
    accent: '#d7a06a',
  },
  {
    id: 'citrus',
    label: 'Citrus',
    housing: '#efe4c8',
    pad: '#c46a3a',
    driver: '#2c2f34',
    metal: '#d8c07a',
    glass: '#fff6e4',
    accent: '#f0c36a',
  },
];

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'driver',
    label: 'Open driver',
    copy: 'A glass window over a perforated cup. I drew the grille as a canvas texture — no brand mesh, no scanned driver.',
  },
  {
    id: 'cushion',
    label: 'Cushion',
    copy: 'Soft squircle pads. Sheen stands in for fabric. Two finishes swap the colour; the silhouette stays mine.',
  },
  {
    id: 'yoke',
    label: 'Slider yoke',
    copy: 'Twin chrome rails and a small yoke. Telescopes in the render, not in the CAD of someone else’s factory.',
  },
  {
    id: 'controls',
    label: 'Edge slab',
    copy: 'Three dummy pills on the cup rim. They fire a mute-default oscillator click — not a sampled product sound.',
  },
];

export function finishById(id: FinishId): Finish {
  const found = FINISHES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown finish ${id}`);
  return found;
}

export function hotspotById(id: HotspotId): Hotspot {
  const found = HOTSPOTS.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown hotspot ${id}`);
  return found;
}
