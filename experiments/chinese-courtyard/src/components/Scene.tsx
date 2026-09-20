import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { COURT_HDRI } from '../assets';
import type { ResolvedLook } from '../atmosphere';
import Courtyard from './Courtyard';
import Garden from './Garden';
import SkyRig from './SkyRig';

interface Props {
  look: ResolvedLook;
  reducedMotion: boolean;
}

export default function Scene({ look, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [7.8, 4.6, 8.6], fov: 36, near: 0.1, far: 120 }}
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
      <Suspense fallback={null}>
        <Environment files={COURT_HDRI} background={false} environmentIntensity={look.envGain} />
        <Courtyard look={look} />
        <Garden look={look} reducedMotion={reducedMotion} />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={4}
        maxDistance={26}
        minPolarAngle={0.32}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0.55, 0.15]}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.18}
      />
    </Canvas>
  );
}
