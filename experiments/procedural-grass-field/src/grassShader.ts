export const grassVertex = /* glsl */ `
  attribute float aPhase;
  attribute vec3 aTint;
  attribute float aBend;

  uniform float uTime;
  uniform float uWind;
  uniform float uHeight;
  uniform float uReduced;
  uniform vec2 uWindDir;
  uniform vec3 uGust;
  uniform vec3 uSunDir;

  varying vec3 vColor;
  varying vec3 vNormalW;
  varying vec3 vWorld;
  varying float vTip;
  varying vec3 vSunDir;

  void main() {
    vec3 pos = position;
    pos.y *= uHeight;

    vec4 world = modelMatrix * instanceMatrix * vec4(pos, 1.0);
    float tip = clamp(uv.y, 0.0, 1.0);
    float tip2 = tip * tip;

    float clock = uTime * (1.05 + aBend * 0.35) + aPhase;
    float wave = sin(clock + world.x * 0.42 + world.z * 0.31) * 0.62
      + sin(clock * 1.71 + world.z * 0.55) * 0.28;

    vec2 away = world.xz - uGust.xz;
    float dist = length(away);
    float gust = 0.0;
    if (uGust.y > 0.001 && dist > 0.02) {
      gust = uGust.y * exp(-dist * dist * 0.42);
      away /= dist;
    } else {
      away = vec2(0.0);
    }

    vec2 sway = uWindDir * wave + away * gust;
    sway *= mix(uWind, 0.0, uReduced) * tip2 * (0.46 + aBend * 0.34);
    world.xz += sway;
    world.y -= length(sway) * 0.18 * tip;

    vColor = aTint;
    vTip = tip;
    vWorld = world.xyz;
    vSunDir = uSunDir;
    vNormalW = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const grassFragment = /* glsl */ `
  uniform vec3 uShift;
  uniform vec3 uSunColor;
  uniform vec3 uAmbient;

  varying vec3 vColor;
  varying vec3 vNormalW;
  varying vec3 vWorld;
  varying float vTip;
  varying vec3 vSunDir;

  void main() {
    vec3 normal = normalize(vNormalW) * (gl_FrontFacing ? 1.0 : -1.0);
    vec3 albedo = vColor * uShift;
    albedo = mix(albedo * 0.52, albedo * 1.18, smoothstep(0.12, 1.0, vTip));

    float wrap = clamp(dot(normal, vSunDir) * 0.5 + 0.5, 0.0, 1.0);
    float sss = pow(clamp(dot(-normal, vSunDir), 0.0, 1.0), 1.35) * 0.38 * vTip;
    vec3 view = normalize(cameraPosition - vWorld);
    float rim = pow(1.0 - abs(dot(view, normal)), 2.2) * 0.16;

    vec3 color = albedo * (uAmbient + uSunColor * wrap);
    color += uSunColor * sss * albedo;
    color += vec3(0.55, 0.7, 0.35) * rim * vTip;

    gl_FragColor = vec4(color, 1.0);
  }
`;
