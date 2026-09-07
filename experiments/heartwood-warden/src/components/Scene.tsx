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
      camera={{ position: [0, 4.1, 8.4], fov: 38, near: 0.1, far: 120 }}
      dpr={[1, 1.6]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 0.92,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <Glade />
      <Warden player={player} input={input} reducedMotion={reducedMotion} />
      <Spirits player={player} reducedMotion={reducedMotion} />
      <CastField player={player} casts={casts} reducedMotion={reducedMotion} />
      <FollowCamera player={player} />
      <EffectComposer disableNormalPass>
        <Bloom
          luminanceThreshold={0.42}
          luminanceSmoothing={0.34}
          intensity={reducedMotion ? 0.28 : 0.62}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
