import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { InputRef, VehicleRef } from '../types';
import type { ResolvedLook } from '../look';
import DriveWorld from './DriveWorld';

interface Props {
  vehicle: VehicleRef;
  input: InputRef;
  look: ResolvedLook;
  reducedMotion: boolean;
}

export default function Scene({ vehicle, input, look, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [-16, 8.4, 22], fov: 42, near: 0.1, far: 240 }}
      dpr={[1, 1.6]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: look.exposure,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <DriveWorld vehicle={vehicle} input={input} look={look} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
