import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { InputRef, PlayerRef, SlipId } from '../types';
import BreezeSlips from './BreezeSlips';
import FollowCamera from './FollowCamera';
import Vale from './Vale';
import Wanderer from './Wanderer';

interface Props {
  player: PlayerRef;
  input: InputRef;
  gathered: SlipId[];
  reducedMotion: boolean;
  onCanvasClick: () => void;
}

export default function Scene({ player, input, gathered, reducedMotion, onCanvasClick }: Props) {
  return (
    <Canvas
      camera={{ position: [4.6, 12.4, 12.8], fov: 40, near: 0.12, far: 180 }}
      dpr={[1, 1.6]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.16,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
      onPointerDown={onCanvasClick}
    >
      <Vale reducedMotion={reducedMotion} />
      <Wanderer player={player} input={input} reducedMotion={reducedMotion} />
      <BreezeSlips gathered={gathered} reducedMotion={reducedMotion} />
      <FollowCamera player={player} />
      <EffectComposer disableNormalPass>
        <Bloom
          luminanceThreshold={0.72}
          luminanceSmoothing={0.4}
          intensity={reducedMotion ? 0.12 : 0.28}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
