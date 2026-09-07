import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import GlassBottle from './GlassBottle';
import { useWindowScroll } from '../hooks/useWindowScroll';

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ProductScene() {
  const group = useRef<THREE.Group>(null);
  const offset = useWindowScroll();

  useFrame((state, delta) => {
    if (!group.current) return;

    const t = offset.current;
    const spin = reducedMotion ? 0.35 : t * Math.PI * 2.05;
    const tilt = reducedMotion ? 0.06 : Math.sin(t * Math.PI) * 0.16;
    const camZ = reducedMotion ? 5.4 : 6.4 - t * 2.35;
    const camY = reducedMotion ? 0.35 : 0.12 + t * 1.35;
    const camX = reducedMotion ? 0.35 : 0.55 + Math.sin(t * Math.PI) * 0.55;

    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, spin, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tilt, 4, delta);

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, camX, 3.2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, camY, 3.2, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, camZ, 3.2, delta);
    state.camera.lookAt(0, 0.15, 0);
  });

  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[4.5, 6, 3.5]} intensity={1.55} color="#fff6ea" />
      <directionalLight position={[-4, 1.5, -3]} intensity={0.55} color="#88b4ff" />
      <spotLight position={[0, 8, 2]} angle={0.38} penumbra={0.85} intensity={1.1} color="#fff8ee" />

      <group ref={group} position={[0, 0.05, 0]}>
        <GlassBottle />
      </group>

      <ContactShadows
        position={[0, -1.58, 0]}
        opacity={0.42}
        scale={10}
        blur={2.6}
        far={5}
      />

      <Environment preset="city" environmentIntensity={0.9} />
    </>
  );
}
