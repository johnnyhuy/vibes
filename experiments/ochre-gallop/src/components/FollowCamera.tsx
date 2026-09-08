import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { RunnerRef } from '../types';

const offset = new Vector3();
const look = new Vector3();

interface Props {
  runner: RunnerRef;
  reducedMotion: boolean;
}

export default function FollowCamera({ runner, reducedMotion }: Props) {
  const { camera } = useThree();
  const smoothing = useRef(new Vector3(0, 5.4, 32));

  useFrame((_, delta) => {
    const body = runner.current;
    const back = 7.4;
    const height = 3.35;
    const sin = Math.sin(body.yaw);
    const cos = Math.cos(body.yaw);
    offset.set(body.x - sin * back, body.y + height, body.z - cos * back);
    if (reducedMotion) {
      smoothing.current.copy(offset);
    } else {
      const ease = 1 - Math.pow(0.05, delta);
      smoothing.current.lerp(offset, ease);
    }
    camera.position.copy(smoothing.current);
    look.set(body.x + sin * 8.2, body.y + 0.55, body.z + cos * 8.2);
    camera.lookAt(look);
  });

  return null;
}
