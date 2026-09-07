import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import CarModel from './CarModel';

interface SceneProps {
  explode: number;
  selectedPart: string | null;
  isolated: boolean;
  onSelectPart: (part: string | null) => void;
}

export default function Scene({ explode, selectedPart, isolated, onSelectPart }: SceneProps) {
  return (
    <Canvas shadows className="canvas">
      <color attach="background" args={['#0a0c0e']} />
      <fog attach="fog" args={['#0a0c0e', 20, 60]} />
      
      <PerspectiveCamera makeDefault position={[-5, 3, 7]} fov={45} />
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI * 0.48}
        target={[0, 0.5, 0]}
      />
      
      <Environment preset="night" />
      
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[-8, 12, 8]} 
        intensity={3} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[6, 6, -10]} intensity={1.5} color="#6b9bd1" />
      <spotLight position={[0, 8, 0]} intensity={0.8} angle={0.6} penumbra={1} />
      
      <CarModel 
        explode={explode}
        selectedPart={selectedPart}
        isolated={isolated}
        onSelectPart={onSelectPart}
      />
      
      {/* Studio ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#1a1d23" 
          metalness={0.1} 
          roughness={0.9}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Grid helper for studio feel */}
      <gridHelper args={[50, 50, '#2a3038', '#1e2228']} position={[0, -0.49, 0]} />
    </Canvas>
  );
}
