import { LOOKS } from '../look';
import { BRAND, MARKS, WALKER } from '../marks';
import type { LookName, Mark } from '../types';

interface Props {
  mark: Mark;
  look: LookName;
  muted: boolean;
  onMark: (id: string) => void;
  onLook: (name: LookName) => void;
  onMute: () => void;
}

export default function Hud({ mark, look, muted, onMark, onLook, onMute }: Props) {
  return (
    <>
      <nav className="topbar" aria-label="Breakwater">
        <p className="brand">{BRAND.lockup}</p>
        <div className="top-groups">
          <p className="stance">{LOOKS.find((item) => item.id === look)?.label}</p>
          <div className="chips" aria-label="Looks">
            {LOOKS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={look === item.id ? 'active' : undefined}
                onClick={() => onLook(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button type="button" className={`ghost compact ${muted ? 'active' : ''}`} onClick={onMute}>
            {muted ? 'Muted' : 'Surf'}
          </button>
        </div>
      </nav>

      <header className="editorial">
        <p className="kicker">{BRAND.nameZh}</p>
        <h1>{BRAND.name}</h1>
        <p className="lede">{BRAND.lede}</p>
      </header>

      <aside className="meter" aria-label="Walker">
        <p className="panel-kicker">{WALKER.nameZh}</p>
        <p className="percent">
          {WALKER.name}
          <span className="pace-num"> · {WALKER.code}</span>
        </p>
        <p className="spec">
          {WALKER.mass}
          <span className="sep">·</span>
          {WALKER.plant}
        </p>
        <p className="caption">{mark.copy}</p>
        <div className="chips" aria-label="Marks">
          {MARKS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={mark.id === item.id ? 'active' : undefined}
              onClick={() => onMark(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </aside>

      <p className="hint">
        drag orbit
        <span className="sep">·</span>
        <kbd>1</kbd>
        <kbd>2</kbd>
        <kbd>3</kbd>
        marks
        <span className="sep">·</span>
        <kbd>T</kbd> look
        <span className="sep">·</span>
        <kbd>M</kbd> mute
      </p>

      <p className="sr-only">
        {BRAND.lockup}. {WALKER.name}. {mark.name}. {mark.copy} Drag to orbit. Number keys frame marks.
      </p>
    </>
  );
}
