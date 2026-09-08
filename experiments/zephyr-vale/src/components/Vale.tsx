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
import { heightAt, SUN, TREES, WATER_LEVEL } from '../world';
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
          zenith: { value: new Color('#8eb8e0') },
          horizon: { value: new Color('#d7e6ee') },
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
            float h = smoothstep(-0.08, 0.62, vDir.y);
            gl_FragColor = vec4(mix(horizon, zenith, h), 1.0);
          }
        `,
      }),
    []
  );

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[90, 28, 18]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function Terrain() {
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(86, 86, 72, 72);
    const positions = plane.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    const moss = new Color('#6f8d45');
    const lime = new Color('#9bb35a');
    const sand = new Color('#c9b48a');
    const mix = new Color();
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const h = heightAt(x, y);
      positions.setZ(i, h);
      const wet = 1 - Math.max(0, Math.min(1, (h - WATER_LEVEL) / 0.7));
      mix.copy(moss).lerp(lime, Math.max(0, h / 3.2)).lerp(sand, wet * 0.85);
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
      <meshStandardMaterial vertexColors roughness={0.96} metalness={0.02} />
    </mesh>
  );
}

function Water({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<Mesh>(null);

  useFrame((state) => {
    if (!mesh.current || reducedMotion) return;
    mesh.current.position.y = WATER_LEVEL + Math.sin(state.clock.elapsedTime * 0.35) * 0.03;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, WATER_LEVEL, -10]} receiveShadow>
      <planeGeometry args={[92, 82, 1, 1]} />
      <meshStandardMaterial
        color="#3eb8c4"
        emissive="#7ad4d8"
        emissiveIntensity={0.18}
        roughness={0.18}
        metalness={0.12}
        transparent
        opacity={0.92}
      />
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
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.4, 10, 8]} />
        <meshStandardMaterial color="#f4f7fb" roughness={1} fog={false} />
      </mesh>
      <mesh position={[1.8, 0.15, 0.3]}>
        <sphereGeometry args={[1.7, 10, 8]} />
        <meshStandardMaterial color="#eef3f8" roughness={1} fog={false} />
      </mesh>
      <mesh position={[-1.6, 0.05, -0.2]}>
        <sphereGeometry args={[1.5, 10, 8]} />
        <meshStandardMaterial color="#f7fafc" roughness={1} fog={false} />
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
  return (
    <group position={[x, y, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 1.1, 6]} />
        <meshStandardMaterial color="#5a4030" roughness={0.92} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <coneGeometry args={[0.62, 1.35, 7]} />
        <meshStandardMaterial color="#35573a" roughness={0.88} />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <coneGeometry args={[0.42, 0.95, 7]} />
        <meshStandardMaterial color="#3f6842" roughness={0.86} />
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
  return (
    <group position={[x, y, z]} rotation={[0, twist, 0]} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.16, 1.4, 6]} />
        <meshStandardMaterial color="#6a4a32" roughness={0.9} />
      </mesh>
      <mesh position={[0.08, 1.55, 0.04]} castShadow>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#6f9a48" roughness={0.84} />
      </mesh>
      <mesh position={[-0.22, 1.42, -0.1]} castShadow>
        <icosahedronGeometry args={[0.36, 0]} />
        <meshStandardMaterial color="#587c3a" roughness={0.86} />
      </mesh>
    </group>
  );
}

const HILLS: Array<[number, number, number, number]> = [
  [-28, -2, -38, 9],
  [32, 1, -36, 10],
  [8, -1, -46, 12],
  [-16, 0, -44, 8],
  [24, 2, 18, 7],
  [-30, 1, 14, 8],
];

export default function Vale({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useThree();

  useLayoutEffect(() => {
    const fog = scene.fog instanceof FogExp2 ? scene.fog : new FogExp2('#c5d8dc', 0.016);
    fog.color.set('#c5d8dc');
    fog.density = 0.011;
    scene.fog = fog;
    scene.background = new Color('#c9dce2');
  }, [scene]);

  return (
    <>
      <SkyDome />
      <color attach="background" args={['#c9dce2']} />
      <hemisphereLight color="#e8f0d8" groundColor="#7a8a58" intensity={0.62} />
      <ambientLight color="#f2ead8" intensity={0.28} />
      <directionalLight
        color="#fff1c8"
        intensity={1.35}
        position={[SUN.x, SUN.y, SUN.z]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={4}
        shadow-camera-far={80}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
      />
      <directionalLight color="#b7d4e8" intensity={0.32} position={[-16, 10, 8]} />
      <Terrain />
      <Water reducedMotion={reducedMotion} />
      <ReedGrass reducedMotion={reducedMotion} />
      <Landmarks reducedMotion={reducedMotion} />
      {TREES.map((tree, index) =>
        tree.kind === 'pine' ? (
          <Pine key={index} {...tree} />
        ) : (
          <Broadleaf key={index} {...tree} />
        )
      )}
      {HILLS.map(([x, y, z, s], index) => (
        <mesh key={index} position={[x, y, z]} scale={[s, s * 0.42, s * 0.85]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#5d7a46" roughness={0.96} />
        </mesh>
      ))}
      <Cloud x={-10} y={16} z={-12} scale={1.15} />
      <Cloud x={12} y={17.5} z={-18} scale={1.4} />
      <Cloud x={-18} y={15} z={6} scale={0.9} />
      <Cloud x={8} y={18} z={8} scale={1.05} />
      <mesh position={[22, 26, 12]}>
        <sphereGeometry args={[1.4, 14, 12]} />
        <meshBasicMaterial color="#fff6d2" fog={false} />
      </mesh>
      <mesh position={[14, 18, 6]} rotation={[0.9, 0.2, 0.1]}>
        <coneGeometry args={[2.4, 18, 10, 1, true]} />
        <meshBasicMaterial
          color="#fff4c8"
          transparent
          opacity={reducedMotion ? 0.04 : 0.09}
          side={DoubleSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>
    </>
  );
}
