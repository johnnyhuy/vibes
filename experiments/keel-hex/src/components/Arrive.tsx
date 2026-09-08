import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Vector3 } from 'three';

interface Props {
  step: number;
  current: number;
  from: [number, number, number];
  rest?: [number, number, number];
  highlight?: boolean;
  reducedMotion: boolean;
  children: ReactNode;
}

const FROM = new Vector3();
const REST = new Vector3();

export default function Arrive({
  step,
  current,
  from,
  rest = [0, 0, 0],
  highlight = false,
  reducedMotion,
  children,
}: Props) {
  const group = useRef<Group>(null);
  const visible = current >= step;
  const ready = useRef(false);

  useLayoutEffect(() => {
    const node = group.current;
    if (!node) return;
    FROM.set(...from);
    REST.set(...rest);
    if (reducedMotion) {
      node.position.copy(visible ? REST : FROM);
      node.scale.setScalar(visible ? 1 : 0.001);
      ready.current = true;
      return;
    }
    if (!ready.current) {
      node.position.copy(visible ? REST : FROM);
      node.scale.setScalar(visible ? 1 : 0.001);
      ready.current = true;
    }
  }, [from, reducedMotion, rest, visible]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    FROM.set(...from);
    REST.set(...rest);
    const goal = visible ? REST : FROM;
    const scale = visible ? 1 : 0.001;
    if (reducedMotion) {
      node.position.copy(goal);
      node.scale.setScalar(scale);
      return;
    }
    const ease = 1 - Math.pow(0.06, delta);
    node.position.lerp(goal, ease);
    node.scale.setScalar(MathUtils.damp(node.scale.x, scale, 10, delta));
  });

  return (
    <group ref={group} visible={visible || !reducedMotion}>
      <group scale={highlight ? 1.015 : 1}>{children}</group>
    </group>
  );
}
