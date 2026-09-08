# Reverse Engineering: TusharXo / Crayon “Where the Wind Wanders”

**References**:
- [TusharXo](https://x.com/TusharXo/status/2096741535891251261) — “Game is live now! Built with GPT-6 Astra, Three.js & @usecrayon” (verified 2026-09-08 via X API, post id `2096741535891251261`)
- Live play URL from the task / t.co: [https://app.usecrayon.ai/play/a9a3c165-74b3-4ff6-9588-ad97f829ddb5](https://app.usecrayon.ai/play/a9a3c165-74b3-4ff6-9588-ad97f829ddb5)
- Quoted progress clip: [TusharXo](https://x.com/TusharXo/status/2096380894579929427) — GPT-6 Astra + Three.js, “will be live on @usecrayon later today”
- X photo still: `https://pbs.twimg.com/media/HRkc1uoaQAAJv_0.jpg` — local copy `hill-climb/refs/tushar-wind-wanders.jpg` when present
- Crayon play OG still — `hill-climb/refs/crayon-wind-wanders-og.jpg` when present (mood / lighting / composition only)
- Optional sibling vibe — `hill-climb/refs/crayon-tide-remembers-thumb.jpg` when present. **Not built this PR.** Underwater Ghibli-town feel only; I stayed on the sunlit vale.
- Progress video thumb: `https://pbs.twimg.com/amplify_video_thumb/2096376650602848256/img/fwpJyqeSixLxyMUC.jpg` — local copy `hill-climb/refs/tushar-wind-wanders-progress.jpg` when present
- Attached hill-climb stills on the agent pass (mood / lighting / composition only). If a checkout is missing the binaries, the same stills live on those posts.

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/zephyr-vale/` (Zephyr Vale / 风笺谷). Clean-room only.

**Disclaimer**: I studied the public post text, the quoted progress post, and the public X stills. I did **not** download their play bundle, clone Crayon chrome, copy their map layout, HUD copy, meshes, or brand. This demo is first-person Johnny Huynh / vibes — it is **not** “Where the Wind Wanders.”

---

## What The Post Is

@TusharXo posted a live Crayon play link for a peaceful outdoor wander. Author bio: indie game dev, building @usecrayon. The *pattern* I wanted is “a quiet sunlit valley you walk, gathering letters the wind left.” The *lesson* is the same one Heartwood Warden took from a different post: generation is the start; the walkable place is the product.

Moon Dumpling Relay already took the party-game slice. Wind Lea is an inspectable meadow. Heartwood Warden is a moonlit combat-adjacent glade. This pass is daylight free-roam with collectible notes — not a conveyor, not a meadow-only orbit, not a warden with casts.

## What The Public Pitch Shows

Observed *read* (pattern only — I am not restating their chrome as a spec to clone):

**X live still** (`tushar-wind-wanders.jpg`):

- High, slightly bird’s-eye look down a grassy knoll toward pale water and mossy islands
- One large deciduous tree as a focal point, a simple seat, a small figure, a floating companion
- Soft daylight, haze on the horizon, painterly greens and milky turquoise
- Post-and-rail fence + dirt path (I will not redraw that fence)

**Crayon play OG** (`crayon-wind-wanders-og.jpg`, when present):

- Wider valley, winding path, rustic homestead, water, large clouds
- Soft afternoon light; a yellow-dressed wanderer and purple droplet companion
- I will not redraw that silhouette, scarf, cottage, windmill, or sailboat

**Progress still** (`tushar-wind-wanders-progress.jpg`):

- Deeper valley, winding path, rustic structures, a boat, a windmill-like vertical
- Soft afternoon light, large clouds
- Same feel-only rule as the OG

**Sibling vibe, not this experiment** (`crayon-tide-remembers-thumb.jpg`):

- Underwater city, cel outlines, whales, cool blues. Clean HUD.
- I took only “quiet atmosphere + thin HUD.” I did **not** build Tide Remembers.

**Copy on the post** (text only):

- Built with GPT-6 Astra, Three.js, Crayon
- “Game is live now”
- Asks for feedback

I treated those as a *peaceful daylight wander + wind letters*, not a map or character to redraw.

## What I Inferred

| Their pattern | Inference | Confidence |
| --- | --- | --- |
| Crayon play URL | Hosted web build, likely Three.js in their runtime | High (they said Three.js + Crayon) |
| Soft valley + water + islands | Height-mapped terrain + a water plane + a few mounds | Medium |
| Letters / notes on the wind | Collectibles that drift, gathered by proximity | Medium (task brief + title) |
| Free-roam | WASD + a look that still feels exploratory | Medium |
| Quiet atmosphere | No combat loop; audio if any is ambient | High (the stills are non-threatening) |

I did **not** confirm any of that against their bundle.

## What I Invented

| Their pattern | What I shipped |
| --- | --- |
| Where the Wind Wanders + Crayon play chrome | **Zephyr Vale / 风笺谷** — brand `vibes · zephyr vale` |
| Yellow dress, red scarf, brown boots, messenger bag | **Reed Walker** — sand linen, rust sash, straw hat, staff, reed-mat roll |
| Purple teardrop companion | **Bellkite** — cream paper kite + bronze bell |
| Park bench + post-and-rail fence | **Log seat** + reed-marker path (no rail fence) |
| Moss cottage + wooden windmill + two-masted sailboat | **Reed bothy**, **overshot waterwheel**, **coracle** |
| Their tree / island layout | Listening oak on my knoll; seven isles I placed; a ford I invented |
| Their letters / HUD copy | Eight **breeze slips** with verses I wrote |
| Direct-behind or gallery crop | High-angle follow + click-to-look yaw |
| Their audio (unknown) | Mute-default filtered wind + two quiet sines |

## What I did NOT copy

- No Crayon wordmark, play chrome, or map layout
- No “Where the Wind Wanders” title in the HUD
- No yellow-dress wanderer, red scarf, or purple droplet
- No post-and-rail fence, moss cottage, windmill, or sailboat
- No downloaded play JS / meshes / HUD strings
- No Tide Remembers city / whales / beacons
- No new Vercel project

## Why this experiment

Wind Lea teaches instanced grass. Heartwood Warden teaches a moonlit walker with casts. Moon Dumpling Relay teaches a table loop. This pass teaches a **daylight valley wander**: a height function you can read, collectibles that are just proximity + a verse, and a mute-default bed so the vale can stay quiet.

See [ADR-0017](../adr/0017-zephyr-vale-procedural-wander.md).

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
