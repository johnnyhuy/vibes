# Reverse Engineering: Japanese Tower / Seasonal Atmosphere

**References**:
- [bharatmodi2014](https://x.com/bharatmodi2014/status/2096974996455444494) — “Built a Japanese tower entirely in Three.js” (verified 2026-09-07 via X API, post id `2096974996455444494`)
- Video thumb: `https://pbs.twimg.com/amplify_video_thumb/2096972351984295936/img/OqOOfBQc9LMfZHuT.jpg` (1920×906 still from the attached video)

**Study date**: 2026-09-08  
**Purpose**: Clean-room notes. Built as `experiments/japanese-tower/`.

**Disclaimer**: I studied the public post and the attached video thumb. No code, no assets, no branding copied. This demo is first-person Johnny Huynh / vibes — it is **not** their site.

---

## What The Post Is

@bharatmodi2014 posted a Three.js Japanese tower and listed the interactive axes:

- Seasons
- Day / night
- Weather effects
- Environmental changes
- Dynamic atmosphere

Copy: *“The whole scene changes as you play with the controls. Three.js + AI is getting seriously wild.”*

The t.co in the post expands to the **video attachment**, not a live product URL I could open. I treated the post text + thumb as the spec and invented the rest.

X bookmarks on this account were empty when I checked the hill-climb brief, so this post is a direct citation, not a bookmark replay.

## What I Observed (thumb + copy)

From the 1920×906 video still and the written list:

- A **cinematic landscape** with a Japanese keep / tower as the hero, not a studio turntable
- **Seasonal and weather chrome** in the overlay (the post names summer / clear / noon-class toggles)
- A **glassmorphism** control layer sitting on the 3D view
- The interesting claim is not the mesh: it is that **one set of controls retints the entire world**

I am not restating their product title, Japanese marketing lines, or construction-progress UI. Those belong to them. The pattern I wanted is: *atmosphere as state*.

## Why This Pattern Exists

A static pagoda is a postcard. The viral move is a **small state vector** that fans out:

```
season × dayNight × weather × haze
        ↓
lights, fog, sky, materials, particles
```

That is the same idea as earth-timeline’s era slider, pointed at weather instead of geology.

## Pattern Breakdown

### 1. Procedural stacked roofs (no GLB)

Hypothesis I ran with: **stacked hip roofs + shader fog + particle rain/snow** is enough. I did not import a temple mesh.

My keep:

- Battered stone podium (tapered 8-sided cylinders)
- Five square storeys, each a plaster box + timber posts
- Four-sided cones for tile roofs, plus a thin eave plate and corner upturns
- A short bronze finial

Original proportions. Not a named castle.

### 2. Season / weather as first-class uniforms

See [ADR-0007](../adr/0007-scene-atmosphere-state.md). One `resolveLook(state)` returns colours, fog density, sun elevation, particle kind. The React UI writes the state. The R3F tree only consumes the look.

### 3. Day / night is a sun, not a theme toggle

`dayNight ∈ [0, 1]` maps to a 24-hour azimuth. Elevation is `sin((t - 0.25) · 2π)`. Dawn and dusk borrow a warm horizon. Night raises lantern gain and stars.

### 4. Weather is particles + fog, not a decal

- Clear — optional spring blossom drift
- Rain — fast downward points, greyer sky, extra fog
- Snow — slow points, cooler sky, frosted ground
- Mist — large soft points, heavy `FogExp2`

Haze is a separate slider so you can have a clear noon that is still thick with air.

### 5. Dark cinematic chrome (my bar, not theirs)

`docs/visual-quality-bar.md` wants black stages and frosted panels. My header is **vibes · japanese tower**. Title is **Ridge Pagoda**. I did not reuse their overlay copy.

## Clean-room checklist

| I did | I did not |
| --- | --- |
| Read the public X post + video thumb | Open or scrape a linked marketing site |
| Invent Ridge Pagoda geometry from primitives | Copy their tower mesh, textures, or scaffolding animation |
| Write original React / R3F / CSS | Copy their JS, fonts, or component tree |
| Brand as vibes · japanese tower | Use their product name, Japanese wordmark, or “growth study” framing |
| Cite the post as inspiration | Claim I created the original viral clip |

## When To Use This Pattern

### Good for

- Outdoor architectural demos where time-of-day is the product
- Educational scenes where the **state → look** function is the lesson
- Kitchen-sink experiments that should stay off the asset pipeline

### Bad for

- Photoreal heritage reconstruction (you want surveyed meshes)
- Indoor product heroes (Aether already spends that budget)

## What I Learnt

1. Fog colour must track the horizon or the pagoda “cuts out” of the sky
2. Season-only palettes look fake until day/night also remaps sun intensity
3. Rain that does not also grey the hemisphere reads as a particle bug
4. Four-sided cones are enough for a pagoda *read* if the eave plate is wide
5. One resolver function is easier to document than four ad-hoc `useEffect`s

## Related / next

- Built: `experiments/japanese-tower/`
- Next X candidate (not built this pass): [Audio gadget product spin](./audio-gadget-product-spin.md)

## Attribution & Ethics

- @bharatmodi2014 inspired the study
- I am **not** redistributing their code, video, or assets
- Geometry, materials, and UI are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-08
