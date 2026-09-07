# Reverse Engineering: Rolling Marble / Ocean of Clouds

**References**:
- [fayazara](https://x.com/fayazara/status/2096997505397584041) — “Astra recreated [Atari Ballance] for me for the web using three and webgl” (verified 2026-09-07 via X API, post id `2096997505397584041`)
- Live demo they linked: `https://ballance.fayaz.workers.dev/` (page title *Ballance*; description: “A 3D rolling-ball game inspired by Ballance. Three materials, three courses, and an ocean of clouds.”)
- Video thumb: `https://pbs.twimg.com/amplify_video_thumb/2096997028723404800/img/hfBKcWx5NYYByPyh.jpg` (3456×2168 still from the attached video)
- Local still (if present): `hill-climb/refs/ballance-fayaz-thumb.jpg`

**Study date**: 2026-09-08  
**Purpose**: Clean-room notes. Built as `experiments/ballance-roll/`.

**Disclaimer**: I studied the public post, the attached video thumb, and the public demo *description*. No code, no assets, no branding copied. I did **not** scrape their Workers bundle or clone their course GLBs. This demo is first-person Johnny Huynh / vibes — it is **not** Atari *Ballance* and it is **not** their site. I do **not** use their product chrome or the *Ballance* wordmark in the UI.

---

## What The Post Is

@fayazara wrote that he used to be obsessed with the Atari game *Ballance*, and that Astra recreated it for the web in Three.js / WebGL. The `/goal` was still running; he said he would share the code once it was finished. The t.co unwinds to `ballance.fayaz.workers.dev`.

Public metrics at study time: ~16 likes, 9 replies, 1 repost. Small post, clear pattern.

## What The Thumb Actually Shows

Observed *read* (pattern only — I am not restating their HUD copy or course names):

- Soft high-altitude sky: pink / lavender / pale purple
- An elevated pale-stone path with 90° turns, thin rails, tall pillars into cloud
- A metallic gold marble on a circular pad
- Decorative lanterns and a plaza with glowing pedestals
- A translucent HUD: timer, a counter, a material chip, pause / volume

So the viral object is **a marble you drive over a handmade sky-path**, not a studio turntable.

I will not reuse their course silhouette, their lantern mesh, their four-flame plaza, their `0/3` chip, or the *Ballance* wordmark. The pattern I wanted is: *contact materials you can feel* **and** *a course that reads as floating on cloud*.

## Why This Pattern Exists

A static skybox is a postcard. A marble plus friction is a demo:

```
material ∈ {wood, stone, metal}     →  mass, friction, restitution, drive
course  = pads + beam + ramp        →  static boxes, one quaternion
camera  = follow boom               →  the path reads as a place
```

`web-physics` already drops shapes on a floor. This experiment makes the floor the level.

## Pattern Breakdown

### 1. Procedural course (no GLB)

Hypothesis: **box pads + a thin beam + one pitched ramp + pillars** is enough.

My course (original layout, not theirs):

- Start court
- A straight run and a left elbow
- A plaza with a haze mote
- A second left onto a narrow beam
- A landing, a descending ramp, a finish court with a bronze hoop

Growth / seasons were last week. This week the second axis is **feel**.

### 2. Three feels, one path

See [ADR-0008](../adr/0008-cannon-es-marble-controller.md). Wood / stone / metal are contact materials. I did **not** take paper (the original game’s third). I did **not** build three full courses.

### 3. Ocean of clouds is a plane plus fog

A back-face gradient dome, `FogExp2` in the same mauve, a large soft plane with two sine waves, instanced puffs underneath. That is enough to *read* as “above the weather.” I did not copy their cloud mesh or their sky LUT.

### 4. My chrome, not theirs

Frosted **rose-white** cards (pale product glass on a dusk sky), my own layout:

- Top strip: `vibes · nimbus path` + clock + mote count + wood / stone / metal + **Reset**
- Left: **霞** (haze — my kicker) + Nimbus Path + first-person lede
- Right: course name + status
- Bottom-right: a tiny steer pad I can poke on a laptop trackpad

I did **not** copy their timer / score pairing, their circular material icon, or their pause / volume cluster.

## Clean-room checklist

| I did | I did not |
| --- | --- |
| Read the public X post + video thumb + public page description | Download or decompile their Workers / WebGL assets |
| Invent Haze Walk from primitives | Copy their course, lanterns, pedestals, or marble texture |
| Write original React / R3F / cannon-es / CSS | Copy their JS, fonts, or component tree |
| Brand as vibes · nimbus path / 霞 | Use *Ballance*, Atari marks, or their HUD |
| Cite the post as inspiration | Claim I created the original viral clip or the 2004 game |

## Adjacent X posts I did not build

Parked on purpose. Pattern notes only.

### Chinese courtyard — Blender → GLB → Three.js

- [MrLarus](https://x.com/MrLarus/status/2096971051334857181) (verified 2026-09-07, id `2096971051334857181`)
- Copy: a few chats with GPT-6 Astra → interactive 3D Chinese courtyard. Workflow: Astra writes Python / builds in Blender → export GLB → Three.js.
- Thumb: `https://pbs.twimg.com/amplify_video_thumb/2096970685797064704/img/dAcdmy3AhVAffWX4.jpg`
- Why I parked it: I already have a Blender-MCP lane (`blender-semicircle-viewer`, ADR-0003) and a keep (`japanese-tower`). A courtyard GLB would be a third architecture hero and would want an asset I do not own.
- If I build later: invent the court in primitives or a CC0 GLB I can attribute. Do not copy their layout or furniture.

### Explorable Three.js ocean / dolphin

- [viewsfrom02108](https://x.com/viewsfrom02108/status/2096970479034634587) (verified 2026-09-07, id `2096970479034634587`)
- Copy: freely explorable Three.js ocean, fixed geography, deterministic terrain streaming. Prompt hint: shader waves, sky, objects.
- Thumb: `https://pbs.twimg.com/amplify_video_thumb/2096969119530987520/img/exex-3-da6FfyL7C.jpg`
- Why I parked it: my cloud sea is already a cheap ocean-of-volume. A streaming heightfield + a dolphin mesh is a different experiment (and their dolphin face is their joke, not mine).
- If I build later: shader waves + a procedural critter. No scraped dolphin GLB.

## When To Use This Pattern

### Good for

- Teaching contact materials without a second engine
- Sky-path / marble / vehicle sketches where the *floor* is the product

### Bad for

- Licensed-level remakes (you want the original designer’s layout, which you cannot take)
- Photoreal terrain (you want a heightmap or a surveyed mesh)

## What I Learnt

1. Sphere-vs-box is enough if every visual slab has a matching static body
2. A force controller makes metal feel different; a velocity set does not
3. Cloud colour has to match fog or the path “cuts out”
4. Pillars sell height cheaper than a bigger skybox
5. Do not name the HUD after a 2004 SKU

## Related

- Built: `experiments/ballance-roll/`
- Physics sibling: `experiments/web-physics/`
- Atmosphere sibling: `experiments/japanese-tower/`

## Attribution & Ethics

- @fayazara inspired this study
- Atari / Cyparade *Ballance* is their game; I am not redistributing it
- I am **not** redistributing Fayaz’s Workers demo, video, or assets
- Geometry, materials, and UI are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-08
