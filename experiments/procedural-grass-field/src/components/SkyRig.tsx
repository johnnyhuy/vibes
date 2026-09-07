import { useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { BackSide, Color, FogExp2, ShaderMaterial, Vector3 } from 'three';
import type { Look } from '../presets';

interface Props {
  look: Look;
}

export function sunPosition(look: Look, distance = 36): Vector3 {
  const y = Math.max(look.sunElevation, 0.06) * distance;
  const x = Math.cos(look.sunAzimuth) * distance * 0.82;
  const z = Math.sin(look.sunAzimuth) * distance * 0.82;
  return new Vector3(x, y, z);
}

function SkyDome({ zenith, horizon }: { zenith: string; horizon: string }) {
  const material = useRef<ShaderMaterial>(null);

  useLayoutEffect(() => {
    material.current?.uniforms.zenith.value.set(zenith);
    material.current?.uniforms.horizon.value.set(horizon);
  }, [horizon, zenith]);

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[80, 32, 20]} />
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
            float h = smoothstep(-0.12, 0.62, vDir.y);
            gl_FragColor = vec4(mix(horizon, zenith, h), 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function SkyRig({ look }: Props) {
  const { scene, gl } = useThree();
  const sun = sunPosition(look);

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
      <hemisphereLight color={look.hemiSky} groundColor={look.hemiGround} intensity={0.62} />
      <ambientLight color={look.ambientColor} intensity={look.ambientIntensity} />
      <directionalLight
        color={look.sunColor}
        intensity={look.sunIntensity}
        position={sun.toArray()}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={4}
        shadow-camera-far={80}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />
      {look.sunElevation > 0.08 && (
        <mesh position={sun.toArray()}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial color={look.sunColor} fog={false} />
        </mesh>
      )}
      {look.starOpacity > 0.05 && (
        <Stars radius={58} depth={28} count={1100} factor={2.6} saturation={0} fade speed={0} />
      )}
    </>
  );
}
