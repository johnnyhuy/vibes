# Reverse Engineering: Interactive WebGL Orb Generator

**References**:
- [onix_react](https://x.com/onix_react/status/2096978661802975464) — “Interactive WebGL Orb Generator 🔮 / Create customizable animated 3D orbs / Adjust colors, motion, shape & glass effects / Copy the code and use it in your web projects” (verified 2026-09-07 via X API, post id `2096978661802975464`)
- Claimed live site: `https://lersent001.github.io` — **404** at study time (`entities.urls[0].status: 404`). I did not scrape a bundle that was not there.
- Promo still: `https://pbs.twimg.com/media/HRn2-euboAAyw6u.jpg` (1024×664). Local copy: `hill-climb/refs/orb-onix-fresh.jpg`

**Study date**: 2026-09-07  
**Status**: **Built** — `experiments/nacre-loom/` (Nacre Loom / 珠络). Clean-room only.

**Disclaimer**: I studied the public post text and the attached marketing still. I did **not** open their GitHub Pages source, clone a third-party repo, or paste their GLSL / UI. This demo is first-person Johnny Huynh / vibes — it is **not** their Orb Generator.

---

## What The Post Is

@onix_react pitched a generator: one hero orb, knobs for colour / motion / shape / glass, and a copy-code affordance. The t.co unwind is `lersent001.github.io`, which 404s. Public author bio is React / React Native teaching. The *pattern* is “studio orb you can retune and export a snippet,” not a product GLB.

## What The Thumb Actually Shows

Observed *read* (pattern only — I am not restating their chrome as a spec to clone):

- Dark studio dashboard, cinematic, high contrast
- Left sidebar titled **Presets**: two-column thumbnail catalogue
- Top: language chips + Preview mode **Orb | Scene**
- Bottom: Copy Code button + a GitHub mark
- Hero: a *perfect sphere* of frosted / refractive glass, bloom / glow, thin fresnel rim
- Interior: an animated multi-colour horizontal wave (cyan → magenta → orange)

**Preset labels visible on the still — I did not reuse these strings:**

Siri Wave (selected), Voice Membrane, Particle Ribbons, Crystal Drop, Violet Ember, Refractive Gel, Chromatic Metal, Aurora Veil.

Other thumbs in the rail also read as frost / lightning. I treated those as a *catalogue pattern*, not a name list to ship.

So the viral object is **a glass shell with a living interior and a catalogue of looks**, plus export.

I will not reuse their preset names, thumbnail grid, language switcher, GitHub cat, or “Orb / Scene” lockup. The site being 404 is a gift: there is no honest way to copy their code even if I wanted to.

## What I Inferred

| Their pattern | Inference | Confidence |
| --- | --- | --- |
| Glass rim + interior glow | `MeshPhysicalMaterial` transmission / IOR / thickness, or a custom refraction pass | Medium |
| Horizontal colour belt | Fragment shader band (sine of Y + time), not a mesh ribbon | Medium |
| Shape knob (copy only; still is a sphere) | Vertex displace or morph targets. The still does not show lobes | Low |
| Copy Code | Dump of uniforms / a shader string | Medium |
| Orb / Scene | Close crop vs a wider stage | Medium |
| Preset thumbs | Each look is a uniform pack + maybe a shader variant | High |

I did **not** confirm any of that against their source. The live URL was gone.

## What I Invented

| Their pattern | What I shipped |
| --- | --- |
| Perfect sphere + named catalogue | **Lobed icosahedron** — three orbiting attractors. Shape is a first-class swell, not a sphere with a label |
| Siri Wave / Voice Membrane / Particle Ribbons / Crystal Drop / Violet Ember / Refractive Gel / Chromatic Metal / Aurora Veil | **Tide Film, Pearl Drift, Brine Glass, Copper Wake, Ink Nacre, Cinder Milk** — chips, not thumbs. None of their strings appear in the app. |
| Left preset grid + bottom Copy Code | Right **loom desk** (dyes + sliders + snippet). Editorial left. Topbar Well / Kiln |
| Orb / Scene + 中 EN | **Well** (close vessel) / **Kiln** (hero + the other mixes on a ring). No language chip |
| Their GLSL / JSON | `buildLoomSnippet()` — my JSON shape + a short `nacreFilm()` helper |
| Black generator chrome | Same *studio darkness* as the rest of the 2026-09-08 sweep, pearl-teal accent `#9fd4d0`, brand `vibes · nacre loom` |

The film weaves are mine: belt, coil, bloom, wake, veil, seed. Tide Film’s belt travels cyan → magenta → orange along the longitude, then a custom fresnel rim and a modest `EffectComposer` bloom. That is the *lesson* of a glowing tide line inside glass, not a clone of the labelled mix. Kiln satellites exist so “scene” is a ring of my recipes, not their preview mode.

## What I did NOT copy

- No `lersent001` HTML, JS, or GLSL
- No preset titles from the still (Siri Wave, Voice Membrane, Particle Ribbons, Crystal Drop, Violet Ember, Refractive Gel, Chromatic Metal, Aurora Veil)
- No two-column thumbnail rail
- No language toggle, no GitHub mascot button
- No “Interactive WebGL Orb Generator” wordmark
- No new Vercel project

## Why this experiment

`glass-capability-brain` already teaches a frosted shell around a graph. `scroll-product-showcase` teaches transmission on a bottle. This pass is the missing **retunable glass core** — uniforms you can hear in the look, plus a snippet you can paste into a notes file.

See [ADR-0013](../adr/0013-nacre-loom-lobed-glass.md).

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-07
