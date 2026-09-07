import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { HudStats } from '../types';

interface Props {
  onStats: (stats: HudStats) => void;
}

export default function StatsReporter({ onStats }: Props) {
  const frames = useRef(0);
  const elapsed = useRef(0);
  const fps = useRef(60);
  const { gl } = useThree();

  useFrame((_, delta) => {
    frames.current += 1;
    elapsed.current += delta;
    if (elapsed.current < 0.4) return;

    fps.current = frames.current / elapsed.current;
    frames.current = 0;
    elapsed.current = 0;

    onStats({
      fps: fps.current,
      triangles: gl.info.render.triangles,
      draws: gl.info.render.calls,
      revision: THREE.REVISION,
    });
  });

  return null;
}
