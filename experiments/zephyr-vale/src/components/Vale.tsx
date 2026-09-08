import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  BackSide,
  BufferAttribute,
  Color,
  DoubleSide,
  FogExp2,
  type Mesh,
  PlaneGeometry,
  ShaderMaterial,
} from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { heightAt, ISLES, SUN, TREES, WATER_LEVEL } from '../world';
import Landmarks from './Landmarks';
import ReedGrass from './ReedGrass';

function SkyDome() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          zenith: { value: new Color('#7eb6e6') },
          horizon: { value: new Color('#e8f3f8') },
        },
        vertexShader: `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 zenith;
          uniform vec3 horizon;
          varying vec3 vDir;
          void main() {
            float h = smoothstep(-0.04, 0.55, vDir.y);
            vec3 sky = mix(horizon, zenith, h);
            float haze = smoothstep(0.02, 0.22, vDir.y);
            sky = mix(vec3(0.92, 0.96, 0.97), sky, haze);
            gl_FragColor = vec4(sky, 1.0);
          }
        `,
      }),
    []
  );

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[110, 28, 18]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function Terrain() {
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(96, 96, 80, 80);
    const positions = plane.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    const moss = new Color('#5f8a3c');
    const lime = new Color('#b4d45e');
    const sand = new Color('#cbb58a');
    const mix = new Color();
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const h = heightAt(x, y);
      positions.setZ(i, h);
      const wet = 1 - Math.max(0, Math.min(1, (h - WATER_LEVEL) / 0.55));
      mix.copy(moss).lerp(lime, Math.max(0, (h - WATER_LEVEL) / 4.2)).lerp(sand, wet * 0.72);
      colors[i * 3] = mix.r;
      colors[i * 3 + 1] = mix.g;
      colors[i * 3 + 2] = mix.b;
    }
    plane.setAttribute('color', new BufferAttribute(colors, 3));
    plane.computeVertexNormals();
    return plane;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.94} metalness={0.01} />
    </mesh>
  );
}

function Water() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, WATER_LEVEL, -4]} receiveShadow>
      <planeGeometry args={[160, 160]} />
      <meshStandardMaterial color="#7ed0ce" roughness={0.58} metalness={0.02} />
    </mesh>
  );
}

function Cloud({
  x,
  y,
  z,
  scale,
}: {
  x: number;
  y: number;
  z: number;
  scale: number;
}) {
  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh position={[0, 0, 0]} scale={[1.8, 0.55, 1.1]}>
        <sphereGeometry args={[2.2, 10, 8]} />
        <meshStandardMaterial color="#f7fafc" roughness={1} fog={false} />
      </mesh>
      <mesh position={[2.4, 0.1, 0.2]} scale={[1.3, 0.48, 0.9]}>
        <sphereGeometry args={[1.7, 10, 8]} />
        <meshStandardMaterial color="#eef4f8" roughness={1} fog={false} />
      </mesh>
      <mesh position={[-2.1, 0.05, -0.15]} scale={[1.15, 0.42, 0.85]}>
        <sphereGeometry args={[1.5, 10, 8]} />
        <meshStandardMaterial color="#fbfcfe" roughness={1} fog={false} />
      </mesh>
    </group>
  );
}

function Pine({
  x,
  z,
  scale,
  twist,
}: {
  x: number;
  z: number;
  scale: number;
  twist: number;
}) {
  const y = heightAt(x, z);
  if (y < WATER_LEVEL + 0.05) return null;
  return (
    <group position={[x, y, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 1.0, 6]} />
        <meshStandardMaterial color="#5a4030" roughness={0.92} />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <coneGeometry args={[0.58, 1.25, 7]} />
        <meshStandardMaterial color="#2f5a36" roughness={0.88} />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow>
        <coneGeometry args={[0.38, 0.88, 7]} />
        <meshStandardMaterial color="#3a6840" roughness={0.86} />
      </mesh>
    </group>
  );
}

function Broadleaf({
  x,
  z,
  scale,
  twist,
}: {
  x: number;
  z: number;
  scale: number;
  twist: number;
}) {
  const y = heightAt(x, z);
  if (y < WATER_LEVEL + 0.05) return null;
  return (
    <group position={[x, y, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.15, 1.25, 6]} />
        <meshStandardMaterial color="#6a4a32" roughness={0.9} />
      </mesh>
      <mesh position={[0.06, 1.45, 0.04]} castShadow>
        <icosahedronGeometry args={[0.52, 0]} />
        <meshStandardMaterial color="#7fb048" roughness={0.82} />
      </mesh>
      <mesh position={[-0.2, 1.32, -0.08]} castShadow>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color="#5f8c3a" roughness={0.84} />
      </mesh>
    </group>
  );
}

export default function Vale({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useThree();
  const sunShaft = useRef<Mesh>(null);

  useLayoutEffect(() => {
    const fog = scene.fog instanceof FogExp2 ? scene.fog : new FogExp2('#d6eaf0', 0.0075);
    fog.color.set('#d6eaf0');
    fog.density = 0.0075;
    scene.fog = fog;
    scene.background = new Color('#cfe6f0');
  }, [scene]);

  useFrame((state) => {
    if (!sunShaft.current || reducedMotion) return;
    sunShaft.current.rotation.z = 0.08 + Math.sin(state.clock.elapsedTime * 0.12) * 0.02;
  });

  return (
    <>
      <SkyDome />
      <color attach="background" args={['#cfe6f0']} />
      <hemisphereLight color="#fff4d4" groundColor="#7a9a4e" intensity={0.78} />
      <ambientLight color="#fff6e4" intensity={0.38} />
      <directionalLight
        color="#fff3c4"
        intensity={1.62}
        position={[SUN.x, SUN.y, SUN.z]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={4}
        shadow-camera-far={90}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={32}
        shadow-camera-bottom={-32}
      />
      <directionalLight color="#b9d8ee" intensity={0.38} position={[-14, 12, 6]} />
      <Water />
      <Terrain />
      <ReedGrass reducedMotion={reducedMotion} />
      <Landmarks reducedMotion={reducedMotion} />
      {TREES.map((tree, index) =>
        tree.kind === 'pine' ? (
          <Pine key={index} {...tree} />
        ) : (
          <Broadleaf key={index} {...tree} />
        )
      )}
      {ISLES.map((isle, index) => (
        <mesh
          key={`isle-${index}`}
          position={[isle.x, WATER_LEVEL + isle.s * 0.18, isle.z]}
          scale={[isle.s * 0.95, isle.s * 0.34, isle.s * 0.82]}
        >
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color="#6a9a42" roughness={0.96} />
        </mesh>
      ))}
      <Cloud x={-14} y={20} z={-16} scale={1.35} />
      <Cloud x={16} y={22} z={-22} scale={1.7} />
      <Cloud x={-22} y={18} z={4} scale={1.05} />
      <Cloud x={10} y={21} z={10} scale={1.2} />
      <Cloud x={-4} y={24} z={-30} scale={1.5} />
      <mesh position={[20, 32, 16]}>
        <sphereGeometry args={[1.6, 14, 12]} />
        <meshBasicMaterial color="#fff7d6" fog={false} />
      </mesh>
      <mesh ref={sunShaft} position={[12, 20, 8]} rotation={[0.95, 0.18, 0.08]}>
        <coneGeometry args={[2.8, 22, 10, 1, true]} />
        <meshBasicMaterial
          color="#fff3c0"
          transparent
          opacity={reducedMotion ? 0.05 : 0.1}
          side={DoubleSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>
    </>
  );
}
