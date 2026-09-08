import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D } from 'three';
import type { Quality } from '../types';

interface Props {
  active: boolean;
  quality: Quality;
  reducedMotion: boolean;
}

const dummy = new Object3D();

export default function Rain({ active, quality, reducedMotion }: Props) {
  const count = quality === 'pretty' ? 280 : 90;
  const mesh = useRef<InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 280 }, (_, i) => ({
        x: ((i * 17) % 70) - 28,
        z: ((i * 13) % 160) - 80,
        y: (i * 7) % 18,
        speed: 10 + (i % 7),
      })),
    []
  );

  useFrame((_, delta) => {
    const inst = mesh.current;
    if (!inst || !active) return;
    const fall = reducedMotion ? 2 : 1;
    for (let i = 0; i < count; i += 1) {
      const drop = seeds[i];
      drop.y -= drop.speed * delta * fall;
      if (drop.y < 0) drop.y = 16 + (i % 5);
      dummy.position.set(drop.x, drop.y, drop.z);
      dummy.rotation.set(0.15, 0, 0.05);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.03, 0.55, 0.03]} />
      <meshBasicMaterial color="#c8d4dc" transparent opacity={0.45} />
    </instancedMesh>
  );
}
