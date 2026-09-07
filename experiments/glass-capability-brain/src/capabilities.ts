export type CapabilityId =
  | 'remember'
  | 'reason'
  | 'code'
  | 'see'
  | 'drive'
  | 'puzzle';

export type DemoKind = 'stub' | 'pixel-qa';

export interface Capability {
  id: CapabilityId;
  key: '1' | '2' | '3' | '4' | '5' | '6';
  name: string;
  kicker: string;
  copy: string;
  stubNote?: string;
  color: string;
  halo: string;
  /** Ellipse radii and Euler tilt for the drawn orbit. */
  radiusX: number;
  radiusZ: number;
  tiltX: number;
  tiltZ: number;
  phase: number;
  speed: number;
  size: number;
  kind: DemoKind;
  /** Remember sits inside the glass volume; others ride outer orbits. */
  inner: boolean;
  alwaysLabel: boolean;
}

/**
 * Six capability moons. Remember + Reason match the public thumb labels.
 * Code / See / Drive / Puzzle are my names for this kitchen-sink map —
 * not claimed as anyone else's node list.
 */
export const CAPABILITIES: Capability[] = [
  {
    id: 'remember',
    key: '1',
    name: 'Remember',
    kicker: 'Working memory',
    copy: 'I keep the working notes for this kitchen sink — ADRs, reverse-eng, the visual QA loop — so I can pick a thread back up without pretending I still hold it in context.',
    stubNote: 'Stub. The live work is on See: I read the canvas, not a memory store.',
    color: '#f59e0b',
    halo: 'rgba(245, 158, 11, 0.28)',
    radiusX: 1.05,
    radiusZ: 0.82,
    tiltX: 0.18,
    tiltZ: -0.22,
    phase: 0.35,
    speed: 0.12,
    size: 0.2,
    kind: 'stub',
    inner: true,
    alwaysLabel: true,
  },
  {
    id: 'reason',
    key: '2',
    name: 'Reason',
    kicker: 'Multi-step thinking',
    copy: 'I walk a problem in steps instead of leaping to an answer. The river-crossing gag in the reference is theirs; mine is just the habit: enumerate, prune, write the path down.',
    stubNote: 'Stub. I am not solving wolf/goat/cabbage here — that live search belongs to the inspiration, not this repo.',
    color: '#7c3aed',
    halo: 'rgba(124, 58, 237, 0.32)',
    radiusX: 3.55,
    radiusZ: 2.85,
    tiltX: 0.42,
    tiltZ: 0.18,
    phase: 1.15,
    speed: 0.18,
    size: 0.18,
    kind: 'stub',
    inner: false,
    alwaysLabel: true,
  },
  {
    id: 'code',
    key: '3',
    name: 'Code',
    kicker: 'Write the experiment',
    copy: 'I write the experiment in the repo — Vite, R3F, a build that has to pass — then I read the compiler the way I would read a reviewer.',
    stubNote: 'Stub. No in-page eval, no user JS sandbox.',
    color: '#2563eb',
    halo: 'rgba(37, 99, 235, 0.28)',
    radiusX: 3.9,
    radiusZ: 3.15,
    tiltX: -0.28,
    tiltZ: 0.55,
    phase: 2.4,
    speed: 0.15,
    size: 0.15,
    kind: 'stub',
    inner: false,
    alwaysLabel: false,
  },
  {
    id: 'see',
    key: '4',
    name: 'See',
    kicker: 'Reads its own pixels',
    copy: 'I look at my own pixels. This node grabs the WebGL canvas, samples brightness, and tells me whether the frame is actually drawing — the same instinct as staring at a preview, just closed-loop.',
    color: '#0d9488',
    halo: 'rgba(13, 148, 136, 0.3)',
    radiusX: 3.7,
    radiusZ: 3.35,
    tiltX: 0.72,
    tiltZ: -0.4,
    phase: 4.1,
    speed: 0.16,
    size: 0.16,
    kind: 'pixel-qa',
    inner: false,
    alwaysLabel: false,
  },
  {
    id: 'drive',
    key: '5',
    name: 'Drive',
    kicker: 'Replay a path',
    copy: 'I replay a path. In this stub that is the camera tour: keys 1–6, then idle, then around again. No OS-in-the-browser.',
    stubNote: 'Stub. The tour in this scene is the whole demo.',
    color: '#db2777',
    halo: 'rgba(219, 39, 119, 0.28)',
    radiusX: 4.05,
    radiusZ: 2.7,
    tiltX: -0.55,
    tiltZ: -0.15,
    phase: 5.2,
    speed: 0.14,
    size: 0.15,
    kind: 'stub',
    inner: false,
    alwaysLabel: false,
  },
  {
    id: 'puzzle',
    key: '6',
    name: 'Puzzle',
    kicker: 'Search a graph',
    copy: 'I treat a constraint as a graph: reachable states, illegal ones pruned. This moon is a placeholder so the map still has six stops.',
    stubNote: 'Stub. See is the only live micro-demo in this pass.',
    color: '#ea580c',
    halo: 'rgba(234, 88, 12, 0.26)',
    radiusX: 3.45,
    radiusZ: 3.5,
    tiltX: 0.12,
    tiltZ: 0.85,
    phase: 0.8,
    speed: 0.17,
    size: 0.15,
    kind: 'stub',
    inner: false,
    alwaysLabel: false,
  },
];

export const KEY_TO_ID: Record<string, CapabilityId> = Object.fromEntries(
  CAPABILITIES.map((node) => [node.key, node.id])
) as Record<string, CapabilityId>;

export function nextTourId(current: CapabilityId | null): CapabilityId | null {
  if (current === null) return CAPABILITIES[0].id;
  const index = CAPABILITIES.findIndex((node) => node.id === current);
  if (index === CAPABILITIES.length - 1) return null;
  return CAPABILITIES[index + 1].id;
}
