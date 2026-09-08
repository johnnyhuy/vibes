import { useLayoutEffect, useMemo } from 'react';
import { LatheGeometry, Vector2 } from 'three';
import { ARM_COUNT, ARM_RADIUS, PLATE_RADIUS, armAngle, hexPlateGeometry, petalGeometry } from '../geometry';
import { TONE } from '../palette';

function useHexPlate(radius: number, depth: number) {
  const geometry = useMemo(() => hexPlateGeometry(radius, depth), [depth, radius]);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

function usePetals() {
  const geometry = useMemo(() => petalGeometry(), []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

function useBell() {
  const geometry = useMemo(() => {
    const pts = [
      new Vector2(0, 0),
      new Vector2(0.028, 0),
      new Vector2(0.034, 0.008),
      new Vector2(0.038, 0.028),
      new Vector2(0.032, 0.046),
      new Vector2(0.018, 0.052),
      new Vector2(0.012, 0.058),
    ];
    return new LatheGeometry(pts, 24);
  }, []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

export function SpoolPlate({ highlight }: { highlight: boolean }) {
  const plate = useHexPlate(PLATE_RADIUS, 0.016);
  const well = useHexPlate(0.11, 0.006);
  const emissive = highlight ? TONE.teal : '#000000';
  const emit = highlight ? 0.12 : 0;

  return (
    <group>
      <mesh geometry={plate} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={TONE.graphite}
          roughness={0.42}
          metalness={0.58}
          clearcoat={0.18}
          clearcoatRoughness={0.4}
          emissive={emissive}
          emissiveIntensity={emit}
        />
      </mesh>
      <mesh geometry={well} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.094, 0]} receiveShadow>
        <meshPhysicalMaterial color={TONE.carbon} roughness={0.5} metalness={0.4} />
      </mesh>
      {Array.from({ length: ARM_COUNT }, (_, i) => {
        const angle = armAngle(i);
        const r = 0.132;
        return (
          <mesh
            key={`stand-${i}`}
            position={[Math.cos(angle) * r, 0.102, Math.sin(angle) * r]}
            castShadow
          >
            <cylinderGeometry args={[0.008, 0.009, 0.018, 12]} />
            <meshPhysicalMaterial color={TONE.steel} roughness={0.32} metalness={0.78} />
          </mesh>
        );
      })}
      {Array.from({ length: ARM_COUNT }, (_, i) => {
        const angle = armAngle(i);
        const r = 0.168;
        return (
          <mesh
            key={`pocket-${i}`}
            position={[Math.cos(angle) * r, 0.09, Math.sin(angle) * r]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.012, 0.012, 0.008, 16]} />
            <meshPhysicalMaterial color={TONE.ink} roughness={0.6} metalness={0.2} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.097, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
        <ringGeometry args={[0.042, 0.05, 6]} />
        <meshPhysicalMaterial color={TONE.teal} roughness={0.35} metalness={0.45} />
      </mesh>
    </group>
  );
}

export function KeelSpars({ highlight }: { highlight: boolean }) {
  return (
    <group>
      {Array.from({ length: ARM_COUNT }, (_, i) => {
        const angle = armAngle(i);
        const mid = ARM_RADIUS * 0.52;
        return (
          <group key={`spar-${i}`} rotation={[0, -angle, 0]} position={[Math.cos(angle) * mid, 0.086, Math.sin(angle) * mid]}>
            <mesh position={[0.02, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.22, 0.014, 0.032]} />
              <meshPhysicalMaterial
                color={TONE.carbon}
                roughness={0.34}
                metalness={0.72}
                emissive={highlight ? TONE.teal : '#000'}
                emissiveIntensity={highlight ? 0.1 : 0}
              />
            </mesh>
            <mesh position={[0.02, 0.009, 0]}>
              <boxGeometry args={[0.2, 0.004, 0.012]} />
              <meshPhysicalMaterial color={TONE.teal} roughness={0.4} metalness={0.35} />
            </mesh>
            <mesh position={[0.118, 0, 0]} castShadow>
              <cylinderGeometry args={[0.018, 0.018, 0.01, 16]} />
              <meshPhysicalMaterial color={TONE.steel} roughness={0.3} metalness={0.8} />
            </mesh>
            {[-0.05, 0.02, 0.08].map((x) => (
              <mesh key={x} position={[x, 0.01, 0.014]}>
                <boxGeometry args={[0.012, 0.006, 0.006]} />
                <meshPhysicalMaterial color={TONE.graphite} roughness={0.45} metalness={0.5} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

export function RotorCups({ highlight }: { highlight: boolean }) {
  const bell = useBell();

  return (
    <group>
      {Array.from({ length: ARM_COUNT }, (_, i) => {
        const angle = armAngle(i);
        const [x, , z] = [Math.cos(angle) * ARM_RADIUS, 0, Math.sin(angle) * ARM_RADIUS];
        return (
          <group key={`cup-${i}`} position={[x, 0.086, z]}>
            <mesh geometry={bell} rotation={[Math.PI, 0, 0]} castShadow>
              <meshPhysicalMaterial
                color={TONE.graphite}
                roughness={0.28}
                metalness={0.82}
                emissive={highlight ? TONE.copper : '#000'}
                emissiveIntensity={highlight ? 0.14 : 0}
              />
            </mesh>
            {Array.from({ length: 8 }, (_, fin) => (
              <mesh key={fin} rotation={[0, (fin / 8) * Math.PI * 2, 0]} position={[0, 0.012, 0]} castShadow>
                <boxGeometry args={[0.006, 0.022, 0.072]} />
                <meshPhysicalMaterial color={TONE.carbon} roughness={0.38} metalness={0.7} />
              </mesh>
            ))}
            <mesh position={[0, 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.007, 0.007, 0.028, 12]} />
              <meshPhysicalMaterial color={TONE.steel} roughness={0.22} metalness={0.88} />
            </mesh>
            <mesh position={[0, -0.008, 0]}>
              <cylinderGeometry args={[0.016, 0.016, 0.006, 16]} />
              <meshPhysicalMaterial color={TONE.copper} roughness={0.4} metalness={0.65} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function NestBoard({ highlight }: { highlight: boolean }) {
  const board = useHexPlate(0.118, 0.006);

  return (
    <group position={[0, 0.118, 0]}>
      <mesh geometry={board} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={TONE.celadon}
          roughness={0.52}
          metalness={0.08}
          sheen={0.4}
          sheenColor="#8fbfa4"
          emissive={highlight ? TONE.celadon : '#000'}
          emissiveIntensity={highlight ? 0.16 : 0}
        />
      </mesh>
      {[
        [0, 0.01, 0, 0.042, 0.012, 0.03],
        [-0.038, 0.008, 0.02, 0.02, 0.008, 0.016],
        [0.04, 0.008, -0.016, 0.018, 0.008, 0.014],
        [0.02, 0.007, 0.042, 0.016, 0.006, 0.012],
        [-0.028, 0.007, -0.038, 0.014, 0.006, 0.012],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`chip-${i}`} position={[x, y, z]} castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshPhysicalMaterial color={TONE.chip} roughness={0.45} metalness={0.25} />
        </mesh>
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={`hdr-${i}`} position={[-0.062 + i * 0.012, 0.008, -0.062]}>
          <boxGeometry args={[0.006, 0.01, 0.006]} />
          <meshPhysicalMaterial color={TONE.steel} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      {Array.from({ length: ARM_COUNT }, (_, i) => {
        const angle = armAngle(i);
        return (
          <mesh
            key={`pad-${i}`}
            position={[Math.cos(angle) * 0.092, 0.005, Math.sin(angle) * 0.092]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.007, 16]} />
            <meshPhysicalMaterial color={TONE.pad} roughness={0.28} metalness={0.85} />
          </mesh>
        );
      })}
      <mesh position={[0.0, 0.007, 0.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.016, 0.02, 24]} />
        <meshPhysicalMaterial color={TONE.pad} roughness={0.35} metalness={0.6} />
      </mesh>
    </group>
  );
}

export function LoomTraces({ highlight }: { highlight: boolean }) {
  return (
    <group>
      {Array.from({ length: ARM_COUNT }, (_, i) => {
        const angle = armAngle(i);
        const x = Math.cos(angle);
        const z = Math.sin(angle);
        return (
          <group key={`loom-${i}`}>
            <mesh
              position={[x * 0.28, 0.108, z * 0.28]}
              rotation={[0, -angle, 0.08]}
              castShadow
            >
              <boxGeometry args={[0.34, 0.004, 0.01]} />
              <meshPhysicalMaterial
                color={highlight ? TONE.copper : TONE.teal}
                roughness={0.45}
                metalness={0.25}
              />
            </mesh>
            <mesh position={[x * 0.12, 0.112, z * 0.12]}>
              <boxGeometry args={[0.016, 0.008, 0.016]} />
              <meshPhysicalMaterial color={TONE.graphite} roughness={0.5} metalness={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function SpoolCell({ highlight }: { highlight: boolean }) {
  return (
    <group position={[0, 0.148, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.14, 0.036, 0.086]} />
        <meshPhysicalMaterial
          color={TONE.pewter}
          roughness={0.38}
          metalness={0.62}
          emissive={highlight ? TONE.teal : '#000'}
          emissiveIntensity={highlight ? 0.12 : 0}
        />
      </mesh>
      {[-0.048, -0.016, 0.016, 0.048].map((x) => (
        <mesh key={x} position={[x, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.01, 16]} />
          <meshPhysicalMaterial color={TONE.cell} roughness={0.32} metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[-0.052, 0.01, 0.038]}>
        <cylinderGeometry args={[0.006, 0.006, 0.012, 12]} />
        <meshPhysicalMaterial color={TONE.brass} roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-0.036, 0.01, 0.038]}>
        <cylinderGeometry args={[0.006, 0.006, 0.012, 12]} />
        <meshPhysicalMaterial color={TONE.steel} roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.04, 0.019, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.01, 0.014, 6]} />
        <meshPhysicalMaterial color={TONE.teal} roughness={0.4} metalness={0.4} />
      </mesh>
    </group>
  );
}

export function BindStraps({ highlight }: { highlight: boolean }) {
  return (
    <group>
      {[-0.028, 0.028].map((z) => (
        <mesh key={z} position={[0, 0.168, z]} castShadow>
          <boxGeometry args={[0.156, 0.01, 0.016]} />
          <meshPhysicalMaterial
            color={TONE.teal}
            roughness={0.48}
            metalness={0.12}
            emissive={highlight ? TONE.teal : '#000'}
            emissiveIntensity={highlight ? 0.2 : 0}
          />
        </mesh>
      ))}
      {[-0.07, 0.07].map((x) =>
        [-0.028, 0.028].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.15, z]}>
            <boxGeometry args={[0.01, 0.028, 0.016]} />
            <meshPhysicalMaterial color={TONE.teal} roughness={0.48} metalness={0.12} />
          </mesh>
        ))
      )}
    </group>
  );
}

export function PetalRotors({ highlight }: { highlight: boolean }) {
  const petal = usePetals();

  return (
    <group>
      {Array.from({ length: ARM_COUNT }, (_, i) => {
        const angle = armAngle(i);
        const x = Math.cos(angle) * ARM_RADIUS;
        const z = Math.sin(angle) * ARM_RADIUS;
        return (
          <group key={`rotor-${i}`} position={[x, 0.128, z]} rotation={[0, angle + Math.PI / 2, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.016, 0.016, 0.01, 16]} />
              <meshPhysicalMaterial color={TONE.graphite} roughness={0.35} metalness={0.7} />
            </mesh>
            {[0, Math.PI].map((spin) => (
              <mesh
                key={spin}
                geometry={petal}
                rotation={[-Math.PI / 2, 0, spin]}
                position={[0, 0.004, 0]}
                castShadow
              >
                <meshPhysicalMaterial
                  color={TONE.copper}
                  roughness={0.36}
                  metalness={0.22}
                  clearcoat={0.35}
                  emissive={highlight ? TONE.copper : '#000'}
                  emissiveIntensity={highlight ? 0.18 : 0}
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

export function SkidFeet({ highlight }: { highlight: boolean }) {
  return (
    <group>
      {[0, 3].map((i) => {
        const angle = armAngle(i);
        const x = Math.cos(angle) * 0.34;
        const z = Math.sin(angle) * 0.34;
        return (
          <group key={`skid-${i}`} position={[x, 0.03, z]} rotation={[0, -angle, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <torusGeometry args={[0.042, 0.007, 10, 22, Math.PI]} />
              <meshPhysicalMaterial
                color={TONE.graphite}
                roughness={0.4}
                metalness={0.55}
                emissive={highlight ? TONE.teal : '#000'}
                emissiveIntensity={highlight ? 0.12 : 0}
              />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.04, 10]} />
              <meshPhysicalMaterial color={TONE.carbon} roughness={0.4} metalness={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function BindPin({ highlight }: { highlight: boolean }) {
  const angle = armAngle(5);
  const x = Math.cos(angle) * 0.12;
  const z = Math.sin(angle) * 0.12;

  return (
    <group position={[x, 0.2, z]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.004, 0.004, 0.12, 10]} />
        <meshPhysicalMaterial
          color={TONE.steel}
          roughness={0.25}
          metalness={0.86}
          emissive={highlight ? TONE.brass : '#000'}
          emissiveIntensity={highlight ? 0.16 : 0}
        />
      </mesh>
      <mesh position={[0, 0.07, 0]} castShadow>
        <sphereGeometry args={[0.01, 16, 12]} />
        <meshPhysicalMaterial color={TONE.brass} roughness={0.28} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.008, 12]} />
        <meshPhysicalMaterial color={TONE.graphite} roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}

export function CanopySpine({ highlight }: { highlight: boolean }) {
  const canopy = useMemo(() => {
    const pts = [
      new Vector2(0, 0),
      new Vector2(0.07, 0.004),
      new Vector2(0.078, 0.02),
      new Vector2(0.05, 0.036),
      new Vector2(0.02, 0.04),
      new Vector2(0, 0.038),
    ];
    return new LatheGeometry(pts, 24);
  }, []);
  useLayoutEffect(() => () => canopy.dispose(), [canopy]);

  return (
    <group position={[0, 0.168, -0.01]}>
      <mesh geometry={canopy} rotation={[0, 0, 0]} castShadow>
        <meshPhysicalMaterial
          color={TONE.graphite}
          roughness={0.3}
          metalness={0.55}
          clearcoat={0.4}
          transmission={0.08}
          thickness={0.2}
          emissive={highlight ? TONE.teal : '#000'}
          emissiveIntensity={highlight ? 0.1 : 0}
        />
      </mesh>
      <mesh position={[-0.04, 0.03, -0.02]} rotation={[0.4, 0.3, 0]}>
        <boxGeometry args={[0.036, 0.004, 0.01]} />
        <meshPhysicalMaterial color={TONE.ink} roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}
