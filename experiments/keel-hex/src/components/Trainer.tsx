import Arrive from './Arrive';
import {
  BindPin,
  BindStraps,
  CanopySpine,
  KeelSpars,
  LoomTraces,
  NestBoard,
  PetalRotors,
  RotorCups,
  SkidFeet,
  SpoolCell,
  SpoolPlate,
} from './parts';

interface Props {
  step: number;
  reducedMotion: boolean;
}

export default function Trainer({ step, reducedMotion }: Props) {
  const mark = (id: number) => step === id;

  return (
    <group>
      <Arrive step={1} current={step} from={[0, 0.42, 0]} highlight={mark(1)} reducedMotion={reducedMotion}>
        <SpoolPlate highlight={mark(1)} />
      </Arrive>
      <Arrive step={2} current={step} from={[0, 0.22, 0]} highlight={mark(2)} reducedMotion={reducedMotion}>
        <KeelSpars highlight={mark(2)} />
      </Arrive>
      <Arrive step={3} current={step} from={[0, 0.38, 0]} highlight={mark(3)} reducedMotion={reducedMotion}>
        <RotorCups highlight={mark(3)} />
      </Arrive>
      <Arrive step={4} current={step} from={[0, 0.46, 0]} highlight={mark(4)} reducedMotion={reducedMotion}>
        <NestBoard highlight={mark(4)} />
      </Arrive>
      <Arrive step={5} current={step} from={[0, 0.28, 0]} highlight={mark(5)} reducedMotion={reducedMotion}>
        <LoomTraces highlight={mark(5)} />
      </Arrive>
      <Arrive step={6} current={step} from={[0, 0.52, 0]} highlight={mark(6)} reducedMotion={reducedMotion}>
        <SpoolCell highlight={mark(6)} />
      </Arrive>
      <Arrive step={7} current={step} from={[0, 0.4, 0]} highlight={mark(7)} reducedMotion={reducedMotion}>
        <BindStraps highlight={mark(7)} />
      </Arrive>
      <Arrive
        step={8}
        current={step}
        from={[0, 0.56, 0]}
        highlight={mark(8)}
        reducedMotion={reducedMotion}
      >
        <PetalRotors highlight={mark(8)} />
      </Arrive>
      <Arrive step={9} current={step} from={[0, -0.18, 0]} highlight={mark(9)} reducedMotion={reducedMotion}>
        <SkidFeet highlight={mark(9)} />
      </Arrive>
      <Arrive step={10} current={step} from={[0, 0.62, 0]} highlight={mark(10)} reducedMotion={reducedMotion}>
        <BindPin highlight={mark(10)} />
      </Arrive>
      <Arrive step={11} current={step} from={[0, 0.5, 0]} highlight={mark(11)} reducedMotion={reducedMotion}>
        <CanopySpine highlight={mark(11)} />
      </Arrive>
    </group>
  );
}
