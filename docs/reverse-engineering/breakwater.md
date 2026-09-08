# Reverse Engineering: mecha / breakwater harbour (pattern only)

**References**:
- Public Crayon Arcade pitch for a mecha / flooded-harbour WebGL demo. Feel / lighting / “a heavy walker on a breakwater” only.
- Feel-only still: `hill-climb/refs/breakwater-20260908-1418.png` when present — dusk HUD, chassis grid, flooded harbour language. Mood only. Not a spec.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/breakwater/` (Breakwater / 防波). Clean-room only.

**Disclaimer**: I studied the public *pitch* and the attached still’s *read*. I did **not** download or decompile their JS, copy meshes, textures, HUD strings, chassis nouns, or branding. This demo is first-person Johnny Huynh / vibes — it is **not** their forge.

---

## What The Pitch Is

A browser WebGL harbour with a heavy walker, dusk chrome, and a machine-select *language*. The viral object is **a mecha on a coastal breakwater**, not a coast-highway coupe and not a woodland guardian.

I will not reuse their forge title, chassis list, war-zone chips, or deploy CTA.

## What The Still / Pitch Shows

Observed *read* (pattern only — I am not restating their HUD copy as a spec):

- Dark tactical dusk, orange accent, frosted panels
- A flooded harbour / pier as the stage
- One heavy walker as the hero (their still also shows a picker; I did not build a picker)
- Thin technical type, invented mass / plant language
- Orbit / inspect, not a third-person fighter this pass

## Why This Pattern Exists

A still walker is a statue. A framed harbour you can orbit is a demo:

```
pier + groyne     →  readable coast without a highway
walker            →  one invented chassis
water             →  sine swell + dusk fresnel
camera            →  orbit + mark reframes
look              →  dusk / afterglow / fog
```

Brine Causeway already teaches a **coast drive**. This experiment makes the **pier + walker** the lesson.

## Pattern Breakdown

### 1. Compact harbour, not their map

Hypothesis: **one pier + tetrapod arm + tide gate** is enough.

My ship:

- Concrete deck, lamps, bollards
- Tetrapod groyne into the swell
- Tide Gate as a second silhouette

I did **not** lift a war-zone layout or their flooded-harbour mesh.

### 2. Invented walker, not a chassis clone

Spile Frame is boxes + hydraulics + a pile-ram. Not a rifle-and-shield assault frame. No OEM nouns.

### 3. Thin dusk HUD, not a forge desk

Brand `vibes · breakwater`. One look chip. Invented specs. Three marks. Mute starts on. No machine grid.

### 4. Local lighting

Small Harbour Sunset 1k HDRI, vendored. Distinct from Venice Sunset and The Sky Is On Fire.

## What we inferred vs what we built

| Inferred from the public pitch | What I built |
| --- | --- |
| Browser WebGL harbour | Vite + R3F pier |
| Heavy walker hero | Procedural Spile Frame |
| Dusk / flooded water | Dusk tide + sine water |
| Inspect / select language | Orbit + three marks |
| Thin dusk chrome | `vibes · breakwater` only |
| Chassis picker / deploy | Not built |

## Clean-room checklist

| I did | I did not |
| --- | --- |
| Read the public pitch + feel-only still | Download or decompile their play bundle |
| Invent Breakwater, Spile Frame, and three marks | Copy their chassis list, HUD strings, or CTA |
| Write original React / R3F / CSS | Copy their JS, fonts, or component tree |
| Brand as vibes · breakwater / 防波 | Use their forge title or OEM mecha nouns |
| Cite the pitch as inspiration | Claim I created the original clip |

## When To Use This Pattern

### Good for

- Teaching a framed hero without a DCC
- Harbour lighting as scene state
- A walker that stays inspectable

### Bad for

- A fighter sim (you want combat, not orbit)
- Licensed mech remakes (you want the original loft, which you cannot take)

## What I Learnt

1. Tetrapods plus lamps already read as “breakwater”
2. A pile-ram reads as harbour work; a rifle would have been their game
3. Do not name the HUD after someone else’s forge
4. Keep it distinct from Brine Causeway: pier + walker, not highway + coupe

## Related

- Built: `experiments/breakwater/`
- Coast sibling: `experiments/brine-causeway/`
- Drive sibling: `experiments/cinder-mere/`
- Walker sibling: `experiments/heartwood-warden/`

## Attribution & Ethics

- The public pitch inspired this study
- I am **not** redistributing their demo, video, or assets
- Geometry, materials, and UI are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-08
