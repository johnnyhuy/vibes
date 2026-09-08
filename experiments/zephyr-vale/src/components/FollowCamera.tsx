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
  const smoothing = useRef(new Vector3(0.8, 6.2, 9.4));

  useFrame((_, delta) => {
    const ease = 1 - Math.pow(0.07, delta);
    const body = player.current;
    const back = 7.8;
    const side = 2.6;
    const height = 4.9 + body.lookPitch * 2.4;
    const sin = Math.sin(body.lookYaw);
    const cos = Math.cos(body.lookYaw);
    offset.set(
      body.x - sin * back + cos * side,
      body.y + height,
      body.z + cos * back + sin * side
    );
    smoothing.current.lerp(offset, ease);
    camera.position.copy(smoothing.current);
    look.set(body.x, body.y + 1.15 + body.lookPitch * 0.4, body.z);
    camera.lookAt(look);
  });

  return null;
}
