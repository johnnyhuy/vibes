import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, Text } from '@react-three/drei';
import * as THREE from 'three';
import GlassBottle from './GlassBottle';
import { useWindowScroll } from '../hooks/useWindowScroll';

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Bottle lies on its long axis. Scroll rolls it (Caldera-class “it rolls”).
 * Lime 3D type sits behind the glass so transmission actually has something
 * to bend — HTML overlays cannot do that.
 */
export default function ProductScene() {
  const roll = useRef<THREE.Group>(null);
  const offset = useWindowScroll();

  useFrame((state, delta) => {
    if (!roll.current) return;

    const t = offset.current;
    const spin = reducedMotion ? 0.15 : t * Math.PI * 2;
    const camZ = reducedMotion ? 6.2 : 6.6 - t * 1.35;
    const camY = reducedMotion ? 0.35 : 0.28 + t * 0.35;

    roll.current.rotation.x = THREE.MathUtils.damp(roll.current.rotation.x, spin, 3.6, delta);

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, 0, 3, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, camY, 3, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, camZ, 3, delta);
    state.camera.lookAt(0, 0.05, 0);
  });

  return (
    <>
      <color attach="background" args={['#030303']} />
      <ambientLight intensity={0.08} />

      <Text
        position={[0, 0.08, -2.15]}
        fontSize={1.72}
        letterSpacing={-0.07}
        color="#c8ff3a"
        anchorX="center"
        anchorY="middle"
      >
        AETHER
      </Text>

      <group ref={roll}>
        <group rotation={[0, 0, Math.PI / 2]}>
          <GlassBottle />
        </group>
      </group>

      <ContactShadows position={[0, -1.15, 0]} opacity={0.55} scale={14} blur={2.8} far={6} />

      <Environment resolution={256} frames={1} environmentIntensity={0.55}>
        <Lightformer intensity={12} position={[0, 4.2, 1.4]} scale={[12, 0.28, 1]} />
        <Lightformer intensity={8} position={[0, -3.2, 1.2]} scale={[12, 0.22, 1]} />
        <Lightformer intensity={4} position={[5, 1, 3]} scale={[1.2, 5, 1]} />
        <Lightformer intensity={2.4} position={[-4, 2, -3]} scale={[3, 3, 1]} color="#c8ff3a" />
      </Environment>
    </>
  );
}
