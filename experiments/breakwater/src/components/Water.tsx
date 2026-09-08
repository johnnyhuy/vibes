import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, ShaderMaterial, Vector3 } from 'three';
import type { ResolvedLook } from '../look';

interface Props {
  look: ResolvedLook;
  reducedMotion: boolean;
}

const VERTEX = `
  uniform float uTime;
  uniform float uMotion;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vFoam;

  float wave(vec2 p, float amp, float freq, float speed, vec2 dir) {
    return sin(dot(p, dir) * freq + uTime * speed) * amp * uMotion;
  }

  void main() {
    vec3 pos = position;
    float w1 = wave(pos.xz, 0.22, 0.2, 0.7, vec2(0.86, 0.42));
    float w2 = wave(pos.xz, 0.11, 0.46, 1.1, vec2(-0.32, 0.9));
    float w3 = wave(pos.xz, 0.055, 1.0, 1.6, vec2(0.7, -0.55));
    pos.y += w1 + w2 + w3;
    vFoam = smoothstep(0.12, 0.26, w1 + w2);
    vec3 t = vec3(1.0, wave(pos.xz + vec2(0.35, 0.0), 0.16, 0.22, 0.7, vec2(0.86, 0.42)) - w1, 0.0);
    vec3 b = vec3(0.0, wave(pos.xz + vec2(0.0, 0.35), 0.16, 0.22, 0.7, vec2(0.86, 0.42)) - w1, 1.0);
    vNormal = normalize(cross(b, t));
    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const FRAGMENT = `
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  uniform vec3 uFoam;
  uniform vec3 uSun;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vFoam;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 view = normalize(cameraPosition - vWorld);
    float fresnel = pow(1.0 - max(dot(view, n), 0.0), 3.2);
    float depth = smoothstep(8.0, 48.0, length(vWorld.xz));
    vec3 base = mix(uShallow, uDeep, depth);
    float spec = pow(max(dot(reflect(-uSun, n), view), 0.0), 42.0);
    vec3 color = mix(base, uFoam, vFoam * 0.48);
    color += vec3(1.0, 0.82, 0.62) * spec * 0.7;
    color = mix(color, vec3(0.95, 0.8, 0.64), fresnel * 0.5);
    gl_FragColor = vec4(color, 0.96);
  }
`;

export default function Water({ look, reducedMotion }: Props) {
  const material = useRef<ShaderMaterial>(null);
  const sun = useMemo(
    () => [
      Math.cos(look.sunAzimuth) * 0.92,
      Math.max(look.sunElevation, 0.08),
      Math.sin(look.sunAzimuth) * 0.92,
    ],
    [look.sunAzimuth, look.sunElevation]
  );

  useLayoutEffect(() => {
    const uniforms = material.current?.uniforms;
    if (!uniforms) return;
    (uniforms.uShallow.value as Color).set(look.waterShallow);
    (uniforms.uDeep.value as Color).set(look.waterDeep);
    (uniforms.uFoam.value as Color).set(look.foam);
    uniforms.uMotion.value = reducedMotion ? 0 : 1;
  }, [look, reducedMotion]);

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    material.current.uniforms.uSun.value.set(sun[0], sun[1], sun[2]).normalize();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} renderOrder={1}>
      <planeGeometry args={[160, 160, 96, 96]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uMotion: { value: reducedMotion ? 0 : 1 },
          uShallow: { value: new Color(look.waterShallow) },
          uDeep: { value: new Color(look.waterDeep) },
          uFoam: { value: new Color(look.foam) },
          uSun: { value: new Vector3(1, 1, 1) },
        }}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
      />
    </mesh>
  );
}
