import { useLayoutEffect, useMemo } from 'react';
import { BackSide, Color, DoubleSide, FogExp2, PlaneGeometry, ShaderMaterial } from 'three';
import { Environment, Stars } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { MOON } from '../world';
import Forest from './Forest';

function SkyDome() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          zenith: { value: new Color('#04070c') },
          horizon: { value: new Color('#0c1a16') },
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
      <meshStandardMaterial color="#122016" roughness={0.97} metalness={0.02} />
    </mesh>
  );
}

function DewRill() {
  const beads = useMemo(() => {
    return Array.from({ length: 20 }, (_, index) => {
      const t = index / 19;
      return {
        x: -6.8 + t * 13.4,
        z: -4.6 + t * 10.2 + Math.sin(t * Math.PI) * 1.55,
        s: 0.34 + Math.sin(t * 9) * 0.08,
      };
    });
  }, []);

  return (
    <group>
      {beads.map((bead, index) => (
        <mesh key={index} rotation={[-Math.PI / 2, 0, 0.18]} position={[bead.x, 0.055, bead.z]}>
          <circleGeometry args={[bead.s, 12]} />
          <meshStandardMaterial
            color="#7d9a68"
            emissive="#8aaa58"
            emissiveIntensity={0.55}
            roughness={0.18}
            metalness={0.12}
            transparent
            opacity={0.62}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Glade() {
  const { scene } = useThree();

  useLayoutEffect(() => {
    const fog = scene.fog instanceof FogExp2 ? scene.fog : new FogExp2('#0a1412', 0.052);
    fog.color.set('#0a1412');
    fog.density = 0.038;
    scene.fog = fog;
    scene.background = new Color('#070b0a');
  }, [scene]);

  return (
    <>
      <SkyDome />
      <color attach="background" args={['#070b0a']} />
      <hemisphereLight color="#6a8498" groundColor="#0e140f" intensity={0.16} />
      <ambientLight color="#121c1a" intensity={0.07} />
      <directionalLight
        color="#c8d8ee"
        intensity={1.45}
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
      <directionalLight color="#9eb8d4" intensity={0.42} position={[-12, 6, 10]} />
      <spotLight
        color="#d7e6f6"
        intensity={8}
        position={[2, 14, -3]}
        angle={0.38}
        penumbra={0.7}
        distance={28}
      />
      <mesh position={[MOON.x, MOON.y, MOON.z]}>
        <sphereGeometry args={[1.8, 20, 16]} />
        <meshBasicMaterial color="#e8eef8" fog={false} />
      </mesh>
      {[
        [6.2, 11, -8.4, 0.22],
        [3.4, 12, -7.1, 0.1],
        [8.1, 10.4, -6.6, 0.28],
        [1.6, 12.4, -9.2, 0.04],
      ].map(([x, y, z, tilt], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0.78 + tilt, 0.32, tilt]}>
          <coneGeometry args={[1.35, 20, 10, 1, true]} />
          <meshBasicMaterial
            color="#b7cce4"
            transparent
            opacity={0.12}
            side={DoubleSide}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      ))}
      <Stars radius={52} depth={26} count={900} factor={2.6} saturation={0} fade speed={0} />
      <Environment files="/hdri/night.hdr" background={false} environmentIntensity={0.62} />
      <Terrain />
      <DewRill />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <circleGeometry args={[7.4, 40]} />
        <meshStandardMaterial color="#1c2e22" roughness={0.95} />
      </mesh>
      {[
        [-2.2, 1.4],
        [1.8, -1.1],
        [3.4, 2.6],
        [-3.6, -2.2],
      ].map(([x, z], index) => (
        <mesh key={`moss-${index}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.04, z]} receiveShadow>
          <circleGeometry args={[1.15, 16]} />
          <meshStandardMaterial color="#2a4230" roughness={0.96} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <ringGeometry args={[5.35, 5.85, 42]} />
        <meshStandardMaterial color="#5a5448" roughness={0.84} />
      </mesh>
      <Forest />
    </>
  );
}
