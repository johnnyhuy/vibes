# Reverse Engineering: Idea → brick-set studio (pattern only)

**References**:
- [Anton Klingspor](https://x.com/antonklingspor/status/2097062589268136439) — “turn any image or idea into a custom LEGO set … built by GPT-6 Astra with three.js. incredibly intricate sets, building instructions & a link to buy the bricks.” (verified 2026-09-08 via X API, post id `2097062589268136439`)
- Public marketing URL in the post / task: [https://setcreator.com](https://setcreator.com). I read the *pitch*, not the running app’s source.
- Video thumb: `https://pbs.twimg.com/amplify_video_thumb/2097062393167990784/img/XUCeVzdNGzHkI4Es.jpg` — local copy `hill-climb/refs/setcreator-anton-thumb-20260908.jpg` when present. Mood only.
- Later feel-only stills (attached 2026-09-08): `hill-climb/refs/setcreator-20260908-1223.png` — a white minimal *gallery* (search + “Rendering preview…” cards). I took **whitespace, one meta line, a quiet chip rail**. I did not copy the white page, search, “Find your next build”, liked/sort chrome, or card grid. `hill-climb/refs/apex-coast-20260908-1223.png` — glossy PBR + golden-hour env on a car. **Lighting only**: stronger env on the plastic, a strip key, warmer kiln-dusk. Not a coast drive, not their HUD.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/kiln-studs/` (Kiln Studs / 窑钉, Ember Hare · 8 / 烬兔). Clean-room only.

**Disclaimer**: I studied the public post text and the X video thumb. I did **not** scrape SetCreator, fork a repo, copy a brick catalog, restyle their chrome, or ship a buy-link. This demo is first-person Johnny Huynh / vibes — it is **not** SetCreator.

---

## What The Post Is

@antonklingspor wrote that any image or idea becomes a custom brick set. GPT-6 Astra plus Three.js. The clip promises intricate assemblies, step instructions, and a commerce hook for the bricks. Public metrics at study time: ~15.1k impressions, 12 likes. Clear pattern, small account.

The t.co in the post advertises the live product. I did not unwind it into their bundle.

## What The Thumb Teaches

Observed *read* (pattern only — I am not restating their chrome as a spec):

- A dark, low-key interior / studio, not a sunny playroom
- One hero set on a plate, cinematic three-quarter
- Bricks that keep their studs; plastic sheen; a soft key from one side
- The viral object is **idea → a buildable set you can orbit and step through**

**Strings and frames I will not reuse:**

SetCreator, LEGO (as a brand or catalog), their buy-link rail, their bridge / city / vehicle sets from the clip, their instruction chrome, their brick IDs, their “from this photo” upload UI.

So the lesson is **a small authored set + studio light + a stepper**, not a storefront.

## What I Inferred

| Their pattern | Inference | Confidence |
| --- | --- | --- |
| Idea / image in | A generator proposes a parts list + poses | High (post text) |
| Studio render | HDRI / env + a key, product still language | High (thumb) |
| Interactive 3D | Orbit a glued assembly | High (Three.js pitch) |
| Building instructions | Step filter on the same parts | High (post text) |
| Buy the bricks | A catalog + affiliate / shop | High (post text) — I will not ship this |

I did **not** confirm any of that against their source.

## What I Invented

| Their pattern | What I shipped |
| --- | --- |
| Photo / idea → GPT set | **Three hardcoded prompts** that only remap a five-colour palette |
| Their demo sets (bridge etc.) | **Ember Hare / 烬兔** — sitting hare, kiln plinth, a tiny pot |
| Official brick catalog | A **42-piece list I wrote** (`catalog.ts`) |
| Buy-link | Nothing. No SKUs, no shop |
| Their HUD / brand | Frosted 2026-09-08 glass, brand `vibes · kiln studs` / 窑钉 |
| GPT-6 Astra pipeline | Vite + R3F only. No API |

## What I did NOT copy

- No files, network calls, or assets from setcreator.com
- No LEGO / SetCreator names, colors, or part numbers
- No commerce, no “add to bag”, no brick-link
- No new Vercel project

## Why this experiment

Explode-assembly already taught a **parts explode**. Japanese tower taught a **lift**. Cinder Mere taught a **drive**. The missing kitchen-sink lesson is **a set you assemble from named steps**, with a mock of “idea in, palette out.”

See [ADR-0019](../adr/0019-kiln-studs-procedural-brick-studio.md).

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
