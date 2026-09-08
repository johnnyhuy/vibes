export const foilVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = cameraPosition - world.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const foilFragment = /* glsl */ `
  uniform sampler2D tMap;
  uniform sampler2D tMask;
  uniform float uIntensity;
  uniform float uTime;
  uniform float uPrint;
  uniform vec2 uTilt;
  uniform vec3 uTint;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec4 base = texture2D(tMap, vUv);
    float mask = texture2D(tMask, vUv).r;
    if (base.a < 0.012 && mask < 0.02) discard;

    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndv, 2.05);

    float phase =
      vUv.x * 3.4 +
      vUv.y * 1.28 +
      V.x * 1.65 +
      V.y * 1.12 +
      uTilt.x * 0.5 +
      uTilt.y * 0.66;
    vec3 rainbow = 0.5 + 0.5 * cos(6.28318 * (phase + vec3(0.0, 0.33, 0.67)));
    rainbow = mix(rainbow, uTint, 0.16);

    float grain = hash21(vUv * 170.0 + V.xy * 8.0 + uTime * 0.03);
    float spark = smoothstep(0.968, 0.994, grain) * (0.4 + mask);

    vec3 foil = rainbow * fresnel * (0.22 + mask * 1.05);
    foil += spark * rainbow * 0.85;
    foil *= uIntensity;

    vec3 color = mix(foil, base.rgb + foil * 0.85, uPrint);
    float alpha = mix((0.16 + mask * 0.7) * fresnel * uIntensity, base.a, uPrint);
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

export const FOIL_TINT = new Color('#9fd4e6');
export const FOIL_TILT = new Vector2();
