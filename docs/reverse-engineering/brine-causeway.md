# Reverse Engineering: APEX Coast Run (pattern only)

**References**:
- [Arian](https://x.com/arianlooterking/status/2097080866526704056) — “Need for Speed but make it browser-native. Full Ferrari coast run, rainy roads, ridiculous visuals built overnight on Mindblown with Three.js + Astra 6.” (verified 2026-09-08 via X API, post id `2097080866526704056`)
- Live they linked: [https://apex-coast-run.mindblown.ai/](https://apex-coast-run.mindblown.ai/) — public page title *APEX Coast Run*
- X thumb / live stills (mood only): `hill-climb/refs/apex-coast-x-thumb-20260908.jpg`, `hill-climb/refs/apex-coast-20260908-1321.png`, `hill-climb/refs/apex-coast-20260908-1223.png` when present
- Headed live *read* (2026-09-08): golden-hour coast strip, a sports coupe, a red suspension bridge, pines, WASD, a start CTA. Pattern only.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/brine-causeway/` (Brine Causeway / 盐桥). Clean-room only.

**Disclaimer**: I studied the public post text, the video thumb, the public page *title*, and the live *read*. I did **not** download or decompile their JS chunks, copy meshes, textures, HUD strings, map data, or branding. This demo is first-person Johnny Huynh / vibes — it is **not** APEX Coast Run.

---

## What The Post Is

@arianlooterking wrote that they shipped a browser-native Need-for-Speed-ish coast run overnight on Mindblown with Three.js + Astra 6. The t.co unwinds to `apex-coast-run.mindblown.ai`. Public metrics at study time: 8 impressions, 0 likes. Clear pattern, small post.

## What The Thumb / Live Read Shows

Observed *read* (pattern only — I am not restating their HUD copy or domain chrome as a spec):

- A two-lane coastal asphalt strip; ocean / cliff, stylized pines
- Golden-hour haze; an optional rain / after-rain look
- A sports coupe in the lower third; chase-cam language
- A red suspension bridge as the far landmark
- Browser playable, WASD-class drive, a start CTA, mute-able sound
- Thin editorial overlay (brand, atmosphere chip, specs, key legend)

The viral object is **a coast highway you drive**, not a dusk basin and not a walker.

I will not reuse their club title, vehicle name, CTA copy, or bridge.

## Why This Pattern Exists

A static coast is a postcard. A coupe that leaves a painted line is a demo:

```
path(t)       →  two-lane strip + hairpins
drive         →  throttle / steer / brake on that strip
landmark      →  one invented span
sky           →  late sun / after rain / dusk
camera        →  hero still, then a soft boom
```

Cinder Mere already teaches a **basin drive**. This experiment makes the **coast + coupe + bridge** the lesson.

## Pattern Breakdown

### 1. Compact loop, not their map

Hypothesis: **one authored ribbon + ocean plane + pine scatter** is enough.

My ship:

- Outbound / inbound S-curves, hairpins at Salt Reach and Vermilion Span
- Shared `pathAt` / `nearestOnPath` for mesh, coupe, and marks
- Soft shoulder push instead of a physics world

I did **not** lift a road spline or heightmap from their site.

### 2. Arcade coupe, not a physics clone

Signed speed, steer scaled by pace, lateral spring off the painted line. No cannon-es (that lesson is the marble). Iodine Wedge is boxes + physical materials. Not a clear-coat 458.

### 3. Looks as scene state, not their clock

Late sun (default), after rain, dusk tide. Wet roughness + streaks for rain. Tower lamps at dusk. The 2026-09-08 stills are golden-hour black coupe and a red convertible after rain; I kept invented names and a salt-black wedge.

### 4. Thin editorial HUD, invented marks

Brand `vibes · brine causeway`. One atmosphere chip. Cut the brine starts the drive. Invented specs (flat-six, 418 hp). WASD hint. Mute starts on. No likes rail.

Marks: **Salt Reach**, **Vermilion Span**, **Kelp Cut**.

## What we inferred vs what we built

| Inferred from the public pitch | What I built |
| --- | --- |
| Browser Three.js coast drive | Vite + R3F arcade loop |
| Golden hour + rain | Late sun / after rain / dusk tide |
| Sports coupe hero | Procedural Iodine Wedge |
| Red suspension bridge landmark | Vermilion Span over Kelp Cut |
| WASD + start CTA | Same verbs, invented copy |
| Thin editorial chrome | `vibes · brine causeway` only |
| Overnight Mindblown stack | Not used; kitchen-sink sibling stack |

## Clean-room checklist

| I did | I did not |
| --- | --- |
| Read the public X post + thumb + public page title + live *read* | Download or decompile their WebGL assets |
| Invent Brine Causeway, Iodine Wedge, and three marks | Copy their map, vehicle, HUD strings, or CTA |
| Write original React / R3F / CSS | Copy their JS, fonts, or component tree |
| Brand as vibes · brine causeway / 盐桥 | Use APEX, Mindblown, Ferrari, or 458 nouns |
| Cite the post as inspiration | Claim I created the original viral clip |

## When To Use This Pattern

### Good for

- Teaching a path-sampled vehicle without a DCC
- Weather as scene state (with ADR-0007)
- A coast drive that stays inspectable

### Bad for

- Open-world production (you want streaming, a road network, and a real vehicle)
- Licensed-car remakes (you want the original loft, which you cannot take)

## What I Learnt

1. A ribbon plus fog already reads as “coast highway”
2. The start gate sells the first frame more than an always-on drive
3. One red span is enough landmark; a second would be tourism
4. Do not name the HUD after someone else’s club
5. Keep it distinct from Cinder Mere: coast + coupe, not basin + cart

## Related

- Built: `experiments/brine-causeway/`
- Drive sibling: `experiments/cinder-mere/`
- Wander sibling: `experiments/zephyr-vale/`
- Vehicle sibling: `experiments/amber-longeron/`

## Attribution & Ethics

- @arianlooterking inspired this study
- I am **not** redistributing their live demo, video, or assets
- Geometry, materials, and UI are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-08
