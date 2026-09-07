import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Environment } from '@react-three/drei';
import * as THREE from 'three';

export default function ProductScene() {
  const productRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const scroll = useScroll();

  useFrame((state) => {
    if (!productRef.current) return;

    const offset = scroll.offset;
    
    productRef.current.rotation.y = offset * Math.PI * 2;
    productRef.current.rotation.x = Math.sin(offset * Math.PI) * 0.15;
    
    state.camera.position.z = 8 - offset * 3;
    state.camera.position.y = offset * 1.5;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 2, -5]} intensity={0.6} color="#88ccff" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} castShadow />

      <group ref={productRef}>
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.1}
            roughness={0.05}
            transmission={0.95}
            thickness={0.8}
            ior={1.5}
            envMapIntensity={1.2}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        <mesh position={[0, 0, 0]} scale={0.85}>
          <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
          <meshPhysicalMaterial
            color="#4488ff"
            metalness={0.0}
            roughness={0.15}
            transmission={0.85}
            thickness={0.4}
            ior={1.33}
            envMapIntensity={0.8}
          />
        </mesh>

        <mesh position={[2.5, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 2.5, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.9}
            roughness={0.15}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
            envMapIntensity={1.0}
          />
        </mesh>

        <mesh position={[2.5, 1.5, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.0}
            roughness={0.02}
            transmission={0.98}
            thickness={0.5}
            ior={1.5}
            envMapIntensity={1.5}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>

        <mesh position={[2.5, 1.5, 0]} scale={0.85}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshPhysicalMaterial
            color="#ff88cc"
            metalness={0.0}
            roughness={0.1}
            transmission={0.7}
            thickness={0.3}
            ior={1.33}
          />
        </mesh>
      </group>

      <Environment preset="studio" />
    </>
  );
}
