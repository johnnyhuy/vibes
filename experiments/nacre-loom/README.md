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

**No Vercel project.** Do not create one on this PR. Hobby quota on `johnnyhuy-dev` stays exhausted until **~2026-09-08 20:39 UTC**. I am not burning a slot on a new app.

`vercel.json` only carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. If I add a project later: dashboard **Root Directory** must be `experiments/nacre-loom`.

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / this orb. Do not create those pending projects here.

## Related

- [docs/reverse-engineering/nacre-loom.md](../../docs/reverse-engineering/nacre-loom.md)
- [docs/adr/0013-nacre-loom-lobed-glass.md](../../docs/adr/0013-nacre-loom-lobed-glass.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-07  
**Built by**: Johnny Huynh
