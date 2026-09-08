import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { STOPS, type Stop } from '../itinerary';
import { chalk } from '../palette';
import Avenue from './Avenue';
import CameraRig from './CameraRig';
import Landmarks from './Landmarks';

interface Props {
  offset: MutableRefObject<number>;
  stop: Stop;
  exploring: boolean;
  reducedMotion: boolean;
}

export default function Scene({ offset, stop, exploring, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: stop.camera, fov: 34, near: 0.1, far: 220 }}
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
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: exploring ? 'auto' : 'none',
      }}
    >
      <color attach="background" args={[chalk.sky]} />
      <fog attach="fog" args={[chalk.sky, 28, 140]} />
      <ambientLight intensity={0.52} color={chalk.paper} />
      <hemisphereLight args={[chalk.sky, chalk.ash, 0.55]} />
      <directionalLight
        position={[16, 24, 10]}
        intensity={1.35}
        color="#fff6ea"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={2}
        shadow-camera-far={160}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <directionalLight position={[-12, 8, -6]} intensity={0.28} color={chalk.fill} />
      <Avenue />
      <Landmarks stops={STOPS} activeId={stop.id} />
      <CameraRig offset={offset} exploring={exploring} reducedMotion={reducedMotion} />
      <ContactShadows position={[0, 0.01, stop.position[2]]} opacity={0.22} scale={28} blur={2.6} far={10} />
      <OrbitControls
        enabled={exploring}
        makeDefault={exploring}
        enablePan={false}
        enableDamping
        dampingFactor={0.07}
        minDistance={stop.exploreMin}
        maxDistance={stop.exploreMax}
        minPolarAngle={0.28}
        maxPolarAngle={Math.PI / 2.08}
        target={stop.lookAt}
        enableZoom
      />
    </Canvas>
  );
}
