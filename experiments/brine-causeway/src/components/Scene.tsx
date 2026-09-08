import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { CamMode, InputRef, Quality, VehicleRef } from '../types';
import type { ResolvedLook } from '../look';
import DriveWorld from './DriveWorld';

interface Props {
  vehicle: VehicleRef;
  input: InputRef;
  look: ResolvedLook;
  driving: boolean;
  cam: CamMode;
  quality: Quality;
  reducedMotion: boolean;
  onCanvasClick?: () => void;
}

export default function Scene({
  vehicle,
  input,
  look,
  driving,
  cam,
  quality,
  reducedMotion,
  onCanvasClick,
}: Props) {
  return (
    <Canvas
      camera={{ position: [-8.2, 1.85, -36.4], fov: 36, near: 0.1, far: 280 }}
      dpr={quality === 'pretty' ? [1, 1.55] : [1, 1]}
      shadows={quality === 'pretty'}
      gl={{
        antialias: quality === 'pretty',
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: look.exposure,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
      onPointerDown={() => onCanvasClick?.()}
    >
      <Suspense fallback={null}>
        <DriveWorld
          vehicle={vehicle}
          input={input}
          look={look}
          driving={driving}
          cam={cam}
          quality={quality}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
