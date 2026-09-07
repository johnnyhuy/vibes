# Design sweep — frosted HUD / cinematic studio

Hill-climb pass against the X.com clean-room refs. I changed **experiment UI, lighting, and camera** only. I did not scrape meshes, and I left the root README apps table alone (PR #21 squash-merged with GIFs).

Production stills Johnny attached after #21 (`readme-shots/`: explode, steam-atlas, glass-brain, earth, v8, physics, semicircle) are the **visual baseline**. Steam and physics read dark / low-contrast; semicircle prod is still the cropped XY sliver (`25587f54`). This branch is rebased onto `1e26ce5` (XZ arc + corner-fit) and keeps that framing.

**No Vercel redeploy on this pass.** Hobby quota is still tight. Local `npm run build` + preview is the QA. Production stills in `docs/previews/` are **pre-sweep** until the next honest ship.

## Refs → apps

| X ref (pattern only) | Informed |
| --- | --- |
| [ashebytes Model X / anatomy](https://x.com/ashebytes/status/2096009146248122416) — black studio, frosted HUD, ordered parts | `explode-assembly` (right overview card, glass panels), `procedural-steam-atlas` (bottom explode dock, ring platform) |
| [DilumSanjaya V8](https://x.com/DilumSanjaya/status/2096280244663775423) — gauges, firing order, cinematic cutaway | `v8-cutaway` |
| [alwayspriyesh / Astra Earth](https://x.com/alwayspriyesh/status/2096819464688005440) — starfield, thin timeline, editorial chrome | `earth-timeline` |
| [himanshubuildss glass bottle](https://x.com/himanshubuildss/status/2096243989439713677) — transmission glass, quiet chrome, lime frame | `scroll-product-showcase` |
| [Legendaryy semicircle](https://x.com/Legendaryy/status/2096510965789422001) — full-arc framing | `blender-semicircle-viewer` |
| Glass brain / steam atlas / Japanese tower / Ballance thumbs in `hill-climb/refs/` | `glass-capability-brain`, `japanese-tower`, `ballance-roll`, `chinese-courtyard`, `web-physics` |

Thumbs: `hill-climb/refs/ashe-modelx.jpg`, `v8-dilum.jpg`, `earth-astra.jpg`, `himanshu-glass-bottle-thumb.jpg`, `glass-brain-x-thumb.jpg`, `steam-atlas-thumb.jpg`, `japanese-tower-thumb.jpg`.

## What I changed

Highest-gap first:

1. **earth-timeline** — bulky bottom card + solid play button → Astra-class layout: left editorial, thin tick timeline, frosted play pill, Earth offset with terminator lighting, camera pulled back.
2. **v8-cutaway** — Courier slabs + muddy grid → Inter HUD, cycle chips, firing-order dots, glass dock, matte block / chrome crank, ring platform, FOV 36.
3. **scroll-product-showcase** — already the closest read. Added lime frame, quiet nav, batch badge, pill CTAs, slightly wider hero camera. Still Aether, not TEPHRA.
4. **procedural-steam-atlas** — opaque corner panel in a void → plaque + editorial + bottom glass dock, `#000` studio, key/fill/rim, illuminated ring. Follow-up vs prod still: lifted metal values, exposure, and rim so the boiler no longer disappears into black.
5. **blender-semicircle-viewer** — slim editorial chrome on top of `1e26ce5` XZ horseshoe + above-front corner-fit (margin 1.14). Pure black studio. Prod still is stale cropped XY.
6. **explode-assembly** — already the Model 3 studio. More transparent glass + selected-part overview card (right).
7. **web-physics** — quiet kicker + kbd chips. Follow-up vs prod still: ACES exposure, stronger key/fill/rim, lighter floor so bodies read against black.
8. **glass-capability-brain** — kept the **light clinical stage** (Claude Fable-class, not a dark hero). Dock is more glass, less solid white.
9. **japanese-tower / ballance-roll / chinese-courtyard** — kept outdoor cinematic lighting; panels drop from ~0.6 white to ~0.4 glass.

## What I did not do

- No proprietary meshes, no scraped assets.
- No root README rewrite (apps table + preview stills stay with the sibling docs pass).
- No new Vercel projects, no `vercel --prod`.
- Semicircle **production** is still stale `25587f54` until quota allows one `main` redeploy.

## Local QA

`npm run build` passed for earth, v8, scroll-product, steam-atlas, semicircle, explode.

Headed preview on `127.0.0.1:4173–4178` (2026-09-08):

| App | Verdict | Notes |
| --- | --- | --- |
| earth-timeline | PASS | Timeline, play, go-back, back-to-today. Globe right of centre on starfield. |
| v8-cutaway | PASS | Speed / pause / play. Ring platform, firing-order dots. |
| scroll-product-showcase | PASS | Scroll rolls the bottle; nav jumps. Lime frame strengthened after the first pass (was too faint). |
| procedural-steam-atlas | PASS | Bottom dock explode + isolation. Ring platform. Follow-up: boiler silhouette reads (not black-into-black). |
| blender-semicircle-viewer | PASS | Horizontal XZ horseshoe, both ends visible (not the cropped XY sliver). |
| explode-assembly | PASS | Battery card, explode slider, isolate / show everything. |
| web-physics | PASS | Bodies pop; floor separates from the void. Click / Space spawn. |

No Vercel redeploy.

**Author:** Johnny Huynh (via cloud agent)  
**Date:** 2026-09-08
