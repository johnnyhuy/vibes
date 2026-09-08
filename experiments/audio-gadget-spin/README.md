# Lumen Cuff — audio gadget spin

I built this after reading three public posts, not after cloning anyone’s repo:

- [@Xr0ud](https://x.com/Xr0ud/status/2096982574132297791) — Claude + Three.js can now stand in for a studio product-spin marketing site
- [@mrblackstudio](https://x.com/mrblackstudio/status/2096893411395600782) — a stylised over-ear with a glass window over an orange driver
- [@Gilbert93533589](https://x.com/Gilbert93533589/status/2096920288319435154) — a product hero with synced click sounds

I studied the *pattern*. I did **not** copy their meshes, stills, chrome, or branding. This is my educational demo — **vibes · audio spin**. The gadget is invented: **Lumen Cuff / 環**.

## What I built

- **Licensed over-ear** — Spacebar’s Headphones (CC-BY-4.0) in `public/models/headphones.glb`. Finishes retint housing / foam / net / screws. Hotspots sit on the real cups and headband. See [ATTRIBUTION.md](./ATTRIBUTION.md).
- **Studio turntable** — dark stage, Poly Haven studio HDRI on the licensed cups, slow auto-orbit. Drag overrides; spin comes back after a beat unless you hold it.
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

Project `vibes-audio-gadget-spin` (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`). SSO off. Dashboard **Root Directory** must be `experiments/audio-gadget-spin`.

Production: [https://vibes-audio-gadget-spin.vercel.app](https://vibes-audio-gadget-spin.vercel.app)

I linked it `deploy: false` before quota. This 2026-09-09 post-quota Root touch is what lets `ignoreCommand` pass so the first production build is not skipped. `create_git_project` does not write Root Directory. I am not creating a new project. See [the incident](../../docs/incidents/2026-09-07-audio-gadget-linked-before-quota.md).

## Related

- [docs/reverse-engineering/audio-gadget-product-spin.md](../../docs/reverse-engineering/audio-gadget-product-spin.md)
- [docs/adr/0010-procedural-audio-spin-mute-default.md](../../docs/adr/0010-procedural-audio-spin-mute-default.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Production alias [vibes-audio-gadget-spin.vercel.app](https://vibes-audio-gadget-spin.vercel.app) — 2026-09-09 Root touch so ignoreCommand builds  
**Last updated**: 2026-09-09  
**Built by**: Johnny Huynh
