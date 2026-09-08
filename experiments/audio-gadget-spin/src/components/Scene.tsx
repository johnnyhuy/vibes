import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import type { Finish, HotspotId } from '../finishes';
import Headphones from './Headphones';
import Studio from './Studio';

interface Props {
  finish: Finish;
  highlight: HotspotId | null;
  autoSpin: boolean;
  onHotspot: (id: HotspotId) => void;
  onUserOrbit: () => void;
}

export default function Scene({ finish, highlight, autoSpin, onHotspot, onUserOrbit }: Props) {
  const resume = useRef<number>();

  useEffect(() => () => window.clearTimeout(resume.current), []);

  return (
    <Canvas
      camera={{ position: [2.55, 0.62, 3.55], fov: 32, near: 0.1, far: 40 }}
      dpr={[1, 1.75]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <Studio />
      <Suspense fallback={null}>
        <Headphones finish={finish} highlight={highlight} onHotspot={onHotspot} />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={2.4}
        maxDistance={6.2}
        minPolarAngle={0.55}
        maxPolarAngle={1.42}
        target={[0, -0.05, 0]}
        autoRotate={autoSpin}
        autoRotateSpeed={0.42}
        onStart={() => {
          window.clearTimeout(resume.current);
          onUserOrbit();
        }}
      />
    </Canvas>
  );
}
