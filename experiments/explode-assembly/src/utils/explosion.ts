import * as THREE from 'three';

/**
 * Ordered explode layout — clean-room take on the public ashemag pattern:
 * project piece bounds onto the overview camera plane, bin-pack into a
 * gallery grid, return translations keyed by piece id.
 *
 * I sort by sidebar system order first so the rearrange reads as rows of
 * systems (body, glass, doors, …) rather than a random cloud.
 */

export const OVERVIEW_DIRECTION = new THREE.Vector3(-5.7, 2.1, 6.3).normalize();
export const LAYOUT_CENTER = new THREE.Vector3(0, 3, 0);

const VIEW_RIGHT = new THREE.Vector3()
  .crossVectors(new THREE.Vector3(0, 1, 0), OVERVIEW_DIRECTION)
  .normalize();
const VIEW_UP = new THREE.Vector3()
  .crossVectors(OVERVIEW_DIRECTION, VIEW_RIGHT)
  .normalize();

export const SYSTEM_ORDER = [
  'body',
  'glass',
  'doors',
  'interior',
  'battery',
  'motors',
  'thermal',
  'suspension',
  'wheels',
  'charging',
  'electronics',
  'lights',
] as const;

export type ExplosionSlot = {
  translation: THREE.Vector3;
};

export type ExplosionLayout = {
  pieces: Map<string, ExplosionSlot>;
  width: number;
  height: number;
};

export const EMPTY_LAYOUT: ExplosionLayout = {
  pieces: new Map(),
  width: 12,
  height: 8,
};

type LayoutPiece = {
  id: string;
  system?: string;
  bounds: THREE.Box3;
};

export function calculateExplosionLayout(pieces: LayoutPiece[]): ExplosionLayout {
  if (!pieces.length) return EMPTY_LAYOUT;

  const cards = pieces.map((piece) => {
    const { min, max } = piece.bounds;
    let left = Infinity;
    let bottom = Infinity;
    let rightEdge = -Infinity;
    let top = -Infinity;

    for (const x of [min.x, max.x]) {
      for (const y of [min.y, max.y]) {
        for (const z of [min.z, max.z]) {
          const corner = new THREE.Vector3(x, y, z);
          const u = corner.dot(VIEW_RIGHT);
          const v = corner.dot(VIEW_UP);
          left = Math.min(left, u);
          rightEdge = Math.max(rightEdge, u);
          bottom = Math.min(bottom, v);
          top = Math.max(top, v);
        }
      }
    }

    return {
      id: piece.id,
      system: piece.system ?? 'body',
      width: Math.max(0.36, rightEdge - left) + 0.28,
      height: Math.max(0.3, top - bottom) + 0.28,
      center: piece.bounds.getCenter(new THREE.Vector3()),
    };
  });

  cards.sort((a, b) => {
    const systemA = SYSTEM_ORDER.indexOf(a.system as (typeof SYSTEM_ORDER)[number]);
    const systemB = SYSTEM_ORDER.indexOf(b.system as (typeof SYSTEM_ORDER)[number]);
    const orderA = systemA === -1 ? SYSTEM_ORDER.length : systemA;
    const orderB = systemB === -1 ? SYSTEM_ORDER.length : systemB;
    if (orderA !== orderB) return orderA - orderB;
    return b.height - a.height || a.id.localeCompare(b.id);
  });

  const area = cards.reduce((sum, card) => sum + card.width * card.height, 0);
  const width = Math.max(12, Math.sqrt(area * 1.6));

  let x = 0;
  let y = 0;
  let rowHeight = 0;
  const slots = cards.map((card) => {
    if (x && x + card.width > width) {
      x = 0;
      y += rowHeight;
      rowHeight = 0;
    }
    const slot = {
      ...card,
      u: x + card.width / 2,
      v: y + card.height / 2,
    };
    x += card.width;
    rowHeight = Math.max(rowHeight, card.height);
    return slot;
  });

  const height = y + rowHeight;
  const piecesMap = new Map<string, ExplosionSlot>();

  for (const slot of slots) {
    const slotCenter = LAYOUT_CENTER.clone()
      .addScaledVector(VIEW_RIGHT, slot.u - width / 2)
      .addScaledVector(VIEW_UP, height / 2 - slot.v);

    piecesMap.set(slot.id, {
      translation: slotCenter.sub(slot.center),
    });
  }

  return { pieces: piecesMap, width, height };
}

/** Modest system-row nudge used before the gallery rearrange takes over. */
export function systemSpread(system: string): THREE.Vector3 {
  const index = SYSTEM_ORDER.indexOf(system as (typeof SYSTEM_ORDER)[number]);
  const i = index === -1 ? 0 : index;
  const col = (i % 4) - 1.5;
  const row = Math.floor(i / 4);
  return new THREE.Vector3()
    .addScaledVector(VIEW_RIGHT, col * 1.35)
    .addScaledVector(VIEW_UP, row * 1.1);
}
