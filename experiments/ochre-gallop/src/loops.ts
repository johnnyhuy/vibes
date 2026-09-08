import { heightAt, ribbonGates } from './terrain';
import type { BiomeId, Hazard, LoopState, PlayPhase, RunnerState } from './types';

const GATE_COUNT = 6;
const PLUME_START = 42;
const PLUME_SPEED = 6.4;
const SHELF_FALL = -3.8;

export function createLoop(): LoopState {
  return resetLoop({
    phase: 'ready',
    score: 0,
    progress: 0,
    caption: 'Take the first stride.',
    nextGate: 0,
    plumeZ: PLUME_START,
    elapsed: 0,
    distance: 0,
  });
}

export function resetLoop(state: LoopState): LoopState {
  state.phase = 'ready';
  state.score = 0;
  state.progress = 0;
  state.caption = 'Take the first stride.';
  state.nextGate = 0;
  state.plumeZ = PLUME_START;
  state.elapsed = 0;
  state.distance = 0;
  return state;
}

function setPhase(state: LoopState, phase: PlayPhase, caption: string): void {
  state.phase = phase;
  state.caption = caption;
}

function near(runner: RunnerState, hazard: Hazard): boolean {
  return Math.hypot(runner.x - hazard.x, runner.z - hazard.z) < hazard.radius + 0.55;
}

export function stepLoop(
  state: LoopState,
  runner: RunnerState,
  biome: BiomeId,
  hazards: Hazard[],
  dt: number
): void {
  if (state.phase === 'cleared' || state.phase === 'caught') return;

  const moving = Math.abs(runner.speed) > 0.35;
  if (state.phase === 'ready' && moving) {
    setPhase(state, 'running', 'In stride.');
  }
  if (state.phase !== 'running') return;

  const clampedDt = Math.min(dt, 0.05);
  state.elapsed += clampedDt;
  state.distance += Math.abs(runner.speed) * clampedDt;

  if (biome === 'terrace') {
    const gates = ribbonGates();
    const next = gates[state.nextGate];
    if (next && near(runner, next)) {
      state.nextGate += 1;
      state.score += 1;
      state.progress = state.nextGate / GATE_COUNT;
      state.caption = state.nextGate >= GATE_COUNT ? 'Ribbon closed.' : `Gate ${state.nextGate} / ${GATE_COUNT}`;
      if (state.nextGate >= GATE_COUNT) {
        setPhase(state, 'cleared', 'Ribbon Cut — six lips, no stumble.');
      }
    }
    const cones = hazards.filter((item) => item.kind === 'cone');
    if (cones.some((cone) => near(runner, cone))) {
      runner.speed *= 0.42;
      state.caption = 'Sinter cone — the ribbon slips.';
    }
    return;
  }

  if (biome === 'basin') {
    state.plumeZ -= PLUME_SPEED * clampedDt;
    const goal = hazards.find((item) => item.kind === 'goal');
    const vents = hazards.filter((item) => item.kind === 'vent');
    if (vents.some((vent) => near(runner, vent))) {
      runner.speed *= 0.72;
      state.caption = 'Vent heat — the plume gains.';
    }
    if (goal && near(runner, goal)) {
      state.score = Math.round(Math.max(0, 40 - state.elapsed) * 12);
      state.progress = 1;
      setPhase(state, 'cleared', 'Plume Break — Clear Crust holds.');
      return;
    }
    if (runner.z > state.plumeZ - 1.2) {
      state.progress = 0;
      setPhase(state, 'caught', 'The plume took the mane.');
      return;
    }
    const span = PLUME_START + 34.5;
    state.progress = Math.min(1, Math.max(0, (PLUME_START - runner.z) / span));
    state.score = Math.round(state.progress * 100);
    return;
  }

  const rocks = hazards.filter((item) => item.kind === 'rock');
  if (rocks.some((rock) => near(runner, rock))) {
    runner.speed *= 0.5;
    state.caption = 'Shelf rock — hold the line.';
  }
  const ground = heightAt('rim', runner.x, runner.z);
  if (ground < SHELF_FALL || runner.x < 2.4) {
    setPhase(state, 'caught', 'Off the shelf.');
    return;
  }
  state.score = Math.round(state.distance * 3.2);
  state.progress = Math.min(1, (runner.z + 28) / 84);
  state.caption = 'Shelf Drift — keep the overlook.';
}
