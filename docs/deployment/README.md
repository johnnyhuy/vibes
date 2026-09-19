# Deployment notes

Each browser demo is its own Vercel project on this repo. **Root Directory** is a dashboard field, not something `vercel.json` can pin — see [Vercel Root Directory hints](./vercel-root-directories.md).

Sibling-folder commits skip via `ignored-build-step` and do **not** refresh production aliases. Those CANCELED skips are expected noise, not ERROR.

Hobby team `johnnyhuy-dev` is at the **25 Git repo-link cap**. All 25 linked projects already have READY production (verified 2026-09-19 AEST). Do not create projects. Do not redeploy from a docs-only pass. Keel Hex, Fairday Walk, and Ochre Gallop stay local-only until I free a slot or upgrade to Pro.

The Vite `^6.4.3` one-Root wave (#63–#90-ish) is complete. Experiments already declare `"vite": "^6.4.3"`; there are no remaining `"vite": "^6.0.1"` pins.

## Production aliases

| App | Project | Root | Production | Status |
| --- | --- | --- | --- | --- |
| explode-assembly | `vibes-explode` | `experiments/explode-assembly` | [vibes-explode.vercel.app](https://vibes-explode.vercel.app) | **LIVE** `dpl_9j991HkMAQspi1RtMzvtPvPAoARy` (#74) |
| procedural-steam-atlas | `vibes-steam-atlas` | `experiments/procedural-steam-atlas` | [vibes-steam-atlas.vercel.app](https://vibes-steam-atlas.vercel.app) | **LIVE** `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` |
| glass-capability-brain | `vibes-glass-capability-brain` | `experiments/glass-capability-brain` | [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app) | **LIVE** `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` |
| earth-timeline | `vibes-earth` | `experiments/earth-timeline` | [vibes-earth.vercel.app](https://vibes-earth.vercel.app) | **LIVE** |
| v8-cutaway | `vibes-v8` | `experiments/v8-cutaway` | [vibes-v8.vercel.app](https://vibes-v8.vercel.app) | **LIVE** |
| web-physics | `vibes-physics` | `experiments/web-physics` | [vibes-physics.vercel.app](https://vibes-physics.vercel.app) | **LIVE** |
| japanese-tower | `vibes-japanese-tower` | `experiments/japanese-tower` | [vibes-japanese-tower.vercel.app](https://vibes-japanese-tower.vercel.app) | **LIVE** `dpl_Gap9BAXosU4jMEsQsR8c2nKyEPjg` |
| blender-semicircle-viewer | `vibes-blender-semicircle` | `experiments/blender-semicircle-viewer` | [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app) | **LIVE** — framing on `main` |
| scroll-product-showcase | `vibes-scroll-product` | `experiments/scroll-product-showcase` | [vibes-scroll-product.vercel.app](https://vibes-scroll-product.vercel.app) | **LIVE** `dpl_DTgSMUvDqSsWwhNz7vL3VR9MgfeY` (#63) |
| web-3d | `vibes` | `experiments/ai-3d-lanes/web-3d` | — | **LIVE** `dpl_9yb7pJhtoTV4kedonEoi2JMK7Gmb` (#94 Root-touch) |
| ballance-roll | `vibes-ballance-roll` | `experiments/ballance-roll` | [vibes-ballance-roll.vercel.app](https://vibes-ballance-roll.vercel.app) | **LIVE** `dpl_4SDB2ERjW7EiDX28PGsDQLEqCkrj` (#80) |
| chinese-courtyard | `vibes-chinese-courtyard` | `experiments/chinese-courtyard` | [vibes-chinese-courtyard.vercel.app](https://vibes-chinese-courtyard.vercel.app) | **LIVE** `dpl_94rAqcG9q98czKhD7PUeVs6nDxCo` (#83) |
| audio-gadget-spin | `vibes-audio-gadget-spin` | `experiments/audio-gadget-spin` | [vibes-audio-gadget-spin.vercel.app](https://vibes-audio-gadget-spin.vercel.app) | **LIVE** `dpl_B9NqntJ3XW2ZvwfWhgMnaS6tAt3N` (#64) |
| procedural-grass-field | `vibes-procedural-grass-field` | `experiments/procedural-grass-field` | [vibes-procedural-grass-field.vercel.app](https://vibes-procedural-grass-field.vercel.app) | **LIVE** `dpl_GyZTo3QLBdYhUdogCHwEzaz7N6CN` |
| amber-longeron | `vibes-amber-longeron` | `experiments/amber-longeron` | [vibes-amber-longeron.vercel.app](https://vibes-amber-longeron.vercel.app) | **LIVE** `dpl_CJns3zztgwxW5TWDYrJxwB29bR23` (#78) |
| nacre-loom | `vibes-nacre-loom` | `experiments/nacre-loom` | [vibes-nacre-loom.vercel.app](https://vibes-nacre-loom.vercel.app) | **LIVE** `dpl_6oGiyXHv76vgmiAbMaaKFEZzzGqt` (#89) |
| heartwood-warden | `vibes-heartwood-warden` | `experiments/heartwood-warden` | [vibes-heartwood-warden.vercel.app](https://vibes-heartwood-warden.vercel.app) | **LIVE** `dpl_23x2wHKZwaJEJ7rr9cVHDLoXsoE4` (#86) |
| moon-dumpling-relay | `vibes-moon-dumpling-relay` | `experiments/moon-dumpling-relay` | [vibes-moon-dumpling-relay.vercel.app](https://vibes-moon-dumpling-relay.vercel.app) | **LIVE** `dpl_7tHZBEsnzuMScQQtpGrhpvN4tnqC` (#90) |
| foil-tilt-card | `vibes-foil-tilt-card` | `experiments/foil-tilt-card` | [vibes-foil-tilt-card.vercel.app](https://vibes-foil-tilt-card.vercel.app) | **LIVE** `dpl_5WnUfCiDajLdiBVznkRE2hhuhSbU` (#85) |
| zephyr-vale | `vibes-zephyr-vale` | `experiments/zephyr-vale` | [vibes-zephyr-vale.vercel.app](https://vibes-zephyr-vale.vercel.app) | **LIVE** `dpl_FNA8YrjsNq2WDkWHKAJjpTi6SztX` (#87) |
| cinder-mere | `vibes-cinder-mere` | `experiments/cinder-mere` | [vibes-cinder-mere.vercel.app](https://vibes-cinder-mere.vercel.app) | **LIVE** `dpl_9jkndX4mk6AnKskypghfGCpYvzye` (#84) |
| kiln-studs | `vibes-kiln-studs` | `experiments/kiln-studs` | [vibes-kiln-studs.vercel.app](https://vibes-kiln-studs.vercel.app) | **LIVE** `dpl_uWh76sMCttwqzURorhXrzrcoUJbz` (#88) |
| alba-forum | `vibes-alba-forum` | `experiments/alba-forum` | [vibes-alba-forum.vercel.app](https://vibes-alba-forum.vercel.app) | **LIVE** `dpl_6sD7RLhpKAadxvXbysTTQ9TAZfnm` (#79) |
| brine-causeway | `vibes-brine-causeway` | `experiments/brine-causeway` | [vibes-brine-causeway.vercel.app](https://vibes-brine-causeway.vercel.app) | **LIVE** `dpl_GPspwkEeuqb54kWVwHf4MpgVzSxX` (#82) |
| breakwater | `vibes-breakwater` | `experiments/breakwater` | [vibes-breakwater.vercel.app](https://vibes-breakwater.vercel.app) | **LIVE** `dpl_HHxJ6ZpeWdc3LziA3PmefbTAe7jB` (#81) |
| keel-hex | — | `experiments/keel-hex` | — | **local-only** — 25-link cap blocked `vibes-keel-hex` |
| fairday-walk | — | `experiments/fairday-walk` | — | **local-only** — do not create `vibes-fairday-walk` |
| ochre-gallop | — | `experiments/ochre-gallop` | — | **local-only** — do not create `vibes-ochre-gallop` |

Ids, Root Directory, and the latest READY `dpl_…` examples live in [vercel-root-directories.md](./vercel-root-directories.md).

PR previews appear as Vercel bot comments when quota allows.

## Related

- [Root Directory checklist](./vercel-root-directories.md)
- [Quota incident](../incidents/2026-09-07-vercel-deploy-quota.md)
- [Audio-gadget linked before quota](../incidents/2026-09-07-audio-gadget-linked-before-quota.md)
- [steam-atlas wrong Root](../incidents/2026-09-08-steam-atlas-wrong-root.md)
- [glass auto-deploy on tower merge](../incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md)
- [README ↔ Vercel link-only drift](../incidents/2026-09-08-readme-vercel-link-only-drift.md)
- [Hobby repo-link cap (25)](../incidents/2026-09-08-vercel-repo-link-limit-25.md)
- [`vercel.json` `"//"` comment key](../incidents/2026-09-09-vercel-json-comment-key.md)
- [Visual QA](../visual-qa/README.md)
