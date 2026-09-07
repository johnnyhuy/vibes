import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type { World } from 'cannon-es';
import { createWorld } from '../physics';
import { PlayError } from '../types';

const WorldContext = createContext<World | null>(null);

export function useCannonWorld(): World {
  const world = useContext(WorldContext);
  if (!world) {
    throw new PlayError('no-world', 'Cannon world is missing — wrap the scene in PhysicsWorld');
  }
  return world;
}

export function PhysicsWorld({ children }: { children: ReactNode }) {
  const world = useMemo(() => createWorld(), []);

  useFrame((_, delta) => {
    world.step(1 / 60, Math.min(delta, 0.05), 4);
  }, -1);

  useEffect(() => {
    return () => {
      world.bodies.slice().forEach((body) => world.removeBody(body));
    };
  }, [world]);

  return <WorldContext.Provider value={world}>{children}</WorldContext.Provider>;
}
