# Cinder Mere — dusk-basin drive slice

I built this after reading [@ShifroAnimation](https://x.com/ShifroAnimation/status/2097116905068966284). The public pitch: a Muse Spark-assisted Three.js browser driving demo with daytimes and vehicle physics. The live they linked is [gg-shifro.vercel.app](https://gg-shifro.vercel.app/) — marketed as Aura Valley, an ultra-realistic open-world sunset drive. I studied the public post, the video thumb, and the live *read* only. I did **not** clone, scrape, or paste their source, meshes, textures, HUD strings, map data, or Vercel bundle. This is my educational demo — **vibes · cinder mere**. The place is invented: **Cinder Mere / 烬泽**.

## What I built

- **A compact heightmapped basin** — a mere in the middle, a rising rim, dusk haze. Not 16 km². One `heightAt(x, z)` shared by the mesh, the cart, and the marks.
- **Soot Runner / 炱奔** — Poly Haven’s portable welding cart (CC0 PBR GLB) with lamps I added. Terrain stays the heightmap. No sports GT.
- **Arcade drive** — W accelerate, S brake / reverse, A D steer, Space brake. Height samples keep the cart on the bowl. Soft follow cam.
- **Four marks I named** — Wick Spire, Pewter Jetty, Low Kiln, Flint Ford. Not their loop, not Zephyr Vale’s oak / bothy / mill.
- **Dusk / ash noon / cycle** — dusk is the default. Ash noon is pewter sky + dusty ochre, not a lush meadow. A slow auto blend.
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

Project `vibes-cinder-mere` (`prj_pXdvd08peYAlt8s9QrW3yRB6nNvv`) exists as **link-only**. It was created `deploy: false` while Hobby quota on `johnnyhuy-dev` is still exhausted. SSO off. **No production yet.** Do not promote production or burn a deploy until quota recovers **~2026-09-08 20:39 UTC**.

Dashboard **Root Directory** must be `experiments/cinder-mere`. `create_git_project` does not write that field. `vercel.json` only carries the usual Vite fields plus `ignoreCommand`. See [the drift note](../../docs/incidents/2026-09-08-readme-vercel-link-only-drift.md).

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / nacre-loom / heartwood-warden / moon-dumpling-relay / foil-tilt-card / zephyr-vale / this basin. Do not create extra pending projects here.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Dusk canvas: ember haze, dark mere, Wick Spire lamp, Soot Runner on the Flint Ford bank. Brand `vibes · cinder mere`.
- Thin HUD: brand, editorial, one Flint Ford pace chip, WASD hint. No tabs, swatches, loop map, or giant speedo.
- Ash noon chip: pewter sky, dusty ochre bowl. Same licensed kiln cart — not a yellow GT meadow.
- Drive: W raises the chip (Flint Ford · 0 → 5). Cart wakes on the dry bank.
- Mute stays default. No console fatals; only benign WebGL `ReadPixels` notes.
- Still: `docs/previews/cinder-mere.png`.

Linked, no production URL.

## Distinct from siblings

Zephyr Vale is a **sunlit walker**. Heartwood Warden is a **moonlit walk + casts**. Amber Longeron is a **lane-dodge biplane**. Ballance-roll is a **marble**. This pass is a **dusk drive slice**.

## Related

- [docs/reverse-engineering/cinder-mere.md](../../docs/reverse-engineering/cinder-mere.md)
- [docs/adr/0018-cinder-mere-drive-slice.md](../../docs/adr/0018-cinder-mere-drive-slice.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Linked `deploy: false`, 0 production — do not promote until quota recovers  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
