import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { CapabilityId } from '../capabilities';
import type { LightingPreset } from '../lighting';
import type { HudStats } from '../types';
import CameraDirector from './CameraDirector';
import CapabilityMoons from './CapabilityMoons';
import GlassSphere from './GlassSphere';
import LightingRig from './LightingRig';
import StatsReporter from './StatsReporter';

interface Props {
  selectedId: CapabilityId | null;
  hoveredId: CapabilityId | null;
  lighting: LightingPreset;
  rippleNonce: number;
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
  lighting,
  rippleNonce,
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
      <LightingRig preset={lighting} reducedMotion={reducedMotion} />

      <group position={[-0.35, 0.05, 0]}>
        <GlassSphere preset={lighting} rippleNonce={rippleNonce} reducedMotion={reducedMotion} />
        <CapabilityMoons
          selectedId={selectedId}
          hoveredId={hoveredId}
          reducedMotion={reducedMotion}
          onSelect={onSelect}
          onHover={onHover}
        />
      </group>

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
