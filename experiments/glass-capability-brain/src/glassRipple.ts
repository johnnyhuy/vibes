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
       float rippleEnv = exp(-rippleRing * rippleRing * 15.0) * rippleAlive;
       float rippleWave = sin(rippleRing * 22.0) * rippleEnv;
       transformed += objectNormal * rippleWave * 0.075;
       vRipple = rippleWave;`,
    );

  shader.fragmentShader = `
    varying float vRipple;
  ${shader.fragmentShader}`.replace(
    '#include <normal_fragment_begin>',
    `#include <normal_fragment_begin>
     normal = normalize(normal + vec3(vRipple * 0.42, vRipple * 0.18, 0.0));`,
  );
}
