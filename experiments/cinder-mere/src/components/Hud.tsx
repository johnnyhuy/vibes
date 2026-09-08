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
          <p className="stance">{hud.timeName}</p>
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
              Day
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
          I cut a dusk basin you can drive — a kiln cart, four invented
          markers, and haze instead of a sixteen-kilometre map.
        </p>
      </header>

      <aside className="desk" aria-label="Drive desk">
        <p className="panel-kicker">Nearest mark</p>
        <p className="panel-title">
          {landmark.name} <span className="zh">{landmark.nameZh}</span>
        </p>
        <p className="panel-copy">{landmark.copy}</p>
        <p className="pace">
          Pace {hud.pace}
          <span className="sep">·</span>
          {hud.landmarkRange < 8 ? 'beside it' : `${hud.landmarkRange.toFixed(0)} m out`}
        </p>
        <button type="button" className="ghost" onClick={onReset}>
          Reset to Flint Ford
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
        <kbd>R</kbd> reset
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
        Cinder Mere. {hud.timeName}. Nearest {landmark.name}. Pace {hud.pace}.
        WASD drive, space brake, T cycles time, R resets.
      </p>
    </>
  );
}
