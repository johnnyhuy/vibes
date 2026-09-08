import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import type { Look, Palette, ViewMode } from '../types';
import Studio from './Studio';

interface Props {
  look: Look;
  palette: Palette;
  step: number;
  mode: ViewMode;
  orbiting: boolean;
  reducedMotion: boolean;
}

export default function Scene({ look, palette, step, mode, orbiting, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [2.05, 1.42, 3.15], fov: 32, near: 0.1, far: 32 }}
      dpr={[1, 1.75]}
      shadows
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: look.exposure,
      }}
      onCreated={({ gl }) => {
        RectAreaLightUniformsLib.init();
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <Studio look={look} palette={palette} step={step} mode={mode} reducedMotion={reducedMotion} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={1.6}
        maxDistance={7.2}
        minPolarAngle={0.38}
        maxPolarAngle={1.38}
        target={[0, 0.55, 0]}
        autoRotate={orbiting && !reducedMotion && mode !== 'step'}
        autoRotateSpeed={0.42}
      />
    </Canvas>
  );
}
