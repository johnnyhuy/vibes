import * as THREE from 'three';

/**
 * Ordered explode layout — clean-room take on ashemag's public pattern:
 * project piece AABBs onto the overview camera plane, pack a gallery grid,
 * return translations keyed by piece id.
 *
 * I use a regular row/column slot grid (not a leftover radial dump) so at
 * 80–100% the parts sit in readable rows, grouped by sidebar system order.
 */

export const OVERVIEW_DIRECTION = new THREE.Vector3(-5.7, 2.1, 6.3).normalize();
export const LAYOUT_CENTER = new THREE.Vector3(0, 3.4, 0);

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
  width: 16,
  height: 10,
};

type LayoutPiece = {
  id: string;
  system?: string;
  bounds: THREE.Box3;
};

function systemIndex(system: string): number {
  const i = SYSTEM_ORDER.indexOf(system as (typeof SYSTEM_ORDER)[number]);
  return i === -1 ? SYSTEM_ORDER.length : i;
}

export function calculateExplosionLayout(pieces: LayoutPiece[]): ExplosionLayout {
  if (!pieces.length) return EMPTY_LAYOUT;

  const cards = pieces.map((piece) => {
    const bounds = piece.bounds;
    const empty = !bounds || bounds.isEmpty() || !Number.isFinite(bounds.min.x);
    const min = empty ? new THREE.Vector3(-0.4, -0.4, -0.4) : bounds.min;
    const max = empty ? new THREE.Vector3(0.4, 0.4, 0.4) : bounds.max;

    let left = Infinity;
    let bottom = Infinity;
    let rightEdge = -Infinity;
    let top = -Infinity;

    for (const x of [min.x, max.x]) {
      for (const y of [min.y, max.y]) {
        for (const z of [min.z, max.z]) {
          const corner = new THREE.Vector3(x, y, z);
          left = Math.min(left, corner.dot(VIEW_RIGHT));
          rightEdge = Math.max(rightEdge, corner.dot(VIEW_RIGHT));
          bottom = Math.min(bottom, corner.dot(VIEW_UP));
          top = Math.max(top, corner.dot(VIEW_UP));
        }
      }
    }

    return {
      id: piece.id,
      system: piece.system ?? 'body',
      // Clamp so one huge body panel cannot blow the gallery into a sparse dump.
      width: Math.min(3.4, Math.max(0.7, rightEdge - left) + 0.35),
      height: Math.min(2.6, Math.max(0.55, top - bottom) + 0.3),
      center: empty
        ? new THREE.Vector3()
        : bounds.getCenter(new THREE.Vector3()),
    };
  });

  cards.sort((a, b) => {
    const order = systemIndex(a.system) - systemIndex(b.system);
    if (order !== 0) return order;
    return b.height - a.height || a.id.localeCompare(b.id);
  });

  const area = cards.reduce((sum, card) => sum + card.width * card.height, 0);
  const width = Math.max(9, Math.min(16, Math.sqrt(area * 1.25)));

  let x = 0;
  let y = 0;
  let rowHeight = 0;
  const slots = cards.map((card) => {
    if (x && x + card.width > width) {
      x = 0;
      y += rowHeight;
      rowHeight = 0;
    }
    const slot = { ...card, u: x + card.width / 2, v: y + card.height / 2 };
    x += card.width;
    rowHeight = Math.max(rowHeight, card.height);
    return slot;
  });

  const height = Math.max(rowHeight, y + rowHeight);
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
