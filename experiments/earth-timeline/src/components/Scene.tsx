import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';
import { TimelineData } from '../types';
import { useEffect } from 'react';

interface SceneProps {
  currentEra: TimelineData;
  isPlaying: boolean;
  timelineValue: number;
  setTimelineValue: (value: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

export default function Scene({ 
  currentEra, 
  isPlaying, 
  timelineValue, 
  setTimelineValue,
  setIsPlaying 
}: SceneProps) {
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTimelineValue((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, setTimelineValue, setIsPlaying]);

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <color attach="background" args={['#000000']} />
      
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={2} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4169e1" />

      <Earth currentEra={currentEra} />
      
      <Stars 
        radius={100} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0.2} 
        fade 
        speed={0.5}
      />

      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        autoRotate={false}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
}
