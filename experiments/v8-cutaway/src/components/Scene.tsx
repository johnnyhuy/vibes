import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import V8Engine from './V8Engine';

interface SceneProps {
  engineSpeed: number;
  setRpm: (rpm: number) => void;
  setStrokeCycle: (cycle: string) => void;
  setPressure: (pressure: string) => void;
  setFiringIndex: (index: number) => void;
}

function Studio() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <hemisphereLight args={['#d7e2ee', '#050608', 0.28]} />
      <ambientLight intensity={0.16} />
      <directionalLight
        position={[6.4, 8.2, 4.8]}
        intensity={1.85}
        color="#fff7ee"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-6.2, 2.4, -3.8]} intensity={0.55} color="#7aa4ff" />
      <spotLight position={[0, 9.2, 2.2]} intensity={1.25} angle={0.5} penumbra={0.85} color="#ffffff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[4.6, 64]} />
        <meshStandardMaterial color="#07080a" roughness={0.92} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[4.58, 4.72, 96]} />
        <meshBasicMaterial color="#8aa4bb" transparent opacity={0.28} />
      </mesh>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.48} scale={10} blur={2.4} far={4} color="#000000" />
    </>
  );
}

export default function Scene({
  engineSpeed,
  setRpm,
  setStrokeCycle,
  setPressure,
  setFiringIndex,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [6.8, 3.4, 7.4], fov: 36, near: 0.1, far: 60 }}
      style={{ width: '100vw', height: '100vh' }}
      dpr={[1, 1.75]}
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <Studio />
      <Suspense fallback={null}>
        <Environment files="/hdri/studio.hdr" environmentIntensity={1.12} background={false} />
        <V8Engine
          engineSpeed={engineSpeed}
          setRpm={setRpm}
          setStrokeCycle={setStrokeCycle}
          setPressure={setPressure}
          setFiringIndex={setFiringIndex}
        />
      </Suspense>
      <OrbitControls
        enableZoom
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={5.2}
        maxDistance={16}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.15, 0]}
      />
    </Canvas>
  );
}
