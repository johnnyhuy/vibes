import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Vector3 } from 'three';
import type { Vec3 } from '../types';

interface Props {
  step: number;
  current: number;
  from: Vec3;
  rest?: Vec3;
  explode?: Vec3;
  explodeAmount?: number;
  inside?: Vec3;
  insideAmount?: number;
  shown?: boolean;
  highlight?: boolean;
  reducedMotion: boolean;
  children: ReactNode;
}

export default function Arrive({
  step,
  current,
  from,
  rest = [0, 0, 0],
  explode = [0, 0, 0],
  explodeAmount = 0,
  inside = [0, 0, 0],
  insideAmount = 0,
  shown = true,
  highlight = false,
  reducedMotion,
  children,
}: Props) {
  const group = useRef<Group>(null);
  const assembled = current >= step;
  const visible = assembled && shown;
  const ready = useRef(false);
  const goal = useRef(new Vector3());

  useLayoutEffect(() => {
    const node = group.current;
    if (!node || ready.current) return;
    goal.current.set(
      rest[0] + explode[0] * explodeAmount + inside[0] * insideAmount,
      rest[1] + explode[1] * explodeAmount + inside[1] * insideAmount,
      rest[2] + explode[2] * explodeAmount + inside[2] * insideAmount
    );
    if (!visible) goal.current.set(from[0], from[1], from[2]);
    node.position.copy(goal.current);
    node.scale.setScalar(visible ? 1 : 0.001);
    ready.current = true;
  }, [explode, explodeAmount, from, inside, insideAmount, rest, visible]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    if (visible) {
      goal.current.set(
        rest[0] + explode[0] * explodeAmount + inside[0] * insideAmount,
        rest[1] + explode[1] * explodeAmount + inside[1] * insideAmount,
        rest[2] + explode[2] * explodeAmount + inside[2] * insideAmount
      );
    } else {
      goal.current.set(from[0], from[1], from[2]);
    }
    const scale = visible ? 1 : 0.001;
    if (reducedMotion) {
      node.position.copy(goal.current);
      node.scale.setScalar(scale);
      return;
    }
    const ease = 1 - Math.pow(0.06, delta);
    node.position.lerp(goal.current, ease);
    node.scale.setScalar(MathUtils.damp(node.scale.x, scale, 10, delta));
  });

  return (
    <group ref={group} visible={visible || !reducedMotion}>
      <group scale={highlight ? 1.015 : 1}>{children}</group>
    </group>
  );
}
