import { useLayoutEffect, useRef } from 'react';
import { Environment } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, Euler, ShaderMaterial } from 'three';
import { HAZE_HDRI } from '../assets';

const HDRI_SPIN = new Euler(0, 2.15, 0);

function CloudSea({ reducedMotion }: { reducedMotion: boolean }) {
  const material = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!material.current || reducedMotion) return;
    material.current.uniforms.time.value = clock.elapsedTime * 0.08;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7.4, -16]} renderOrder={-1}>
      <planeGeometry args={[160, 160, 48, 48]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        uniforms={{
          time: { value: 0 },
          high: { value: new Color('#fff4fb') },
          low: { value: new Color('#e4c4d4') }
        }}
        vertexShader={`
          uniform float time;
          varying float vLift;
          void main() {
            vec3 p = position;
            float w1 = sin(p.x * 0.045 + time) * 0.55;
            float w2 = cos(p.y * 0.038 - time * 1.15) * 0.4;
            p.z += w1 + w2;
            vLift = (w1 + w2) * 0.5 + 0.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 high;
          uniform vec3 low;
          varying float vLift;
          void main() {
            vec3 col = mix(low, high, vLift);
            gl_FragColor = vec4(col, 0.58);
          }
        `}
      />
    </mesh>
  );
}

export default function SkyAndClouds({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useThree();

  useLayoutEffect(() => {
    // FogExp2 tints scene.background to a flat mauve, which is why Pink Sunrise
    // never read as sky on #104. Haze stays in the veil + cloud sea.
    scene.fog = null;
  }, [scene]);

  return (
    <>
      <CloudSea reducedMotion={reducedMotion} />
      <Environment
        files={HAZE_HDRI}
        background
        backgroundBlurriness={0}
        backgroundIntensity={1.4}
        backgroundRotation={HDRI_SPIN}
        environmentIntensity={1.18}
        environmentRotation={HDRI_SPIN}
      />
      <mesh position={[22, 14, -28]}>
        <sphereGeometry args={[2.4, 20, 16]} />
        <meshBasicMaterial color="#ffd2a0" fog={false} />
      </mesh>
      <hemisphereLight args={['#ffe8f2', '#b9a7d2', 0.72]} />
      <ambientLight color="#f6e6f0" intensity={0.42} />
      <directionalLight
        color="#fff1dc"
        intensity={1.28}
        position={[16, 22, 8]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={2}
        shadow-camera-far={80}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
      />
      <directionalLight color="#c9b0ea" intensity={0.42} position={[-12, 8, -10]} />
    </>
  );
}
