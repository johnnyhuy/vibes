# Reverse Engineering: Procedural Conveyor Party Game

**References**:
- [clydejuniordev](https://x.com/clydejuniordev/status/2097086770576011601) — “Remade Sushi-Go-Round from Pokémon Stadium, but with cats / Built the whole thing with GPT Astra + Three.js. 8 cats, 3 AI rivals, wasabi chaos, catnip speed boosts. No assets, everything is procedural code. Runs in your browser.” (verified 2026-09-08 via X API, post id `2097086770576011601`)
- Public repo README claims: [clydejuniorscripts/sushi-paws-conveyor-clash](https://github.com/clydejuniorscripts/sushi-paws-conveyor-clash) (MIT). I read the **README only**. I did not clone the tree, open `src/`, or paste their files.
- Video thumb: `https://pbs.twimg.com/amplify_video_thumb/2097084705401163776/img/dzJdHY30DWJNBXsu.jpg`. Local copy: `hill-climb/refs/clyde-conveyor-thumb.jpg`

**Study date**: 2026-09-08  
**Status**: **Built** — `experiments/moon-dumpling-relay/` (Moon Dumpling Relay / 月饺接力). Clean-room only.

**Disclaimer**: I studied the public post text, the attached video thumb, and the GitHub README *claims*. I did **not** copy their source, tests, packaging, cat roster, sushi brand, or Pokémon IP. This demo is first-person Johnny Huynh / vibes — it is **not** Sushi Paws.

---

## What The Post Is

@clydejuniordev pitched a browser party game: a spinning conveyor, pick-a-diner, AI guests, a hazard, a speed boost, all procedural, GPT Astra + Three.js. The t.co unwind is the MIT GitHub repo. Public author bio: random projects, everything free to use.

The *pattern* is “shared rotating table + eat interaction + light AI,” not a restaurant sim and not a Pokémon remake I am allowed to ship.

## What The Thumb / README Claims Teach

Observed *read* (pattern only — I am not restating their chrome as a spec to clone):

- A round dining table with plates riding a ring
- Several stylised animal diners seated / walking the rim
- Warm interior lighting, busy but readable food colours
- A HUD with time and scores
- README claims: WASD + Space eat + Shift dash, 75s rounds, wasabi panic, catnip speed, three AI, eight cats, cosmetics, Windows zip, Pages workflow

**Strings and frames I will not reuse:**

Sushi Paws, Conveyor Clash, Sushi-Go-Round, Pokémon Stadium, their eight cat names, wasabi, catnip, house specials, Chef Hat / Sakura Collar / Tiny Sunglasses / Golden Bell, `sushi-paws-v1`, `PLAY SUSHI PAWS.bat`.

So the viral object is **a procedural conveyor you race with AI**, plus a hazard/boost pair.

## What I Inferred

| Their pattern | Inference | Confidence |
| --- | --- | --- |
| Spinning plates | Kinematic ring; plate world angle = slot + spin | High (README describes a conveyor entity) |
| Eat when close | Angular / reach test, not a physics grab | Medium |
| Wasabi panic | Timed status that overrides steer | Medium (README says 5s uncontrollable) |
| Catnip speed | Timed multiplier | Medium |
| AI rivals | Score plates, walk toward a target | Medium |
| No assets | Primitive rigs + shared materials | High (post + README) |

I did **not** confirm any of that against their source.

## What I Invented

| Their pattern | What I shipped |
| --- | --- |
| Eight cats in a pastel sushi room | **Five diners** — Ember Fox, Ink Raccoon, Paper Owl, Moss Badger, River Hare — around a **moon-gate** table |
| 75s, three AI, cosmetics, zip, Pages | **55s**, **two** AI (`orbit`, `savour`), no unlocks, **local-only** |
| Wasabi / catnip | **Chili slick** / **tea-leaf sprig** |
| Sushi categories + ×2.5 chain | Pleat / soup / moon coin + a small **fold** bonus I numbered |
| Their HUD / brand | Frosted 2026-09-08 glass, brand `vibes · moon dumpling relay` |
| Vanilla `Game.js` tree | React + R3F loop in `sim.ts` + `RelayWorld.tsx` |

## What I did NOT copy

- No files from `clydejuniorscripts/sushi-paws-conveyor-clash`
- No cat names, sushi brand, Pokémon Stadium framing, or packaging
- No wasabi / catnip strings
- No cosmetics economy, Windows zip, or GitHub Pages workflow
- No new Vercel project

## Why this experiment

Amber Longeron already taught a tiny arcade loop. Nacre Loom taught a retunable studio object. This pass is the missing **shared-table party slice** — spawn / respawn on a rail, an eat cone, and two guests who also want the plates.

See [ADR-0015](../adr/0015-procedural-party-game-slice.md).

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
