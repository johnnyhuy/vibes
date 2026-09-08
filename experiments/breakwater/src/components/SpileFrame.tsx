import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface Props {
  reducedMotion: boolean;
}

function hull(color = '#4a4e52') {
  return <meshStandardMaterial color={color} metalness={0.58} roughness={0.36} />;
}

function rust(color = '#6a4030') {
  return <meshStandardMaterial color={color} metalness={0.28} roughness={0.62} />;
}

export default function SpileFrame({ reducedMotion }: Props) {
  const root = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const ram = useRef<Group>(null);
  const boom = useRef<Group>(null);
  const lamps = useRef<Group>(null);

  useFrame((state) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const settle = Math.sin(t * 0.7);
    const pulse = 1 + Math.sin(t * 2.1) * 0.08;
    if (root.current) root.current.position.y = 1.49 + settle * 0.018;
    if (torso.current) {
      torso.current.rotation.z = settle * 0.012;
      torso.current.position.y = settle * 0.02;
    }
    if (leftLeg.current) leftLeg.current.rotation.x = settle * 0.03;
    if (rightLeg.current) rightLeg.current.rotation.x = -settle * 0.03;
    if (ram.current) ram.current.position.y = 0.12 + settle * 0.08;
    if (boom.current) boom.current.rotation.z = -0.42 + settle * 0.04;
    if (lamps.current) lamps.current.scale.setScalar(pulse);
  });

  return (
    <group ref={root} position={[0, 1.49, 1.7]} rotation={[0, 0.35, 0]}>
      <group ref={leftLeg} position={[-0.62, 0.9, 0.08]}>
        <mesh position={[0, -0.55, 0.08]} castShadow>
          <boxGeometry args={[0.48, 1.15, 0.42]} />
          {hull('#3e4246')}
        </mesh>
        <mesh position={[0.18, -0.2, 0.02]} rotation={[0.15, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.72, 6]} />
          {hull('#c45a32')}
        </mesh>
        <mesh position={[0, -1.18, 0.18]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.22, 0.95]} />
          <meshStandardMaterial color="#8a8478" roughness={0.88} />
        </mesh>
        {[-0.22, 0.22].map((x) => (
          <mesh key={`lg-${x}`} position={[x, -1.28, 0.42]}>
            <boxGeometry args={[0.16, 0.08, 0.28]} />
            {rust('#5a5248')}
          </mesh>
        ))}
      </group>
      <group ref={rightLeg} position={[0.62, 0.9, 0.08]}>
        <mesh position={[0, -0.55, 0.08]} castShadow>
          <boxGeometry args={[0.48, 1.15, 0.42]} />
          {hull('#43474b')}
        </mesh>
        <mesh position={[-0.18, -0.2, 0.02]} rotation={[0.15, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.72, 6]} />
          {hull('#c45a32')}
        </mesh>
        <mesh position={[0, -1.18, 0.18]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.22, 0.95]} />
          <meshStandardMaterial color="#8a8478" roughness={0.88} />
        </mesh>
        {[-0.22, 0.22].map((x) => (
          <mesh key={`rg-${x}`} position={[x, -1.28, 0.42]}>
            <boxGeometry args={[0.16, 0.08, 0.28]} />
            {rust('#5a5248')}
          </mesh>
        ))}
      </group>

      <group ref={torso} position={[0, 1.55, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[1.55, 0.55, 1.05]} />
          {hull('#3a3e42')}
        </mesh>
        <mesh position={[0, 0.55, 0.04]} castShadow>
          <boxGeometry args={[1.28, 0.95, 0.92]} />
          {hull()}
        </mesh>
        <mesh position={[0, 1.18, 0.08]} castShadow>
          <boxGeometry args={[0.95, 0.42, 0.78]} />
          {hull('#52565a')}
        </mesh>
        {[-0.42, 0, 0.42].map((x) => (
          <mesh key={`rivet-${x}`} position={[x, 0.2, 0.48]}>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 6]} />
            {hull('#c8a070')}
          </mesh>
        ))}
        <mesh position={[0, 0.52, 0.5]}>
          <boxGeometry args={[0.55, 0.28, 0.04]} />
          <meshStandardMaterial color="#1a2228" roughness={0.25} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.52, 0.53]}>
          <boxGeometry args={[0.42, 0.08, 0.02]} />
          <meshStandardMaterial color="#ffb070" emissive="#ff8a3a" emissiveIntensity={1.2} />
        </mesh>
        {[-0.38, 0.38].map((x) => (
          <mesh key={`stack-${x}`} position={[x, 1.55, -0.12]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.7, 8]} />
            {rust('#4a3228')}
          </mesh>
        ))}
        <mesh position={[0, 0.08, -0.58]} castShadow>
          <boxGeometry args={[1.05, 0.7, 0.22]} />
          {rust()}
        </mesh>
        <mesh position={[-0.72, 0.85, 0]} rotation={[0, 0, 0.15]} castShadow>
          <boxGeometry args={[0.28, 0.22, 0.55]} />
          {hull('#3e4246')}
        </mesh>
        <mesh position={[0.78, 0.82, 0.05]} castShadow>
          <boxGeometry args={[0.42, 0.38, 0.42]} />
          {hull('#3a3e42')}
        </mesh>

        <group ref={boom} position={[-0.82, 0.95, 0.08]} rotation={[0, 0.15, -0.42]}>
          <mesh position={[-0.85, 0, 0]} castShadow>
            <boxGeometry args={[1.7, 0.16, 0.16]} />
            {hull('#c45a32')}
          </mesh>
          <mesh position={[-1.72, -0.35, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.7, 6]} />
            {hull('#c8ccd0')}
          </mesh>
          <mesh position={[-1.72, -0.72, 0]}>
            <torusGeometry args={[0.1, 0.025, 6, 10]} />
            {hull('#d8a040')}
          </mesh>
        </group>

        <group position={[0.82, 0.95, 0.18]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.32, 0.85, 0.32]} />
            {hull('#3e4248')}
          </mesh>
          <group ref={ram} position={[0, 0.12, 0]}>
            <mesh position={[0, 0.85, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.1, 1.15, 8]} />
              {hull('#c45a32')}
            </mesh>
            <mesh position={[0, 1.48, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.18, 0.22, 8]} />
              {rust('#5a4030')}
            </mesh>
          </group>
        </group>

        <group position={[0, 1.55, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.62, 0.38, 0.52]} />
            {hull('#2e3236')}
          </mesh>
          <mesh position={[0, 0.06, 0.28]}>
            <boxGeometry args={[0.48, 0.12, 0.04]} />
            <meshStandardMaterial color="#0e1418" roughness={0.2} />
          </mesh>
          <group ref={lamps} position={[0, 0.22, 0.18]}>
            {[-0.16, 0.16].map((x) => (
              <mesh key={`lamp-${x}`} position={[x, 0.12, 0.08]}>
                <sphereGeometry args={[0.07, 8, 6]} />
                <meshStandardMaterial color="#ffb070" emissive="#ff8a3a" emissiveIntensity={1.8} />
              </mesh>
            ))}
          </group>
          <pointLight position={[0, 0.2, 0.35]} color="#ffb070" intensity={1.35} distance={7} />
        </group>
      </group>
    </group>
  );
}
