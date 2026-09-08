import { Suspense } from 'react';
import { ContactShadows, Environment } from '@react-three/drei';
import { LOOK } from '../catalog';
import type { Toggles, ViewMode } from '../types';
import Trainer from './Trainer';

interface Props {
  step: number;
  mode: ViewMode;
  explode: number;
  playing: boolean;
  toggles: Toggles;
  reducedMotion: boolean;
}

export default function Studio({ step, mode, explode, playing, toggles, reducedMotion }: Props) {
  return (
    <>
      <color attach="background" args={[LOOK.bg]} />
      <fog attach="fog" args={[LOOK.bg, 8, 18]} />
      <Suspense fallback={null}>
        <Environment files={LOOK.hdri} environmentIntensity={LOOK.env} background={false} />
      </Suspense>
      <hemisphereLight args={['#fff7ee', '#d5cfc4', 0.62]} />
      <ambientLight intensity={0.34} color="#fff8f0" />
      <directionalLight
        position={[3.2, 5.8, 2.6]}
        intensity={LOOK.keyInt}
        color={LOOK.key}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.4}
        shadow-camera-far={14}
        shadow-camera-left={-2.4}
        shadow-camera-right={2.4}
        shadow-camera-top={2.4}
        shadow-camera-bottom={-2.4}
      />
      <directionalLight position={[-3.2, 2.2, -2.2]} intensity={LOOK.fillInt} color={LOOK.fill} />
      <spotLight
        position={[-1.6, 3.8, 3.2]}
        intensity={LOOK.rimInt}
        color={LOOK.rim}
        angle={0.5}
        penumbra={0.8}
      />
      <Trainer
        step={step}
        mode={mode}
        explode={explode}
        playing={playing}
        toggles={toggles}
        reducedMotion={reducedMotion}
      />
      <ContactShadows position={[0, 0.002, 0]} opacity={0.28} scale={6.4} blur={2.8} far={2.4} color="#2a2622" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[6.8, 64]} />
        <meshStandardMaterial color={LOOK.bg} roughness={0.92} metalness={0.02} />
      </mesh>
    </>
  );
}
