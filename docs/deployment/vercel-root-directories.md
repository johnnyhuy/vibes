# Vercel Root Directory Hints

I'm writing this down because Root Directory lives in the **Vercel dashboard**, not in git. `vercel.json` inside an experiment can set framework / build / `ignoreCommand`. It cannot set Root Directory. A monorepo-root `vercel.json` would fight every other project. I am not adding one.

Team: `johnnyhuy-dev` (`team_qBCPdqU9J1cQDL4rkrFsjNoa`)  
Hobby quota: 100 deploys/day.  
**Repo-link cap: 25 projects per Git repo on Hobby** — still full (verified 2026-09-19 AEST). All 25 linked projects already have READY production. Do **not** call `create_git_project`. Keel Hex, Fairday Walk, and Ochre Gallop stay local-only until I free a slot or upgrade to Pro. See [the incident](../incidents/2026-09-08-vercel-repo-link-limit-25.md).

## Dashboard field (required)

Project Settings → General → **Root Directory** → the experiment folder. Save.

If this is empty, Vercel builds the repo root. There is no root `package.json`. You get ERROR or a 404.

**`create_git_project` reuse (`deploy: false`) does not write this field.** I reused `vibes-steam-atlas` and Root stayed whatever the dashboard already had — still no production. Set it by hand.

**Pause API = 400 on hobby** for that project. I cannot pause it to stop fan-out.

See [the incident](../incidents/2026-09-08-steam-atlas-wrong-root.md).

## Per-app (verified 2026-09-19 AEST, Vercel API team `johnnyhuy-dev`; audio / semicircle / glass IDs rechecked 2026-09-20 AEST)

All **25** git-linked projects are **LIVE** with latest READY production. This table is the source of truth. Do **not** treat any row here as "no project", "0 production", "link-only", or "do not promote".

| Project | Id | Root Directory | Latest READY prod |
| --- | --- | --- | --- |
| `vibes` | `prj_4b6cXKJVxCYNTn6WuofofmkBZPX6` | `experiments/ai-3d-lanes/web-3d` | **LIVE** `dpl_9yb7pJhtoTV4kedonEoi2JMK7Gmb` (#94 Root-touch) |
| `vibes-explode` | `prj_bkyEqYqsAhAk0ZrVnhXi9Him98Fb` | `experiments/explode-assembly` | **LIVE** [vibes-explode.vercel.app](https://vibes-explode.vercel.app) `dpl_9j991HkMAQspi1RtMzvtPvPAoARy` (#74) |
| `vibes-earth` | `prj_SiIJCJMag4TvYUYp8qjzuZ5EIRLe` | `experiments/earth-timeline` | **LIVE** [vibes-earth.vercel.app](https://vibes-earth.vercel.app) |
| `vibes-v8` | `prj_7Em98GNdH9nceT1LonpntoCgNgRY` | `experiments/v8-cutaway` | **LIVE** [vibes-v8.vercel.app](https://vibes-v8.vercel.app) |
| `vibes-physics` | `prj_Ilh5mBV0g7m7btvnxnhZuFY5ZjiH` | `experiments/web-physics` | **LIVE** [vibes-physics.vercel.app](https://vibes-physics.vercel.app) |
| `vibes-blender-semicircle` | `prj_PLhnoCVRKmpHc8SxyLRmcp3MFZMC` | `experiments/blender-semicircle-viewer` | **LIVE** [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app) `dpl_Ei5PArDDuKAJbRDXxeScExHD8sHG` (`447686fb`, #101 Root-touch after #98 Classic Laptop) |
| `vibes-steam-atlas` | `prj_7D08PT8sdUjhigCEuz83oltZrDMv` | `experiments/procedural-steam-atlas` | **LIVE** [vibes-steam-atlas.vercel.app](https://vibes-steam-atlas.vercel.app) `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` |
| `vibes-scroll-product` | `prj_XLBiIlbjweejp9himT53bolPEMUW` | `experiments/scroll-product-showcase` | **LIVE** [vibes-scroll-product.vercel.app](https://vibes-scroll-product.vercel.app) `dpl_DTgSMUvDqSsWwhNz7vL3VR9MgfeY` (#63) |
| `vibes-glass-capability-brain` | `prj_yJbQTsiB138V5jh92cwSWd8rZmij` | `experiments/glass-capability-brain` | **LIVE** [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app) `dpl_DyQwdDkZcmcia4HAa42VaiFj9Q2w` (`6f455822`, #62 Vite bump; Pale Lift / Ember Slide / Lumen Watch) |
| `vibes-japanese-tower` | `prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js` | `experiments/japanese-tower` | **LIVE** [vibes-japanese-tower.vercel.app](https://vibes-japanese-tower.vercel.app) `dpl_Gap9BAXosU4jMEsQsR8c2nKyEPjg` |
| `vibes-ballance-roll` | `prj_BSAzHRX6jgMZOx10fPYUUXXrKrmt` | `experiments/ballance-roll` | **LIVE** [vibes-ballance-roll.vercel.app](https://vibes-ballance-roll.vercel.app) `dpl_4SDB2ERjW7EiDX28PGsDQLEqCkrj` (#80) |
| `vibes-chinese-courtyard` | `prj_6eH8pYXjJzcXT5lIGfaxejO6qXAO` | `experiments/chinese-courtyard` | **LIVE** [vibes-chinese-courtyard.vercel.app](https://vibes-chinese-courtyard.vercel.app) `dpl_94rAqcG9q98czKhD7PUeVs6nDxCo` (#83) |
| `vibes-audio-gadget-spin` | `prj_N57mvThg4UcU9XxLK3F5wAICz9PA` | `experiments/audio-gadget-spin` | **LIVE** [vibes-audio-gadget-spin.vercel.app](https://vibes-audio-gadget-spin.vercel.app) `dpl_2K1X2kWCXyFLaech4oxqdxzffYk1` (`e8c15a22`, #95 cup-screw mute / mute rocker) |
| `vibes-procedural-grass-field` | `prj_iJND14XT4LtOHI2gnUR0UM8RFk9F` | `experiments/procedural-grass-field` | **LIVE** [vibes-procedural-grass-field.vercel.app](https://vibes-procedural-grass-field.vercel.app) `dpl_GyZTo3QLBdYhUdogCHwEzaz7N6CN` |
| `vibes-amber-longeron` | `prj_P8wkvn17aVx2YpjNwpSSY2njdJGA` | `experiments/amber-longeron` | **LIVE** [vibes-amber-longeron.vercel.app](https://vibes-amber-longeron.vercel.app) `dpl_CJns3zztgwxW5TWDYrJxwB29bR23` (#78) |
| `vibes-nacre-loom` | `prj_JG69HBJtf8eb6ZKLqH3IXutMyZNU` | `experiments/nacre-loom` | **LIVE** [vibes-nacre-loom.vercel.app](https://vibes-nacre-loom.vercel.app) `dpl_6oGiyXHv76vgmiAbMaaKFEZzzGqt` (#89) |
| `vibes-heartwood-warden` | `prj_TyrDfg7r52zArouthNjFS4m7B30Z` | `experiments/heartwood-warden` | **LIVE** [vibes-heartwood-warden.vercel.app](https://vibes-heartwood-warden.vercel.app) `dpl_23x2wHKZwaJEJ7rr9cVHDLoXsoE4` (#86) |
| `vibes-moon-dumpling-relay` | `prj_oIOqxeUp7QkAOPYBoEyzR0rvegwP` | `experiments/moon-dumpling-relay` | **LIVE** [vibes-moon-dumpling-relay.vercel.app](https://vibes-moon-dumpling-relay.vercel.app) `dpl_7tHZBEsnzuMScQQtpGrhpvN4tnqC` (#90) |
| `vibes-foil-tilt-card` | `prj_SpUrjDXzeQSTohXNWvGq7q3cKoxX` | `experiments/foil-tilt-card` | **LIVE** [vibes-foil-tilt-card.vercel.app](https://vibes-foil-tilt-card.vercel.app) `dpl_5WnUfCiDajLdiBVznkRE2hhuhSbU` (#85) |
| `vibes-zephyr-vale` | `prj_g5olvF0lrvLZ89UZp4uZaxU2bTa8` | `experiments/zephyr-vale` | **LIVE** [vibes-zephyr-vale.vercel.app](https://vibes-zephyr-vale.vercel.app) `dpl_FNA8YrjsNq2WDkWHKAJjpTi6SztX` (#87) |
| `vibes-cinder-mere` | `prj_pXdvd08peYAlt8s9QrW3yRB6nNvv` | `experiments/cinder-mere` | **LIVE** [vibes-cinder-mere.vercel.app](https://vibes-cinder-mere.vercel.app) `dpl_9jkndX4mk6AnKskypghfGCpYvzye` (#84) |
| `vibes-kiln-studs` | `prj_qI0BHjZbM8vNYHuhPtpmN91ZOLT8` | `experiments/kiln-studs` | **LIVE** [vibes-kiln-studs.vercel.app](https://vibes-kiln-studs.vercel.app) `dpl_uWh76sMCttwqzURorhXrzrcoUJbz` (#88) |
| `vibes-alba-forum` | `prj_q9pJAos2JhRzr1M3uBAalAnAST17` | `experiments/alba-forum` | **LIVE** [vibes-alba-forum.vercel.app](https://vibes-alba-forum.vercel.app) `dpl_6sD7RLhpKAadxvXbysTTQ9TAZfnm` (#79) |
| `vibes-brine-causeway` | `prj_UmVE510DKswQAtJf6NVYzOzQvqQf` | `experiments/brine-causeway` | **LIVE** [vibes-brine-causeway.vercel.app](https://vibes-brine-causeway.vercel.app) `dpl_GPspwkEeuqb54kWVwHf4MpgVzSxX` (#82) |
| `vibes-breakwater` | `prj_ZR9kwHuMM2cBrQPvtuoXkdwunyho` | `experiments/breakwater` | **LIVE** [vibes-breakwater.vercel.app](https://vibes-breakwater.vercel.app) `dpl_HHxJ6ZpeWdc3LziA3PmefbTAe7jB` (#81) |

### Local-only (no project — do not create)

Hobby 25-link cap is full. These three stay on `main` as Vite apps only. Future names if I ever free a slot: `vibes-<experiment>`. Dashboard Root would be the folder below.

| Experiment | Root Directory | Status |
| --- | --- | --- |
| keel-hex | `experiments/keel-hex` | **No project.** `create_git_project` for `vibes-keel-hex` already failed (`repo_links_exceeded_limit`). |
| fairday-walk | `experiments/fairday-walk` | **No project.** Do not create `vibes-fairday-walk`. |
| ochre-gallop | `experiments/ochre-gallop` | **No project.** Do not create `vibes-ochre-gallop`. |

In-repo `vercel.json` lives *inside* those folders (`framework: vite`, `outputDirectory: dist`, `ignoreCommand` where I have added it). Do **not** add a `"//"` comment key — Vercel schema-rejects `additional property //` and the deploy ERRORs before install. See [the incident](../incidents/2026-09-09-vercel-json-comment-key.md).

`ignoreCommand: git diff --quiet HEAD^ HEAD ./` skips the Vite build when that folder did not change. Vercel records that skip as **CANCELED** with `errorLink` **`ignored-build-step`**. Sibling-folder CANCELED skips are **expected noise**, not ERROR. They may still count as a hobby deployment. They do **not** write or refresh a production alias — that is why steam-atlas stayed `DEPLOYMENT_NOT_FOUND` after a `create_git_project` redeploy of `main` (the tip only touched `japanese-tower`).

**2026-09-17:** earth / v8 / explode / physics / semicircle / web-3d now have `ignoreCommand`. PR #73 proved the leak: steam-atlas-only `78639f2c` still rebuilt those six production aliases (earth `dpl_9bqUtJcDFH8FSopEv8HYf9qFHcSR`, v8 `dpl_NdfXkL3MZk5EBoaW8M5NdqBPXxaQ`, plus explode / physics / semicircle / web-3d). japanese-tower CANCELED as expected. See [the incident](../incidents/2026-09-17-ignorecommand-leak-earth-v8.md).

It will not save you if Root Directory is blank — that `vercel.json` is never read.

## Current hill-climb rules

Do not create Vercel projects. Do not call `create_git_project`. Do not unlink or pause an existing project to dodge the cap. Do not redeploy just because this doc changed.

The 2026-09-09 post-quota Root-touch wave (scroll / audio / grass) and the later Vite `^6.4.3` one-Root wave are **done**. Those apps are LIVE. A sibling-folder merge will CANCELED-skip anyone we do not touch — that is fine.

steam-atlas Root must stay `experiments/procedural-steam-atlas`. It already has LIVE production.

## README showcase previews

The root README is a visual showcase (GIFs, not an ops table). Refresh `docs/previews/<app>.gif` when an app ships or the motion clip goes stale. Stills are a fallback only. Ops status lives in [deployment notes](./). See [docs/visual-qa/README.md](../visual-qa/README.md).

### Hill-climb — 2026-09-20 (docs ID sync only)

Docs-only. **No redeploy. No new projects.** I synced three stale Latest READY prod IDs to live Vercel production (team `johnnyhuy-dev`). Audio is `dpl_2K1X2kWCXyFLaech4oxqdxzffYk1` (`e8c15a22`, #95 mute rocker). Semicircle is `dpl_Ei5PArDDuKAJbRDXxeScExHD8sHG` (`447686fb`, #101 Root-touch after #98 Classic Laptop). Glass is `dpl_DyQwdDkZcmcia4HAa42VaiFj9Q2w` (`6f455822`, #62 Vite bump; Pale Lift / Ember Slide / Lumen Watch). Aliases HTTP 200. I did not Root-touch any experiment README. Hobby 25-link cap still full.

### Hill-climb — 2026-09-19 (docs sync after Vite wave)

Docs-only. **No redeploy. No new projects.** Vite `^6.4.3` wave (#63–#90-ish) is complete: repo search found 0 remaining `"vite": "^6.0.1"` in experiments; sampled `package.json` files (including the local-only trio) already declare `"vite": "^6.4.3"`. Open PRs: none on `vibes` or `s2000-digital-dash`. Hobby 25-link cap still full. This pass rewrites the Root map so later runs stop treating LIVE apps as "0 production" / "no project". Sibling `ignoreCommand` CANCELED skips stay expected noise.

The dated notes below are contemporaneous logs. **Current status is the 2026-09-20 table.** Do not follow an older "no project" / "0 production" / "do not promote" line for an app that is LIVE above.

### Hill-climb — 2026-09-09 (post-quota Root-touch wave)

Quota reset ~2026-09-08 20:39 UTC. This pass **did not create projects**. I touched `experiments/scroll-product-showcase/`, `experiments/audio-gadget-spin/`, and `experiments/procedural-grass-field/` so `ignoreCommand` could not CANCELED-skip them (`ignored-build-step`). Showcase Live links: [scroll](https://vibes-scroll-product.vercel.app), [audio](https://vibes-audio-gadget-spin.vercel.app), [grass](https://vibes-procedural-grass-field.vercel.app). Semicircle framing was already on `main` at [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app).

### Hill-climb — 2026-09-08 (ballance-roll)

Explode production still **PASS** on `de25d60`. Semicircle still FAIL on `25587f54`. steam-atlas + scroll-product still `DEPLOYMENT_NOT_FOUND` at that hour — steam-atlas `main` redeploy **CANCELED** `ignored-build-step` (tip only touched japanese-tower). Glass production LIVE on the tower merge (`9328191` / `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz`). That pass was the marble experiment plus README touches. **Later:** `vibes-ballance-roll` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-08 (chinese-courtyard)

steam-atlas production **LIVE PASS** ~4:37am AEST: assembled locomotive on `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` / `main` `a94b16e`. Semicircle still FAIL on `25587f54`. scroll-product still 404. explode and glass PASS. That pass was the courtyard experiment plus README touches. **Later:** `vibes-chinese-courtyard` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-08 (audio-gadget-spin)

That pass added Lumen Cuff locally. The project was created later the same day: `vibes-audio-gadget-spin` / `prj_N57mvThg4UcU9XxLK3F5wAICz9PA`, `deploy: false`. **Later:** first READY production `dpl_B9NqntJ3XW2ZvwfWhgMnaS6tAt3N` (#64).

### Hill-climb — 2026-09-07 (procedural-grass-field)

This pass added Wind Lea locally. No new Vercel project that day. **Later:** `vibes-procedural-grass-field` / `prj_iJND14XT4LtOHI2gnUR0UM8RFk9F` is LIVE (`dpl_GyZTo3QLBdYhUdogCHwEzaz7N6CN`).

### Hill-climb — 2026-09-07 (amber-longeron)

This pass added Amber Longeron locally. **Later:** `vibes-amber-longeron` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-07 (nacre-loom)

This pass added Nacre Loom locally. **Later:** `vibes-nacre-loom` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-07 (heartwood-warden)

This pass added Heartwood Warden locally. **Later:** `vibes-heartwood-warden` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-08 (moon-dumpling-relay)

This pass added Moon Dumpling Relay locally. **Later:** `vibes-moon-dumpling-relay` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-08 (foil-tilt-card)

This pass added Foil Tilt Card locally. **Later:** `vibes-foil-tilt-card` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-08 (zephyr-vale)

This pass added Zephyr Vale locally. **Later:** `vibes-zephyr-vale` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-08 (cinder-mere)

This pass added Cinder Mere locally. **Later:** `vibes-cinder-mere` is LIVE — see the 2026-09-19 table. The old "link-only / 0 production / do not promote" line is stale.

### Hill-climb — 2026-09-08 (kiln-studs)

This pass added Kiln Studs locally. **Later:** `vibes-kiln-studs` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-08 (alba-forum)

This pass added Alba Forum locally. **Later:** `vibes-alba-forum` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-08 (brine-causeway)

This pass added Brine Causeway locally. **Later:** `vibes-brine-causeway` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-08 (breakwater)

This pass added Breakwater locally. **Later:** `vibes-breakwater` is LIVE — see the 2026-09-19 table.

### Hill-climb — 2026-09-08 (keel-hex)

This pass added Keel Hex locally. **Still no project.** Hobby 25-link cap blocked `vibes-keel-hex` (`repo_links_exceeded_limit`). Local-only until I free a slot or upgrade to Pro.

### Hill-climb — 2026-09-08 (fairday-walk)

This pass added Fairday Walk locally. **Still no project.** Same 25-link cap. Do not create `vibes-fairday-walk`.

### Hill-climb — 2026-09-08 (ochre-gallop)

This pass added Ochre Gallop locally. **Still no project.** Hobby is at the **25 Git repo-link cap**. Do not create `vibes-ochre-gallop`.

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-20 (Hill-climb docs ID sync only; audio / semicircle / glass LIVE dpl IDs match production)
