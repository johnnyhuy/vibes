# Brine Causeway — coast-highway drive slice

I built this after reading [@arianlooterking](https://x.com/arianlooterking/status/2097080866526704056). The public pitch: a browser NFS-ish coast run, rainy / golden visuals, Three.js + Astra overnight on Mindblown. The live they linked is [apex-coast-run.mindblown.ai](https://apex-coast-run.mindblown.ai/) — marketed as APEX Coast Run. I studied the public post, the X thumb, and the live *read* only. I did **not** clone, scrape, decompile, or paste their source, meshes, textures, HUD strings, map data, or bundle. This is my educational demo — **vibes · brine causeway**. The place is invented: **Brine Causeway / 盐桥**.

## What I built

- **A compact coast loop** — two-lane asphalt along a cliff, ocean on one side, stylized pines on the other. Not an open world. One out-and-back with hairpins.
- **Iodine Wedge / 碘楔** — a procedural mid-engine coupe I modelled from boxes. Salt-black clearcoat, copper stripe. No licensed sports-car GLB, no Ferrari nouns.
- **Vermilion Span / 朱跨** — one invented red suspension bridge over Kelp Cut. Landmark, not their bay crossing.
- **Arcade drive** — W accelerate, S brake / reverse, A D steer, Space brake. Soft chase cam after the start gate. C tightens the boom. R banks at Salt Reach.
- **Late sun / after rain / dusk tide** — golden hour is the default. Rain wets the deck. Dusk lifts the tower lamps. Mute-default wind + surf. The toggle starts **Muted**.
- **Start gate** — the wedge sits until **Cut the brine**. Quality can drop to performance if the machine asks.

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

Project `vibes-brine-causeway` (`prj_UmVE510DKswQAtJf6NVYzOzQvqQf`) exists as **link-only**. It was created `deploy: false` while Hobby quota on `johnnyhuy-dev` is still exhausted. SSO off. **No production yet.** Do not promote production or burn a deploy until quota recovers **~2026-09-08 20:39 UTC**.

Dashboard **Root Directory** must be `experiments/brine-causeway`. `create_git_project` does not write that field. `vercel.json` only carries the usual Vite fields plus `ignoreCommand`. See [the drift note](../../docs/incidents/2026-09-08-readme-vercel-link-only-drift.md).

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / nacre-loom / heartwood-warden / moon-dumpling-relay / foil-tilt-card / zephyr-vale / cinder-mere / kiln-studs / alba-forum / this causeway. Do not create extra pending projects here.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Late-sun canvas: warm haze, two-lane strip, Vermilion Span in the distance, Iodine Wedge on Salt Reach. Brand `vibes · brine causeway`.
- Thin HUD: lockup, one atmosphere chip, Cut the brine, invented specs. No third-party rail, likes, or “Make one like this”.
- After rain chip: wet deck, cooler fog, falling streaks. Same invented coupe — not a red convertible meadow.
- Drive: Cut the brine, then W raises the chip (Salt Reach · 0 → n). Soft chase cam.
- Mute stays default. No console fatals; only benign WebGL `ReadPixels` notes.
- Still: `docs/previews/brine-causeway.png`.

Linked, no production URL.

## Distinct from siblings

Cinder Mere is a **dusk basin + kiln cart**. Zephyr Vale is a **sunlit walker**. Amber Longeron is a **lane-dodge biplane**. This pass is a **coast road + bridge + sports coupe**.

## Related

- [docs/reverse-engineering/brine-causeway.md](../../docs/reverse-engineering/brine-causeway.md)
- [docs/adr/0021-brine-causeway-coast-drive.md](../../docs/adr/0021-brine-causeway-coast-drive.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Linked `deploy: false`, 0 production — do not promote until quota recovers  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
