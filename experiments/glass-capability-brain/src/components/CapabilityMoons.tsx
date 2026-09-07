import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { CAPABILITIES, type Capability, type CapabilityId } from '../capabilities';
import { buildOrbitCurve, orbitPoint } from '../orbit';

interface Props {
  selectedId: CapabilityId | null;
  hoveredId: CapabilityId | null;
  reducedMotion: boolean;
  onSelect: (id: CapabilityId) => void;
  onHover: (id: CapabilityId | null) => void;
}

function OrbitRibbon({ node }: { node: Capability }) {
  const geometry = useMemo(() => {
    const curve = buildOrbitCurve(node);
    return new THREE.TubeGeometry(curve, 160, node.inner ? 0.006 : 0.01, 6, true);
  }, [node]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={node.color} transparent opacity={node.inner ? 0.28 : 0.55} />
    </mesh>
  );
}

function Moon({
  node,
  selected,
  hovered,
  reducedMotion,
  onSelect,
  onHover,
}: {
  node: Capability;
  selected: boolean;
  hovered: boolean;
  reducedMotion: boolean;
  onSelect: (id: CapabilityId) => void;
  onHover: (id: CapabilityId | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  useCursor(hovered);

  useFrame((state) => {
    if (!group.current) return;
    orbitPoint(node, state.clock.elapsedTime, reducedMotion, group.current.position);
    if (halo.current) {
      const pulse = selected || reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.06;
      halo.current.scale.setScalar(pulse);
    }
  });

  const showLabel = node.alwaysLabel || selected || hovered;
  const blob = node.inner;

  return (
    <group ref={group}>
      {blob ? (
        <>
          <mesh
            onClick={(event) => {
              event.stopPropagation();
              onSelect(node.id);
            }}
            onPointerOver={(event) => {
              event.stopPropagation();
              onHover(node.id);
            }}
            onPointerOut={() => onHover(null)}
          >
            <icosahedronGeometry args={[0.22, 2]} />
            <meshPhysicalMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.7}
              roughness={0.38}
              metalness={0.05}
            />
          </mesh>
          <mesh position={[0.1, 0.05, -0.04]} scale={0.62}>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshPhysicalMaterial
              color="#fb923c"
              emissive="#ea580c"
              emissiveIntensity={0.45}
              roughness={0.42}
            />
          </mesh>
        </>
      ) : (
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            onSelect(node.id);
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            onHover(node.id);
          }}
          onPointerOut={() => onHover(null)}
        >
          <sphereGeometry args={[node.size, 32, 32]} />
          <meshPhysicalMaterial
            color={node.color}
            roughness={0.22}
            metalness={0.12}
            emissive={node.color}
            emissiveIntensity={selected ? 0.35 : 0.12}
          />
        </mesh>
      )}

      <mesh ref={halo} scale={selected ? 1 : 0.92}>
        <sphereGeometry args={[blob ? 0.42 : node.size * 2.15, 24, 24]} />
        <meshBasicMaterial
          color={node.color}
          transparent
          opacity={selected || hovered ? 0.22 : 0.1}
          depthWrite={false}
        />
      </mesh>

      {showLabel && (
        <Html center distanceFactor={7} style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
          <div className="node-label">
            <span className="node-dot" style={{ background: node.color }} />
            {node.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function CapabilityMoons({
  selectedId,
  hoveredId,
  reducedMotion,
  onSelect,
  onHover,
}: Props) {
  return (
    <group>
      {CAPABILITIES.map((node) => (
        <OrbitRibbon key={`${node.id}-path`} node={node} />
      ))}
      {CAPABILITIES.map((node) => (
        <Moon
          key={node.id}
          node={node}
          selected={selectedId === node.id}
          hovered={hoveredId === node.id}
          reducedMotion={reducedMotion}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </group>
  );
}
