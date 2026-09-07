import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import type { CapabilityId } from '../capabilities';
import type { HudStats } from '../types';
import CameraDirector from './CameraDirector';
import CapabilityMoons from './CapabilityMoons';
import GlassSphere from './GlassSphere';
import StatsReporter from './StatsReporter';

interface Props {
  selectedId: CapabilityId | null;
  hoveredId: CapabilityId | null;
  reducedMotion: boolean;
  onSelect: (id: CapabilityId) => void;
  onHover: (id: CapabilityId | null) => void;
  onInteract: () => void;
  onStats: (stats: HudStats) => void;
  onCanvas: (canvas: HTMLCanvasElement) => void;
}

export default function Scene({
  selectedId,
  hoveredId,
  reducedMotion,
  onSelect,
  onHover,
  onInteract,
  onStats,
  onCanvas,
}: Props) {
  return (
    <Canvas
      camera={{ position: [2.55, 1.4, 7.7], fov: 42, near: 0.1, far: 80 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => onCanvas(gl.domElement)}
      onPointerMissed={() => onHover(null)}
    >
      <color attach="background" args={['#e6edf5']} />
      <hemisphereLight args={['#f4f7fb', '#c5d0dc', 0.85]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 4]} intensity={1.15} color="#fffaf2" />
      <directionalLight position={[-5, 2, -4]} intensity={0.35} color="#9db4cc" />

      <group position={[-0.35, 0.05, 0]}>
        <GlassSphere />
        <CapabilityMoons
          selectedId={selectedId}
          hoveredId={hoveredId}
          reducedMotion={reducedMotion}
          onSelect={onSelect}
          onHover={onHover}
        />
      </group>

      <ContactShadows
        position={[0, -2.35, 0]}
        opacity={0.18}
        scale={18}
        blur={3.2}
        far={6}
        color="#8aa0b5"
      />

      <Environment frames={1} resolution={256} environmentIntensity={0.42}>
        <Lightformer intensity={1.6} position={[0, 5, 2]} scale={[8, 1.2, 1]} color="#ffffff" />
        <Lightformer intensity={0.7} position={[-4, 2, -2]} scale={4} color="#d7e6f5" />
        <Lightformer intensity={0.55} position={[4, 1, 3]} scale={3} color="#f3e8ff" />
      </Environment>

      <CameraDirector selectedId={selectedId} reducedMotion={reducedMotion} />
      <StatsReporter onStats={onStats} />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={4.2}
        maxDistance={12}
        minPolarAngle={0.55}
        maxPolarAngle={Math.PI / 1.7}
        onStart={onInteract}
      />
    </Canvas>
  );
}
