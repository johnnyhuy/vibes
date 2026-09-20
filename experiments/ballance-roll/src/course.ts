export type SegmentKind = 'pad' | 'run' | 'beam' | 'ramp' | 'finish';

export interface CourseSegment {
  id: string;
  kind: SegmentKind;
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
  rails: boolean;
}

export interface CourseMote {
  id: string;
  position: [number, number, number];
}

export type PropKind = 'lantern' | 'diya' | 'bust';

export interface CourseProp {
  id: string;
  kind: PropKind;
  position: [number, number, number];
  yaw: number;
  span: number;
}

export interface Course {
  name: string;
  kicker: string;
  segments: CourseSegment[];
  motes: CourseMote[];
  props: CourseProp[];
  start: [number, number, number];
  finishId: string;
}

interface Cursor {
  x: number;
  y: number;
  z: number;
  yaw: number;
  along: number;
}

function heading(yaw: number): [number, number] {
  return [Math.sin(yaw), -Math.cos(yaw)];
}

function localOffset(
  origin: [number, number, number],
  yaw: number,
  offset: [number, number, number]
): [number, number, number] {
  const [x, y, z] = offset;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return [origin[0] + x * c + z * s, origin[1] + y, origin[2] - x * s + z * c];
}

function buildHazeWalk(): Course {
  const segments: CourseSegment[] = [];
  const motes: CourseMote[] = [];
  const props: CourseProp[] = [];
  const cursor: Cursor = { x: 0, y: 0, z: 0, yaw: 0, along: 0 };
  let index = 0;

  const add = (
    kind: SegmentKind,
    width: number,
    depth: number,
    rails = false,
    pitch = 0,
    height = 0.48
  ): CourseSegment => {
    const horiz = (depth / 2) * Math.cos(pitch);
    const vert = (depth / 2) * Math.sin(pitch);
    const [hx, hz] = heading(cursor.yaw);
    if (segments.length > 0) {
      cursor.x += (cursor.along + horiz) * hx;
      cursor.z += (cursor.along + horiz) * hz;
      cursor.y -= vert;
    }

    const segment: CourseSegment = {
      id: `${kind}-${index++}`,
      kind,
      position: [cursor.x, cursor.y, cursor.z],
      size: [width, height, depth],
      rotation: [pitch, cursor.yaw, 0],
      rails
    };
    segments.push(segment);
    cursor.along = horiz;
    cursor.y -= vert;
    return segment;
  };

  const turn = (radians: number) => {
    cursor.yaw += radians;
  };

  const startPad = add('pad', 7.2, 7.2);
  const start: [number, number, number] = [0, 0.72, 1.55];
  props.push({
    id: 'lantern-start-w',
    kind: 'lantern',
    position: localOffset(startPad.position, startPad.rotation[1], [-2.55, 0.24, 2.35]),
    yaw: 0.18,
    span: 1.18
  });
  props.push({
    id: 'lantern-start-e',
    kind: 'lantern',
    position: localOffset(startPad.position, startPad.rotation[1], [2.55, 0.24, 2.35]),
    yaw: -0.18,
    span: 1.18
  });

  add('run', 3.55, 8.2);
  add('pad', 6.2, 6.2);
  turn(-Math.PI / 2);

  add('run', 3.4, 9.4);
  const plaza = add('pad', 6.8, 6.8);
  motes.push({
    id: 'mote-plaza',
    position: [plaza.position[0], plaza.position[1] + 0.95, plaza.position[2]]
  });
  props.push({
    id: 'bust-plaza-w',
    kind: 'bust',
    position: localOffset(plaza.position, plaza.rotation[1], [-2.45, 0.24, 2.2]),
    yaw: plaza.rotation[1] + 0.55,
    span: 1.52
  });
  props.push({
    id: 'bust-plaza-e',
    kind: 'bust',
    position: localOffset(plaza.position, plaza.rotation[1], [2.45, 0.24, 2.2]),
    yaw: plaza.rotation[1] - 0.55,
    span: 1.52
  });
  turn(-Math.PI / 2);

  const beam = add('beam', 1.48, 13.6, true);
  motes.push({
    id: 'mote-beam',
    position: [beam.position[0], beam.position[1] + 0.9, beam.position[2]]
  });

  add('pad', 5.8, 5.8);
  add('ramp', 3.7, 10.4, true, 0.17);
  const finish = add('finish', 7.6, 7.6);
  motes.push({
    id: 'mote-crown',
    position: [finish.position[0], finish.position[1] + 0.95, finish.position[2]]
  });
  props.push({
    id: 'lantern-finish-w',
    kind: 'lantern',
    position: localOffset(finish.position, finish.rotation[1], [-2.45, 0.24, 2.15]),
    yaw: finish.rotation[1] + 0.2,
    span: 1.18
  });
  props.push({
    id: 'lantern-finish-e',
    kind: 'lantern',
    position: localOffset(finish.position, finish.rotation[1], [2.45, 0.24, 2.15]),
    yaw: finish.rotation[1] - 0.2,
    span: 1.18
  });
  props.push({
    id: 'diya-finish-w',
    kind: 'diya',
    position: localOffset(finish.position, finish.rotation[1], [-2.15, 0.24, -2.2]),
    yaw: finish.rotation[1] + 0.4,
    span: 1.28
  });
  props.push({
    id: 'diya-finish-e',
    kind: 'diya',
    position: localOffset(finish.position, finish.rotation[1], [2.15, 0.24, -2.2]),
    yaw: finish.rotation[1] - 0.4,
    span: 1.28
  });

  return {
    name: 'Haze Walk',
    kicker: 'Cloud course',
    segments,
    motes,
    props,
    start,
    finishId: finish.id
  };
}

export const HAZE_WALK = buildHazeWalk();

export function segmentAabb(segment: CourseSegment, pad = 0.35) {
  const [x, y, z] = segment.position;
  const [w, h, d] = segment.size;
  const yaw = segment.rotation[1];
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const hx = (Math.abs(c) * w + Math.abs(s) * d) / 2 + pad;
  const hz = (Math.abs(s) * w + Math.abs(c) * d) / 2 + pad;
  return {
    min: [x - hx, y - h, z - hz] as const,
    max: [x + hx, y + h + 1.6, z + hz] as const
  };
}

export function pointInAabb(
  point: { x: number; y: number; z: number },
  aabb: ReturnType<typeof segmentAabb>
): boolean {
  return (
    point.x >= aabb.min[0] &&
    point.x <= aabb.max[0] &&
    point.y >= aabb.min[1] &&
    point.y <= aabb.max[1] &&
    point.z >= aabb.min[2] &&
    point.z <= aabb.max[2]
  );
}

export function formatClock(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const mins = Math.floor(clamped / 60);
  const secs = Math.floor(clamped % 60);
  const tenths = Math.floor((clamped * 10) % 10);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
}
