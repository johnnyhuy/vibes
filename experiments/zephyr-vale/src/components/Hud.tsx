import { SLIP_COUNT, slipById } from '../slips';
import type { SlipId, Stance } from '../types';

interface Props {
  stance: Stance;
  sprinting: boolean;
  gathered: SlipId[];
  lastSlip: SlipId | null;
  muted: boolean;
  looking: boolean;
  onMute: () => void;
  onPad: (axis: 'x' | 'z', value: number) => void;
  onSprint: (held: boolean) => void;
}

function PadButton({
  children,
  onHold,
}: {
  children: string;
  onHold: (held: boolean) => void;
}) {
  return (
    <button
      type="button"
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        onHold(true);
      }}
      onPointerUp={() => onHold(false)}
      onPointerCancel={() => onHold(false)}
    >
      {children}
    </button>
  );
}

export default function Hud({
  stance,
  sprinting,
  gathered,
  lastSlip,
  muted,
  looking,
  onMute,
  onPad,
  onSprint,
}: Props) {
  const active = lastSlip ? slipById(lastSlip) : null;

  return (
    <>
      <nav className="topbar" aria-label="Zephyr Vale">
        <p className="brand">vibes · zephyr vale</p>
        <div className="top-groups">
          <p className="stance">{sprinting && stance !== 'idle' ? 'hurry' : stance}</p>
          <button type="button" className={`ghost ${muted ? 'active' : ''}`} onClick={onMute}>
            {muted ? 'Muted' : 'Wind on'}
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">风笺谷</p>
        <h1>Zephyr Vale</h1>
        <p className="lede">
          I walked a sunlit fold of hills and gathered breeze slips — folded
          notes the wind keeps. No combat. Just a vale, a reed hat, and a
          paper kite with a bell.
        </p>
      </header>

      <aside className="desk" aria-label="Last breeze slip">
        <p className="panel-kicker">Breeze slip</p>
        <p className="panel-title">{active?.title ?? 'Unopened air'}</p>
        <p className="panel-copy">
          {active?.verse ??
            'Walk near a drifting note to take it. The verses are mine. The vale is a wander, not a fight.'}
        </p>
      </aside>

      <p className="gather" aria-live="polite">
        {gathered.length} / {SLIP_COUNT} slips gathered
        {gathered.length === SLIP_COUNT ? ' — the vale is quiet now' : ''}
      </p>

      <p className="hint">
        <kbd>W</kbd>
        <kbd>A</kbd>
        <kbd>S</kbd>
        <kbd>D</kbd>
        wander
        <span className="sep">·</span>
        <kbd>⇧</kbd> hurry
        <span className="sep">·</span>
        {looking ? 'Esc frees the pointer' : 'click the vale to look'}
      </p>

      <div className="pad" aria-label="Move">
        <PadButton onHold={(held) => onPad('z', held ? -1 : 0)}>↑</PadButton>
        <div className="pad-row">
          <PadButton onHold={(held) => onPad('x', held ? -1 : 0)}>←</PadButton>
          <PadButton onHold={(held) => onPad('z', held ? 1 : 0)}>↓</PadButton>
          <PadButton onHold={(held) => onPad('x', held ? 1 : 0)}>→</PadButton>
        </div>
        <PadButton onHold={onSprint}>⇧</PadButton>
      </div>

      <p className="sr-only">
        Zephyr Vale. Stance {stance}. {gathered.length} of {SLIP_COUNT} breeze slips gathered.
        {active ? ` Last slip ${active.title}.` : ''}
      </p>
    </>
  );
}
