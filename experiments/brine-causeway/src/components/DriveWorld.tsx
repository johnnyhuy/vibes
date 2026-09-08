import { useFrame } from '@react-three/fiber';
import { stepVehicle } from '../vehicle';
import type { CamMode, InputRef, Quality, VehicleRef } from '../types';
import type { ResolvedLook } from '../look';
import Bridge from './Bridge';
import Coast from './Coast';
import FollowCamera from './FollowCamera';
import IodineWedge from './IodineWedge';
import Rain from './Rain';
import SkyRig from './SkyRig';

interface Props {
  vehicle: VehicleRef;
  input: InputRef;
  look: ResolvedLook;
  driving: boolean;
  cam: CamMode;
  quality: Quality;
  reducedMotion: boolean;
}

export default function DriveWorld({
  vehicle,
  input,
  look,
  driving,
  cam,
  quality,
  reducedMotion,
}: Props) {
  useFrame((_, delta) => {
    stepVehicle(vehicle.current, input.current, delta, driving);
  });

  return (
    <>
      <SkyRig look={look} />
      <Coast look={look} quality={quality} />
      <Bridge look={look} />
      <IodineWedge vehicle={vehicle} look={look} />
      <Rain active={look.rain} quality={quality} reducedMotion={reducedMotion} />
      <FollowCamera vehicle={vehicle} driving={driving} cam={cam} reducedMotion={reducedMotion} />
    </>
  );
}
