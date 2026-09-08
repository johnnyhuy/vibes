# Reverse Engineering: a three-environment chase (pattern only)

**References**:
- [BrenBuilds](https://x.com/BrenBuilds/status/2097221820743139824) — “After Carl’s Yellowstone bison toss in July, we made a quick game. It was previously flat. Now Bison Breakaway has three environments: Grand Prismatic, Old Faithful & Artist Point. Built with Astra, @threejs and Blender.” (verified 2026-09-08 via X API, post id `2097221820743139824`)
- Live they advertised: `bison-breakaway.brenhq.com` — public t.co card title *Bison Breakaway — A Yellowstone Chase*; description “One bison. Three ways to run. Play Gauntlet, Yellowstone Escape and Endless.” Pattern only. **I did not network-fetch that site into the repo.**
- Feel-only stills: `hill-climb/refs/bison-breakaway-20260908-1824.png` when attached (menu, not in-level 3D). Pattern only: dark charcoal, three place tabs, poster card, play CTA, controls legend. If the file is missing from a checkout, the same *read* is in the operator attachment.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/ochre-gallop/` (Ochre Gallop / 赭奔). Clean-room only.

**Disclaimer**: I studied the public post text, the public card title / description, and a feel-only **menu** still. I did **not** download or decompile their JS chunks, copy meshes, textures, HUD strings, mode names, park branding, poster illustration, or Blender files. This demo is first-person Johnny Huynh / vibes — it is **not** their chase.

---

## What The Post Is

@BrenBuilds wrote that a July toss joke became a quick game, that it used to be flat, and that it now has three named environments. Stack pitch: Astra, Three.js, Blender. They @ the park service. Public metrics at study time: ~67 impressions, 1 like. Clear pattern, small account.

The viral object is **three places you chase through**, not a studio turntable and not a single dusk basin.

## What I Took (pattern)

Observed *read* (pattern only — I am not restating their HUD copy or domain chrome as a spec):

- A lobby before the 3D: poster card + three place tabs + a play CTA
- Three selectable environments
- A chase / run loop after play
- A four-legged runner in the lower third; follow-cam language
- Browser playable
- Three loop *feels*: a weave, an escape, an endless hold

I will not reuse their title, park place-names, mode names, animal brand, NPS marks, poster illustration, yellow CTA, or jump/slide legend.

## Why This Pattern Exists

A single heightmap is a postcard. Three authored fields plus a stride is a demo:

```
biome     →  height(x, z) + look + props
stride    →  throttle / steer / burst on that field
loop      →  gates  |  closing front  |  distance
camera    →  soft boom behind the runner
```

Cinder Mere already teaches a **cart on one bowl**. This experiment makes **biome switching** the lesson.

## Pattern Breakdown

### 1. Three height fields, not their park

Hypothesis: **three compact functions** are enough.

My ship:

- Sulfur Terrace — concentric lips + a teal pool
- Spout Basin — sinter bowl + vent cones
- Rim Overlook — shelf + canyon drop
- Shared `heightAt(biome, x, z)` for mesh, runner, and marks

I did **not** lift a displacement map, spline, or Blender scene from their site.

### 2. Arcade stride, not a physics clone

Signed speed, slope samples, a short burst. Gallop is four sine legs. No cannon-es (that lesson is the marble).

Ashmane is boxes and a mane. Not a photographed bison.

### 3. Invented loops, not their mode list

| Feel I read | Noun I shipped | What it does |
| --- | --- | --- |
| Weave / gauntlet | Ribbon Cut | Six ochre gates on the terrace |
| Escape | Plume Break | Steam front vs Clear Crust |
| Endless | Shelf Drift | Distance on the overlook |

### 4. Invented lobby chrome

The menu still is two columns: a print card and a tab / copy / play stack. Mine:

- Left: SVG highland print (rings / vents / shelf). Stamp `OG · 赭奔`
- Tabs: Sulfur Terrace / Spout Basin / Rim Overlook
- CTA: **Open Sulfur Terrace** (updates with the tab)
- Legend: WASD stride, space burst, Esc highlands
- Copper rust button, celadon stamp — not their yellow pills or silk-screen toss

### 5. Thin frosted HUD

Brand `vibes · ochre gallop`. Left editorial in Johnny voice. Right stride chip. Mute starts on. No likes rail, no park lockup, no third-party CTA.

## Clean-room checklist

| I did | I did not |
| --- | --- |
| Read the public X post + public card title / description | Fetch, scrape, or decompile their live site |
| Invent Ochre Gallop, Ashmane, three highlands, three loops | Copy their map, runner, HUD strings, or Blender assets |
| Write original React / R3F / CSS | Copy their JS, fonts, or component tree |
| Brand as vibes · ochre gallop / 赭奔 | Use their title, park names, NPS marks, or mode names |
| Cite the post as inspiration | Claim I created the original pitch |

## Explicit non-copy list

Do not ship, even as “placeholder”:

- Their product title or domain lockup
- Grand Prismatic / Old Faithful / Artist Point as place names
- Gauntlet / Yellowstone Escape / Endless as mode titles
- Yellowstone, NPS, or park-service marks
- Their bison mesh, hide texture, or Blender hero
- Their menu poster, silk-screen toss, compass, or dashed trail
- Their HUD chrome, fonts, yellow Play label, or jump/slide legend
- Any file fetched from their advertised host into `experiments/`

## When To Use This Pattern

### Good for

- Teaching biome-switched height fields without a DCC
- A chase slice that stays inspectable
- Showing why three loops beat three skyboxes

### Bad for

- Park-accurate tourism (you want licensed GIS and a real animal)
- A physics ungulate (you want hoof contact and a real rig)

## What I Learnt

1. Concentric steps already read as “terrace”
2. A moving fog box sells “escape” harder than a timer chip
3. A canyon is a clamp you *allow* to fail
4. Do not name the HUD after someone else’s park
5. Keep it distinct from Cinder Mere: runner + three fields, not cart + one bowl

## Related

- Built: `experiments/ochre-gallop/`
- Drive sibling: `experiments/cinder-mere/`
- Coast sibling: `experiments/brine-causeway/`
- Dodge sibling: `experiments/amber-longeron/`

## Attribution & Ethics

- @BrenBuilds inspired this study
- I am **not** redistributing their live demo, video, or assets
- Geometry, materials, and UI are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-08
