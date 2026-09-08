# Breakwater — harbour walker orbit

I built this after reading a public Crayon Arcade pitch for a mecha / flooded-harbour WebGL demo. The *read* I wanted: dusk chrome, a heavy walker on a coastal breakwater, stylized water. Feel-only still: `hill-climb/refs/breakwater-20260908-1418.png` when present. I did **not** scrape, clone, decompile, or paste their source, meshes, chassis nouns, HUD strings, or play bundle. This is my educational demo — **vibes · breakwater**. The place is invented: **Breakwater / 防波**.

## What I built

- **A dusk pier** — concrete deck, lamps, bollards, a tetrapod groyne into the swell. Not a highway, not a basin drive.
- **Spile Frame / 桩架** — a harbour walker I modelled from boxes. Pile-shoes, ballast torso, hook boom, pile-ram. Designation **SF-04 HARBOUR**. No OEM / branded mecha nouns.
- **Stylized water** — sine-displaced plane, dusk fresnel, foam on the crests. Not a photo ocean.
- **Orbit / explore** — drag to orbit. Marks reframe: Spile Frame, Groyne Head, Tide Gate.
- **Dusk tide / afterglow / fog bank** — dusk is the default. Mute-default surf. The toggle starts **Muted**.

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

Project `vibes-breakwater` (`prj_ZR9kwHuMM2cBrQPvtuoXkdwunyho`) exists as **link-only**. It was created `deploy: false` while Hobby quota on `johnnyhuy-dev` is still exhausted. SSO off. **No production yet.** Do not promote production or burn a deploy until quota recovers **~2026-09-08 20:39 UTC**.

Dashboard **Root Directory** must be `experiments/breakwater`. `create_git_project` does not write that field. `vercel.json` only carries the usual Vite fields plus `ignoreCommand`. See [the drift note](../../docs/incidents/2026-09-08-readme-vercel-link-only-drift.md).

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / nacre-loom / heartwood-warden / moon-dumpling-relay / foil-tilt-card / zephyr-vale / cinder-mere / kiln-studs / alba-forum / brine-causeway / this pier. Do not create extra pending projects here.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Dusk canvas: ember haze, stylized water, tetrapod groyne, Spile Frame on the seaward deck. Brand `vibes · breakwater`.
- Thin HUD: lockup, one look chip, invented walker specs. No machine grid, no Deploy, no chassis picker.
- Afterglow / fog bank chips retint the harbour. Same invented walker.
- Orbit: drag frames the walker; `1` `2` `3` jump marks.
- Mute stays default. No console fatals; only benign WebGL `ReadPixels` notes.
- Still: `docs/previews/breakwater.png`.

Linked, no production URL.

## Distinct from siblings

Brine Causeway is a **coast highway + coupe**. Cinder Mere is a **dusk basin + kiln cart**. Heartwood Warden is a **woodland walker**. This pass is a **harbour pier + heavy walker + orbit**.

## Related

- [docs/reverse-engineering/breakwater.md](../../docs/reverse-engineering/breakwater.md)
- [docs/adr/0022-breakwater-harbour-orbit.md](../../docs/adr/0022-breakwater-harbour-orbit.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Linked `deploy: false`, 0 production — do not promote until quota recovers  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
