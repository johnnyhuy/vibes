import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import V8Engine from './V8Engine';

interface SceneProps {
  engineSpeed: number;
  setRpm: (rpm: number) => void;
  setStrokeCycle: (cycle: string) => void;
  setPressure: (pressure: string) => void;
}

export default function Scene({ engineSpeed, setRpm, setStrokeCycle, setPressure }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [12, 8, 12], fov: 50 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <color attach="background" args={['#0a0a0a']} />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#4169e1" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#ef4444" />

      <V8Engine 
        engineSpeed={engineSpeed}
        setRpm={setRpm}
        setStrokeCycle={setStrokeCycle}
        setPressure={setPressure}
      />

      <Grid 
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#333"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#444"
        fadeDistance={25}
        fadeStrength={1}
        position={[0, -3, 0]}
      />

      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minDistance={8}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
