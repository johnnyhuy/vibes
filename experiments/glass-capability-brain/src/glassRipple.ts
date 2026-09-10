import type { IUniform, Vector3, WebGLProgramParametersWithUniforms } from 'three';

export interface RippleUniforms {
  uRipple: IUniform<number>;
  uRippleOrigin: IUniform<Vector3>;
}

/**
 * One travelling ring on a transmission sphere.
 * Invented for this map — not a port of anyone else's glass shader.
 */
export function injectGlassRipple(
  shader: WebGLProgramParametersWithUniforms,
  uniforms: RippleUniforms,
) {
  shader.uniforms.uRipple = uniforms.uRipple;
  shader.uniforms.uRippleOrigin = uniforms.uRippleOrigin;

  shader.vertexShader = `
    uniform float uRipple;
    uniform vec3 uRippleOrigin;
    varying float vRipple;
  ${shader.vertexShader}`
    .replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
       float rippleAlive = step(0.001, uRipple) * (1.0 - uRipple);
       vec3 rippleN = normalize(transformed);
       vec3 rippleO = normalize(uRippleOrigin);
       float rippleAng = acos(clamp(dot(rippleN, rippleO), -1.0, 1.0));
       float rippleFront = uRipple * 3.05;
       float rippleRing = rippleAng - rippleFront;
       float rippleEnv = exp(-rippleRing * rippleRing * 9.0) * rippleAlive;
       float rippleWave = sin(rippleRing * 16.0) * rippleEnv;
       transformed += objectNormal * rippleWave * 0.14;
       vRipple = rippleWave;`,
    );

  shader.fragmentShader = `
    varying float vRipple;
  ${shader.fragmentShader}`.replace(
    '#include <normal_fragment_begin>',
    `#include <normal_fragment_begin>
     normal = normalize(normal + vec3(vRipple * 0.55, vRipple * 0.28, 0.0));`,
  );
}

export const rippleSheenVertex = /* glsl */ `
  varying vec3 vObj;
  void main() {
    vObj = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const rippleSheenFragment = /* glsl */ `
  uniform float uRipple;
  uniform vec3 uRippleOrigin;
  uniform vec3 uColor;
  varying vec3 vObj;

  void main() {
    if (uRipple < 0.001) discard;
    vec3 n = normalize(vObj);
    vec3 o = normalize(uRippleOrigin);
    float ang = acos(clamp(dot(n, o), -1.0, 1.0));
    float front = uRipple * 3.05;
    float ring = abs(ang - front);
    float band = smoothstep(0.28, 0.03, ring) * pow(1.0 - uRipple, 0.55);
    float core = smoothstep(0.09, 0.0, ring) * band;
    gl_FragColor = vec4(uColor, band * 0.62 + core * 0.38);
  }
`;
