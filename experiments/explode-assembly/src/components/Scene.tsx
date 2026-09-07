import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import CarModel from './CarModel';
import {
  EMPTY_LAYOUT,
  LAYOUT_CENTER,
  OVERVIEW_DIRECTION,
  type ExplosionLayout,
} from '../utils/explosion';

interface SceneProps {
  explode: number;
  selectedPart: string | null;
  isolated: boolean;
  onSelectPart: (part: string | null) => void;
  layout: ExplosionLayout;
  onLayoutReady: (layout: ExplosionLayout) => void;
}

function CameraRig({
  explode,
  layout,
}: {
  explode: number;
  layout: ExplosionLayout;
}) {
  const { camera, size } = useThree();
  const controls = useThree((state) => state.controls) as {
    target: THREE.Vector3;
    addEventListener?: (type: string, fn: () => void) => void;
    removeEventListener?: (type: string, fn: () => void) => void;
  } | null;
  const framingRef = useRef(2);
  const prevExplode = useRef(explode);

  useEffect(() => {
    framingRef.current = 1.6;
    prevExplode.current = explode;
  }, [explode, layout.width, layout.height]);

  useEffect(() => {
    const stop = () => {
      framingRef.current = 0;
    };
    controls?.addEventListener?.('start', stop);
    return () => controls?.removeEventListener?.('start', stop);
  }, [controls]);

  useFrame((_, dt) => {
    if (framingRef.current <= 0) return;
    framingRef.current = Math.max(0, framingRef.current - dt);

    const amount = explode / 100;
    const f = THREE.MathUtils.smoothstep(amount, 0.2, 0.72);
    const homeTarget = new THREE.Vector3(0, 0.8, 0);
    const target = homeTarget.lerp(LAYOUT_CENTER, f);

    const perspective = camera as THREE.PerspectiveCamera;
    const tangent = Math.tan(THREE.MathUtils.degToRad(perspective.fov / 2));
    const aspect = size.width / Math.max(size.height, 1);
    const fullDistance =
      Math.max(layout.height / (2 * tangent), layout.width / (2 * tangent * aspect)) * 1.2 + 3;
    const assembledDistance = Math.max(10.5, 7.5 / aspect);
    const distance = THREE.MathUtils.lerp(assembledDistance, fullDistance, f);
    const desired = target.clone().addScaledVector(OVERVIEW_DIRECTION, distance);
    const blend = 1 - Math.exp(-7 * dt);

    camera.position.lerp(desired, blend);
    controls?.target.lerp(target, blend);
  });

  return null;
}

export default function Scene({
  explode,
  selectedPart,
  isolated,
  onSelectPart,
  layout,
  onLayoutReady,
}: SceneProps) {
  return (
    <Canvas
      shadows
      className="canvas"
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      <color attach="background" args={['#000000']} />

      <PerspectiveCamera makeDefault position={[-5.7, 2.9, 6.3]} fov={38} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.065}
        minDistance={5}
        maxDistance={180}
        maxPolarAngle={Math.PI * 0.49}
        minPolarAngle={0.18}
        target={[0, 0.8, 0]}
      />
      <CameraRig explode={explode} layout={layout.width ? layout : EMPTY_LAYOUT} />

      {/* Studio lights only — no Environment / HDRI sky (that washed the stage grey). */}
      <hemisphereLight args={['#d7e4f2', '#000000', 0.55]} />
      <directionalLight
        position={[-6, 10, 6]}
        intensity={3.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0008}
      />
      <directionalLight position={[8, 6, -8]} intensity={1.8} color="#9bb6d6" />
      <directionalLight position={[2, 3, -6]} intensity={2.1} color="#ffffff" />
      <spotLight position={[0, 14, 2]} intensity={1.4} angle={0.55} penumbra={1} />
      <ambientLight intensity={0.28} />

      <CarModel
        explode={explode}
        selectedPart={selectedPart}
        isolated={isolated}
        onSelectPart={onSelectPart}
        onLayoutReady={onLayoutReady}
      />

      {explode < 22 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]} receiveShadow>
          <planeGeometry args={[18, 18]} />
          <shadowMaterial transparent opacity={0.32 * (1 - explode / 22)} />
        </mesh>
      )}
    </Canvas>
  );
}
