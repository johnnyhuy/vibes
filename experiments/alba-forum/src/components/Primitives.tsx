import { chalk } from '../palette';

export function Stone({
  color = chalk.stone,
  roughness = 0.86,
}: {
  color?: string;
  roughness?: number;
}) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.035} />;
}

export function Column({
  height = 4.2,
  radius = 0.2,
  color = chalk.stone,
}: {
  height?: number;
  radius?: number;
  color?: string;
}) {
  return (
    <group>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[radius * 2.35, 0.16, radius * 2.35]} />
        <Stone color={chalk.ash} roughness={0.92} />
      </mesh>
      <mesh position={[0, height * 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.9, radius, height - 0.38, 10]} />
        <Stone color={color} />
      </mesh>
      <mesh position={[0, height - 0.14, 0]} castShadow>
        <cylinderGeometry args={[radius * 1.28, radius * 1.04, 0.22, 10]} />
        <Stone color={chalk.lintel} roughness={0.74} />
      </mesh>
    </group>
  );
}

export function Pier({
  width,
  height,
  depth,
  color = chalk.ash,
}: {
  width: number;
  height: number;
  depth: number;
  color?: string;
}) {
  return (
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <Stone color={color} roughness={0.88} />
    </mesh>
  );
}

export function BarrelRing({
  radius,
  tube = 0.3,
  color = chalk.lintel,
}: {
  radius: number;
  tube?: number;
  color?: string;
}) {
  return (
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
      <torusGeometry args={[radius, tube, 8, 18, Math.PI]} />
      <Stone color={color} roughness={0.78} />
    </mesh>
  );
}

export function Pediment({
  width,
  depth = 1.4,
  height = 1.15,
}: {
  width: number;
  depth?: number;
  height?: number;
}) {
  return (
    <mesh rotation={[0, Math.PI / 4, 0]} scale={[width / Math.max(depth, 0.2), 1, 1]} castShadow>
      <coneGeometry args={[depth * 0.72, height, 4]} />
      <Stone color={chalk.lintel} roughness={0.8} />
    </mesh>
  );
}

export function Steps({
  count = 4,
  width = 4.6,
  rise = 0.18,
  tread = 0.38,
}: {
  count?: number;
  width?: number;
  rise?: number;
  tread?: number;
}) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[0, rise * (i + 0.5), -i * tread]} receiveShadow castShadow>
          <boxGeometry args={[width - i * 0.12, rise, tread]} />
          <Stone color={i % 2 === 0 ? chalk.avenue : chalk.ash} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

export function Cypress({ height = 4.6 }: { height?: number }) {
  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.56, 6]} />
        <Stone color={chalk.pewter} roughness={0.9} />
      </mesh>
      <mesh position={[0, height * 0.55, 0]} castShadow>
        <coneGeometry args={[0.55, height, 7]} />
        <meshStandardMaterial color={chalk.sage} roughness={0.88} metalness={0.02} />
      </mesh>
    </group>
  );
}

export function ActiveRing({ active }: { active: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <ringGeometry args={[5.05, 5.42, 48]} />
      <meshStandardMaterial
        color={chalk.charcoal}
        roughness={0.55}
        transparent
        opacity={active ? 0.26 : 0.05}
      />
    </mesh>
  );
}
