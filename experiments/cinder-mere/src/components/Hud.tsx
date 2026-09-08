import { landmarkAt } from '../terrain';
import type { HudSnapshot, TimeMode } from '../types';

interface Props {
  hud: HudSnapshot;
  onMute: () => void;
  onTime: (mode: TimeMode) => void;
  onReset: () => void;
  onPad: (axis: 'throttle' | 'steer', value: number) => void;
  onBrake: (held: boolean) => void;
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

export default function Hud({ hud, onMute, onTime, onReset, onPad, onBrake }: Props) {
  const landmark = landmarkAt(hud.landmark);

  return (
    <>
      <nav className="topbar" aria-label="Cinder Mere">
        <p className="brand">vibes · cinder mere</p>
        <div className="top-groups">
          <p className="stance">{hud.timeName === 'day' ? 'ash noon' : hud.timeName}</p>
          <div className="chips">
            <button
              type="button"
              className={hud.timeMode === 'dusk' ? 'active' : undefined}
              onClick={() => onTime('dusk')}
            >
              Dusk
            </button>
            <button
              type="button"
              className={hud.timeMode === 'day' ? 'active' : undefined}
              onClick={() => onTime('day')}
            >
              Ash noon
            </button>
            <button
              type="button"
              className={hud.timeMode === 'cycle' ? 'active' : undefined}
              onClick={() => onTime('cycle')}
            >
              Cycle
            </button>
          </div>
          <button type="button" className={`ghost compact ${hud.muted ? 'active' : ''}`} onClick={onMute}>
            {hud.muted ? 'Muted' : 'Reed bed'}
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">烬泽</p>
        <h1>Cinder Mere</h1>
        <p className="lede">
          A kiln cart in a dusk basin. Four marks I named. No loop, no GT.
        </p>
      </header>

      <aside className="meter" aria-label="Pace">
        <p className="panel-kicker">{landmark.nameZh}</p>
        <p className="percent">
          {landmark.name}
          <span className="pace-num"> · {hud.pace}</span>
        </p>
        <button type="button" className="ghost compact" onClick={onReset}>
          Bank
        </button>
      </aside>

      <p className="hint">
        <kbd>W</kbd>
        <kbd>A</kbd>
        <kbd>S</kbd>
        <kbd>D</kbd>
        drive
        <span className="sep">·</span>
        <kbd>␣</kbd> brake
        <span className="sep">·</span>
        <kbd>T</kbd> time
        <span className="sep">·</span>
        <kbd>R</kbd> bank
      </p>

      <div className="pad" aria-label="Drive">
        <PadButton onHold={(held) => onPad('throttle', held ? 1 : 0)}>↑</PadButton>
        <div className="pad-row">
          <PadButton onHold={(held) => onPad('steer', held ? -1 : 0)}>←</PadButton>
          <PadButton onHold={(held) => onPad('throttle', held ? -1 : 0)}>↓</PadButton>
          <PadButton onHold={(held) => onPad('steer', held ? 1 : 0)}>→</PadButton>
        </div>
        <PadButton onHold={onBrake}>␣</PadButton>
      </div>

      <p className="sr-only">
        Cinder Mere. {hud.timeName}. Nearest {landmark.name}. {landmark.copy} Pace {hud.pace}.
        WASD drive, space brake, T cycles time, R returns to the Flint Ford bank.
      </p>
    </>
  );
}
