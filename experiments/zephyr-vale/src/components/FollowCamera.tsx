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
  const smoothing = useRef(new Vector3(4.6, 12.4, 12.8));

  useFrame((_, delta) => {
    const ease = 1 - Math.pow(0.08, delta);
    const body = player.current;
    const back = 13.2;
    const side = 4.4;
    const height = 11.4 + body.lookPitch * 3.2;
    const sin = Math.sin(body.lookYaw);
    const cos = Math.cos(body.lookYaw);
    offset.set(
      body.x - sin * back + cos * side,
      body.y + height,
      body.z + cos * back + sin * side
    );
    smoothing.current.lerp(offset, ease);
    camera.position.copy(smoothing.current);
    look.set(body.x, body.y + 0.55 + body.lookPitch * 0.25, body.z - 1.8);
    camera.lookAt(look);
  });

  return null;
}
