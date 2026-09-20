import { useLayoutEffect as useExhibitLayout } from 'react';
import { useThree as useExhibitThree } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';
import { TimelineData } from '../types';
import { useEffect } from 'react';

interface SceneProps {
  night: boolean;
  currentEra: TimelineData;
  isPlaying: boolean;
  timelineValue: number;
  setTimelineValue: (value: number | ((prev: number) => number)) => void;
  setIsPlaying: (playing: boolean) => void;
}

export default function Scene({
  night,
  currentEra,
  isPlaying,
  timelineValue,
  setTimelineValue,
  setIsPlaying,
}: SceneProps) {
  useEffect(() => {
    if (!isPlaying) return;
    if (timelineValue >= 100) { setIsPlaying(false); return; }

    const interval = setInterval(() => {
      setTimelineValue((prev) => Math.min(100, prev + 1));
    }, 110);

    return () => clearInterval(interval);
  }, [isPlaying, timelineValue, setTimelineValue, setIsPlaying]);

  return (
    <Canvas
      camera={{ position: [1.35, 0.18, 4.35], fov: 38 }}
      style={{ width: '100vw', height: '100vh' }}
      gl={{ antialias: true }}
      dpr={[1, 1.75]}
    >
      <color attach="background" args={['#000000']} />

      <ambientLight intensity={0.12} />
      <directionalLight position={[6, 1.4, 3.2]} intensity={2.4} color="#fff4e6" />
      <directionalLight position={[-4, 0.4, -3]} intensity={0.55} color="#6ea8ff" />
      <pointLight position={[-2, -1, 2]} intensity={0.35} color="#3b82f6" />

      <group position={[0.55, -0.08, 0]}>
        <Earth currentEra={currentEra} night={night} />
      </group>

      <Stars
        radius={140}
        depth={60}
        count={4200}
        factor={3.2}
        saturation={0}
        fade
        speed={0.35}
      />

      <OrbitControls
        enableZoom
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={2.6}
        maxDistance={8}
        rotateSpeed={0.45}
        target={[0.45, 0, 0]}
      />
      <ExhibitFraming />
    </Canvas>
  );
}

// Preserve the subject's horizontal field of view on portrait screens.
function ExhibitFraming() {
  const { camera, size } = useExhibitThree();
  useExhibitLayout(() => {
    camera.zoom = .85 * Math.min(1, size.width / size.height / 1.25);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}
