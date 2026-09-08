import { Suspense } from 'react';
import { ContactShadows, Environment, MeshReflectorMaterial } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import type { Look, Palette, ViewMode } from '../types';
import HareSet from './HareSet';
import Pedestal from './Pedestal';

interface Props {
  look: Look;
  palette: Palette;
  step: number;
  mode: ViewMode;
  reducedMotion: boolean;
}

export default function Studio({ look, palette, step, mode, reducedMotion }: Props) {
  return (
    <>
      <color attach="background" args={[look.bg]} />
      <fog attach="fog" args={[look.bg, 8.5, 20]} />
      <Suspense fallback={null}>
        <Environment files={look.hdri} environmentIntensity={look.env} background={false} />
      </Suspense>
      <hemisphereLight args={['#f0d8c0', '#2a1c18', 0.42]} />
      <ambientLight intensity={0.28} color="#d8c8b8" />
      <directionalLight
        position={[3.4, 5.2, 2.6]}
        intensity={look.keyInt}
        color={look.key}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <directionalLight position={[-3.2, 1.6, -2.2]} intensity={look.fillInt} color={look.fill} />
      <spotLight
        position={[-1.2, 3.4, 3.2]}
        intensity={look.rimInt}
        color={look.rim}
        angle={0.5}
        penumbra={0.7}
      />
      <Pedestal />
      <HareSet step={step} mode={mode} palette={palette} reducedMotion={reducedMotion} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.42} scale={8} blur={2.4} far={2.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.168, 0]} receiveShadow>
        <circleGeometry args={[7.4, 64]} />
        <MeshReflectorMaterial
          blur={[280, 70]}
          resolution={384}
          mixBlur={0.85}
          mixStrength={0.38}
          roughness={0.82}
          metalness={0.22}
          color={look.bg}
          mirror={0.12}
        />
      </mesh>
      <EffectComposer disableNormalPass>
        <Bloom
          luminanceThreshold={0.46}
          luminanceSmoothing={0.36}
          intensity={look.bloom}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
