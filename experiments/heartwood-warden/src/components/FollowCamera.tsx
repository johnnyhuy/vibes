import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { PlayerRef } from '../types';

const offset = new Vector3();
const look = new Vector3();

interface Props {
  player: PlayerRef;
}

export default function FollowCamera({ player }: Props) {
  const { camera } = useThree();
  const smoothing = useRef(new Vector3(2.2, 2.45, 7.6));

  useFrame((_, delta) => {
    const ease = 1 - Math.pow(0.08, delta);
    const body = player.current;
    const back = 5.6;
    const side = 2.15;
    const height = 2.45;
    const sin = Math.sin(body.yaw);
    const cos = Math.cos(body.yaw);
    offset.set(
      body.x - sin * back + cos * side,
      height,
      body.z + cos * back + sin * side
    );
    smoothing.current.lerp(offset, ease);
    camera.position.copy(smoothing.current);
    look.set(body.x, 1.05, body.z);
    camera.lookAt(look);
  });

  return null;
}
