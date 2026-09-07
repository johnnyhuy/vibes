# Reverse Engineering: Procedural Grass Field

**References**:
- [Bilal Khan (@Bk23544)](https://x.com/Bk23544/status/2096928659785626028) — Three.js Grassworks “GOLD” post (verified 2026-09-07 via X API, post id `2096928659785626028`)
- Live demo (public): [grassworks.techredux.co/demo](https://grassworks.techredux.co/demo)
- OG still: `https://pbs.twimg.com/news_img/2096928708632395776/P0gOe-WT` (1200×630)
- Video thumb: `https://pbs.twimg.com/amplify_video_thumb/2096927228965920768/img/d4JeQEdn_grzipfJ.jpg` (2560×1264)

**Study date**: 2026-09-07  
**Status**: **Built** — `experiments/procedural-grass-field/` (Wind Lea). Clean-room only.

**Disclaimer**: I have not copied their code, shaders, meshes, waitlist chrome, or branding.

---

## What The Post And Demo Show

Bilal’s public copy: a high-performance procedural grass system for Three.js, “dense, dynamic, interactive,” shipping with presets inspired by real-world species plus stylised looks. I treated that as a *feel* brief. I did not open their JS bundles or copy materials.

### Observed demo chrome (inspiration only)

Public HUD at [grassworks.techredux.co/demo](https://grassworks.techredux.co/demo), read without lifting source:

| Control | What I saw |
| --- | --- |
| Preset | Sunny / Golden Hour / Rain / Wind Calm / Bowed / Moon Light |
| Grass type | Blade / Billboard |
| Quality | Performance / Balanced / High / Ultra |
| Sliders | Wind Strength, Grass Height, Simulation Speed, Pixel Ratio |
| Toggle | Foot Interaction |
| Meters | FPS, TRIS |
| Move | WASD walk, mouse look, Shift run |
| Boot | “Initializing…” overlay, then **Start** |
| CTA | Join Waitlist |

I did **not** rebuild that product sheet. An educational subset is enough: a few invented looks, wind + height, frosted HUD, orbit (or a gentle walk). GPU instancing / shader blades, procedural only.

**Stack guess**: Three.js, custom grass vertex displacement, instancing or compute, a first-person controller. I did not inspect their source.

## Clean-room mapping

| Their pattern | What I shipped |
| --- | --- |
| Dense interactive meadow | Instanced crossed blades + wind shader (`Wind Lea / 青原`) |
| Seven named presets | Four invented looks (Noon / Amber / Overcast / Night) plus four species chips. Smaller than their sheet; still educational |
| Blade / Billboard | One crossed-plane blade. No billboard path this pass |
| Performance → Ultra | Spare / Full / Dense instance counts |
| Wind Strength + Grass Height | Same idea, my uniforms |
| Simulation Speed, Pixel Ratio, FPS, TRIS | Skipped. Not the lesson |
| Foot Interaction + WASD / Shift | Pointer gust that parts blades. Orbit camera, not a walker |
| Initializing… / Start / Waitlist | None. App just starts. Branding is `vibes · grass field` |

## What I did NOT copy

- No Grassworks, Techredux, or waitlist wordmark
- No their preset names, loader, FPS overlay, or first-person rig
- No scraped GLSL, textures, or commercial grass cards
- No imported turf / plant GLB
- No new Vercel project

## Why instanced shaders (not a blade GLB)

Educational repo. A meadow is tens of thousands of near-identical stems. A GLB blade would hide the lesson and blow the instance budget. See [ADR-0011](../adr/0011-procedural-grass-instancing.md).

## Stack I chose

Vite + React 19 + R3F + drei + three `~0.170`. `InstancedMesh` + custom `ShaderMaterial`. Same kitchen-sink lane as Lumen Cuff and North Court.

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-07
