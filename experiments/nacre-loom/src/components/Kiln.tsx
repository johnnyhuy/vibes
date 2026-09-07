import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { RECIPES, type LoomState, type StageId, loomFromRecipe } from '../recipes';
import NacreVessel from './NacreVessel';

interface Props {
  loom: LoomState;
  stage: StageId;
  reducedMotion: boolean;
}

export default function Kiln({ loom, stage, reducedMotion }: Props) {
  const satellites = stage === 'kiln';

  return (
    <>
      <color attach="background" args={['#07060a']} />
      <fog attach="fog" args={['#07060a', 7, 16]} />
      <ambientLight intensity={0.14} />
      <spotLight
        position={[2.6, 4.4, 3.1]}
        angle={0.4}
        penumbra={0.72}
        intensity={34}
        color="#fff4e8"
        castShadow
        shadow-mapSize={1024}
      />
      <spotLight position={[-3.4, 2.2, -1.8]} angle={0.52} penumbra={0.8} intensity={9} color="#8eb4d4" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]} receiveShadow>
        <circleGeometry args={[3.6, 64]} />
        <meshStandardMaterial color="#0c0b10" roughness={0.94} metalness={0.06} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.168, 0]} receiveShadow>
        <ringGeometry args={[0.78, 1.22, 72]} />
        <meshPhysicalMaterial color="#1c1a22" roughness={0.18} metalness={0.62} clearcoat={0.7} />
      </mesh>

      <NacreVessel loom={loom} reducedMotion={reducedMotion} position={[0, 0.06, 0]} />

      {satellites
        ? RECIPES.filter((recipe) => recipe.id !== loom.recipeId).map((recipe, index) => {
            const angle = (index / 5) * Math.PI * 2 - 0.4;
            return (
              <NacreVessel
                key={recipe.id}
                loom={loomFromRecipe(recipe)}
                reducedMotion={reducedMotion}
                scale={0.28}
                position={[Math.cos(angle) * 2.15, -0.42, Math.sin(angle) * 2.15]}
              />
            );
          })
        : null}

      <ContactShadows position={[0, -1.16, 0]} opacity={0.5} scale={9} blur={2.8} far={4} />

      <Environment resolution={256} frames={1} environmentIntensity={0.7}>
        <Lightformer intensity={12} position={[0, 3.9, 1.6]} scale={[9.2, 0.3, 1]} />
        <Lightformer intensity={5.4} position={[0, -2.4, 1.1]} scale={[7.4, 0.2, 1]} />
        <Lightformer intensity={4.6} position={[3.5, 1.2, 2.1]} scale={[0.55, 4.4, 1]} />
        <Lightformer intensity={2.6} position={[-3.1, 1.7, -2]} scale={[2.4, 2.4, 1]} color="#9fd4d0" />
      </Environment>
    </>
  );
}
