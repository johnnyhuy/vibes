import { BIOMES, BRAND, RUNNER, biomeAt, phaseLabel } from '../catalog';
import type { BiomeId, HudSnapshot } from '../types';

interface Props {
  hud: HudSnapshot;
  onBiome: (id: BiomeId) => void;
  onMute: () => void;
  onReset: () => void;
  onLobby: () => void;
  onPad: (axis: 'throttle' | 'steer', value: number) => void;
  onBurst: (held: boolean) => void;
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

export default function Hud({ hud, onBiome, onMute, onReset, onLobby, onPad, onBurst }: Props) {
  const biome = biomeAt(hud.biome);

  return (
    <>
      <nav className="topbar" aria-label="Ochre Gallop">
        <p className="brand">{BRAND.lockup}</p>
        <div className="top-groups">
          <p className="stance">{biome.loop}</p>
          <div className="chips" aria-label="Highlands">
            {BIOMES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={hud.biome === item.id ? 'active' : undefined}
                onClick={() => onBiome(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <button type="button" className="ghost compact" onClick={onLobby}>
            Highlands
          </button>
          <button type="button" className={`ghost compact ${hud.muted ? 'active' : ''}`} onClick={onMute}>
            {hud.muted ? 'Muted' : 'Sinter bed'}
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">{BRAND.nameZh}</p>
        <h1>{BRAND.name}</h1>
        <p className="lede">{BRAND.lede}</p>
      </header>

      <aside className="meter" aria-label="Stride">
        <p className="panel-kicker">
          {biome.loopZh} · {RUNNER.nameZh}
        </p>
        <p className="percent">
          {biome.loop}
          <span className="pace-num"> · {hud.score}</span>
        </p>
        <p className="spec">
          {RUNNER.name}
          <span className="sep">·</span>
          {phaseLabel(hud.phase)}
          <span className="sep">·</span>
          {hud.pace}
        </p>
        <div className="bar" aria-hidden>
          <span style={{ width: `${Math.round(hud.progress * 100)}%` }} />
        </div>
        <p className="caption">{hud.caption}</p>
        {hud.best > 0 && <p className="best">Best {hud.best}</p>}
        <button type="button" className="ghost compact" onClick={onReset}>
          Bank
        </button>
      </aside>

      <p className="hint">
        <kbd>W</kbd>
        <kbd>A</kbd>
        <kbd>S</kbd>
        <kbd>D</kbd>
        run
        <span className="sep">·</span>
        <kbd>␣</kbd> burst
        <span className="sep">·</span>
        <kbd>1</kbd>
        <kbd>2</kbd>
        <kbd>3</kbd>
        highland
        <span className="sep">·</span>
        <kbd>R</kbd> bank
        <span className="sep">·</span>
        <kbd>Esc</kbd> highlands
      </p>

      <div className="pad" aria-label="Run">
        <PadButton onHold={(held) => onPad('throttle', held ? 1 : 0)}>↑</PadButton>
        <div className="pad-row">
          <PadButton onHold={(held) => onPad('steer', held ? -1 : 0)}>←</PadButton>
          <PadButton onHold={(held) => onPad('throttle', held ? -1 : 0)}>↓</PadButton>
          <PadButton onHold={(held) => onPad('steer', held ? 1 : 0)}>→</PadButton>
        </div>
        <PadButton onHold={onBurst}>␣</PadButton>
      </div>

      <p className="sr-only">
        {BRAND.lockup}. {biome.name}. {biome.loop}. {RUNNER.name}. {hud.caption} WASD run, space burst,
        number keys switch highlands, R banks Ashmane.
      </p>
    </>
  );
}
