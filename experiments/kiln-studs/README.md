# Kiln Studs — Ember Hare

I built this after reading [@antonklingspor](https://x.com/antonklingspor/status/2097062589268136439). The public pitch: turn any image or idea into a custom brick set, built with GPT-6 Astra and Three.js — intricate sets, building instructions, and a link to buy the bricks. They point at [setcreator.com](https://setcreator.com). I studied the **post text** and the **X video thumb** only. I did **not** scrape, fork, or copy SetCreator source, assets, branding, brick-catalog APIs, buy-links, or UI chrome. This is my educational demo — **vibes · kiln studs**. The set is invented: **Ember Hare · 8 / 烬兔**.

## What I built

- **A sitting kiln-hearth hare** — forty-two procedural stud bricks I placed by hand. Not their bridge, not a licensed minifig, not a Kenney toy pack.
- **Idea → palette** — three hardcoded prompts (Dusk hare, Clay slip, Pewter ash). They only remap five colours I named. No network, no model call.
- **Studio / kiln dusk / pewter** — vendored 1k HDRIs plus a strip key and a reflector floor. Kiln dusk is the default (warm env, not a coast drive). A bronze-rim pedestal I modelled, not a downloaded stand.
- **Assemble / step / explode** — eight marks I named. Arrow keys walk the instruction. `E` separates the studs. `R` puts them back.
- **Frosted 2026-09-08 HUD** — brand lockup, Inter, thin glass. Looks stay on the top bar (Cinder Mere language). Idea chips sit on the desk as a small prompt rail — not a white gallery, not their search. No commerce rail.

Drag to orbit. Wheel zooms. Space plays the steps.

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

Linked Vercel project `vibes-kiln-studs` / `prj_qI0BHjZbM8vNYHuhPtpmN91ZOLT8` (link-only, 0 production, no production URL yet. Production has only been CANCELED lately via ignoreCommand). Dashboard **Root Directory** is `experiments/kiln-studs`. `vercel.json` carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. No new projects (Hobby 25-link cap). See [the drift note](../../docs/incidents/2026-09-08-readme-vercel-link-only-drift.md).

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Kiln dusk default: warm env, strip key, reflector floor. Frosted HUD, brand `vibes · kiln studs`. Not their chrome.
- Ember Hare reads as a sitting kiln-hearth hare (haunches, cream chest, tall ears, a small pot). Collared studs catch the env.
- Desk meta: `42 marks · 8 steps` plus glaze-dot idea chips. No search, no gallery cards.
- Drag orbits; explode separates the 42 bricks; assemble puts them back. Step / Play walk the eight marks.
- Dusk hare / Clay slip / Pewter ash remaps the glaze. Studio / Kiln dusk / Pewter change the stage (vendored HDRIs, no CDN).
- Console: no fatals. Benign WebGL `ReadPixels` / software-GL notes only. Build green.
- Still: `docs/previews/kiln-studs.png`.

Linked, no production URL.

## Distinct from siblings

Cinder Mere is a **dusk drive**. Foil Tilt Card is a **layered print**. Moon Dumpling Relay is a **conveyor table**. Heartwood Warden is a **walkable creature**. Amber Longeron is a **lane-dodge**. Japanese tower is a **pagoda lift**. This pass is a **brick-set studio with instructions**.

## Related

- [docs/reverse-engineering/kiln-studs.md](../../docs/reverse-engineering/kiln-studs.md)
- [docs/adr/0019-kiln-studs-procedural-brick-studio.md](../../docs/adr/0019-kiln-studs-procedural-brick-studio.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Still link-only, 0 production; Vite ^6.4.3 + this Root-touch force `ignoreCommand` to rebuild `vibes-kiln-studs`  
**Last updated**: 2026-09-19 ~8:25am AEST (kiln-studs-only Vite security bump)  
**Deploy**: Linked `vibes-kiln-studs` / `prj_qI0BHjZbM8vNYHuhPtpmN91ZOLT8`. Root Directory `experiments/kiln-studs`. No production URL yet (production CANCELED via ignoreCommand until this Root rebuilds). No new projects (Hobby 25-link cap).  
Built by Johnny Huynh • This is my kitchen sink • Research and education only, not production code
