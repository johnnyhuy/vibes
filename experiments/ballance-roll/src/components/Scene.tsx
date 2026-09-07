import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { MutableRefObject } from 'react';
import type { Steer } from '../hooks';
import type { BallKind, PlayState } from '../types';
import CourseMesh from './CourseMesh';
import Marble from './Marble';
import { PhysicsWorld } from './PhysicsWorld';
import SkyAndClouds from './SkyAndClouds';

interface Props {
  kind: BallKind;
  resetToken: number;
  state: PlayState;
  steer: MutableRefObject<Steer>;
  reducedMotion: boolean;
  takenMotes: string[];
  onDrive: () => void;
  onFallen: () => void;
  onFinished: () => void;
  onMote: (id: string) => void;
}

export default function Scene({
  kind,
  resetToken,
  state,
  steer,
  reducedMotion,
  takenMotes,
  onDrive,
  onFallen,
  onFinished,
  onMote
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 4.2, 8.4], fov: 42, near: 0.1, far: 160 }}
      dpr={[1, 1.75]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <SkyAndClouds reducedMotion={reducedMotion} />
      <PhysicsWorld>
        <CourseMesh takenMotes={takenMotes} />
        <Marble
          kind={kind}
          resetToken={resetToken}
          state={state}
          steer={steer}
          reducedMotion={reducedMotion}
          takenMotes={takenMotes}
          onDrive={onDrive}
          onFallen={onFallen}
          onFinished={onFinished}
          onMote={onMote}
        />
      </PhysicsWorld>
    </Canvas>
  );
}
