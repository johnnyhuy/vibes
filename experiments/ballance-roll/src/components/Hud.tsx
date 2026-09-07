import { BALL_FEEL } from '../materials';
import { HAZE_WALK, formatClock } from '../course';
import { BALL_KINDS, type BallKind, type HudSnapshot } from '../types';

interface Props {
  kind: BallKind;
  hud: HudSnapshot;
  onKind: (kind: BallKind) => void;
  onReset: () => void;
  onPad: (axis: 'x' | 'z', value: number) => void;
}

function statusCopy(hud: HudSnapshot): string {
  if (hud.state === 'ready') return 'Roll when you are ready';
  if (hud.state === 'rolling') return 'Stay on the stone';
  if (hud.state === 'fallen') return 'Below the haze — reset';
  return 'You reached the hoop';
}

export default function Hud({ kind, hud, onKind, onReset, onPad }: Props) {
  const feel = BALL_FEEL[kind];

  return (
    <>
      <nav className="topbar" aria-label="Course">
        <p className="brand">vibes · nimbus path</p>
        <div className="top-groups">
          <p className="clock" aria-label="Timer">
            {formatClock(hud.elapsed)}
          </p>
          <p className="motes">
            {hud.motes}/{hud.moteTotal} motes
          </p>
          <div className="chips">
            {BALL_KINDS.map((value) => (
              <button
                key={value}
                type="button"
                className={value === kind ? 'active' : undefined}
                onClick={() => onKind(value)}
              >
                {BALL_FEEL[value].label}
              </button>
            ))}
          </div>
          <button type="button" className="ghost compact" onClick={onReset}>
            Reset
          </button>
        </div>
      </nav>

      <section className="editorial">
        <p className="kicker">{HAZE_WALK.kicker}</p>
        <h1>Nimbus Path</h1>
        <p className="lede">
          A course I drew in code, above a pale sea of cloud. {feel.note}. This is my kitchen-sink
          marble — not Atari Ballance, and not their web recreation.
        </p>
      </section>

      <aside className="meter">
        <p className="panel-kicker">{HAZE_WALK.name}</p>
        <p className="percent">{statusCopy(hud)}</p>
        <p className="panel-copy">
          Wood bites, stone plants, metal slides. Swap mid-run if you want to feel the contact
          materials change.
        </p>
      </aside>

      <div className="pad" aria-label="Steer">
        <button
          type="button"
          onPointerDown={() => onPad('z', -1)}
          onPointerUp={() => onPad('z', 0)}
          onPointerLeave={() => onPad('z', 0)}
        >
          ↑
        </button>
        <div className="pad-row">
          <button
            type="button"
            onPointerDown={() => onPad('x', -1)}
            onPointerUp={() => onPad('x', 0)}
            onPointerLeave={() => onPad('x', 0)}
          >
            ←
          </button>
          <button
            type="button"
            onPointerDown={() => onPad('z', 1)}
            onPointerUp={() => onPad('z', 0)}
            onPointerLeave={() => onPad('z', 0)}
          >
            ↓
          </button>
          <button
            type="button"
            onPointerDown={() => onPad('x', 1)}
            onPointerUp={() => onPad('x', 0)}
            onPointerLeave={() => onPad('x', 0)}
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
