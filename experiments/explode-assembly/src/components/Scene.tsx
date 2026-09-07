import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
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
      {/* Pure black background for cinematic studio look */}
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 25, 70]} />
      
      {/* Camera positioned to frame full sedan */}
      <PerspectiveCamera makeDefault position={[-6, 3, 8]} fov={40} />
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI * 0.48}
        target={[0, 0.5, 0]}
      />
      
      {/* Key light - main illumination (brighter for 70% readability) */}
      <directionalLight 
        position={[-10, 12, 8]} 
        intensity={4.5} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      
      {/* Fill light - soften shadows (increased) */}
      <directionalLight position={[8, 8, -10]} intensity={2.5} color="#8ba6d1" />
      
      {/* Rim light - edge definition (increased) */}
      <directionalLight position={[-5, 4, -8]} intensity={1.5} color="#ffffff" />
      
      {/* Top accent (increased) */}
      <spotLight position={[0, 12, 0]} intensity={1.2} angle={0.5} penumbra={1} />
      
      {/* Ambient for soft global fill (increased) */}
      <ambientLight intensity={0.5} />
      
      <CarModel 
        explode={explode}
        selectedPart={selectedPart}
        isolated={isolated}
        onSelectPart={onSelectPart}
      />
      
      {/* Studio ground - dark reflective surface */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.05} 
          roughness={0.95}
          envMapIntensity={0.3}
        />
      </mesh>
    </Canvas>
  );
}
