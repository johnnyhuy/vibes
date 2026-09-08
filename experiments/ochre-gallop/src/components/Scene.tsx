import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { ResolvedLook } from '../look';
import type { BiomeId, InputRef, LoopRef, RunnerRef } from '../types';
import ChaseWorld from './ChaseWorld';

interface Props {
  biome: BiomeId;
  runner: RunnerRef;
  input: InputRef;
  loop: LoopRef;
  look: ResolvedLook;
  reducedMotion: boolean;
  onCanvasClick?: () => void;
}

export default function Scene({
  biome,
  runner,
  input,
  loop,
  look,
  reducedMotion,
  onCanvasClick,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 5.4, 32], fov: 42, near: 0.1, far: 260 }}
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
      onPointerDown={() => onCanvasClick?.()}
    >
      <Suspense fallback={null}>
        <ChaseWorld
          biome={biome}
          runner={runner}
          input={input}
          loop={loop}
          look={look}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
