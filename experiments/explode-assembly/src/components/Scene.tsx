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
      <PerspectiveCamera makeDefault position={[-6, 3, 8]} fov={40} />
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        minDistance={8}
        maxDistance={50}
        maxPolarAngle={Math.PI * 0.48}
        target={[0, 1, 0]}
      />
      
      <Environment preset="city" />
      
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[-5, 8, 5]} 
        intensity={2.5} 
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[5, 5, -8]} intensity={1.2} />
      
      <CarModel 
        explode={explode}
        selectedPart={selectedPart}
        isolated={isolated}
        onSelectPart={onSelectPart}
      />
      
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </Canvas>
  );
}
