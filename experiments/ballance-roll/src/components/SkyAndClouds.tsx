import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BackSide, Color, FogExp2, InstancedMesh, Object3D, ShaderMaterial } from 'three';

const puffDummy = new Object3D();

function SkyDome() {
  const material = useRef<ShaderMaterial>(null);

  return (
    <mesh renderOrder={-2}>
      <sphereGeometry args={[120, 32, 20]} />
      <shaderMaterial
        ref={material}
        side={BackSide}
        depthWrite={false}
        fog={false}
        uniforms={{
          zenith: { value: new Color('#f3c4d8') },
          horizon: { value: new Color('#c9b4e4') },
          nadir: { value: new Color('#efe6f6') }
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
            vec3 low = mix(nadir, horizon, smoothstep(-0.35, 0.02, h));
            vec3 col = mix(low, zenith, smoothstep(0.02, 0.72, h));
            gl_FragColor = vec4(col, 1.0);
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
          low: { value: new Color('#d7c4ea') }
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
            gl_FragColor = vec4(col, 0.88);
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
      Array.from({ length: 42 }, (_, i) => ({
        x: ((i * 47) % 90) - 45,
        z: ((i * 31) % 86) - 58,
        y: -6.2 - (i % 5) * 0.35,
        s: 2.4 + (i % 6) * 0.55,
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
      <meshStandardMaterial color="#f7eef8" roughness={1} transparent opacity={0.55} depthWrite={false} />
    </instancedMesh>
  );
}

export default function SkyAndClouds({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useThree();

  useLayoutEffect(() => {
    const fog = scene.fog instanceof FogExp2 ? scene.fog : new FogExp2('#d8c6e8', 0.018);
    fog.color.set('#d8c6e8');
    fog.density = 0.018;
    scene.fog = fog;
    scene.background = new Color('#d7c3e6');
  }, [scene]);

  return (
    <>
      <SkyDome />
      <CloudSea reducedMotion={reducedMotion} />
      <CloudPuffs reducedMotion={reducedMotion} />
      <hemisphereLight args={['#ffe8f2', '#b9a7d2', 0.72]} />
      <ambientLight color="#f6e6f0" intensity={0.42} />
      <directionalLight
        color="#fff1dc"
        intensity={1.25}
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
      <directionalLight color="#c9b0ea" intensity={0.35} position={[-12, 8, -10]} />
    </>
  );
}
