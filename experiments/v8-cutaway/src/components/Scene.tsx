import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import V8Engine from './V8Engine';

interface SceneProps {
  engineSpeed: number;
  setRpm: (rpm: number) => void;
  setStrokeCycle: (cycle: string) => void;
  setPressure: (pressure: string) => void;
  setFiringIndex: (index: number) => void;
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
      camera={{ position: [13.5, 6.4, 14.5], fov: 36 }}
      style={{ width: '100vw', height: '100vh' }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#000000']} />

      <hemisphereLight args={['#d7e2ee', '#000000', 0.22]} />
      <ambientLight intensity={0.18} />
      <directionalLight position={[8, 10, 6]} intensity={1.55} color="#fff7ee" />
      <directionalLight position={[-8, 3, -4]} intensity={0.45} color="#7aa4ff" />
      <spotLight position={[0, 12, 2]} intensity={1.1} angle={0.55} penumbra={0.85} color="#ffffff" />
      <pointLight position={[0, 1.2, 0]} intensity={0.35} color="#ef4444" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.05, 0]}>
        <ringGeometry args={[5.4, 5.55, 96]} />
        <meshBasicMaterial color="#8aa4bb" transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.06, 0]}>
        <circleGeometry args={[5.4, 64]} />
        <meshStandardMaterial color="#07080a" roughness={0.92} metalness={0.08} />
      </mesh>

      <V8Engine
        engineSpeed={engineSpeed}
        setRpm={setRpm}
        setStrokeCycle={setStrokeCycle}
        setPressure={setPressure}
        setFiringIndex={setFiringIndex}
      />

      <OrbitControls
        enableZoom
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={10}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0.4, 0]}
      />
    </Canvas>
  );
}
