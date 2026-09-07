# Reverse Engineering: Japanese Tower / Seasonal Atmosphere

**References**:
- [bharatmodi2014](https://x.com/bharatmodi2014/status/2096974996455444494) — “Built a Japanese tower entirely in Three.js” (verified 2026-09-07 via X API, post id `2096974996455444494`)
- Video thumb: `https://pbs.twimg.com/amplify_video_thumb/2096972351984295936/img/OqOOfBQc9LMfZHuT.jpg` (1920×906 still from the attached video)

**Study date**: 2026-09-08  
**Purpose**: Clean-room notes. Built as `experiments/japanese-tower/`.

**Disclaimer**: I studied the public post and the attached video thumb. No code, no assets, no branding copied. This demo is first-person Johnny Huynh / vibes — it is **not** their site. I do **not** use their product name.

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

## What The Thumb Actually Shows

A second pass on the 1920×906 still (2026-09-08). It is **not** a dark studio turntable.

Observed *read* (pattern only — I am not restating their wordmark or poster lines):

- **Minimal glassmorphic product UI** over a 3D seasonal landscape
- **Header toggles** for style / season / weather / time / sound, plus a rebuild action
- **Left editorial** with bilingual labels
- **Centre 3D focus**: construction / growth of a Japanese castle keep (tenshu), stonework, timber scaffolding
- **Right progress %**
- **Bottom timeline scrubber**
- **Low-poly hills / mountains**, pale sky, cinematic but **calm**

So the viral object is a **keep being raised in weather**, not an already-finished pagoda on black.

I will not reuse their product name, their Japanese poster pair, or their exact chrome grid. The pattern I wanted is: *atmosphere as state* **and** *growth as a second axis*.

## Why This Pattern Exists

A static pagoda is a postcard. Two sliders make it a demo:

```
season × dayNight × weather × haze     →  lights, fog, sky, materials, particles
growth ∈ [0, 1]                        →  podium, scaffold, storeys, roofs, finial
```

earth-timeline already does the first shape for geology. This experiment adds a lift.

## Pattern Breakdown

### 1. Procedural stacked roofs + lift (no GLB)

Hypothesis: **stacked hip roofs + scaffold + shader fog + particle rain/snow** is enough.

My keep (original proportions, not a named castle):

- Battered stone podium (four octagonal terraces — my ishigaki *read*, not a named castle)
- Loose stone heaps on the court while the lift is early
- Timber yard piles + a post-and-ledger scaffold that fades at the crown
- Five square storeys, plaster + timber posts + a couple of bay frames
- Four-sided hip roofs with eave plates and corner upturns
- A short bronze finial
- A gravel court ring — mine, not their radar overlay

Growth stages I named: **Podium → Frame → Storeys → Tiles → Crown**.

### 2. Season / weather as first-class uniforms

See [ADR-0007](../adr/0007-scene-atmosphere-state.md). One `resolveLook(state)` returns colours, fog, sun, particles. `resolveBuild(growth)` is the sibling for mesh reveal.

### 3. Day / night is a sun, not a theme toggle

`dayNight ∈ [0, 1]` maps to a 24-hour azimuth. Elevation is `sin((t - 0.25) · 2π)`.

Default first frame is **summer noon, pale sky, mid-lift** so the thumb’s calm valley *read* lands without a click. Night is still on the slider.

### 4. Weather is particles + fog

- Clear — optional spring blossom drift
- Rain — fast downward points, greyer sky
- Snow — slow points, frosted ground
- Mist — large soft points, heavier `FogExp2`

### 5. My chrome, not theirs

Frosted **white** cards (pale product glass), my own layout:

- Top strip: `vibes · japanese tower` + season / weather / time / haze + **Raise again**
- Left: **尾根** (ridge — my kicker) + Ridge Pagoda + first-person lede
- Right: stage name + %
- Bottom: **Lift the keep** scrubber

I did **not** copy their toggle labels, their poster Japanese, or their single framed-glass stage.

## Clean-room checklist

| I did | I did not |
| --- | --- |
| Read the public X post + video thumb | Open or scrape a linked marketing site |
| Invent Ridge Pagoda geometry + scaffold from primitives | Copy their keep mesh, textures, or animation curves |
| Write original React / R3F / CSS | Copy their JS, fonts, or component tree |
| Brand as vibes · japanese tower / 尾根 | Use their product name or their Japanese poster lines |
| Cite the post as inspiration | Claim I created the original viral clip |

## When To Use This Pattern

### Good for

- Outdoor architectural demos where time-of-day **and** assembly are the product
- Educational scenes where two resolvers (`look`, `build`) are the lesson

### Bad for

- Photoreal heritage reconstruction (you want surveyed meshes)
- Indoor product heroes (Aether already spends that budget)

## What I Learnt

1. Fog colour must track the horizon or the pagoda “cuts out” of the sky
2. A finished keep at dusk hid the thumb’s actual hook (growth)
3. Scaffold that does not recede at 100% still looks like a construction site
4. Pale glass chrome reads on a pale noon *and* on a night sky
5. One resolver each for air and lift beats a pile of `useEffect`s

## Related / next

- Built: `experiments/japanese-tower/`
- Built next: [Rolling marble / ocean of clouds](./ballance-roll-threejs.md)
- Still parked (not built; thumb treated cautiously): [Audio gadget product spin](./audio-gadget-product-spin.md)

## Attribution & Ethics

- @bharatmodi2014 inspired this study
- I am **not** redistributing their code, video, or assets
- Geometry, materials, and UI are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-08
