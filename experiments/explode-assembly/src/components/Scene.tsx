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
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 20, 60]} />
      
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
      
      {/* Studio ground - pure black */}
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
