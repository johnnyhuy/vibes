export const BRAND = {
  lockup: 'vibes · alba forum',
  place: 'Alba Forum',
  placeLabel: 'Architecture journal',
} as const;

export type StopId =
  | 'ivory-arch'
  | 'chalk-forum'
  | 'pale-obelisk'
  | 'alabaster-gate'
  | 'milk-colonnade'
  | 'pumice-bridge'
  | 'bone-theatre'
  | 'quartz-spire'
  | 'linen-basilica'
  | 'cloud-rotunda';

export interface Stop {
  id: StopId;
  name: string;
  kicker: string;
  caption: string;
  position: [number, number, number];
  yaw: number;
  camera: [number, number, number];
  lookAt: [number, number, number];
  exploreMin: number;
  exploreMax: number;
}

function frame(
  position: [number, number, number],
  distance: number,
  height: number,
  lift: number,
  yaw: number
): Pick<Stop, 'camera' | 'lookAt'> {
  return {
    camera: [
      position[0] + Math.sin(yaw) * distance,
      height,
      position[2] + Math.cos(yaw) * distance,
    ],
    lookAt: [position[0], lift, position[2]],
  };
}

function stop(
  partial: Omit<Stop, 'camera' | 'lookAt'> & {
    distance: number;
    height: number;
    lift: number;
  }
): Stop {
  const posed = frame(partial.position, partial.distance, partial.height, partial.lift, partial.yaw);
  return {
    id: partial.id,
    name: partial.name,
    kicker: partial.kicker,
    caption: partial.caption,
    position: partial.position,
    yaw: partial.yaw,
    exploreMin: partial.exploreMin,
    exploreMax: partial.exploreMax,
    ...posed,
  };
}

/** Invented chalk-city itinerary — not a Rome landmark list. */
export const STOPS: Stop[] = [
  stop({
    id: 'ivory-arch',
    name: 'Ivory Arch',
    kicker: '01 · gate',
    caption: 'Two stone piers frame a rounded arch beneath a decorated attic.',
    position: [0, 0, 0],
    yaw: 0.42,
    distance: 16.5,
    height: 6.4,
    lift: 3.4,
    exploreMin: 8,
    exploreMax: 28,
  }),
  stop({
    id: 'chalk-forum',
    name: 'Chalk Forum',
    kicker: '02 · square',
    caption: 'A colonnade wraps around an open civic square.',
    position: [3.2, 0, -32],
    yaw: 0.28,
    distance: 18,
    height: 7.2,
    lift: 2.4,
    exploreMin: 9,
    exploreMax: 32,
  }),
  stop({
    id: 'pale-obelisk',
    name: 'Pale Obelisk',
    kicker: '03 · needle',
    caption: 'A tapered obelisk rises from a layered stone plinth.',
    position: [-2.4, 0, -64],
    yaw: 0.55,
    distance: 15,
    height: 8.6,
    lift: 5.2,
    exploreMin: 8,
    exploreMax: 30,
  }),
  stop({
    id: 'alabaster-gate',
    name: 'Alabaster Gate',
    kicker: '04 · walls',
    caption: 'Twin towers mark a passage through the city wall.',
    position: [2.8, 0, -96],
    yaw: 0.18,
    distance: 17.5,
    height: 7.4,
    lift: 3.6,
    exploreMin: 9,
    exploreMax: 30,
  }),
  stop({
    id: 'milk-colonnade',
    name: 'Milk Colonnade',
    kicker: '05 · walk',
    caption: 'Eight bays of columns form a sheltered walk.',
    position: [-3.6, 0, -128],
    yaw: 0.72,
    distance: 16,
    height: 6.2,
    lift: 2.8,
    exploreMin: 8,
    exploreMax: 28,
  }),
  stop({
    id: 'pumice-bridge',
    name: 'Pumice Bridge',
    kicker: '06 · span',
    caption: 'Three masonry arches cross a dry channel.',
    position: [1.6, 0, -160],
    yaw: 0.95,
    distance: 16.5,
    height: 6.8,
    lift: 2.6,
    exploreMin: 8,
    exploreMax: 28,
  }),
  stop({
    id: 'bone-theatre',
    name: 'Bone Theatre',
    kicker: '07 · cavea',
    caption: 'Tiered seats curve around an open stage.',
    position: [-1.2, 0, -194],
    yaw: 0.2,
    distance: 19,
    height: 8.4,
    lift: 2.8,
    exploreMin: 10,
    exploreMax: 34,
  }),
  stop({
    id: 'quartz-spire',
    name: 'Quartz Spire',
    kicker: '08 · tower',
    caption: 'A stepped tower punctuates the avenue.',
    position: [3.4, 0, -228],
    yaw: 0.48,
    distance: 16.5,
    height: 9.2,
    lift: 5.6,
    exploreMin: 9,
    exploreMax: 32,
  }),
  stop({
    id: 'linen-basilica',
    name: 'Linen Basilica',
    kicker: '09 · hall',
    caption: 'A central nave and side aisles sit below a raised clerestory.',
    position: [-2.8, 0, -262],
    yaw: 0.38,
    distance: 18.5,
    height: 7.8,
    lift: 3.4,
    exploreMin: 10,
    exploreMax: 32,
  }),
  stop({
    id: 'cloud-rotunda',
    name: 'Cloud Rotunda',
    kicker: '10 · dome',
    caption: 'A circular colonnade supports a dome with an open oculus.',
    position: [0.6, 0, -296],
    yaw: 0.52,
    distance: 18,
    height: 8.8,
    lift: 4.2,
    exploreMin: 10,
    exploreMax: 34,
  }),
];

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function smoothstep(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function sampleItinerary(offset: number) {
  const max = STOPS.length - 1;
  const x = clamp01(offset) * max;
  const i = Math.min(Math.floor(x), Math.max(0, max - 1));
  const f = smoothstep(x - i);
  const a = STOPS[i];
  const b = STOPS[Math.min(i + 1, max)];
  return {
    camera: lerp3(a.camera, b.camera, f),
    lookAt: lerp3(a.lookAt, b.lookAt, f),
    index: Math.round(x),
    blend: x - i,
  };
}

export function stopIndexFromOffset(offset: number) {
  return Math.round(clamp01(offset) * (STOPS.length - 1));
}
