import { ExtrudeGeometry, Shape } from 'three';

export const ARM_COUNT = 6;
export const ARM_RADIUS = 0.5;
export const PLATE_RADIUS = 0.2;

export function armAngle(index: number): number {
  return (index / ARM_COUNT) * Math.PI * 2 + Math.PI / 6;
}

export function armPoint(index: number, radius = ARM_RADIUS): [number, number, number] {
  const angle = armAngle(index);
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
}

export function hexShape(radius: number): Shape {
  const shape = new Shape();
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

export function hexPlateGeometry(radius: number, depth: number): ExtrudeGeometry {
  return new ExtrudeGeometry(hexShape(radius), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.004,
    bevelSegments: 2,
    curveSegments: 1,
  });
}

export function petalShape(): Shape {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.016, 0.024, 0.042, 0.1, 0.022, 0.26);
  shape.bezierCurveTo(0.01, 0.3, -0.01, 0.3, -0.022, 0.26);
  shape.bezierCurveTo(-0.042, 0.1, -0.016, 0.024, 0, 0);
  return shape;
}

export function petalGeometry(): ExtrudeGeometry {
  return new ExtrudeGeometry(petalShape(), {
    depth: 0.006,
    bevelEnabled: true,
    bevelThickness: 0.0012,
    bevelSize: 0.0016,
    bevelSegments: 2,
    curveSegments: 12,
  });
}
