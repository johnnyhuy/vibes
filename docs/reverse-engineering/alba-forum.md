# Reverse Engineering: educational landmark scroll (pattern only)

**References**:
- [Levin Stanley](https://x.com/levinstanley/status/2097083437610074117) — “Educational content is about to get really good. Scroll to travel through 12 landmarks of Rome. Click Explore to orbit each building and zoom into the details. … White as the foundation.” (verified 2026-09-08 via X API, post id `2097083437610074117`)
- Live they linked: [https://rome.levinstanley.chatgpt.site/](https://rome.levinstanley.chatgpt.site/) — public page title *Rome in White*. Feel only.
- Title-card thumb: `hill-climb/refs/explore-rome-thumb.jpg` when present — pale field, serif lockup. Mood only.
- Avoid-lane still: `hill-climb/refs/apex-coast-20260908-1223.png` — APEX Coast drive. **Not** this experiment’s target.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/alba-forum/` (Alba Forum / 白坛). Clean-room only.

**Disclaimer**: I studied the public post text, the title-card *feel*, and the live *read* (drag orbit, scroll/pinch zoom, Explore, a landmark name). I did **not** download or decompile their JS, copy meshes, textures, CSS, HUD strings, or branding. This demo is first-person Johnny Huynh / vibes — it is **not** Explore Rome.

---

## What The Post Is

@levinstanley wrote that educational content is about to get good: scroll through landmarks, Explore to orbit and zoom, white as the foundation. The t.co unwinds to `rome.levinstanley.chatgpt.site`. Public metrics at study time: 23 impressions, 1 like. Clear pattern, small post.

## What The Thumb / Live Read Shows

Observed *read* (pattern only — I am not restating their HUD copy or domain chrome as a spec):

- Soft off-white / chalk foundation, not a black studio
- Elegant serif accent on a pale field
- Travel along a sequence of landmarks, then inspect one
- Drag orbit, scroll / pinch zoom
- An Explore control and a landmark name chip

The viral object is **an educational white landmark scroll**, not a product bottle and not a coast drive.

I will not reuse their title, city, landmark nouns, or logo.

## Why This Pattern Exists

A static model is a postcard. A camera that walks an itinerary, then lets you orbit the current mesh, is a lesson:

```
scroll 0 → 1     →  pose lerp across authored stops
current stop     →  name + caption
Explore          →  orbit + zoom that mesh
Leave            →  return to the scroll pose
```

Scroll-product already teaches **scroll → one hero**. This experiment makes **many stops + inspect** the lesson.

## Pattern Breakdown

### 1. Authored poses, not their path

Hypothesis: **ten Vector3 pairs + damp** is enough.

My ship:

- `itinerary.ts` lists ten invented stops
- Camera and look-at lerp with a smoothstep
- Native window scroll, fixed canvas

I did **not** lift a camera spline from their site.

### 2. Invented chalk architecture

Boxes, cylinders, arches, columns, a half-dome. Soft shadows. Off-white materials. Neighbours sit on an avenue so travel reads; the HUD still names one stop.

Names: **Ivory Arch**, **Chalk Forum**, **Pale Obelisk**, **Alabaster Gate**, **Milk Colonnade**, **Pumice Bridge**, **Bone Theatre**, **Quartz Spire**, **Linen Basilica**, **Cloud Rotunda**.

### 3. Explore as a mode

OrbitControls off until Explore. Pointer-events on the canvas only then. Wheel zoom stays in the scene. Esc / Leave restores the scroll framing.

### 4. Thin frosted HUD, white foundation

Brand `vibes · alba forum`. Stop counter. Explore. Serif landmark chip. First-person caption. Inter for chrome. No dark kiln desk, no coast HUD, no bottle cards.

## Clean-room checklist

| I did | I did not |
| --- | --- |
| Read the public X post + title-card feel + live *read* | Download or decompile their site / WebGL assets |
| Invent Alba Forum and ten chalk stops | Copy their Rome list, meshes, or HUD strings |
| Write original React / R3F / CSS | Copy their JS, fonts, or component tree |
| Brand as vibes · alba forum / 白坛 | Use their domain, logo, or “Rome in White” lockup |
| Cite the post as inspiration | Claim I created the original clip |

## When To Use This Pattern

### Good for

- Teaching scroll-driven camera without a DCC
- Explore / inspect as a second axis on the same scene
- A white educational read next to dark studio siblings

### Bad for

- A real city tour (you want licensed surveys and a researched itinerary)
- Photogrammetry landmarks (you want the original loft, which you cannot take)

## What I Learnt

1. Pose lerp already reads as “travel” if the silhouettes change
2. Explore has to steal the wheel or the page keeps scrolling
3. Serif on the chip + Inter on the chrome is enough for a museum read
4. Do not name the HUD after someone else’s city
5. Keep it distinct from the bottle hero and the pagoda lift

## Related

- Built: `experiments/alba-forum/`
- Scroll sibling: `experiments/scroll-product-showcase/`
- Orbit sibling: `experiments/japanese-tower/`
- Avoid-lane drive: `experiments/cinder-mere/`

## Attribution & Ethics

- @levinstanley inspired this study
- I am **not** redistributing their site, video, or assets
- Geometry, materials, and UI are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-08
