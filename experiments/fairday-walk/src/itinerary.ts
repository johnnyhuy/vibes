export const BRAND = {
  lockup: 'vibes · fairday walk',
  place: 'Fairday Walk',
  placeZh: '晴巷 · 风里的册页',
  slip: 'Slip 7',
} as const;

export type StopId =
  | 'laundry-court'
  | 'bicycle-shed'
  | 'courtyard-well'
  | 'shop-awning'
  | 'window-fern'
  | 'rooftop-pigeon'
  | 'evening-laundry'
  | 'fig-alley';

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

/** Invented residential folio — not a Qing Tian itinerary. */
export const STOPS: Stop[] = [
  stop({
    id: 'laundry-court',
    name: 'Laundry Court',
    kicker: '01 · court',
    caption: 'I hung the folio on a shared line. Sheets take the breeze first; the plaster waits.',
    position: [0, 0, 0],
    yaw: 0.48,
    distance: 11.4,
    height: 3.15,
    lift: 1.55,
    exploreMin: 5.5,
    exploreMax: 18,
  }),
  stop({
    id: 'bicycle-shed',
    name: 'Bicycle Shed',
    kicker: '02 · lean-to',
    caption: 'Two frames under a tin lean-to. I counted the spokes so the shed would not read as a crate.',
    position: [0.4, 0, -22],
    yaw: 0.62,
    distance: 10.2,
    height: 2.85,
    lift: 1.15,
    exploreMin: 4.8,
    exploreMax: 16,
  }),
  stop({
    id: 'courtyard-well',
    name: 'Courtyard Well',
    kicker: '03 · ring',
    caption: 'A lathed stone lip and a bucket that never draws. Moss holds the memory of water.',
    position: [-0.6, 0, -44],
    yaw: 0.38,
    distance: 9.4,
    height: 2.55,
    lift: 0.95,
    exploreMin: 4.2,
    exploreMax: 15,
  }),
  stop({
    id: 'shop-awning',
    name: 'Shop Awning',
    kicker: '04 · stripe',
    caption: 'Striped cloth over crates I invented. No shopkeeper. The awning is the sentence.',
    position: [0.8, 0, -66],
    yaw: 0.72,
    distance: 10.6,
    height: 2.9,
    lift: 1.45,
    exploreMin: 5,
    exploreMax: 17,
  }),
  stop({
    id: 'window-fern',
    name: 'Window Fern',
    kicker: '05 · sill',
    caption: 'A balcony box and fronds that lean into the lane. I wanted the window to have depth, not a painted pane.',
    position: [-0.4, 0, -88],
    yaw: 0.18,
    distance: 8.6,
    height: 3.55,
    lift: 2.55,
    exploreMin: 4.6,
    exploreMax: 15,
  }),
  stop({
    id: 'rooftop-pigeon',
    name: 'Rooftop Pigeon',
    kicker: '06 · loft',
    caption: 'A coop on the ridge. Three birds I modelled, not a downloaded flock. The tiles do the talking.',
    position: [0.2, 0, -110],
    yaw: 0.92,
    distance: 9.4,
    height: 8.2,
    lift: 6.15,
    exploreMin: 5.5,
    exploreMax: 18,
  }),
  stop({
    id: 'evening-laundry',
    name: 'Evening Laundry',
    kicker: '07 · amber',
    caption: 'A warmer pocket between two gables. Same breeze, later light. I kept the sun and added a local amber bounce.',
    position: [0.6, 0, -132],
    yaw: 0.44,
    distance: 10.8,
    height: 3.05,
    lift: 1.7,
    exploreMin: 5.2,
    exploreMax: 17,
  }),
  stop({
    id: 'fig-alley',
    name: 'Fig Alley',
    kicker: '08 · barrel',
    caption: 'A fig I grew from stems, a rain barrel, a downpipe. The folio ends where the lane turns.',
    position: [0.4, 0, -154],
    yaw: 0.34,
    distance: 8.6,
    height: 2.45,
    lift: 1.15,
    exploreMin: 4.2,
    exploreMax: 14,
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
