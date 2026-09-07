import { useMemo } from 'react';
import * as THREE from 'three';

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGraph(count = 72, radius = 1.62) {
  const rand = mulberry32(20260908);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < count; i += 1) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = radius * Math.cbrt(rand());
    points.push(
      new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )
    );
  }

  const positions = new Float32Array(count * 3);
  points.forEach((point, i) => {
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;
  });

  const segments: number[] = [];
  for (let i = 0; i < count; i += 1) {
    for (let j = i + 1; j < count; j += 1) {
      if (points[i].distanceTo(points[j]) < 0.52) {
        segments.push(
          points[i].x,
          points[i].y,
          points[i].z,
          points[j].x,
          points[j].y,
          points[j].z
        );
      }
    }
  }

  return { positions, segments: new Float32Array(segments) };
}

export default function NeuralGraph() {
  const { positions, segments } = useMemo(() => buildGraph(), []);

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[segments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#8aaac8" transparent opacity={0.52} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#b7cce0" size={0.042} sizeAttenuation transparent opacity={0.95} />
      </points>
    </group>
  );
}
