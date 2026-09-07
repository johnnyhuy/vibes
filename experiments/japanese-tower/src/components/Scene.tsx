import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { ResolvedLook } from '../atmosphere';
import Landscape from './Landscape';
import SkyRig from './SkyRig';
import Tower from './Tower';
import WeatherField from './WeatherField';

interface Props {
  look: ResolvedLook;
  reducedMotion: boolean;
}

export default function Scene({ look, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [13.5, 7.2, 15.5], fov: 40, near: 0.1, far: 140 }}
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
      <Tower look={look} />
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
        target={[0, 3.4, 0]}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.28}
      />
    </Canvas>
  );
}
