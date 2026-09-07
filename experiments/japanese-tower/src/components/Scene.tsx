import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { BuildLook } from '../growth';
import type { ResolvedLook } from '../atmosphere';
import Landscape from './Landscape';
import SkyRig from './SkyRig';
import Tower from './Tower';
import WeatherField from './WeatherField';

interface Props {
  look: ResolvedLook;
  build: BuildLook;
  reducedMotion: boolean;
}

export default function Scene({ look, build, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [15.8, 6.4, 17.2], fov: 38, near: 0.1, far: 140 }}
      dpr={[1, 1.75]}
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
      <SkyRig look={look} />
      <Tower look={look} build={build} />
      <Landscape look={look} />
      <WeatherField look={look} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={8}
        maxDistance={32}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 2.6, 0]}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.16}
      />
    </Canvas>
  );
}
