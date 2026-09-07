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
  const smoothing = useRef(new Vector3(0, 4.1, 8.4));

  useFrame((_, delta) => {
    const ease = 1 - Math.pow(0.08, delta);
    const body = player.current;
    const back = 6.4;
    const height = 3.35;
    offset.set(
      body.x - Math.sin(body.yaw) * back,
      height,
      body.z + Math.cos(body.yaw) * back
    );
    smoothing.current.lerp(offset, ease);
    camera.position.copy(smoothing.current);
    look.set(body.x, 1.35, body.z);
    camera.lookAt(look);
  });

  return null;
}
