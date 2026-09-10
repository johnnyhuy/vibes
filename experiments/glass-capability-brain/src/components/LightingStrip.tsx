import { LIGHTING, type LightingId } from '../lighting';

interface Props {
  lightingId: LightingId;
  muted: boolean;
  reducedMotion: boolean;
  onLighting: (id: LightingId) => void;
  onMute: () => void;
}

export default function LightingStrip({
  lightingId,
  muted,
  reducedMotion,
  onLighting,
  onMute,
}: Props) {
  const active = LIGHTING.find((item) => item.id === lightingId);

  return (
    <div className="lighting-strip">
      <p className="lighting-kicker">Stage tint</p>
      <div className="lighting-row" role="group" aria-label="Stage lighting">
        {LIGHTING.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === lightingId ? 'lighting-btn is-active' : 'lighting-btn'}
            aria-pressed={item.id === lightingId}
            title={item.hint}
            onClick={() => onLighting(item.id)}
          >
            {item.name}
          </button>
        ))}
        <button
          type="button"
          className={muted ? 'lighting-btn mute is-active' : 'lighting-btn mute'}
          aria-pressed={muted}
          onClick={onMute}
        >
          {muted ? 'Muted' : 'Sound on'}
        </button>
      </div>
      <p className="lighting-hint">
        {active?.hint}
        {reducedMotion ? ' · ripple skipped (reduced motion)' : ''}
      </p>
    </div>
  );
}
