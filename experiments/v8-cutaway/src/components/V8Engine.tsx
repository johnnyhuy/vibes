import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface V8EngineProps {
  engineSpeed: number;
  setRpm: (rpm: number) => void;
  setStrokeCycle: (cycle: string) => void;
  setPressure: (pressure: string) => void;
  setFiringIndex: (index: number) => void;
}

export default function V8Engine({
  engineSpeed,
  setRpm,
  setStrokeCycle,
  setPressure,
  setFiringIndex,
}: V8EngineProps) {
  const crankshaftRef = useRef<THREE.Mesh>(null);
  const pistonsLeftRef = useRef<THREE.Group>(null);
  const pistonsRightRef = useRef<THREE.Group>(null);
  const crankRotation = useRef(0);

  const vAngle = Math.PI / 2;

  const firingOrder = [0, 7, 3, 2, 5, 4, 6, 1];

  const pistonPhases = useMemo(() => {
    return firingOrder.map((_, i) => (firingOrder[i] * Math.PI / 4));
  }, []);

  useFrame((state, delta) => {
    crankRotation.current += delta * engineSpeed * 2;

    const rpm = engineSpeed === 0 ? 0 : Math.floor(engineSpeed * 200 + 300);
    setRpm(rpm);

    const cycle = Math.floor((crankRotation.current / (Math.PI * 2)) % 4);
    const cycles = ['INTAKE', 'COMPRESSION', 'POWER', 'EXHAUST'];
    setStrokeCycle(cycles[cycle]);
    setFiringIndex(Math.floor((crankRotation.current / (Math.PI / 4)) % 8));

    const pressure = (1.5 + Math.sin(crankRotation.current) * 0.5).toFixed(1);
    setPressure(pressure);

    if (crankshaftRef.current) {
      crankshaftRef.current.rotation.z = crankRotation.current;
    }

    if (pistonsLeftRef.current) {
      pistonsLeftRef.current.children.forEach((piston, i) => {
        const phase = pistonPhases[i];
        const offset = Math.sin(crankRotation.current + phase) * 0.8;
        piston.position.y = offset;
      });
    }

    if (pistonsRightRef.current) {
      pistonsRightRef.current.children.forEach((piston, i) => {
        const phase = pistonPhases[i];
        const offset = Math.sin(crankRotation.current + phase) * 0.8;
        piston.position.y = offset;
      });
    }
  });

  const blockMaterial = new THREE.MeshStandardMaterial({
    color: '#16181c',
    metalness: 0.42,
    roughness: 0.55,
  });

  const crankMaterial = new THREE.MeshStandardMaterial({
    color: '#d4d7dc',
    metalness: 0.92,
    roughness: 0.16,
  });

  const pistonMaterial = new THREE.MeshStandardMaterial({
    color: '#4d6f93',
    metalness: 0.55,
    roughness: 0.28,
  });

  const valveMaterial = new THREE.MeshStandardMaterial({
    color: '#8b5cf6',
    metalness: 0.78,
    roughness: 0.22,
  });

  return (
    <group>
      <mesh position={[0, 0, 0]} material={blockMaterial}>
        <boxGeometry args={[8, 3, 4]} />
      </mesh>

      <group position={[0, 1.5, 1]} rotation={[0, 0, -vAngle / 2]}>
        <mesh material={blockMaterial}>
          <boxGeometry args={[8, 1.5, 1]} />
        </mesh>
      </group>

      <group position={[0, 1.5, -1]} rotation={[0, 0, vAngle / 2]}>
        <mesh material={blockMaterial}>
          <boxGeometry args={[8, 1.5, 1]} />
        </mesh>
      </group>

      <mesh ref={crankshaftRef} position={[0, -1.5, 0]} rotation={[0, 0, Math.PI / 2]} material={crankMaterial}>
        <cylinderGeometry args={[0.3, 0.3, 9, 16]} />
      </mesh>

      <group ref={pistonsLeftRef} position={[0, 0, 1.5]} rotation={[0, 0, -vAngle / 2]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-3 + i * 2, 0, 0]} material={pistonMaterial}>
            <cylinderGeometry args={[0.4, 0.4, 1.5, 16]} />
          </mesh>
        ))}
      </group>

      <group ref={pistonsRightRef} position={[0, 0, -1.5]} rotation={[0, 0, vAngle / 2]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-3 + i * 2, 0, 0]} material={pistonMaterial}>
            <cylinderGeometry args={[0.4, 0.4, 1.5, 16]} />
          </mesh>
        ))}
      </group>

      <group position={[0, 3, 1.5]} rotation={[0, 0, -vAngle / 2]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[-3 + i * 2, 0, 0]}>
            <mesh position={[-0.3, 0, 0]} material={valveMaterial}>
              <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            </mesh>
            <mesh position={[0.3, 0, 0]} material={valveMaterial}>
              <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            </mesh>
          </group>
        ))}
      </group>

      <group position={[0, 3, -1.5]} rotation={[0, 0, vAngle / 2]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[-3 + i * 2, 0, 0]}>
            <mesh position={[-0.3, 0, 0]} material={valveMaterial}>
              <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            </mesh>
            <mesh position={[0.3, 0, 0]} material={valveMaterial}>
              <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
