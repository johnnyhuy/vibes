import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { LOOK } from '../catalog';
import type { Toggles, ViewMode } from '../types';
import Studio from './Studio';

interface Props {
  step: number;
  mode: ViewMode;
  explode: number;
  playing: boolean;
  toggles: Toggles;
  reducedMotion: boolean;
}

export default function Scene({ step, mode, explode, playing, toggles, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [1.42, 1.32, 1.72], fov: 32, near: 0.08, far: 28 }}
      dpr={[1, 1.75]}
      shadows
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: LOOK.exposure,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <Studio
        step={step}
        mode={mode}
        explode={explode}
        playing={playing}
        toggles={toggles}
        reducedMotion={reducedMotion}
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={1.15}
        maxDistance={5.4}
        minPolarAngle={0.32}
        maxPolarAngle={1.32}
        target={[0, 0.14, 0]}
        autoRotate={toggles.orbit && !reducedMotion}
        autoRotateSpeed={0.46}
      />
    </Canvas>
  );
}
