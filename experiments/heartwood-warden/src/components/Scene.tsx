import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { CastQueueRef, InputRef, PlayerRef } from '../types';
import CastField from './CastField';
import FollowCamera from './FollowCamera';
import Glade from './Glade';
import Spirits from './Spirits';
import Warden from './Warden';

interface Props {
  player: PlayerRef;
  input: InputRef;
  casts: CastQueueRef;
  reducedMotion: boolean;
}

export default function Scene({ player, input, casts, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [2.2, 2.45, 7.6], fov: 36, near: 0.1, far: 120 }}
      dpr={[1, 1.6]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 0.94,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <Suspense fallback={null}>
        <Glade />
      </Suspense>
      <Warden player={player} input={input} reducedMotion={reducedMotion} />
      <Spirits player={player} reducedMotion={reducedMotion} />
      <CastField player={player} casts={casts} reducedMotion={reducedMotion} />
      <FollowCamera player={player} />
      <EffectComposer disableNormalPass>
        <Bloom
          luminanceThreshold={0.36}
          luminanceSmoothing={0.32}
          intensity={reducedMotion ? 0.24 : 0.72}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
