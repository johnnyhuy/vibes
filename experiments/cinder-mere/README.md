# Cinder Mere — dusk-basin drive slice

I built this after reading [@ShifroAnimation](https://x.com/ShifroAnimation/status/2097116905068966284). The public pitch: a Muse Spark-assisted Three.js browser driving demo with daytimes and vehicle physics. The live they linked is [gg-shifro.vercel.app](https://gg-shifro.vercel.app/) — marketed as Aura Valley, an ultra-realistic open-world sunset drive. I studied the public post, the video thumb, and the live *read* only. I did **not** clone, scrape, or paste their source, meshes, textures, HUD strings, map data, or Vercel bundle. This is my educational demo — **vibes · cinder mere**. The place is invented: **Cinder Mere / 烬泽**.

## What I built

- **A compact heightmapped basin** — a mere in the middle, a rising rim, dusk haze. Not 16 km². One `heightAt(x, z)` shared by the mesh, the cart, and the marks.
- **Soot Runner / 炱奔** — a kiln-yard utility cart from boxes, drums, and a soot canvas. No sports GT. No car GLB.
- **Arcade drive** — W accelerate, S brake / reverse, A D steer, Space brake. Height samples keep the cart on the bowl. Soft follow cam.
- **Four marks I named** — Wick Spire, Pewter Jetty, Low Kiln, Flint Ford. Not their loop, not Zephyr Vale’s oak / bothy / mill.
- **Dusk / day / cycle** — two looks I mixed, plus a slow auto blend. Default is dusk.
- **Mute-default reed bed** — filtered noise + two quiet sines. The toggle starts **Muted**.

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

**No Vercel project.** Do not create one on this PR. Hobby quota on `johnnyhuy-dev` stays exhausted until **~2026-09-08 20:39 UTC**. I am not burning a slot on a new app. This experiment is **local-only**.

`vercel.json` only carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. If I add a project later, the name pattern is `vibes-<experiment>` — here **`vibes-cinder-mere`**. Dashboard **Root Directory** must be `experiments/cinder-mere`.

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / nacre-loom / heartwood-warden / moon-dumpling-relay / foil-tilt-card / zephyr-vale / this basin. Do not create those pending projects here.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Dusk canvas: ember haze, dark mere, Wick Spire lamp, Soot Runner on the Flint Ford bank. Brand `vibes · cinder mere`.
- Day chip: brighter blue sky, green bowl, teal mere. Same invented cart — not their GT.
- Drive: W raises Pace (0 → 5 in the puppeteer pass). First spawn sat in the mere and cancelled motion; the cart now wakes on the dry bank.
- Mute stays default. No console fatals; only benign WebGL `ReadPixels` notes.
- Still: `docs/previews/cinder-mere.png`.

No Vercel project. No production URL.

## Distinct from siblings

Zephyr Vale is a **sunlit walker**. Heartwood Warden is a **moonlit walk + casts**. Amber Longeron is a **lane-dodge biplane**. Ballance-roll is a **marble**. This pass is a **dusk drive slice**.

## Related

- [docs/reverse-engineering/cinder-mere.md](../../docs/reverse-engineering/cinder-mere.md)
- [docs/adr/0018-cinder-mere-drive-slice.md](../../docs/adr/0018-cinder-mere-drive-slice.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
