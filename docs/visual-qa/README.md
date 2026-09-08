# Visual QA

Hill-climb and production visual QA should keep the root README honest.

## Showcase previews

The root README is a **showcase**. Prefer a short looping GIF:

```text
docs/previews/<app>.gif
```

`<app>` is the experiment folder name (`explode-assembly`, `procedural-steam-atlas`, …). Semicircle uses `blender-semicircle.gif`.

- Capture locally (`npm run build` + `npm run preview`, or `npm run dev`) with a few seconds of meaningful motion (slider, explode, orbit, scroll).
- Aim for ~2–4s, ~640px wide, optimised (`ffmpeg` + `gifsicle` when available).
- A still (`docs/previews/<app>.png`) is a temporary fallback if a GIF is impractical — do not leave a 404 page as the hero. `scroll-product-showcase` currently uses a still (`MeshPhysicalMaterial` transmission did not composite in the capture environment). `procedural-grass-field`, `amber-longeron`, `nacre-loom`, `heartwood-warden`, `moon-dumpling-relay`, `foil-tilt-card`, `zephyr-vale`, `cinder-mere`, `kiln-studs`, and `alba-forum` start as stills until I loop the wind, the flight, the film, the glade, the conveyor, the foil, the vale, the basin, the studio, and the avenue.
- Extra angles (explode ordered gallery, etc.) can sit beside the hero as `docs/previews/<app>-gallery.png`.

The apps table in the [root README](../../README.md) embeds the GIFs. Ops status lives in [deployment notes](../deployment/), not in the showcase table.

## Logs

- [2026-09-07 hill-climb](../visual-qa-2026-09-07.md)
- [2026-09-08 production](../visual-qa-2026-09-08-prod.md)
- [Visual quality bar](../visual-quality-bar.md)
- [2026-09-08 design sweep](../design-sweep-2026-09-08.md) — HUD / lighting pass; README preview stills are pre-sweep until the next ship
- [2026-09-08 hi-fi heroes](../visual-qa-2026-09-08-hifi-heroes.md) — Poly Haven PBR forest / kiln cart / HDRIs; local stills refreshed on this pass
