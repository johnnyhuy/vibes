import * as THREE from 'three';

/**
 * Calculate explosion layout for pieces
 * Based on ashemag's model-x-studio explosion-layout.ts
 * Projects pieces onto a 2D grid and calculates translation vectors
 * 
 * Returns a Map keyed by piece ID to avoid index mismatch
 */

// System order matching sidebar (intentional layout order)
const SYSTEM_ORDER = [
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
];

export function calculateExplosionLayout(pieces: any[]): Map<string, THREE.Vector3> {
  if (!pieces.length) return new Map();
  
  // Viewing direction for projection
  const overviewDirection = new THREE.Vector3(-5.7, 2.1, 6.3).normalize();
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), overviewDirection).normalize();
  const up = new THREE.Vector3().crossVectors(overviewDirection, right).normalize();
  
  // Calculate 2D projected bounds for each piece
  const cards = pieces.map(piece => {
    const { min, max } = piece.bounds;
    let left = Infinity, bottom = Infinity, rightEdge = -Infinity, top = -Infinity;
    
    // Project all 8 corners of the bounding box
    for (const x of [min.x, max.x]) {
      for (const y of [min.y, max.y]) {
        for (const z of [min.z, max.z]) {
          const corner = new THREE.Vector3(x, y, z);
          const u = corner.dot(right);
          const v = corner.dot(up);
          left = Math.min(left, u);
          rightEdge = Math.max(rightEdge, u);
          bottom = Math.min(bottom, v);
          top = Math.max(top, v);
        }
      }
    }
    
    return {
      ...piece,
      width: Math.max(0.36, rightEdge - left) + 0.22,
      height: Math.max(0.3, top - bottom) + 0.22,
    };
  });
  
  // Sort by system order first (sidebar order), then by size within system
  // This creates the intentional "rearrange" pattern like ashe's demo
  cards.sort((a, b) => {
    const systemA = SYSTEM_ORDER.indexOf(a.system);
    const systemB = SYSTEM_ORDER.indexOf(b.system);
    
    // If different systems, sort by system order
    if (systemA !== systemB) {
      return systemA - systemB;
    }
    
    // Within same system, sort by size (height)
    return b.height - a.height;
  });
  
  // Pack into grid
  const totalArea = cards.reduce((sum, c) => sum + c.width * c.height, 0);
  const gridWidth = Math.max(12, Math.sqrt(totalArea * 1.6));
  
  let x = 0, y = 0, rowHeight = 0;
  const slots = cards.map(card => {
    if (x && x + card.width > gridWidth) {
      x = 0;
      y += rowHeight;
      rowHeight = 0;
    }
    const slot = { ...card, x: x + card.width / 2, y: y + card.height / 2 };
    x += card.width;
    rowHeight = Math.max(rowHeight, card.height);
    return slot;
  });
  
  const gridHeight = y + rowHeight;
  const layoutCenter = new THREE.Vector3(0, 3, 0);
  
  // Calculate translation vectors from center to grid slot
  // Return Map keyed by piece ID to avoid index mismatch
  const layoutMap = new Map<string, THREE.Vector3>();
  
  slots.forEach(slot => {
    const gridPos = layoutCenter.clone()
      .addScaledVector(right, slot.x - gridWidth / 2)
      .addScaledVector(up, gridHeight / 2 - slot.y);
    
    const offset = gridPos.sub(slot.center);
    layoutMap.set(slot.id, offset);
  });
  
  return layoutMap;
}
