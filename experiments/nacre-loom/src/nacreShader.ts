import type { IUniform, WebGLProgramParametersWithUniforms } from 'three';

export interface LobeUniforms {
  uTime: IUniform<number>;
  uMorph: IUniform<number>;
  uSpeed: IUniform<number>;
  uAmp: IUniform<number>;
}

export const LOBE_GLSL = /* glsl */ `
vec3 lobeDisplace(vec3 p, float t, float morph, float speed, float amp) {
  float clock = t * speed;
  vec3 a = normalize(vec3(sin(clock), 0.42, cos(clock)));
  vec3 b = normalize(vec3(cos(clock * 0.73 + 1.2), -0.36, sin(clock * 0.73)));
  vec3 c = normalize(vec3(sin(clock * 0.51 + 2.1), 0.68, cos(clock * 0.51 + 0.4)));
  vec3 n = normalize(p);
  float da = pow(max(dot(n, a), 0.0), 3.6);
  float db = pow(max(dot(n, b), 0.0), 4.2);
  float dc = pow(max(dot(n, c), 0.0), 5.0);
  float swell = (da * 0.55 + db * 0.38 + dc * 0.48) * morph * amp;
  return p * (1.0 + swell);
}
`;

export function injectLobe(
  shader: WebGLProgramParametersWithUniforms,
  uniforms: LobeUniforms,
) {
  shader.uniforms.uTime = uniforms.uTime;
  shader.uniforms.uMorph = uniforms.uMorph;
  shader.uniforms.uSpeed = uniforms.uSpeed;
  shader.uniforms.uAmp = uniforms.uAmp;
  shader.vertexShader = `
    uniform float uTime;
    uniform float uMorph;
    uniform float uSpeed;
    uniform float uAmp;
    ${LOBE_GLSL}
  ${shader.vertexShader}`
    .replace(
      '#include <beginnormal_vertex>',
      `#include <beginnormal_vertex>
       objectNormal = normalize(lobeDisplace(position, uTime, uMorph, uSpeed, uAmp));`,
    )
    .replace(
      '#include <begin_vertex>',
      'vec3 transformed = lobeDisplace(position, uTime, uMorph, uSpeed, uAmp);',
    );
}

export const nacreVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSpeed;
  uniform float uAmp;
  ${LOBE_GLSL}

  varying vec3 vPos;
  varying vec3 vNormalW;
  varying vec3 vView;

  void main() {
    vec3 displaced = lobeDisplace(position, uTime, uMorph, uSpeed, uAmp);
    vec4 world = modelMatrix * vec4(displaced, 1.0);
    vPos = displaced;
    vNormalW = normalize(mat3(modelMatrix) * normalize(displaced));
    vView = cameraPosition - world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const nacreFragment = /* glsl */ `
  uniform vec3 uFilmA;
  uniform vec3 uFilmB;
  uniform vec3 uFilmC;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uAmp;
  uniform float uWeave;
  uniform float uReduced;

  varying vec3 vPos;
  varying vec3 vNormalW;
  varying vec3 vView;

  float belt(vec3 p, float t) {
    float wave = 0.12 * sin(p.x * 6.4 + t * 1.4) + 0.08 * sin(p.z * 4.6 - t);
    float band = 1.0 - smoothstep(0.05, 0.32 * uAmp + 0.16, abs(p.y - wave));
    return band * band;
  }

  float coil(vec3 p, float t) {
    float ang = atan(p.z, p.x) / 6.2831853;
    float helix = fract(ang + p.y * 0.85 - t * 0.18);
    return 1.0 - smoothstep(0.04, 0.22 * uAmp + 0.08, abs(helix - 0.5));
  }

  float bloom(vec3 p, float t) {
    float r = length(p);
    float pulse = 0.5 + 0.5 * sin(r * 9.0 - t * 1.1);
    return smoothstep(0.12, 0.02, r) + pulse * (1.0 - smoothstep(0.2, 0.92, r)) * 0.55;
  }

  float wake(vec3 p, float t) {
    float swirl = atan(p.z, p.x) + p.y * 2.4 - t * 0.9;
    float band = 0.5 + 0.5 * sin(swirl * 3.0);
    return pow(band, 3.2) * (0.35 + 0.65 * uAmp);
  }

  float veil(vec3 p, float t) {
    float sheet = 0.5 + 0.5 * sin(p.x * 4.6 + t * 0.7) * sin(p.z * 3.3 - t * 0.4);
    return pow(sheet, 2.4) * (0.4 + 0.6 * (0.5 + 0.5 * p.y));
  }

  float seed(vec3 p, float t) {
    float core = exp(-dot(p, p) * 6.4);
    float ember = exp(-dot(p.xy, p.xy) * 14.0) * (0.6 + 0.4 * sin(t * 2.2));
    return core * 1.4 + ember;
  }

  float weaveMask(vec3 p, float t) {
    if (uWeave < 0.5) return belt(p, t);
    if (uWeave < 1.5) return coil(p, t);
    if (uWeave < 2.5) return bloom(p, t);
    if (uWeave < 3.5) return wake(p, t);
    if (uWeave < 4.5) return veil(p, t);
    return seed(p, t);
  }

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(vView);
    float ndv = max(dot(n, v), 0.0);
    float fres = pow(1.0 - ndv, 2.35);
    float clock = uTime * mix(uSpeed, 0.0, uReduced);
    float mask = weaveMask(vPos, clock);
    vec3 film = mix(uFilmA, uFilmB, 0.5 + 0.5 * sin(vPos.y * 8.4 + clock + fres * 3.2));
    film = mix(film, uFilmC, fres);
    float glow = mask * (0.85 + 1.1 * fres) + fres * 0.32;
    gl_FragColor = vec4(film * glow * 2.6, clamp(glow, 0.1, 1.0));
  }
`;
