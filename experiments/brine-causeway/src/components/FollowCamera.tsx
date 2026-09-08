import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { CamMode, VehicleRef } from '../types';

const offset = new Vector3();
const look = new Vector3();
const HERO_POS = new Vector3(-8.2, 1.85, -36.4);
const HERO_LOOK = new Vector3(-1.4, 0.52, -20.6);

interface Props {
  vehicle: VehicleRef;
  driving: boolean;
  cam: CamMode;
  reducedMotion: boolean;
}

export default function FollowCamera({ vehicle, driving, cam, reducedMotion }: Props) {
  const { camera } = useThree();
  const smoothing = useRef(HERO_POS.clone());
  const lookSmooth = useRef(HERO_LOOK.clone());

  useFrame((_, delta) => {
    const body = vehicle.current;
    if (!driving) {
      offset.copy(HERO_POS);
      look.copy(HERO_LOOK);
    } else {
      const back = cam === 'close' ? 5.1 : 7.4;
      const height = cam === 'close' ? 1.85 : 2.55;
      const sin = Math.sin(body.yaw);
      const cos = Math.cos(body.yaw);
      offset.set(body.x - sin * back, body.y + height, body.z - cos * back);
      look.set(body.x + sin * 8.4, body.y + 0.62, body.z + cos * 8.4);
    }

    if (reducedMotion) {
      smoothing.current.copy(offset);
      lookSmooth.current.copy(look);
    } else {
      const ease = 1 - Math.pow(driving ? 0.05 : 0.12, delta);
      smoothing.current.lerp(offset, ease);
      lookSmooth.current.lerp(look, ease);
    }
    camera.position.copy(smoothing.current);
    camera.lookAt(lookSmooth.current);
  });

  return null;
}
