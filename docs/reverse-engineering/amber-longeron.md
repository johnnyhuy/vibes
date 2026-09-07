# Reverse Engineering: Vintage Wooden Biplane Lane-Dodge

**References**:
- [heymichu25](https://x.com/heymichu25/status/2097062564299759855) — “Built a 3D vintage flight mini-game for the web using AI + Three.js & React! Pure WebGL, procedural wooden textures, snappy lane-dodging mechanics, and zero UI for maximum immersion.” (verified 2026-09-07 via X API, post id `2097062564299759855`)
- Live demo they linked: `https://vintage-biplane-experience.ai.studio/` (page title *Vintage Biplane Experience*)
- Video thumb: `https://pbs.twimg.com/amplify_video_thumb/2097062514253316096/img/3CLbMDrQeeVG0Vpw.jpg` (672×1280 portrait still from the attached video)
- Local still (if present): `hill-climb/refs/biplane-heymichu-thumb.jpg`

**Study date**: 2026-09-07  
**Purpose**: Clean-room notes. Built as `experiments/amber-longeron/`.

**Disclaimer**: I studied the public post, the attached video thumb, and the public page *title*. No code, no assets, no branding copied. I did **not** scrape their ai.studio bundle or clone a biplane GLB. This demo is first-person Johnny Huynh / vibes — it is **not** Vintage Biplane Experience. I do **not** use their product chrome or waitlist.

---

## What The Post Is

@heymichu25 wrote that they built a 3D vintage flight mini-game with AI + Three.js + React. The pitch is four beats: Pure WebGL, procedural wooden textures, snappy lane-dodging, zero UI. The t.co unwinds to `vintage-biplane-experience.ai.studio`.

Public metrics at study time: 13 impressions, 0 likes. Small post, clear pattern.

## What The Thumb Actually Shows

Observed *read* (pattern only — I am not restating their HUD copy or domain chrome):

- Portrait follow-cam, behind and slightly above a toy wooden biplane
- Uniform medium-brown airframe: cylindrical fuselage, two plank wings, black cabane struts, a dark prop hub, blocky gear
- Flat beige / tan void. No horizon line in that still
- Three saturated red spheres in a receding diagonal — lane language
- Soft key from upper left; almost no HUD in frame

So the viral object is **a wooden spar you steer between orbs**, not a studio turntable.

I will not reuse their exact wing loft, their domain chrome, or the *Vintage Biplane Experience* wordmark. After a headed look at the public still (tan studio, red lane orbs, no HUD) I adopted that *mechanic and lighting read* with my own linen, carnelian, and score chip. The pattern is: *toy wood you can read* **and** *lanes that snap*.

## Why This Pattern Exists

A static biplane is a postcard. Lanes plus grain is a demo:

```
lane ∈ {left, centre, right}     →  x targets, bank from vx
wood  = soft canvas varnish      →  map + roughnessMap
beat  = orb | ring               →  overlap on z, never all three lanes
camera = close follow boom       →  the studio reads as a place
```

`ballance-roll` already teaches contact on a path. This experiment makes the *vehicle* the lesson.

## Pattern Breakdown

### 1. Composite biplane (no GLB)

Hypothesis: **cylinder fuselage + box wings + strut cylinders + a spinning prop** is enough.

My ship (original silhouette, not theirs):

- One long upper plank, split lower stubs
- Two cabane posts
- Flat rear cap, dark hub, walnut prop
- Block gear, no scraped loft
- Name from the part: a **longeron** is a fuselage spar

### 2. Canvas wood, not a crate texture

See [ADR-0012](../adr/0012-procedural-wood-biplane.md). Amber and walnut maps are painted at runtime with *low* contrast so they read as toy varnish. I did **not** lift a photo from their site.

### 3. Carnelian orbs, my material

The public still uses red spheres as the lane beat. I kept that *mechanic* — a `SphereGeometry` + `MeshPhysicalMaterial` in oxide red I mixed (`#c43a2a`). I did not scrape their mesh or arrange their exact diagonal. Bronze rings stay as a count that is mine.

### 4. Linen studio, not their void hex

Warm linen background `#e6d4b8`, a sand floor, linear fog. Soft key from upper left, the same *lighting read* as the thumb. I am not matching their exact beige or dropping a horizon-less clone of their page.

### 5. Almost-zero chrome

They pitched zero UI. In flight I keep a distance chip only. Ready / crash still have a small frosted card so restart is findable:

- Ready: **桁** (spar) + Amber Longeron + Take off
- Flight: centred metres
- Crash: a centred card, not their domain overlay

I did **not** copy a waitlist, a wordmark, or a cinematic title card.

## Clean-room checklist

| I did | I did not |
| --- | --- |
| Read the public X post + video thumb + public page title | Download or decompile their ai.studio / WebGL assets |
| Invent Amber Longeron from primitives | Copy their biplane loft, grain maps, or orb mesh |
| Write original React / R3F / CSS | Copy their JS, fonts, or component tree |
| Brand as vibes · amber longeron / 桁 | Use *Vintage Biplane Experience* or their HUD |
| Cite the post as inspiration | Claim I created the original viral clip |

## When To Use This Pattern

### Good for

- Teaching composite vehicles without a DCC
- Lane-dodge sketches where the *ship* is the product
- Procedural PBR that stays inspectable (canvas maps)

### Bad for

- Licensed-aircraft remakes (you want the original designer’s loft, which you cannot take)
- Photoreal varnish (you want a scanned board or a film look-dev)

## What I Learnt

1. A follow-cam behind a cylinder already reads as “flight”
2. Bank from lateral velocity sells the snap more than a tweened yaw
3. Never block all three lanes or the run is a coin-flip
4. High-contrast canvas rings look like zebra; toy varnish wants a narrow tone range
5. A dark canyon hid the wood — the public still is a lit studio for a reason
6. Do not name the HUD after someone else’s domain

## Related

- Built: `experiments/amber-longeron/`
- Vehicle sibling: `experiments/procedural-steam-atlas/`
- Feel sibling: `experiments/ballance-roll/`

## Attribution & Ethics

- @heymichu25 inspired this study
- I am **not** redistributing their ai.studio demo, video, or assets
- Geometry, materials, and UI are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-07
