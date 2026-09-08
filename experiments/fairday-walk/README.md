# Fairday Walk — breezy residential memory walk

I built this after reading [@anyumeng28](https://x.com/anyumeng28/status/2097175519825383852). The public pitch: GPT-6 Astra’s modelling only feels real when you use it; Three.js turned pictures into a 3D version (~50% of a Plus weekly quota); after Blender — or if the quota holds — old photos can become a 3D webpage you walk again. The live they linked is [qingtian-memory-3d.anyumeng28.chatgpt.site](https://qingtian-memory-3d.anyumeng28.chatgpt.site), title *晴天 · 风里的记忆*. I studied the **post text** and the live *read* only — soft outdoor memory places, walk / orbit, photo→3D feel. I did **not** scrape, fork, clone, or copy their source, assets, CSS, UI chrome, domain, logo, or copy. This is my educational demo — **vibes · fairday walk**. The place is invented: **Fairday Walk / 晴巷 · 风里的册页**.

## What I built

- **A breezy residential lane** — plaster, tiled roofs, cobble, hanging cloth. Not a chalk forum and not a dusk harbour.
- **Eight invented stops** — Laundry Court, Bicycle Shed, Courtyard Well, Shop Awning, Window Fern, Rooftop Pigeon, Evening Laundry, Fig Alley. Not a Qing Tian list.
- **Scroll-driven camera** — native window scroll, damped in `useFrame`, same family as Alba Forum / scroll-product-showcase. Bidirectional. Prev / next chips and arrow keys step the folio.
- **Folio / Orbit / Sheetdrift / Recast** — invented mode pills. Folio walks the stops. Orbit + wheel zoom inspects. Sheetdrift keeps leaves and cloth in the breeze. Recast (or double-click) returns the authored pose. Esc leaves Orbit.
- **Clothlight / Porchwash / Lanehaze / Ridgegold / Folio** — invented lighting stances. **Line haze** (Sheet / Drift / Mist) is my breeze→mist axis, not their weather chrome.
- **Mid-fi PBR** — instanced roof tiles, recessed windows, wind-hung laundry, lathed well, tube bicycles, pigeons, striped awning. Local Poly Haven sky HDRI under Suspense. No scraped GLBs. No runtime CDN. No blocky toy as the hero.

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

**No Vercel project.** Hobby quota on `johnnyhuy-dev` is exhausted until **~2026-09-08 20:39 UTC**. Local-only this pass. Do not create a project or promote production.

If I add one later: project name `vibes-fairday-walk`, dashboard **Root Directory** `experiments/fairday-walk`. `create_git_project` does not write that field. `vercel.json` only carries the usual Vite fields plus `ignoreCommand`.

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / nacre-loom / heartwood-warden / moon-dumpling-relay / foil-tilt-card / zephyr-vale / cinder-mere / kiln-studs / alba-forum / brine-causeway / breakwater / this lane. Do not create extra pending projects here.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Teal-mist canvas: Laundry Court on a floating earth-cut plot, court tree, wet cobble, brand `vibes · fairday walk`. Not a chalk avenue and not a dusk pier.
- Thin frosted HUD: lockup, Slip 7, `01 / 08`, Folio / Orbit / Sheetdrift / Recast, invented lighting chips + Line haze (Sheet / Drift / Mist).
- Next walks the invented folio (Bicycle Shed, Courtyard Well, … Fig Alley). No 晴天 / Qing Tian nouns.
- Orbit inspects the current place; Recast / Esc returns to the authored pose.
- Console: no fatals. Benign WebGL `ReadPixels` / software-GL notes only. Build green.
- Still: `docs/previews/fairday-walk.png`.

Local-only. No production URL.

## Distinct from siblings

Alba Forum is a **white landmark scroll**. Chinese-courtyard is a **season siheyuan**. Zephyr Vale is a **reed wander**. This pass is a **soft outdoor photo→3D memory walk** on an invented lane.

## Related

- [docs/reverse-engineering/fairday-walk.md](../../docs/reverse-engineering/fairday-walk.md)
- [docs/adr/0024-fairday-walk-memory-lane.md](../../docs/adr/0024-fairday-walk-memory-lane.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Local-only — do not create a Vercel project until quota recovers  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
