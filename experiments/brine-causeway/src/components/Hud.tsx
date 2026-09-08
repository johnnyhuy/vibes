import { ATMOSPHERE_CHIP } from '../look';
import { MARKS } from '../road';
import type { Atmosphere, HudSnapshot, Quality } from '../types';

interface Props {
  hud: HudSnapshot;
  onMute: () => void;
  onAtmosphere: (mode: Atmosphere) => void;
  onQuality: (mode: Quality) => void;
  onStart: () => void;
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

export default function Hud({
  hud,
  onMute,
  onAtmosphere,
  onQuality,
  onStart,
  onReset,
  onPad,
  onBrake,
}: Props) {
  const mark = MARKS[hud.mark];

  return (
    <>
      <nav className="topbar" aria-label="Brine Causeway">
        <p className="brand">vibes · brine causeway</p>
        <p className={`chip ${hud.atmosphere}`}>
          <span className="dot" />
          {ATMOSPHERE_CHIP[hud.atmosphere]}
        </p>
        <button type="button" className={`ghost compact ${hud.muted ? 'active' : ''}`} onClick={onMute}>
          {hud.muted ? 'Muted' : 'Surf'}
        </button>
      </nav>

      <header className={`editorial ${hud.driving ? 'is-live' : ''}`}>
        <p className="kicker">盐桥</p>
        <h1>Hold the spill.</h1>
        <p className="lede">
          One causeway. One loop. The wedge stays on the painted line through Salt Reach.
        </p>
        {!hud.driving && (
          <button type="button" className="cta" onClick={onStart}>
            Cut the brine
            <span aria-hidden="true">↗</span>
          </button>
        )}
      </header>

      {hud.driving && (
        <aside className="meter" aria-label="Pace">
          <p className="panel-kicker">{mark.nameZh}</p>
          <p className="percent">
            {mark.name}
            <span className="pace-num"> · {hud.pace}</span>
          </p>
          <button type="button" className="ghost compact" onClick={onReset}>
            Bank
          </button>
        </aside>
      )}

      <footer className="dock">
        <p className="specs">
          <span>418 horsepower</span>
          <span>6 speed manual</span>
          <span>flat-six boxer</span>
        </p>
        <p className="model">iodine wedge / salt reach</p>
        <p className="hint">
          <kbd>W</kbd>
          <kbd>A</kbd>
          <kbd>S</kbd>
          <kbd>D</kbd>
          drive
          <span className="sep">·</span>
          <kbd>␣</kbd> brake
          <span className="sep">·</span>
          <kbd>C</kbd> cam
          <span className="sep">·</span>
          <kbd>R</kbd> bank
          <span className="sep">·</span>
          <kbd>T</kbd> sky
        </p>
        <div className="dock-actions">
          <div className="chips">
            <button
              type="button"
              className={hud.atmosphere === 'sun' ? 'active' : undefined}
              onClick={() => onAtmosphere('sun')}
            >
              Late sun
            </button>
            <button
              type="button"
              className={hud.atmosphere === 'rain' ? 'active' : undefined}
              onClick={() => onAtmosphere('rain')}
            >
              After rain
            </button>
            <button
              type="button"
              className={hud.atmosphere === 'dusk' ? 'active' : undefined}
              onClick={() => onAtmosphere('dusk')}
            >
              Dusk tide
            </button>
          </div>
          <button
            type="button"
            className="ghost compact"
            onClick={() => onQuality(hud.quality === 'pretty' ? 'performance' : 'pretty')}
          >
            Quality: {hud.quality === 'pretty' ? 'pretty' : 'performance'}
          </button>
        </div>
      </footer>

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
        Brine Causeway. {hud.atmosphere}. Nearest {mark.name}. Pace {hud.pace}.
        Start with Cut the brine. WASD drive, space brake, C camera, R returns to Salt Reach, T cycles sky.
      </p>
    </>
  );
}
