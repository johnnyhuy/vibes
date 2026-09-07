import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  DoubleSide,
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedMesh,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { grassFragment, grassVertex } from '../grassShader';
import { DENSITY_COUNT, type DensityId, type Look, type Species } from '../presets';
import { sunPosition } from './SkyRig';

interface Props {
  species: Species;
  look: Look;
  densityId: DensityId;
  wind: number;
  height: number;
  reducedMotion: boolean;
  gust: Vector3;
}

const dummy = new Object3D();
const FIELD_RADIUS = 18;
const CLUMPS = [
  [0, 0],
  [-6.2, 4.1],
  [7.4, -3.2],
  [-3.8, -7.6],
  [5.1, 6.8],
];

function hash(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function onPath(x: number, z: number): boolean {
  const localZ = z * Math.cos(0.18) - x * Math.sin(0.18);
  return Math.abs(localZ) < 0.62 && Math.abs(x) < 11;
}

function createBladeGeometry(width: number, tipLift: number) {
  const a = new PlaneGeometry(width, 1, 1, 5);
  a.translate(0, 0.5, 0);
  const pos = a.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const y = pos.getY(i);
    pos.setX(i, pos.getX(i) * (1 - y * 0.84));
    pos.setZ(i, y * y * tipLift);
  }
  pos.needsUpdate = true;
  a.computeVertexNormals();
  const b = a.clone();
  b.rotateY(Math.PI / 2);
  const merged = mergeGeometries([a, b], false);
  a.dispose();
  b.dispose();
  return merged ?? a;
}

export default function GrassField({
  species,
  look,
  densityId,
  wind,
  height,
  reducedMotion,
  gust,
}: Props) {
  const mesh = useRef<InstancedMesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const count = DENSITY_COUNT[densityId];
  const sun = useMemo(() => sunPosition(look).normalize(), [look]);

  const geometry = useMemo(
    () => createBladeGeometry(species.width, species.tipLift),
    [species.tipLift, species.width]
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWind: { value: wind },
      uHeight: { value: height * species.height },
      uReduced: { value: reducedMotion ? 1 : 0 },
      uWindDir: { value: [0.86, 0.52] },
      uGust: { value: new Vector3() },
      uSunDir: { value: sun.clone() },
      uShift: { value: new Vector3(...look.grassShift) },
      uSunColor: { value: new Color(look.sunColor) },
      uAmbient: { value: new Color(look.ambientColor).multiplyScalar(look.ambientIntensity + 0.22) },
    }),
    // Geometry-stable uniforms; values are written each frame / layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useLayoutEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;

    const phases = new Float32Array(count);
    const tints = new Float32Array(count * 3);
    const bends = new Float32Array(count);
    const palette = species.colors.map((hex) => new Color(hex));

    let placed = 0;
    let attempt = 0;
    while (placed < count && attempt < count * 6) {
      attempt += 1;
      const u = hash(attempt * 3.17 + 0.11);
      const v = hash(attempt * 7.91 + 2.4);
      const radius = Math.sqrt(u) * FIELD_RADIUS;
      const angle = v * Math.PI * 2;
      const clump = CLUMPS[attempt % CLUMPS.length];
      const x = Math.cos(angle) * radius * 0.74 + clump[0] * 0.26;
      const z = Math.sin(angle) * radius * 0.74 + clump[1] * 0.26;
      if (x * x + z * z > FIELD_RADIUS * FIELD_RADIUS) continue;
      if (onPath(x, z) && hash(attempt * 11.3) > 0.12) continue;

      const scale = 0.72 + hash(attempt * 5.5) * 0.55;
      dummy.position.set(x, 0, z);
      dummy.rotation.set(0, hash(attempt * 9.2) * Math.PI * 2, (hash(attempt * 4.4) - 0.5) * 0.18);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      instanced.setMatrixAt(placed, dummy.matrix);

      const color = palette[Math.floor(hash(attempt * 13.7) * palette.length)];
      tints[placed * 3] = color.r;
      tints[placed * 3 + 1] = color.g;
      tints[placed * 3 + 2] = color.b;
      phases[placed] = hash(attempt * 17.1) * Math.PI * 2;
      bends[placed] = species.bend * (0.75 + hash(attempt * 2.9) * 0.5);
      placed += 1;
    }

    instanced.count = placed;
    instanced.instanceMatrix.needsUpdate = true;
    geometry.setAttribute('aPhase', new InstancedBufferAttribute(phases.subarray(0, placed), 1));
    geometry.setAttribute('aTint', new InstancedBufferAttribute(tints.subarray(0, placed * 3), 3));
    geometry.setAttribute('aBend', new InstancedBufferAttribute(bends.subarray(0, placed), 1));
    instanced.instanceMatrix.setUsage(DynamicDrawUsage);
    instanced.frustumCulled = false;
  }, [count, geometry, species]);

  useFrame((state) => {
    const mat = material.current;
    if (!mat) return;
    mat.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    mat.uniforms.uWind.value = wind;
    mat.uniforms.uHeight.value = height * species.height;
    mat.uniforms.uReduced.value = reducedMotion ? 1 : 0;
    mat.uniforms.uGust.value.copy(gust);
    mat.uniforms.uSunDir.value.copy(sun);
    mat.uniforms.uShift.value.set(...look.grassShift);
    mat.uniforms.uSunColor.value.set(look.sunColor);
    mat.uniforms.uAmbient.value.set(look.ambientColor).multiplyScalar(look.ambientIntensity + 0.22);
  });

  return (
    <instancedMesh key={`${species.id}-${densityId}`} ref={mesh} args={[geometry, undefined, count]} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={grassVertex}
        fragmentShader={grassFragment}
        uniforms={uniforms}
        side={DoubleSide}
        toneMapped
      />
    </instancedMesh>
  );
}
