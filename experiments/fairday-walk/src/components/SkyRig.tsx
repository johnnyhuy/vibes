import { useLayoutEffect, useRef } from 'react';
import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { BackSide, Color, FogExp2, ShaderMaterial } from 'three';
import type { ResolvedLook } from '../looks';

function SkyDome({ zenith, horizon }: { zenith: string; horizon: string }) {
  const material = useRef<ShaderMaterial>(null);

  useLayoutEffect(() => {
    material.current?.uniforms.zenith.value.set(zenith);
    material.current?.uniforms.horizon.value.set(horizon);
  }, [horizon, zenith]);

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[160, 32, 20]} />
      <shaderMaterial
        ref={material}
        side={BackSide}
        depthWrite={false}
        fog={false}
        uniforms={{
          zenith: { value: new Color(zenith) },
          horizon: { value: new Color(horizon) },
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

export default function SkyRig({ look }: { look: ResolvedLook }) {
  const { scene, gl } = useThree();

  useLayoutEffect(() => {
    const fog = scene.fog instanceof FogExp2 ? scene.fog : new FogExp2(look.fogColor, look.fogDensity);
    fog.color.set(look.fogColor);
    fog.density = look.fogDensity;
    scene.fog = fog;
    scene.background = new Color(look.skyHorizon);
    gl.toneMappingExposure = look.exposure;
  }, [gl, look, scene]);

  return (
    <>
      <SkyDome zenith={look.skyZenith} horizon={look.skyHorizon} />
      <Environment files="/hdri/fairday-sky.hdr" background={false} environmentIntensity={look.envGain} />
      <hemisphereLight color={look.hemiSky} groundColor={look.hemiGround} intensity={0.56} />
      <ambientLight color={look.skyHorizon} intensity={look.ambient} />
      <directionalLight
        color={look.sunColor}
        intensity={look.sunIntensity}
        position={look.sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={2}
        shadow-camera-far={140}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={36}
        shadow-camera-bottom={-36}
      />
      <directionalLight color={look.fillColor} intensity={look.fillIntensity} position={look.fill} />
    </>
  );
}
