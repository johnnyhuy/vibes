# Alba Forum — chalk-city landmark scroll

I built this after reading [@levinstanley](https://x.com/levinstanley/status/2097083437610074117). The public pitch: educational scroll through landmarks, click Explore to orbit and zoom details, design directed around “White as the foundation.” The live they linked is [rome.levinstanley.chatgpt.site](https://rome.levinstanley.chatgpt.site/). I studied the **post text**, the **title-card feel** (`hill-climb/refs/explore-rome-thumb.jpg` when present), and the live *read* only — drag orbit, scroll/pinch zoom, an Explore control, a landmark name. I did **not** scrape, fork, clone, or copy their source, assets, CSS, UI chrome, domain, logo, or copy. This is my educational demo — **vibes · alba forum**. The place is invented: **Alba Forum / 白坛**.

## What I built

- **A chalk avenue** — soft off-white foundation, pale stone, sage cypress. Not a dark kiln studio and not another rainy coast drive (Cinder Mere / APEX already cover that lane).
- **Ten invented stops** — Ivory Arch, Chalk Forum, Pale Obelisk, Alabaster Gate, Milk Colonnade, Pumice Bridge, Bone Theatre, Quartz Spire, Linen Basilica, Cloud Rotunda. Not a 1:1 Rome list.
- **Scroll-driven camera** — native window scroll, damped in `useFrame`, same family as scroll-product-showcase. Bidirectional. Prev / next chips and arrow keys step the itinerary.
- **Explore** — orbit + zoom the current landmark mesh. Leave (or Esc) returns to the scroll framing.
- **Procedural architecture** — boxes, cylinders, arches, columns, a half-dome. No scraped GLBs. No runtime CDN.

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

`vercel.json` only carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. If I add a project later, the name pattern is `vibes-<experiment>` — here **`vibes-alba-forum`**. Dashboard **Root Directory** must be `experiments/alba-forum`.

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / nacre-loom / heartwood-warden / moon-dumpling-relay / foil-tilt-card / zephyr-vale / cinder-mere / kiln-studs / this avenue. Do not create those pending projects here.

## Local playtest (2026-09-08)

Headed preview after `npm run build` + `npm run preview` (capture notes in the still):

- Chalk canvas: off-white ground, Ivory Arch framed, brand `vibes · alba forum`.
- Thin frosted HUD: lockup, `01 / 10`, Explore, landmark chip + first-person caption.
- Scroll / Next walks the invented itinerary. Explore orbits the current mesh; Leave returns to scroll framing.
- Still: `docs/previews/alba-forum.png`.

No Vercel project. No production URL.

## Distinct from siblings

Scroll-product-showcase is a **glass bottle hero**. Japanese-tower is a **pagoda lift**. Kiln Studs is a **dark brick studio**. Cinder Mere is a **dusk drive**. This pass is a **white-foundation educational landmark scroll**.

## Related

- [docs/reverse-engineering/alba-forum.md](../../docs/reverse-engineering/alba-forum.md)
- [docs/adr/0020-alba-forum-educational-landmark-scroll.md](../../docs/adr/0020-alba-forum-educational-landmark-scroll.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
