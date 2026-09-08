import { ContactShadows } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { ACESFilmicToneMapping } from 'three';
import TiltCard from './TiltCard';

interface Props {
  foil: number;
  tilt: number;
  spread: number;
  flipped: boolean;
  sway: boolean;
  reducedMotion: boolean;
  resetToken: number;
}

export default function Scene({
  foil,
  tilt,
  spread,
  flipped,
  sway,
  reducedMotion,
  resetToken,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.08, 5.15], fov: 32, near: 0.1, far: 24 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
    >
      <color attach="background" args={['#05070c']} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[3.2, 4.2, 5]} intensity={1.35} color="#f4efe4" />
      <directionalLight position={[-3.6, 1.4, 2.2]} intensity={0.55} color="#7fbad0" />
      <spotLight position={[0, 2.4, 4.2]} intensity={0.7} angle={0.45} penumbra={0.7} color="#d8c89a" />
      <TiltCard
        foil={foil}
        tilt={tilt}
        spread={spread}
        flipped={flipped}
        sway={sway}
        reducedMotion={reducedMotion}
        resetToken={resetToken}
      />
      <ContactShadows position={[0, -1.72, 0]} opacity={0.38} scale={8} blur={2.4} far={3.2} />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.42} luminanceSmoothing={0.34} intensity={0.72} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
