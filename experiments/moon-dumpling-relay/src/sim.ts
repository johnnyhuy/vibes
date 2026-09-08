import { dinerById, seatRivals } from './diners';
import { hash, isEdibleScore, pickPlateKind, plateValue, PLATE_COUNT } from './plates';
import type { ActorState, AiStyle, PlateKind, PlateState, StatusKind } from './types';

export const WALK_RADIUS = 3.52;
export const CONVEYOR_RADIUS = 2.38;
export const TABLE_Y = 0.08;
export const ROUND_SECONDS = 55;
export const COUNTDOWN_SECONDS = 3;
export const EAT_ARC = 0.32;
export const EAT_TIME = 0.42;
export const DASH_TIME = 0.26;
export const DASH_COOLDOWN = 2.3;
export const TEA_TIME = 10;
export const CHILI_TIME = 4;
export const WALK_SPEED = 1.18;
export const CONVEYOR_SPEED = 0.32;
export const CHAIN_WINDOW = 3.6;

export function wrapAngle(angle: number): number {
  const tau = Math.PI * 2;
  return ((angle % tau) + tau) % tau;
}

export function shortestDelta(from: number, to: number): number {
  let delta = wrapAngle(to) - wrapAngle(from);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export function angularNear(a: number, b: number, arc = EAT_ARC): boolean {
  return Math.abs(shortestDelta(a, b)) <= arc;
}

export function slotAngle(slot: number, spin: number): number {
  return wrapAngle((slot / PLATE_COUNT) * Math.PI * 2 + spin);
}

export function actorStatus(actor: ActorState, now: number): StatusKind {
  if (now < actor.chiliUntil) return 'chili';
  if (now < actor.teaUntil) return 'tea';
  return 'clear';
}

export function walkMultiplier(actor: ActorState, now: number): number {
  let speed = 1;
  if (now < actor.teaUntil) speed *= 1.55;
  if (now < actor.dashUntil) speed *= 2.35;
  if (now < actor.chiliUntil) speed *= 1.15;
  return speed;
}

export function makeActor(
  dinerId: string,
  angle: number,
  isPlayer: boolean,
  ai: AiStyle | null
): ActorState {
  return {
    dinerId,
    angle,
    score: 0,
    eaten: 0,
    chain: 0,
    bestChain: 0,
    chiliUntil: 0,
    teaUntil: 0,
    dashUntil: 0,
    dashReadyAt: 0,
    eatUntil: 0,
    lean: 0,
    lastBiteAt: -99,
    isPlayer,
    ai,
  };
}

export function seedPlates(seed = 7): PlateState[] {
  return Array.from({ length: PLATE_COUNT }, (_, slot) => {
    let kind = pickPlateKind(seed + slot * 17);
    if (slot === 2) kind = 'chili';
    if (slot === 6) kind = 'tea';
    return { id: slot + 1, kind, slot, hiddenUntil: 0 };
  });
}

export function seatActors(playerId: string): ActorState[] {
  const player = dinerById(playerId);
  const rivals = seatRivals(playerId);
  const seated = [
    makeActor(player.id, -Math.PI / 2, true, null),
    makeActor(rivals[0].dinerId, Math.PI / 6, false, rivals[0].ai),
    makeActor(rivals[1].dinerId, (Math.PI * 5) / 6, false, rivals[1].ai),
  ];
  return seated;
}

export function platePriority(kind: PlateKind, style: AiStyle): number {
  if (style === 'savour') {
    if (kind === 'moon') return 8;
    if (kind === 'soup') return 5;
    if (kind === 'tea') return 4;
    if (kind === 'pleat') return 2;
    return -4;
  }
  if (kind === 'chili') return -3;
  if (kind === 'moon') return 4;
  if (kind === 'soup') return 3;
  if (kind === 'tea') return 2;
  return 1;
}

export function chooseAiTarget(
  actor: ActorState,
  plates: PlateState[],
  spin: number,
  now: number
): number | null {
  if (!actor.ai) return null;
  let best: { score: number; angle: number } | null = null;
  for (const plate of plates) {
    if (now < plate.hiddenUntil) continue;
    const angle = slotAngle(plate.slot, spin);
    const reach = 1 - Math.min(1, Math.abs(shortestDelta(actor.angle, angle)) / Math.PI);
    const score = platePriority(plate.kind, actor.ai) + reach * 2.4;
    if (!best || score > best.score) best = { score, angle };
  }
  return best?.angle ?? null;
}

export interface BiteResult {
  kind: PlateKind;
  points: number;
  chain: number;
}

export function applyBite(
  actor: ActorState,
  plate: PlateState,
  now: number,
  seed: number
): BiteResult {
  const kind = plate.kind;
  plate.hiddenUntil = now + 1.05 + hash(seed, plate.slot) * 1.4;
  plate.kind = pickPlateKind(seed + plate.slot * 31 + Math.floor(now * 10));
  actor.eatUntil = now + EAT_TIME;
  actor.lean = 1;

  if (kind === 'chili') {
    actor.chiliUntil = now + CHILI_TIME;
    actor.teaUntil = Math.min(actor.teaUntil, now);
    actor.chain = 0;
    return { kind, points: 0, chain: 0 };
  }

  if (kind === 'tea') {
    actor.teaUntil = now + TEA_TIME;
    actor.chiliUntil = Math.min(actor.chiliUntil, now);
    actor.chain = 0;
    actor.score += plateValue(kind, 1);
    return { kind, points: plateValue(kind, 1), chain: 0 };
  }

  const nextChain = actor.lastKind === kind && now - actor.lastBiteAt <= CHAIN_WINDOW
    ? actor.chain + 1
    : 1;
  const points = plateValue(kind, nextChain);
  actor.chain = nextChain;
  actor.bestChain = Math.max(actor.bestChain, nextChain);
  actor.score += points;
  actor.eaten += 1;
  actor.lastKind = kind;
  actor.lastBiteAt = now;
  return { kind, points, chain: nextChain };
}

export function tryDash(actor: ActorState, now: number): boolean {
  if (now < actor.dashReadyAt || now < actor.eatUntil) return false;
  actor.dashUntil = now + DASH_TIME;
  actor.dashReadyAt = now + DASH_COOLDOWN;
  return true;
}

export function stepActor(
  actor: ActorState,
  steer: number,
  now: number,
  dt: number
): void {
  const panic = now < actor.chiliUntil ? -1 : 1;
  const jitter = now < actor.chiliUntil ? (hash(now * 8, actor.angle) - 0.5) * 1.6 : 0;
  actor.angle = wrapAngle(
    actor.angle + (steer * panic + jitter) * WALK_SPEED * walkMultiplier(actor, now) * dt
  );
  actor.lean = Math.max(0, actor.lean - dt * 2.4);
}

export function rankActors(actors: ActorState[]): ActorState[] {
  return [...actors].sort((a, b) => b.score - a.score || b.eaten - a.eaten);
}
