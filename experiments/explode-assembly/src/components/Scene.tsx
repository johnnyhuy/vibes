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
  const userOrbiting = useRef(false);

  useEffect(() => {
    const start = () => {
      userOrbiting.current = true;
    };
    const end = () => {
      userOrbiting.current = false;
    };
    controls?.addEventListener?.('start', start);
    controls?.addEventListener?.('end', end);
    return () => {
      controls?.removeEventListener?.('start', start);
      controls?.removeEventListener?.('end', end);
    };
  }, [controls]);

  useFrame((_, dt) => {
    if (userOrbiting.current) return;

    const amount = explode / 100;
    const f = THREE.MathUtils.smoothstep(amount, 0.12, 0.7);
    const homeTarget = new THREE.Vector3(0, 0.8, 0);
    const target = homeTarget.lerp(LAYOUT_CENTER, f);

    const perspective = camera as THREE.PerspectiveCamera;
    const tangent = Math.tan(THREE.MathUtils.degToRad(perspective.fov / 2));
    const aspect = size.width / Math.max(size.height, 1);
    const fullDistance =
      Math.max(layout.height / (2 * tangent), layout.width / (2 * tangent * aspect)) * 1.28 + 4;
    const assembledDistance = Math.max(10.5, 7.5 / aspect);
    const distance = THREE.MathUtils.lerp(assembledDistance, fullDistance, f);
    const desired = target.clone().addScaledVector(OVERVIEW_DIRECTION, distance);
    const blend = 1 - Math.exp(-8 * dt);

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
      className="canvas"
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        alpha: false,
      }}
    >
      <color attach="background" args={['#000000']} />

      <PerspectiveCamera makeDefault position={[-5.7, 2.9, 6.3]} fov={38} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.065}
        minDistance={5}
        maxDistance={220}
        maxPolarAngle={Math.PI * 0.49}
        minPolarAngle={0.18}
        target={[0, 0.8, 0]}
      />
      <CameraRig explode={explode} layout={layout.width ? layout : EMPTY_LAYOUT} />

      {/* Lights only — no Environment, no grey floor, no HDRI sky. */}
      <hemisphereLight args={['#e8eef5', '#000000', 0.85]} />
      <directionalLight position={[-7, 11, 5]} intensity={4.6} />
      <directionalLight position={[8, 6, 4]} intensity={3.2} color="#ffffff" />
      <directionalLight position={[7, 5, -7]} intensity={2.8} color="#b9d0ea" />
      <directionalLight position={[1, 2, -8]} intensity={2.6} color="#ffffff" />
      <spotLight position={[0, 16, 3]} intensity={2.4} angle={0.65} penumbra={1} />
      <ambientLight intensity={0.55} />

      <CarModel
        explode={explode}
        selectedPart={selectedPart}
        isolated={isolated}
        onSelectPart={onSelectPart}
        onLayoutReady={onLayoutReady}
      />
    </Canvas>
  );
}
