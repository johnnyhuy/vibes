# Keel Hex — KH-55 trainer bench

I built this after reading [@Peter05704721](https://x.com/Peter05704721/status/2097144569989300371). The public pitch: GPT-6 Astra knocked out a Three.js assembly view for a drone / flight-controller build — step scrubber, parts coming together, explore the completed aircraft, Replay. They point at [s3-px4-assembly.pages.dev](https://s3-px4-assembly.pages.dev). I studied the **post text** and the **X video thumb** (`hill-climb/refs/px4-assembly-x-thumb-20260908.jpg` when present) only. I did **not** scrape, fork, or copy that live site’s source, assets, branding, part catalog, or UI chrome. This is my educational demo — **vibes · keel hex**. The chassis is invented: **KH-55 / Spool Plate / 卷盘板**.

## What I built

- **A hex trainer on a white bench** — soft studio, contact shadow, a paper floor. Not another dusk harbour or kiln desk.
- **KH-55 / Spool Plate** — twelve marks I named: plate, keel spars, rotor cups, Nest Board, loom traces, Spool Cell, bind straps, petal rotors, skid feet, bind pin, canopy spine, bench complete. Not their quad, not an OEM flight-controller list.
- **Assembly scrubber** — Previous / Next / Replay, a progress fraction, 1x / 2x / 4x walk. Drag orbits. Explore holds or releases the turntable. No audio.
- **Frosted 2026-09-08 HUD** — light glass, Inter, teal accent. Brand `vibes · keel hex`. Bottom dock on a phone; side dock on a wide bench.
- **Readable PBR mid-fi** — lathed cups, extruded hex deck, copper petals, celadon nest. Vendored Poly Haven studio HDRI (CC0). No Kenney toy pack.

Drag to orbit. Wheel zooms. Arrow keys walk the marks. `R` replays.

## Stack

Vite + React 19 + R3F + drei + three `~0.170`.

## Run

```bash
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173)

```bash
npm install && npm run build
```

## Deploy

**No Vercel project.** Do not create one on this PR. Hobby quota on `johnnyhuy-dev` stays exhausted until **~2026-09-08 20:39 UTC**. I am not burning a slot on a new app. This experiment is **local-only**.

`vercel.json` only carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. If I add a project later, the name pattern is `vibes-<experiment>` — here **`vibes-keel-hex`**. Dashboard **Root Directory** must be `experiments/keel-hex`.

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / nacre-loom / heartwood-warden / moon-dumpling-relay / foil-tilt-card / zephyr-vale / cinder-mere / kiln-studs / alba-forum / brine-causeway / breakwater / this bench. Do not create `vibes-keel-hex` here.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- White studio: paper floor, soft contact shadow, KH-55 hex trainer framed. Brand `vibes · keel hex`.
- Thin frosted HUD: lockup, KH-55 · Spool Plate. Dock walks twelve invented marks. No PX4 / S3 chrome.
- Scrubber, Previous / Next / Replay, 1x–4x. Explore orbits the sealed trainer; Hold stops the turntable.
- Completed craft reads as a hex (six spars, six copper petals, celadon nest, teal cinches). Not a quad clone.
- Console: no fatals. Benign WebGL `ReadPixels` / software-GL notes only. Build green.
- Still: `docs/previews/keel-hex.png`.

No Vercel project. No production URL.

## Distinct from siblings

Explode-assembly is a **Tesla Model 3 product explode**. Kiln Studs is a **brick-set studio**. Japanese-tower is a **pagoda lift**. Breakwater is a **harbour walker**. This pass is a **step-sequenced trainer assembly** on a white bench.

## Related

- [docs/reverse-engineering/keel-hex.md](../../docs/reverse-engineering/keel-hex.md)
- [docs/adr/0023-keel-hex-assembly.md](../../docs/adr/0023-keel-hex-assembly.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
