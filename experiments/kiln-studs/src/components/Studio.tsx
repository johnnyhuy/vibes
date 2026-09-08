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
  const hazeNear = look.id === 'kiln-dusk' ? 7.2 : 9;
  const hazeFar = look.id === 'kiln-dusk' ? 16 : 20;

  return (
    <>
      <color attach="background" args={[look.bg]} />
      <fog attach="fog" args={[look.bg, hazeNear, hazeFar]} />
      <Suspense fallback={null}>
        <Environment files={look.hdri} environmentIntensity={look.env} background={false} />
      </Suspense>
      <hemisphereLight args={['#f4d8b8', '#241814', 0.38]} />
      <ambientLight intensity={0.22} color="#e8d2be" />
      <directionalLight
        position={[3.6, 5.4, 2.4]}
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
      <directionalLight position={[-3.4, 1.8, -2.4]} intensity={look.fillInt} color={look.fill} />
      <spotLight
        position={[-1.4, 3.6, 3.4]}
        intensity={look.rimInt}
        color={look.rim}
        angle={0.48}
        penumbra={0.78}
      />
      <rectAreaLight
        position={[0.2, 4.6, 2.8]}
        width={3.4}
        height={0.28}
        intensity={4.2}
        color={look.key}
        rotation={[-0.72, 0.18, 0]}
      />
      <Pedestal />
      <HareSet step={step} mode={mode} palette={palette} reducedMotion={reducedMotion} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.48} scale={8} blur={2.6} far={2.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.168, 0]} receiveShadow>
        <circleGeometry args={[7.4, 64]} />
        <MeshReflectorMaterial
          blur={[320, 90]}
          resolution={512}
          mixBlur={0.9}
          mixStrength={0.55}
          roughness={0.72}
          metalness={0.28}
          color={look.bg}
          mirror={0.18}
        />
      </mesh>
      <EffectComposer disableNormalPass>
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.32}
          intensity={look.bloom}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
