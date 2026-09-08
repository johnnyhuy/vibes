import { DINERS, dinerById } from '../diners';
import { rankActors, ROUND_SECONDS } from '../sim';
import type { HudSnapshot, Phase } from '../types';

interface Props {
  hud: HudSnapshot;
  muted: boolean;
  onSelect: (id: string) => void;
  onStart: () => void;
  onAgain: () => void;
  onSeat: () => void;
  onMute: () => void;
}

export default function Hud({ hud, muted, onSelect, onStart, onAgain, onSeat, onMute }: Props) {
  const selected = dinerById(hud.selectedId);
  const ranked = rankActors(hud.roster);

  return (
    <>
      <nav className="topbar" aria-label="Moon Dumpling Relay">
        <p className="brand">vibes · moon dumpling relay</p>
        <div className="top-groups">
          <p className="clock">
            {hud.phase === 'play' ? `${Math.ceil(hud.remaining)}s` : `${ROUND_SECONDS}s relay`}
          </p>
          <button type="button" className="ghost compact" onClick={onMute}>
            {muted ? 'Sound off' : 'Sound on'}
          </button>
        </div>
      </nav>

      {hud.phase === 'select' ? (
        <>
          <header className="editorial">
            <p className="kicker">月饺接力</p>
            <h1>Moon Dumpling Relay</h1>
            <p className="lede">
              I seated fox, raccoon, and owl diners around a moon-gate table.
              The plates are procedural. Chili slick panics; tea-leaf speeds.
              No cats, no sushi brand, no borrowed restaurant.
            </p>
          </header>
          <aside className="desk">
            <p className="panel-kicker">Seat a diner</p>
            <p className="panel-title">{selected.name}</p>
            <p className="panel-copy">
              {selected.nameZh}. {selected.lede} Two invented guests will sit with you.
            </p>
            <div className="chips" role="group" aria-label="Diners">
              {DINERS.map((diner) => (
                <button
                  key={diner.id}
                  type="button"
                  className={diner.id === hud.selectedId ? 'active' : undefined}
                  onClick={() => onSelect(diner.id)}
                >
                  {diner.name}
                </button>
              ))}
            </div>
            <button type="button" className="copy" onClick={onStart}>
              Start the 55s relay
            </button>
          </aside>
        </>
      ) : null}

      {hud.phase === 'countdown' ? (
        <p className="banner" aria-live="polite">
          {Math.ceil(hud.countdown)}
        </p>
      ) : null}

      {hud.phase === 'play' && hud.player ? (
        <>
          <aside className="desk slim">
            <p className="panel-kicker">{dinerById(hud.player.dinerId).nameZh}</p>
            <p className="panel-title">{hud.player.score} pts</p>
            <p className="panel-copy">
              {statusLine(hud)} · fold {hud.player.chain || '—'}
            </p>
            <ol className="scores">
              {hud.rivals.map((rival) => (
                <li key={rival.dinerId}>
                  <span>{dinerById(rival.dinerId).name}</span>
                  <strong>{rival.score}</strong>
                </li>
              ))}
            </ol>
          </aside>
          <p className="hint">
            A / D walk <span className="sep">·</span> Space eat <span className="sep">·</span> Shift
            dash
          </p>
        </>
      ) : null}

      {hud.phase === 'results' ? (
        <aside className="desk results">
          <p className="panel-kicker">Moon gate closed</p>
          <p className="panel-title">Relay card</p>
          <ol className="scores tall">
            {ranked.map((actor, index) => (
              <li key={actor.dinerId}>
                <span>
                  {index + 1}. {dinerById(actor.dinerId).name}
                  {actor.isPlayer ? ' · you' : ''}
                </span>
                <strong>{actor.score}</strong>
              </li>
            ))}
          </ol>
          <p className="panel-copy">{hud.lastBite}</p>
          <div className="chips">
            <button type="button" className="copy" onClick={onAgain}>
              Same diner
            </button>
            <button type="button" className="ghost" onClick={onSeat}>
              Change diner
            </button>
          </div>
        </aside>
      ) : null}

      <p className="sr-only">
        Moon Dumpling Relay. Phase {labelPhase(hud.phase)}. {hud.lastBite}
      </p>
    </>
  );
}

function statusLine(hud: HudSnapshot): string {
  if (hud.status === 'chili') return 'chili panic';
  if (hud.status === 'tea') return 'tea-leaf speed';
  return hud.lastBite;
}

function labelPhase(phase: Phase): string {
  if (phase === 'select') return 'character select';
  if (phase === 'countdown') return 'countdown';
  if (phase === 'play') return 'relay';
  return 'results';
}
