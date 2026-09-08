import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { stepLoop } from '../loops';
import { stepRunner } from '../runner';
import { hazardsFor } from '../terrain';
import type { ResolvedLook } from '../look';
import type { BiomeId, InputRef, LoopRef, RunnerRef } from '../types';
import Ashmane from './Ashmane';
import FollowCamera from './FollowCamera';
import Highland from './Highland';
import SkyRig from './SkyRig';

interface Props {
  biome: BiomeId;
  runner: RunnerRef;
  input: InputRef;
  loop: LoopRef;
  look: ResolvedLook;
  reducedMotion: boolean;
}

export default function ChaseWorld({ biome, runner, input, loop, look, reducedMotion }: Props) {
  const hazards = useMemo(() => hazardsFor(biome), [biome]);

  useFrame((_, delta) => {
    if (loop.current.phase === 'caught' || loop.current.phase === 'cleared') return;
    stepRunner(runner.current, input.current, biome, delta);
    stepLoop(loop.current, runner.current, biome, hazards, delta);
  });

  return (
    <>
      <SkyRig look={look} />
      <Highland biome={biome} look={look} loop={loop} reducedMotion={reducedMotion} />
      <Ashmane runner={runner} reducedMotion={reducedMotion} />
      <FollowCamera runner={runner} reducedMotion={reducedMotion} />
    </>
  );
}
