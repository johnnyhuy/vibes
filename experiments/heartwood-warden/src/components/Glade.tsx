import { useLayoutEffect, useMemo } from 'react';
import { BackSide, Color, DoubleSide, FogExp2, PlaneGeometry, ShaderMaterial } from 'three';
import { Stars } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { MOON, TREES } from '../world';

function SkyDome() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          zenith: { value: new Color('#050814') },
          horizon: { value: new Color('#102033') },
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
            float h = smoothstep(-0.12, 0.58, vDir.y);
            gl_FragColor = vec4(mix(horizon, zenith, h), 1.0);
          }
        `,
      }),
    []
  );

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[70, 28, 18]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function GnarledTree({
  x,
  z,
  scale,
  twist,
  lean,
}: {
  x: number;
  z: number;
  scale: number;
  twist: number;
  lean: number;
}) {
  return (
    <group position={[x, 0, z]} rotation={[lean, twist, -lean * 0.4]} scale={scale}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.28, 1.1, 7]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.92} />
      </mesh>
      <mesh position={[0.08, 1.35, 0.04]} rotation={[0.08, 0.2, 0.12]} castShadow>
        <cylinderGeometry args={[0.11, 0.17, 1.05, 6]} />
        <meshStandardMaterial color="#2f2418" roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 2.05, -0.02]} rotation={[-0.12, 0.4, -0.08]} castShadow>
        <cylinderGeometry args={[0.06, 0.11, 0.72, 5]} />
        <meshStandardMaterial color="#2a2016" roughness={0.88} />
      </mesh>
      <mesh position={[0.06, 2.35, 0.08]} castShadow>
        <icosahedronGeometry args={[0.92, 0]} />
        <meshStandardMaterial color="#2a4a34" roughness={0.82} />
      </mesh>
      <mesh position={[0.42, 2.15, -0.22]} castShadow>
        <icosahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial color="#355a3c" roughness={0.8} />
      </mesh>
      <mesh position={[-0.28, 2.05, 0.18]} castShadow>
        <icosahedronGeometry args={[0.46, 0]} />
        <meshStandardMaterial color="#1e3a2a" roughness={0.84} />
      </mesh>
    </group>
  );
}

function Terrain() {
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(48, 48, 36, 36);
    const positions = plane.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const mound = Math.sin(x * 0.18) * Math.cos(y * 0.16) * 0.22 + Math.sin(x * 0.41 + y * 0.27) * 0.08;
      const rim = Math.max(0, Math.hypot(x, y) - 10) * 0.04;
      positions.setZ(i, mound + rim);
    }
    plane.computeVertexNormals();
    return plane;
  }, []);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]}
      receiveShadow
    >
      <meshStandardMaterial color="#16301c" roughness={0.96} metalness={0.02} />
    </mesh>
  );
}

export default function Glade() {
  const { scene } = useThree();

  useLayoutEffect(() => {
    const fog = scene.fog instanceof FogExp2 ? scene.fog : new FogExp2('#08141c', 0.026);
    fog.color.set('#08141c');
    fog.density = 0.026;
    scene.fog = fog;
    scene.background = new Color('#081018');
  }, [scene]);

  return (
    <>
      <SkyDome />
      <color attach="background" args={['#08141c']} />
      <hemisphereLight color="#7a96b4" groundColor="#142016" intensity={0.28} />
      <ambientLight color="#1a2830" intensity={0.14} />
      <directionalLight
        color="#d5e4f6"
        intensity={0.88}
        position={[MOON.x, MOON.y, MOON.z]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={4}
        shadow-camera-far={80}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />
      <mesh position={[MOON.x, MOON.y, MOON.z]}>
        <sphereGeometry args={[1.8, 20, 16]} />
        <meshBasicMaterial color="#e8eef8" fog={false} />
      </mesh>
      {[
        [4.2, 10, -7.5, 0.18],
        [-2.6, 11, -6.2, -0.12],
        [1.1, 12, -8.8, 0.08],
      ].map(([x, y, z, tilt], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0.72 + tilt, 0.18, tilt]}>
          <coneGeometry args={[1.15, 18, 10, 1, true]} />
          <meshBasicMaterial
            color="#9eb6d4"
            transparent
            opacity={0.08}
            side={DoubleSide}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      ))}
      <Stars radius={52} depth={26} count={900} factor={2.6} saturation={0} fade speed={0} />
      <Terrain />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <circleGeometry args={[7.4, 40]} />
        <meshStandardMaterial color="#2a3c28" roughness={0.94} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <ringGeometry args={[5.35, 5.85, 42]} />
        <meshStandardMaterial color="#6a6458" roughness={0.82} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const angle = (index / 6) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 5.6, 0.22, Math.sin(angle) * 5.6]}
            castShadow
          >
            <dodecahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color="#7a7468" roughness={0.88} />
          </mesh>
        );
      })}
      {TREES.map((tree, index) => (
        <GnarledTree key={index} {...tree} />
      ))}
    </>
  );
}
