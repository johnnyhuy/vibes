import { Suspense, useEffect, useRef } from 'react';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { STOPS, type Stop } from '../itinerary';
import type { ResolvedLook } from '../looks';
import CameraRig from './CameraRig';
import Drift from './Drift';
import Lane from './Lane';
import Places from './Places';
import SkyRig from './SkyRig';

interface WorldProps {
  offset: MutableRefObject<number>;
  stop: Stop;
  exploring: boolean;
  reducedMotion: boolean;
  look: ResolvedLook;
  recast: number;
}

interface Props extends WorldProps {
  onRecast: () => void;
}

function World({ offset, stop, exploring, reducedMotion, look, recast }: WorldProps) {
  const controls = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    const orbit = controls.current;
    if (!orbit) return;
    orbit.object.position.set(...stop.camera);
    orbit.target.set(...stop.lookAt);
    orbit.update();
  }, [recast, stop]);

  return (
    <>
      <SkyRig look={look} />
      <Lane look={look} />
      <Drift reducedMotion={reducedMotion} />
      <Places stops={STOPS} activeId={stop.id} reducedMotion={reducedMotion} />
      <CameraRig offset={offset} exploring={exploring} reducedMotion={reducedMotion} />
      <ContactShadows position={[0, 0.02, stop.position[2]]} opacity={0.28} scale={22} blur={2.4} far={8} />
      <OrbitControls
        ref={controls}
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

export default function Scene({ offset, stop, exploring, reducedMotion, look, recast, onRecast }: Props) {
  return (
    <Canvas
      camera={{ position: stop.camera, fov: 36, near: 0.1, far: 220 }}
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
      onDoubleClick={() => {
        if (exploring) onRecast();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: exploring ? 'auto' : 'none',
      }}
    >
      <color attach="background" args={[look.skyHorizon]} />
      <Suspense fallback={null}>
        <World
          offset={offset}
          stop={stop}
          exploring={exploring}
          reducedMotion={reducedMotion}
          look={look}
          recast={recast}
        />
      </Suspense>
    </Canvas>
  );
}
