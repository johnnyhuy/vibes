import { useLayoutEffect, useRef } from 'react';
import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { BackSide, Color, FogExp2, ShaderMaterial } from 'three';
import type { ResolvedLook } from '../look';

interface Props {
  look: ResolvedLook;
}

function SkyDome({ zenith, horizon }: { zenith: string; horizon: string }) {
  const material = useRef<ShaderMaterial>(null);

  useLayoutEffect(() => {
    material.current?.uniforms.zenith.value.set(zenith);
    material.current?.uniforms.horizon.value.set(horizon);
  }, [horizon, zenith]);

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[150, 32, 20]} />
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
            float h = smoothstep(-0.14, 0.62, vDir.y);
            gl_FragColor = vec4(mix(horizon, zenith, h), 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function SkyRig({ look }: Props) {
  const { scene, gl } = useThree();
  const sunDistance = 52;
  const sunY = Math.max(look.sunElevation, 0.04) * sunDistance;
  const sunX = Math.cos(look.sunAzimuth) * sunDistance * 0.9;
  const sunZ = Math.sin(look.sunAzimuth) * sunDistance * 0.9;

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
      <Environment files="/hdri/qwantani-dusk.hdr" background={false} environmentIntensity={look.envGain} />
      <hemisphereLight color={look.hemiSky} groundColor={look.hemiGround} intensity={0.6} />
      <ambientLight color={look.ambientColor} intensity={look.ambientIntensity} />
      <directionalLight
        color={look.sunColor}
        intensity={look.sunIntensity}
        position={[sunX, sunY, sunZ]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={4}
        shadow-camera-far={130}
        shadow-camera-left={-46}
        shadow-camera-right={46}
        shadow-camera-top={46}
        shadow-camera-bottom={-46}
      />
      <mesh position={[sunX, sunY, sunZ]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={look.sunColor} fog={false} />
      </mesh>
    </>
  );
}
