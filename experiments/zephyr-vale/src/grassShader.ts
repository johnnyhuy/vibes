export const reedVertex = /* glsl */ `
  attribute float aPhase;
  attribute vec3 aTint;

  uniform float uTime;
  uniform float uReduced;
  uniform vec2 uWind;

  varying vec3 vColor;
  varying float vTip;

  void main() {
    vec3 pos = position;
    float tip = clamp(uv.y, 0.0, 1.0);
    vTip = tip;
    vColor = aTint;

    vec4 world = modelMatrix * instanceMatrix * vec4(pos, 1.0);
    float wave = sin(uTime * 1.15 + aPhase + world.x * 0.28 + world.z * 0.21);
    float sway = mix(1.0, 0.0, uReduced) * tip * tip * wave;
    world.xz += uWind * sway * 0.42;
    world.y -= abs(sway) * 0.08 * tip;

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const reedFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vTip;

  void main() {
    vec3 color = mix(vColor * 0.62, vColor * 1.12, vTip);
    gl_FragColor = vec4(color, 1.0);
  }
`;
