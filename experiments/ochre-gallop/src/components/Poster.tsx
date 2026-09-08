import { BRAND, biomeAt } from '../catalog';
import type { BiomeId } from '../types';

interface Props {
  biome: BiomeId;
}

function TerracePrint() {
  return (
    <g>
      <ellipse cx="120" cy="118" rx="78" ry="52" fill="#6a3a28" />
      <ellipse cx="120" cy="118" rx="62" ry="40" fill="#b85a32" />
      <ellipse cx="120" cy="118" rx="46" ry="28" fill="#d4783a" />
      <ellipse cx="120" cy="118" rx="28" ry="16" fill="#3a8a7c" />
      <ellipse cx="120" cy="118" rx="12" ry="7" fill="#c8ece4" />
      <rect x="108" y="148" width="24" height="14" rx="2" fill="#5a3420" />
      <rect x="112" y="142" width="16" height="8" fill="#d8c8b4" />
    </g>
  );
}

function BasinPrint() {
  return (
    <g>
      <ellipse cx="120" cy="132" rx="86" ry="36" fill="#c8b8a0" />
      <ellipse cx="86" cy="108" rx="28" ry="16" fill="#e0d4bc" />
      <ellipse cx="154" cy="104" rx="24" ry="14" fill="#d4c8b0" />
      <polygon points="72,96 86,58 100,96" fill="#8a6a3a" />
      <polygon points="142,94 154,52 166,94" fill="#7a5a32" />
      <polygon points="108,100 120,68 132,100" fill="#9a7a44" />
      <circle cx="86" cy="48" r="10" fill="#f0ece4" opacity="0.55" />
      <circle cx="154" cy="42" r="12" fill="#f0ece4" opacity="0.4" />
      <circle cx="120" cy="56" r="8" fill="#f0ece4" opacity="0.5" />
    </g>
  );
}

function RimPrint() {
  return (
    <g>
      <polygon points="18,168 92,78 240,168" fill="#3a2418" />
      <polygon points="18,168 240,168 240,196 18,196" fill="#2a1810" />
      <path d="M28 124 C 80 108, 150 112, 222 96" fill="none" stroke="#e0c8a0" strokeWidth="10" />
      <polygon points="168,86 176,58 184,86" fill="#3a4a28" />
      <polygon points="188,82 196,50 204,82" fill="#2a3a20" />
      <polygon points="206,80 214,54 222,80" fill="#3a4a28" />
      <circle cx="198" cy="44" r="11" fill="#e89a48" />
      <rect x="94" y="108" width="22" height="12" rx="2" fill="#5a3420" />
    </g>
  );
}

export default function Poster({ biome }: Props) {
  const spec = biomeAt(biome);

  return (
    <figure className={`poster poster-${biome}`} aria-hidden>
      <svg viewBox="0 0 240 220" className="poster-print" role="img">
        <rect width="240" height="220" fill="transparent" />
        {biome === 'terrace' && <TerracePrint />}
        {biome === 'basin' && <BasinPrint />}
        {biome === 'rim' && <RimPrint />}
      </svg>
      <figcaption className="poster-caption">
        <p className="poster-stamp">{BRAND.stamp}</p>
        <p className="poster-name">{spec.name}</p>
        <p className="poster-loop">{spec.loop}</p>
      </figcaption>
    </figure>
  );
}
