import { Suspense, useEffect, useRef } from 'react';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap, Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { ResolvedLook } from '../look';
import type { Mark } from '../types';
import Harbour from './Harbour';
import SkyRig from './SkyRig';
import SpileFrame from './SpileFrame';
import Water from './Water';

interface Props {
  look: ResolvedLook;
  mark: Mark;
  reducedMotion: boolean;
}

function Framing({ mark }: { mark: Mark }) {
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  const applied = useRef<string | null>(null);

  useEffect(() => {
    if (!controls || applied.current === mark.id) return;
    applied.current = mark.id;
    controls.object.position.set(...mark.camera);
    controls.target.set(...mark.target);
    controls.minDistance = mark.minDistance;
    controls.maxDistance = mark.maxDistance;
    controls.update();
  }, [controls, mark]);

  return null;
}

export default function Scene({ look, mark, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: mark.camera, fov: 36, near: 0.1, far: 240 }}
      dpr={[1, 1.6]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: look.exposure,
      }}
      onCreated={({ gl, camera }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
        camera.lookAt(new Vector3(...mark.target));
      }}
    >
      <Suspense fallback={null}>
        <SkyRig look={look} />
        <Harbour look={look} />
        <Water look={look} reducedMotion={reducedMotion} />
        <SpileFrame reducedMotion={reducedMotion} />
        <ContactShadows position={[0, 1.5, 1.7]} opacity={0.38} scale={12} blur={2.4} far={6} />
        <Framing mark={mark} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.07}
          minDistance={mark.minDistance}
          maxDistance={mark.maxDistance}
          minPolarAngle={0.32}
          maxPolarAngle={Math.PI / 2.12}
          target={mark.target}
        />
      </Suspense>
    </Canvas>
  );
}
