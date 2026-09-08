import { Suspense } from 'react';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { STOPS, type Stop } from '../itinerary';
import { lane } from '../palette';
import CameraRig from './CameraRig';
import Lane from './Lane';
import Places from './Places';
import SkyRig from './SkyRig';

interface Props {
  offset: MutableRefObject<number>;
  stop: Stop;
  exploring: boolean;
  reducedMotion: boolean;
}

function World({
  offset,
  stop,
  exploring,
  reducedMotion,
}: Props) {
  return (
    <>
      <SkyRig />
      <Lane />
      <Places stops={STOPS} activeId={stop.id} reducedMotion={reducedMotion} />
      <CameraRig offset={offset} exploring={exploring} reducedMotion={reducedMotion} />
      <ContactShadows position={[0, 0.02, stop.position[2]]} opacity={0.28} scale={22} blur={2.4} far={8} />
      <OrbitControls
        enabled={exploring}
        makeDefault={exploring}
        enablePan={false}
        enableDamping
        dampingFactor={0.07}
        minDistance={stop.exploreMin}
        maxDistance={stop.exploreMax}
        minPolarAngle={0.22}
        maxPolarAngle={Math.PI / 2.05}
        target={stop.lookAt}
        enableZoom
      />
    </>
  );
}

export default function Scene({ offset, stop, exploring, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: stop.camera, fov: 36, near: 0.1, far: 220 }}
      dpr={[1, 1.75]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: exploring ? 'auto' : 'none',
      }}
    >
      <color attach="background" args={[lane.skyHorizon]} />
      <Suspense fallback={null}>
        <World offset={offset} stop={stop} exploring={exploring} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
