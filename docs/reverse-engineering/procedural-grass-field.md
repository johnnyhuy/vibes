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

Bilal’s public copy: a high-performance procedural grass system for Three.js, “dense, dynamic, interactive,” shipping with presets inspired by real-world species plus stylised looks. The demo page (controls I could read without lifting source) exposes:

- **Looks**: Sunny, Golden Hour, Rain, Wind, Calm, Bowed, Moon Light
- **Grass type**: Blade / Billboard
- **Quality**: Performance / Balanced / High / Ultra
- **Sliders**: wind strength, grass height, simulation speed, pixel ratio
- **Foot interaction**, FPS / TRI counters
- **WASD walk**, mouse look, Shift run
- A waitlist CTA and an “Initializing…” loader

The video is a first-person walk through a thick meadow. I treated that as a *feel* brief: density, wind, species as first-class state. I did not open their JS bundles or copy materials.

**Stack guess**: Three.js, custom grass vertex displacement, instancing or compute, a first-person controller. I did not inspect their source.

## Clean-room mapping

| Their pattern | What I shipped |
| --- | --- |
| Dense interactive meadow | Instanced crossed blades + wind shader (`Wind Lea / 青原`) |
| Species + stylised presets | Rye / Fescue / Reed / Ink — names and palettes I invented |
| Sunny / golden hour / night | Noon / Amber / Overcast / Night (sky + fog + sun + grass shift) |
| Quality steps | Spare / Full / Dense instance counts |
| Wind + height sliders | Same idea, my uniforms |
| Foot / walk interaction | Pointer gust that parts blades. Orbit camera, not WASD |
| Grassworks / Techredux chrome | `vibes · grass field` pale glass HUD |
| Blade vs billboard types | One crossed-plane blade. No billboard path this pass |

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
