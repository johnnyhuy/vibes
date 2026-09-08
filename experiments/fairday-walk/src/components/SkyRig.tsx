import { useLayoutEffect, useRef } from 'react';
import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { BackSide, Color, FogExp2, ShaderMaterial } from 'three';
import { lane } from '../palette';

function SkyDome() {
  const material = useRef<ShaderMaterial>(null);

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[160, 32, 20]} />
      <shaderMaterial
        ref={material}
        side={BackSide}
        depthWrite={false}
        fog={false}
        uniforms={{
          zenith: { value: new Color(lane.skyZenith) },
          horizon: { value: new Color(lane.skyHorizon) },
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
          varying vec3 vDir;
          void main() {
            float h = smoothstep(-0.08, 0.62, vDir.y);
            gl_FragColor = vec4(mix(horizon, zenith, h), 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function SkyRig() {
  const { scene, gl } = useThree();

  useLayoutEffect(() => {
    const fog = scene.fog instanceof FogExp2 ? scene.fog : new FogExp2(lane.fog, 0.018);
    fog.color.set(lane.fog);
    fog.density = 0.018;
    scene.fog = fog;
    scene.background = new Color(lane.skyHorizon);
    gl.toneMappingExposure = 1.12;
  }, [gl, scene]);

  return (
    <>
      <SkyDome />
      <Environment files="/hdri/fairday-sky.hdr" background={false} environmentIntensity={0.72} />
      <hemisphereLight color={lane.skyZenith} groundColor={lane.earth} intensity={0.58} />
      <ambientLight color={lane.paper} intensity={0.38} />
      <directionalLight
        color={lane.sun}
        intensity={1.45}
        position={[18, 22, 10]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={2}
        shadow-camera-far={140}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={36}
        shadow-camera-bottom={-36}
      />
      <directionalLight color={lane.amber} intensity={0.22} position={[-10, 6, -8]} />
    </>
  );
}
