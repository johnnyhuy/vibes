# Lumen Cuff — audio gadget spin

I built this after reading three public posts, not after cloning anyone’s repo:

- [@Xr0ud](https://x.com/Xr0ud/status/2096982574132297791) — Claude + Three.js can now stand in for a studio product-spin marketing site
- [@mrblackstudio](https://x.com/mrblackstudio/status/2096893411395600782) — a stylised over-ear with a glass window over an orange driver
- [@Gilbert93533589](https://x.com/Gilbert93533589/status/2096920288319435154) — a product hero with synced click sounds

I studied the *pattern*. I did **not** copy their meshes, stills, chrome, or branding. This is my educational demo — **vibes · audio spin**. The gadget is invented: **Lumen Cuff / 環**.

## What I built

- **Procedural over-ear** — tube headband, chrome sliders, squircle cups, a glass driver window, a canvas-painted grille. Primitives + `MeshPhysicalMaterial`. No .glb.
- **Studio turntable** — dark stage, strip Lightformers, slow auto-orbit. Drag overrides; spin comes back after a beat unless you hold it.
- **Three finishes** — Studio, Midnight, Citrus. Hotspots on the driver, cushion, yoke, and edge slab.
- **Mute-default audio** — Web Audio oscillators for a click / whoosh. Browsers block autoplay; the toggle starts **Muted**.

The Xr0ud video thumb I already had looks like a loft / architecture scroll, not a headphone. I treated the *tweet text* as the brief and ignored that still as a build spec.

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

Project `vibes-audio-gadget-spin` (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`) exists. It was created `deploy: false` before the hobby quota resets (~**2026-09-08 20:39 UTC**). SSO off. **No production yet.** Do not redeploy it on this PR.

Dashboard **Root Directory** must be `experiments/audio-gadget-spin`. `create_git_project` does not write that field. `vercel.json` only carries the usual Vite fields plus `ignoreCommand`. See [the incident](../../docs/incidents/2026-09-07-audio-gadget-linked-before-quota.md).

Do not create `vibes-ballance-roll`, a courtyard project, or a grass-field project either.

## Related

- [docs/reverse-engineering/audio-gadget-product-spin.md](../../docs/reverse-engineering/audio-gadget-product-spin.md)
- [docs/adr/0010-procedural-audio-spin-mute-default.md](../../docs/adr/0010-procedural-audio-spin-mute-default.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
