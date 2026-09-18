# Nacre Loom — glass vessel studio

I built this after reading [@onix_react](https://x.com/onix_react/status/2096978661802975464). The post is an Interactive WebGL Orb Generator: customisable animated 3D orbs, knobs for colour / motion / shape / glass, and a copy-code vibe. The claimed live site (`lersent001.github.io`) was 404 when I looked, so I studied the public post and the promo still only. I did **not** scrape, clone, or paste their code. This is my educational demo — **vibes · nacre loom**. The vessel is invented: **Nacre Loom / 珠络**.

## What I built

- **A lobed glass vessel** — icosahedron shell with three moving attractors. Not a perfect catalogue sphere. `MeshPhysicalMaterial` transmission, IOR, thickness, roughness, clearcoat.
- **A nacre film** — my own thin-film shader (belt, coil, bloom, wake, veil, seed) plus a fresnel rim and a modest bloom pass. Additive interior. Not their preset names.
- **Recipes I mixed** — Tide Film, Pearl Drift, Brine Glass, Copper Wake, Ink Nacre, Cinder Milk. Chips, not a thumbnail grid.
- **Loom desk** — dyes, speed / amplitude, lobe morph, glass knobs. Well is the close look; Kiln shows the other mixes on a ring.
- **Copy loom snippet** — generated JSON + a short GLSL film helper that is mine.

Drag to orbit. Swap a recipe. Pull the lobe. Copy the snippet.

## Stack

Vite + React 19 + R3F + drei + three `~0.170`.

## Run

```bash
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173)

```bash
npm run build
```

## Deploy

Linked Vercel project `vibes-nacre-loom` / `prj_JG69HBJtf8eb6ZKLqH3IXutMyZNU` (link-only, 0 production, no production URL yet. Production has only been CANCELED lately via ignoreCommand). Dashboard **Root Directory** is `experiments/nacre-loom`. `vercel.json` carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. No new projects (Hobby 25-link cap). See [the drift note](../../docs/incidents/2026-09-08-readme-vercel-link-only-drift.md).

## Related

- [docs/reverse-engineering/nacre-loom.md](../../docs/reverse-engineering/nacre-loom.md)
- [docs/adr/0013-nacre-loom-lobed-glass.md](../../docs/adr/0013-nacre-loom-lobed-glass.md)

---

**Status**: Still link-only, 0 production; Vite ^6.4.3 + this Root-touch force `ignoreCommand` to rebuild `vibes-nacre-loom`  
**Last updated**: 2026-09-19 ~9:30am AEST (nacre-loom-only Vite security bump)  
**Deploy**: Linked `vibes-nacre-loom` / `prj_JG69HBJtf8eb6ZKLqH3IXutMyZNU`. Root Directory `experiments/nacre-loom`. No production URL yet (production CANCELED via ignoreCommand until this Root rebuilds). No new projects (Hobby 25-link cap).  
Built by Johnny Huynh • This is my kitchen sink • Research and education only, not production code
