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

Linked Vercel project `vibes-breakwater` / `prj_ZR9kwHuMM2cBrQPvtuoXkdwunyho` (link-only, 0 production, no production URL yet). Dashboard **Root Directory** is `experiments/breakwater`. `vercel.json` carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. No new projects (Hobby 25-link cap). See [the drift note](../../docs/incidents/2026-09-08-readme-vercel-link-only-drift.md).

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

**Status**: Still link-only, 0 production; Vite ^6.4.3 + this Root-touch force `ignoreCommand` to rebuild `vibes-breakwater`  
**Last updated**: 2026-09-18 ~2:24pm AEST (breakwater-only Vite security bump)  
**Deploy**: Linked `vibes-breakwater` / `prj_ZR9kwHuMM2cBrQPvtuoXkdwunyho`. Root Directory `experiments/breakwater`. No production URL yet. No new projects (Hobby 25-link cap).  
Built by Johnny Huynh • This is my kitchen sink • Research and education only, not production code
