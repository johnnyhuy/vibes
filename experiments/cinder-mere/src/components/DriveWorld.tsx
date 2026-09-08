import { useFrame } from '@react-three/fiber';
import { stepVehicle } from '../vehicle';
import type { InputRef, VehicleRef } from '../types';
import type { ResolvedLook } from '../look';
import Basin from './Basin';
import FollowCamera from './FollowCamera';
import Landmarks from './Landmarks';
import SkyRig from './SkyRig';
import SootRunner from './SootRunner';

interface Props {
  vehicle: VehicleRef;
  input: InputRef;
  look: ResolvedLook;
  reducedMotion: boolean;
}

export default function DriveWorld({ vehicle, input, look, reducedMotion }: Props) {
  useFrame((_, delta) => {
    stepVehicle(vehicle.current, input.current, delta);
  });

  return (
    <>
      <SkyRig look={look} />
      <Basin look={look} />
      <Landmarks look={look} reducedMotion={reducedMotion} />
      <SootRunner vehicle={vehicle} look={look} />
      <FollowCamera vehicle={vehicle} reducedMotion={reducedMotion} />
    </>
  );
}
