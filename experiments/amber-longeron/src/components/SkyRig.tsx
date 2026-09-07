import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BackSide, Color, FogExp2, InstancedMesh, Object3D, ShaderMaterial } from 'three';

const dummy = new Object3D();

function Dome() {
  return (
    <mesh renderOrder={-2}>
      <sphereGeometry args={[90, 32, 20]} />
      <shaderMaterial
        side={BackSide}
        depthWrite={false}
        fog={false}
        uniforms={{
          zenith: { value: new Color('#1a120e') },
          horizon: { value: new Color('#c26a32') },
          nadir: { value: new Color('#2a1810') }
        }}
        vertexShader={`
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 zenith;
          uniform vec3 horizon;
          uniform vec3 nadir;
          varying vec3 vDir;
          void main() {
            float h = vDir.y;
            vec3 low = mix(nadir, horizon, smoothstep(-0.2, 0.04, h));
            vec3 col = mix(low, zenith, smoothstep(0.04, 0.62, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function HazeFloor({ reducedMotion }: { reducedMotion: boolean }) {
  const material = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!material.current || reducedMotion) return;
    material.current.uniforms.time.value = clock.elapsedTime * 0.12;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.6, 18]} renderOrder={-1}>
      <planeGeometry args={[80, 140, 24, 36]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        uniforms={{
          time: { value: 0 },
          high: { value: new Color('#5a3422') },
          low: { value: new Color('#24140e') }
        }}
        vertexShader={`
          uniform float time;
          varying float vLift;
          void main() {
            vec3 p = position;
            float w1 = sin(p.x * 0.08 + time) * 0.18;
            float w2 = cos(p.y * 0.05 - time * 0.8) * 0.14;
            p.z += w1 + w2;
            vLift = (w1 + w2) * 2.0 + 0.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 high;
          uniform vec3 low;
          varying float vLift;
          void main() {
            vec3 col = mix(low, high, clamp(vLift, 0.0, 1.0));
            gl_FragColor = vec4(col, 0.72);
          }
        `}
      />
    </mesh>
  );
}

function Mesas({ travelZ }: { travelZ: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        side: i % 2 === 0 ? -1 : 1,
        x: 8.5 + (i % 5) * 1.4,
        z: i * 18,
        h: 2.4 + (i % 4) * 0.7,
        w: 2.2 + (i % 3) * 0.8
      })),
    []
  );

  useFrame(() => {
    if (!mesh.current) return;
    seeds.forEach((mesa, i) => {
      const loop = 16 * 18;
      let z = mesa.z - (travelZ % loop);
      if (z < travelZ - 20) z += loop;
      dummy.position.set(mesa.side * mesa.x, -2.2 + mesa.h * 0.5, z);
      dummy.scale.set(mesa.w, mesa.h, 2.4);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, seeds.length]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2c1c14" roughness={0.95} />
    </instancedMesh>
  );
}

export default function SkyRig({
  travelZ,
  reducedMotion
}: {
  travelZ: number;
  reducedMotion: boolean;
}) {
  const { scene } = useThree();

  useLayoutEffect(() => {
    const fog = scene.fog instanceof FogExp2 ? scene.fog : new FogExp2('#3a2418', 0.028);
    fog.color.set('#3a2418');
    fog.density = 0.026;
    scene.fog = fog;
    scene.background = new Color('#1c120e');
  }, [scene]);

  return (
    <>
      <Dome />
      <HazeFloor reducedMotion={reducedMotion} />
      <Mesas travelZ={travelZ} />
      <hemisphereLight args={['#f0b27a', '#2a1810', 0.55]} />
      <ambientLight color="#6a4030" intensity={0.28} />
      <directionalLight
        color="#ffc178"
        intensity={1.55}
        position={[-10, 14, 6]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={2}
        shadow-camera-far={60}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />
      <directionalLight color="#6a3a88" intensity={0.28} position={[8, 4, -6]} />
    </>
  );
}
