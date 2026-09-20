import { useLayoutEffect, useMemo, useRef } from 'react';
import { Environment } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { BackSide, Color, FogExp2, InstancedMesh, Object3D, ShaderMaterial } from 'three';
import { HAZE_HDRI } from '../assets';

const puffDummy = new Object3D();

function HorizonHaze() {
  return (
    <mesh renderOrder={-2}>
      <sphereGeometry args={[110, 32, 20]} />
      <shaderMaterial
        side={BackSide}
        transparent
        depthWrite={false}
        fog={false}
        uniforms={{
          haze: { value: new Color('#f6c9d4') }
        }}
        vertexShader={`
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 haze;
          varying vec3 vDir;
          void main() {
            float a = 0.2 * (1.0 - smoothstep(0.04, 0.62, vDir.y));
            gl_FragColor = vec4(haze, a);
          }
        `}
      />
    </mesh>
  );
}

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

function CloudPuffs({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        x: ((i * 47) % 90) - 45,
        z: ((i * 31) % 86) - 58,
        y: -6.6 - (i % 5) * 0.28,
        s: 1.8 + (i % 6) * 0.4,
        phase: i * 0.37
      })),
    []
  );

  useLayoutEffect(() => {
    if (!mesh.current) return;
    seeds.forEach((puff, i) => {
      puffDummy.position.set(puff.x, puff.y, puff.z);
      puffDummy.scale.setScalar(puff.s);
      puffDummy.updateMatrix();
      mesh.current!.setMatrixAt(i, puffDummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [seeds]);

  useFrame(({ clock }) => {
    if (!mesh.current || reducedMotion) return;
    const t = clock.elapsedTime;
    seeds.forEach((puff, i) => {
      puffDummy.position.set(puff.x + Math.sin(t * 0.12 + puff.phase) * 1.4, puff.y, puff.z);
      puffDummy.scale.setScalar(puff.s);
      puffDummy.updateMatrix();
      mesh.current!.setMatrixAt(i, puffDummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, seeds.length]}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#f7eef8" roughness={1} transparent opacity={0.28} depthWrite={false} />
    </instancedMesh>
  );
}

export default function SkyAndClouds({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useThree();

  useLayoutEffect(() => {
    const fog = scene.fog instanceof FogExp2 ? scene.fog : new FogExp2('#efd0da', 0.0075);
    fog.color.set('#efd0da');
    fog.density = 0.0075;
    scene.fog = fog;
  }, [scene]);

  return (
    <>
      <HorizonHaze />
      <CloudSea reducedMotion={reducedMotion} />
      <CloudPuffs reducedMotion={reducedMotion} />
      <Environment
        files={HAZE_HDRI}
        background
        backgroundBlurriness={0.16}
        backgroundIntensity={0.92}
        environmentIntensity={1.08}
      />
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
