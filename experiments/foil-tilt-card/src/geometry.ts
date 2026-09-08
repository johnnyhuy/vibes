import { ExtrudeGeometry, Shape, ShapeGeometry, type BufferGeometry } from 'three';

function roundedRect(width: number, height: number, radius: number): Shape {
  const shape = new Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function applyCardUvs(geometry: BufferGeometry, width: number, height: number) {
  const uv = geometry.getAttribute('uv');
  const pos = geometry.getAttribute('position');
  for (let i = 0; i < pos.count; i += 1) {
    uv.setXY(i, pos.getX(i) / width + 0.5, pos.getY(i) / height + 0.5);
  }
  uv.needsUpdate = true;
}

export function cardStockGeometry(width: number, height: number, radius: number, depth: number) {
  return new ExtrudeGeometry(roundedRect(width, height, radius), {
    depth,
    bevelEnabled: false,
    curveSegments: 8,
  });
}

export function cardFaceGeometry(width: number, height: number, radius: number) {
  const geometry = new ShapeGeometry(roundedRect(width, height, radius), 8);
  applyCardUvs(geometry, width, height);
  geometry.computeVertexNormals();
  return geometry;
}
