import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { HudStats } from '../types';

interface Props {
  onStats: (stats: HudStats) => void;
}

function countScene(scene: THREE.Object3D): { triangles: number; draws: number } {
  let triangles = 0;
  let draws = 0;

  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh && mesh.visible && mesh.geometry) {
      const geometry = mesh.geometry;
      const indexed = geometry.index;
      const positions = geometry.attributes.position;
      if (indexed) triangles += indexed.count / 3;
      else if (positions) triangles += positions.count / 3;
      draws += 1;
      return;
    }

    const line = object as THREE.Line;
    if (line.isLine && line.visible && line.geometry) {
      const positions = line.geometry.attributes.position;
      if (positions) triangles += positions.count / 2;
      draws += 1;
      return;
    }

    const points = object as THREE.Points;
    if (points.isPoints && points.visible && points.geometry) {
      draws += 1;
    }
  });

  return { triangles: Math.round(triangles), draws };
}

export default function StatsReporter({ onStats }: Props) {
  const frames = useRef(0);
  const elapsed = useRef(0);
  const fps = useRef(0);
  const { scene } = useThree();

  useFrame((_, delta) => {
    frames.current += 1;
    elapsed.current += delta;
    if (elapsed.current < 0.45) return;

    fps.current = frames.current / elapsed.current;
    frames.current = 0;
    elapsed.current = 0;

    const { triangles, draws } = countScene(scene);
    onStats({
      fps: fps.current,
      triangles,
      draws,
      revision: THREE.REVISION,
    });
  });

  return null;
}
