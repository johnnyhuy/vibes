import { MOTION, STEPS } from '../catalog';
import type { Toggles, ViewMode } from '../types';
import Arrive from './Arrive';
import Callout from './Callout';
import {
  BindPin,
  BindStraps,
  CanopySpine,
  KeelSpars,
  LoomTraces,
  NestBoard,
  PetalRotors,
  RotorCups,
  SightBead,
  SkidFeet,
  SpoolCell,
  SpoolPlate,
  TideVane,
} from './parts';

interface Props {
  step: number;
  mode: ViewMode;
  explode: number;
  playing: boolean;
  toggles: Toggles;
  reducedMotion: boolean;
}

export default function Trainer({ step, mode, explode, playing, toggles, reducedMotion }: Props) {
  const mark = (id: number) => playing && step === id;
  const explodeAmount = !playing && mode === 'exploded' ? explode : 0;
  const insideAmount = !playing && mode === 'inside' ? 1 : 0;
  const current = playing ? step : STEPS.length;

  return (
    <group>
      <Arrive
        step={1}
        current={current}
        from={MOTION.plate.from}
        explode={MOTION.plate.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.plate.inside}
        insideAmount={insideAmount}
        highlight={mark(1)}
        reducedMotion={reducedMotion}
      >
        <SpoolPlate highlight={mark(1)} />
      </Arrive>
      <Arrive
        step={2}
        current={current}
        from={MOTION.spars.from}
        explode={MOTION.spars.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.spars.inside}
        insideAmount={insideAmount}
        highlight={mark(2)}
        reducedMotion={reducedMotion}
      >
        <KeelSpars highlight={mark(2)} />
        {toggles.labels && <Callout text="Keel spar" tip={[0.16, 0.1, 0.12]} end={[0.42, 0.22, 0.28]} />}
      </Arrive>
      <Arrive
        step={3}
        current={current}
        from={MOTION.cups.from}
        explode={MOTION.cups.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.cups.inside}
        insideAmount={insideAmount}
        highlight={mark(3)}
        reducedMotion={reducedMotion}
      >
        <RotorCups highlight={mark(3)} />
        {toggles.labels && <Callout text="Rotor cup" tip={[0.48, 0.1, 0.08]} end={[0.72, 0.28, 0.22]} />}
      </Arrive>
      <Arrive
        step={4}
        current={current}
        from={MOTION.nest.from}
        explode={MOTION.nest.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.nest.inside}
        insideAmount={insideAmount}
        highlight={mark(4)}
        reducedMotion={reducedMotion}
      >
        <NestBoard highlight={mark(4)} />
        {toggles.labels && <Callout text="Nest Board" tip={[0.04, 0.14, 0.04]} end={[-0.42, 0.32, 0.22]} />}
      </Arrive>
      <Arrive
        step={5}
        current={current}
        from={MOTION.loom.from}
        explode={MOTION.loom.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.loom.inside}
        insideAmount={insideAmount}
        shown={toggles.loom}
        highlight={mark(5)}
        reducedMotion={reducedMotion}
      >
        <LoomTraces highlight={mark(5)} />
        {toggles.labels && <Callout text="Loom" tip={[0.2, 0.12, -0.16]} end={[0.5, 0.26, -0.32]} />}
      </Arrive>
      <Arrive
        step={6}
        current={current}
        from={MOTION.cell.from}
        explode={MOTION.cell.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.cell.inside}
        insideAmount={insideAmount}
        highlight={mark(6)}
        reducedMotion={reducedMotion}
      >
        <SpoolCell highlight={mark(6)} />
        {toggles.labels && <Callout text="Spool Cell" tip={[0, 0.18, 0]} end={[-0.28, 0.42, -0.18]} />}
      </Arrive>
      <Arrive
        step={7}
        current={current}
        from={MOTION.straps.from}
        explode={MOTION.straps.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.straps.inside}
        insideAmount={insideAmount}
        highlight={mark(7)}
        reducedMotion={reducedMotion}
      >
        <BindStraps highlight={mark(7)} />
      </Arrive>
      <Arrive
        step={8}
        current={current}
        from={MOTION.petals.from}
        explode={MOTION.petals.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.petals.inside}
        insideAmount={insideAmount}
        shown={toggles.petals}
        highlight={mark(8)}
        reducedMotion={reducedMotion}
      >
        <PetalRotors highlight={mark(8)} spin={toggles.petals && !reducedMotion && !playing} />
        {toggles.labels && <Callout text="Petal" tip={[0.5, 0.16, -0.08]} end={[0.78, 0.36, -0.18]} />}
      </Arrive>
      <Arrive
        step={9}
        current={current}
        from={MOTION.skids.from}
        explode={MOTION.skids.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.skids.inside}
        insideAmount={insideAmount}
        highlight={mark(9)}
        reducedMotion={reducedMotion}
      >
        <SkidFeet highlight={mark(9)} />
      </Arrive>
      <Arrive
        step={10}
        current={current}
        from={MOTION.pin.from}
        explode={MOTION.pin.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.pin.inside}
        insideAmount={insideAmount}
        highlight={mark(10)}
        reducedMotion={reducedMotion}
      >
        <BindPin highlight={mark(10)} />
        {toggles.labels && <Callout text="Bind pin" tip={[-0.08, 0.26, -0.1]} end={[-0.36, 0.48, -0.28]} />}
      </Arrive>
      <Arrive
        step={11}
        current={current}
        from={MOTION.canopy.from}
        explode={MOTION.canopy.explode}
        explodeAmount={explodeAmount}
        inside={MOTION.canopy.inside}
        insideAmount={insideAmount}
        shown={mode !== 'inside'}
        highlight={mark(11)}
        reducedMotion={reducedMotion}
      >
        <CanopySpine highlight={mark(11)} />
      </Arrive>
      {toggles.tide && current >= 12 && <TideVane />}
      {toggles.sight && current >= 12 && <SightBead />}
    </group>
  );
}
