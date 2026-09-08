import { useLayoutEffect, useRef } from 'react';
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
      <sphereGeometry args={[140, 32, 20]} />
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
            float h = smoothstep(-0.16, 0.58, vDir.y);
            gl_FragColor = vec4(mix(horizon, zenith, h), 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function SkyRig({ look }: Props) {
  const { scene, gl } = useThree();
  const sunDistance = 48;
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
      <hemisphereLight color={look.hemiSky} groundColor={look.hemiGround} intensity={0.58} />
      <ambientLight color={look.ambientColor} intensity={look.ambientIntensity} />
      <directionalLight
        color={look.sunColor}
        intensity={look.sunIntensity}
        position={[sunX, sunY, sunZ]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={4}
        shadow-camera-far={120}
        shadow-camera-left={-42}
        shadow-camera-right={42}
        shadow-camera-top={42}
        shadow-camera-bottom={-42}
      />
      <mesh position={[sunX, sunY, sunZ]}>
        <sphereGeometry args={[1.15, 16, 16]} />
        <meshBasicMaterial color={look.sunColor} fog={false} />
      </mesh>
      {look.cloudOpacity > 0.08 && (
        <group>
          {[
            [22, 16, -48],
            [-18, 14, -56],
            [8, 13, 52],
            [-36, 15, 18],
            [40, 17, 8],
          ].map(([x, y, z], index) => (
            <mesh key={index} position={[x, y, z]} scale={[4.8 + index * 0.4, 0.7, 2.2]}>
              <sphereGeometry args={[1, 10, 7]} />
              <meshStandardMaterial
                color="#f4f7fb"
                transparent
                opacity={look.cloudOpacity}
                roughness={1}
                depthWrite={false}
                fog={false}
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
}
