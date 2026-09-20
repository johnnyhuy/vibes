import { useLayoutEffect as useExhibitLayout } from 'react';
import { useThree as useExhibitThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { ContactShadows, Html, OrbitControls } from '@react-three/drei';
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
  sheetdrift: boolean;
}

interface Props extends WorldProps {
  onRecast: () => void;
}

function World({ offset, stop, exploring, reducedMotion, look, recast, sheetdrift }: WorldProps) {
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
      <Drift reducedMotion={reducedMotion || !sheetdrift} haze={look.haze} />
      <Places stops={STOPS} activeId={stop.id} reducedMotion={reducedMotion || !sheetdrift} />
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

export default function Scene({
  offset,
  stop,
  exploring,
  reducedMotion,
  look,
  recast,
  sheetdrift,
  onRecast,
}: Props) {
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
      <Suspense fallback={<Html center><p role="status" style={{whiteSpace:'nowrap',padding:'16px 24px',background:'#f3ead8',color:'#3a332c'}}>Preparing the neighbourhood…</p></Html>}>
        <World
          offset={offset}
          stop={stop}
          exploring={exploring}
          reducedMotion={reducedMotion}
          look={look}
          recast={recast}
          sheetdrift={sheetdrift}
        />
      </Suspense>
      <ExhibitFraming />
    </Canvas>
  );
}

// Preserve the subject's horizontal field of view on portrait screens.
function ExhibitFraming() {
  const { camera, size } = useExhibitThree();
  useExhibitLayout(() => {
    camera.zoom = .85 * Math.min(1, size.width / size.height / 1.25);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}
