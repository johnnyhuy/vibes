import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { explodeOffset, restOf, setCentroid, visibleBricks } from '../bricks';
import type { Palette, ViewMode } from '../types';
import BrickMesh from './BrickMesh';

interface Props {
  step: number;
  mode: ViewMode;
  palette: Palette;
  reducedMotion: boolean;
}

export default function HareSet({ step, mode, palette, reducedMotion }: Props) {
  const bricks = useMemo(() => visibleBricks(step, mode), [step, mode]);
  const centroid = useMemo(() => setCentroid(bricks), [bricks]);
  const explode = mode === 'explode' ? 1 : 0;

  return (
    <group position={[0, 0.04, 0]}>
      {bricks.map((brick) => (
        <PlacedBrick
          key={brick.id}
          brick={brick}
          palette={palette}
          centroid={centroid}
          explode={explode}
          highlight={mode === 'step' && brick.step === step}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}

function PlacedBrick({
  brick,
  palette,
  centroid,
  explode,
  highlight,
  reducedMotion,
}: {
  brick: ReturnType<typeof visibleBricks>[number];
  palette: Palette;
  centroid: Vector3;
  explode: number;
  highlight: boolean;
  reducedMotion: boolean;
}) {
  const group = useRef<Group>(null);
  const rest = useMemo(() => restOf(brick), [brick]);
  const offset = useMemo(() => explodeOffset(brick, centroid), [brick, centroid]);
  const goal = useMemo(() => rest.clone().addScaledVector(offset, explode), [rest, offset, explode]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    if (reducedMotion) {
      node.position.copy(goal);
      return;
    }
    const ease = 1 - Math.pow(0.08, delta);
    node.position.lerp(goal, ease);
  });

  return (
    <group ref={group} position={reducedMotion ? goal : rest}>
      <BrickMesh brick={brick} palette={palette} highlight={highlight} />
    </group>
  );
}
