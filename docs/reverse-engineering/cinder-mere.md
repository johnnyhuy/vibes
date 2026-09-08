# Reverse Engineering: Aura Valley open-world drive (pattern only)

**References**:
- [ShifroAnimation](https://x.com/ShifroAnimation/status/2097116905068966284) — “Decided to stress test Muse Spark 1.3 xhigh on 3D game logic in Three.js. Built out an entire browser driving demo with different daytimes, and vehicle physics.” (verified 2026-09-08 via X API, post id `2097116905068966284`)
- Live they linked: [https://gg-shifro.vercel.app/](https://gg-shifro.vercel.app/) — public page title *Aura Valley — Ultra Realistic Open World Drive*
- Video thumb: `https://pbs.twimg.com/amplify_video_thumb/2097116044192350208/img/U4tma-Ej9qWmN7x0.jpg` — local copy `hill-climb/refs/aura-valley-shifro-thumb.jpg` when present
- Headed live *read* (2026-09-08): dusk / sunset valley, a drivable vehicle, time-of-day chrome, a follow-ish camera. Pattern only.
- X video thumb (`aura-valley-shifro-thumb.jpg`, attached as `aura-valley-thumb-20260908.jpg` when present): one daylight frame — chase-cam behind a low car, wide grassy basin, scrub on the floor, trees on the slopes, bright blue sky. Sky / terrain / vehicle *silhouette* only. I did not redraw their asphalt loop, sports GT, or HUD.
- Live QA still (2026-09-08 ~11:41, `hill-climb/ref-aura-valley-20260908-1141.png` when present): hood / FPV over a bright daytime meadow with tree rows. Dense product chrome (title lockup, vehicle panel, swatches, tabs, circular loop map, large speed readout, click-to-look). Pattern only. I will not restating those nouns as a spec, and I will not ship hood-cam meadow + yellow GT.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/cinder-mere/` (Cinder Mere / 烬泽). Clean-room only.

**Disclaimer**: I studied the public post text, the video thumb, the public page *title*, and the live *read*. I did **not** download or decompile their Vercel JS chunks, copy meshes, textures, HUD strings, map data, or branding. This demo is first-person Johnny Huynh / vibes — it is **not** Aura Valley.

---

## What The Post Is

@ShifroAnimation wrote that they stress-tested Muse Spark on 3D game logic in Three.js and shipped a browser driving demo with daytimes and vehicle physics. The t.co unwinds to `gg-shifro.vercel.app`. Public metrics at study time: ~15.7k impressions, 21 likes. Clear pattern, small account.

## What The Thumb / Live Read Shows

Observed *read* (pattern only — I am not restating their HUD copy or domain chrome as a spec):

- An open dusk / sunset valley; warm horizon, haze, a long view
- A drivable vehicle in the lower third; follow-cam language
- Time-of-day as a first-class control
- Browser playable, WASD-class drive
- Marketed open-world scale (they claim a large valley)

The viral object is **a dusk valley you drive**, not a studio turntable and not a walker.

I will not reuse their valley title, vehicle name, loop chrome, or map.

## Why This Pattern Exists

A static valley is a postcard. A cart that leans on a height field is a demo:

```
height(x, z)  →  bowl + mere + rim
drive         →  throttle / steer / brake on that field
sky           →  two (or more) authored looks
camera        →  soft boom behind the cart
```

Zephyr Vale already teaches a **sunlit walk**. This experiment makes the **vehicle** the lesson.

## Pattern Breakdown

### 1. Compact heightmap, not their world

Hypothesis: **a 128-unit basin + a water disc + exponential fog** is enough.

My ship:

- Low mere in the centre, rising rim, southwest ford tongue
- Vertex colours: grass / reed / silt / ash ring / rock
- Shared `heightAt` for mesh, cart, and marks

I did **not** lift a displacement map or road spline from their site.

### 2. Arcade cart, not a physics clone

Four height samples and a signed speed. Pitch / roll from the slope. Deep water dumps speed. No cannon-es (that lesson is the marble).

Soot Runner is a kiln cart: box, drums, hoop, lanterns. Not a clear-coat GT.

### 3. Daytimes as looks, not their clock

Dusk (default) and **ash noon** — pewter sky, dusty ochre bowl, not a lush meadow. A slow cycle. Lamps brighten at dusk. The 2026-09-08 live still is hood-cam meadow daylight; I kept the opposite read.

### 4. Thin frosted HUD, invented marks

Brand `vibes · cinder mere`. Left editorial in Johnny voice. A small pace chip names the nearest mark. WASD hint. Mute starts on. No tabs, swatches, loop map, or giant speedo.

Marks: **Wick Spire**, **Pewter Jetty**, **Low Kiln**, **Flint Ford**.

## Clean-room checklist

| I did | I did not |
| --- | --- |
| Read the public X post + video thumb + public page title + live *read* | Download or decompile their Vercel / WebGL assets |
| Invent Cinder Mere, Soot Runner, and four marks | Copy their map, vehicle, HUD strings, or loop |
| Write original React / R3F / CSS | Copy their JS, fonts, or component tree |
| Brand as vibes · cinder mere / 烬泽 | Use Aura Valley, their vehicle name, or their chrome |
| Cite the post as inspiration | Claim I created the original viral clip |

## When To Use This Pattern

### Good for

- Teaching height-sampled vehicles without a DCC
- Dusk / day as scene state (with ADR-0007)
- A drive slice that stays inspectable

### Bad for

- Open-world production (you want streaming, a road network, and a real vehicle)
- Licensed-car remakes (you want the original loft, which you cannot take)

## What I Learnt

1. A bowl plus fog already reads as “valley”
2. Follow-cam height sells the cart more than a wide FOV
3. Slope drag keeps the rim from feeling like ice
4. Do not name the HUD after someone else’s valley
5. Keep it distinct from Zephyr Vale: dusk + drive, not daylight + walk
6. Their live still is hood-cam meadow + dense chrome — thin dusk HUD is the clean-room answer

## Related

- Built: `experiments/cinder-mere/`
- Wander sibling: `experiments/zephyr-vale/`
- Vehicle sibling: `experiments/amber-longeron/`
- Contact sibling: `experiments/ballance-roll/`

## Attribution & Ethics

- @ShifroAnimation inspired this study
- I am **not** redistributing their Vercel demo, video, or assets
- Geometry, materials, and UI are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-08
