import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { VehicleRef } from '../types';

const offset = new Vector3();
const look = new Vector3();

interface Props {
  vehicle: VehicleRef;
  reducedMotion: boolean;
}

export default function FollowCamera({ vehicle, reducedMotion }: Props) {
  const { camera } = useThree();
  const smoothing = useRef(new Vector3(-16, 8.4, 22));

  useFrame((_, delta) => {
    const body = vehicle.current;
    const back = 7.4;
    const height = 3.15;
    const sin = Math.sin(body.yaw);
    const cos = Math.cos(body.yaw);
    offset.set(body.x - sin * back, body.y + height, body.z - cos * back);
    if (reducedMotion) {
      smoothing.current.copy(offset);
    } else {
      const ease = 1 - Math.pow(0.06, delta);
      smoothing.current.lerp(offset, ease);
    }
    camera.position.copy(smoothing.current);
    look.set(body.x + sin * 4.2, body.y + 0.85, body.z + cos * 4.2);
    camera.lookAt(look);
  });

  return null;
}
