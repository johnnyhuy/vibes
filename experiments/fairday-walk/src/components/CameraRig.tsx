import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import { sampleItinerary } from '../itinerary';

interface Props {
  offset: MutableRefObject<number>;
  exploring: boolean;
  reducedMotion: boolean;
}

const target = new Vector3();
const desired = new Vector3();
const look = new Vector3();

export default function CameraRig({ offset, exploring, reducedMotion }: Props) {
  const seeded = useRef(false);

  useFrame((state, delta) => {
    if (exploring) return;

    const pose = sampleItinerary(offset.current);
    desired.set(...pose.camera);
    look.set(...pose.lookAt);

    if (!seeded.current || reducedMotion) {
      state.camera.position.copy(desired);
      target.copy(look);
      state.camera.lookAt(target);
      seeded.current = true;
      return;
    }

    const lambda = 2.5;
    state.camera.position.x = MathUtils.damp(state.camera.position.x, desired.x, lambda, delta);
    state.camera.position.y = MathUtils.damp(state.camera.position.y, desired.y, lambda, delta);
    state.camera.position.z = MathUtils.damp(state.camera.position.z, desired.z, lambda, delta);
    target.x = MathUtils.damp(target.x, look.x, lambda, delta);
    target.y = MathUtils.damp(target.y, look.y, lambda, delta);
    target.z = MathUtils.damp(target.z, look.z, lambda, delta);
    state.camera.lookAt(target);
  });

  return null;
}
