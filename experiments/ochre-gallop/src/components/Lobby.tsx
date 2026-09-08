import { BIOMES, BRAND, biomeAt } from '../catalog';
import type { BiomeId } from '../types';
import Poster from './Poster';

interface Props {
  biome: BiomeId;
  muted: boolean;
  onBiome: (id: BiomeId) => void;
  onOpen: () => void;
  onMute: () => void;
}

export default function Lobby({ biome, muted, onBiome, onOpen, onMute }: Props) {
  const spec = biomeAt(biome);

  return (
    <div className="lobby">
      <nav className="lobby-bar" aria-label="Ochre Gallop lobby">
        <p className="brand">{BRAND.lockup}</p>
        <button type="button" className={`ghost compact ${muted ? 'active' : ''}`} onClick={onMute}>
          {muted ? 'Muted' : 'Sinter bed'}
        </button>
      </nav>

      <div className="lobby-grid">
        <Poster biome={biome} />

        <section className="lobby-copy">
          <p className="kicker">{BRAND.nameZh}</p>
          <h1>{BRAND.name}</h1>
          <p className="lobby-line">{BRAND.lobbyLine}</p>

          <div className="chips lobby-chips" aria-label="Highlands">
            {BIOMES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={biome === item.id ? 'active' : undefined}
                onClick={() => onBiome(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <p className="lobby-hook">{spec.hook}</p>
          <p className="lede">{spec.copy}</p>

          <button type="button" className="open" onClick={onOpen}>
            {spec.openLabel}
          </button>

          <p className="lobby-legend">
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd>
            stride
            <span className="sep">·</span>
            <kbd>␣</kbd> burst
            <span className="sep">·</span>
            <kbd>Esc</kbd> highlands
          </p>
          <p className="lobby-facts">{spec.facts}</p>
        </section>
      </div>

      <p className="sr-only">
        {BRAND.lockup}. {spec.name}. {spec.loop}. {spec.copy} Press Enter to open, number keys to pick a highland.
      </p>
    </div>
  );
}
