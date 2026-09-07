export type CastId =
  | 'vine-lash'
  | 'spore-bloom'
  | 'root-pulse'
  | 'amber-heart'
  | 'moss-veil'
  | 'canopy-bind'
  | 'lantern-call'
  | 'night-dew'
  | 'heartwood-choir'
  | 'moon-graft';

export interface CastDef {
  id: CastId;
  key: string;
  label: string;
  copy: string;
  duration: number;
}

export const CASTS: CastDef[] = [
  { id: 'vine-lash', key: '1', label: 'Vine lash', copy: 'Whips of living cane snap outward.', duration: 1.8 },
  { id: 'spore-bloom', key: '2', label: 'Spore bloom', copy: 'A burst of pale seed-dust.', duration: 2.1 },
  { id: 'root-pulse', key: '3', label: 'Root pulse', copy: 'The floor answers with a ring.', duration: 1.6 },
  { id: 'amber-heart', key: '4', label: 'Amber heart', copy: 'The resin well flares.', duration: 1.5 },
  { id: 'moss-veil', key: '5', label: 'Moss veil', copy: 'A green hush wraps the warden.', duration: 2.4 },
  { id: 'canopy-bind', key: '6', label: 'Canopy bind', copy: 'Twigs knit a cage overhead.', duration: 2.0 },
  { id: 'lantern-call', key: '7', label: 'Lantern call', copy: 'The spirits hurry home.', duration: 2.6 },
  { id: 'night-dew', key: '8', label: 'Night dew', copy: 'Moon-wet beads fall and vanish.', duration: 2.2 },
  { id: 'heartwood-choir', key: '9', label: 'Heartwood choir', copy: 'Bark rings lift and sing.', duration: 2.0 },
  { id: 'moon-graft', key: '0', label: 'Moon graft', copy: 'A shaft of night-silver lands.', duration: 2.3 },
];

export const CAST_BY_KEY: Record<string, CastId> = Object.fromEntries(
  CASTS.map((cast) => [cast.key, cast.id])
) as Record<string, CastId>;

export function castById(id: CastId): CastDef {
  const found = CASTS.find((cast) => cast.id === id);
  if (!found) throw new Error(`Unknown cast: ${id}`);
  return found;
}
