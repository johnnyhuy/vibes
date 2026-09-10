# Deployment notes

Each browser demo is its own Vercel project on this repo. **Root Directory** is a dashboard field, not something `vercel.json` can pin — see [Vercel Root Directory hints](./vercel-root-directories.md).

Sibling-folder commits skip via `ignored-build-step` and do **not** refresh production aliases.

Hobby quota on `johnnyhuy-dev` reset after the 2026-09-07 burn (~**2026-09-08 20:39 UTC**; earlier notes said 12:55). **Post-quota redeploy wave 2026-09-09:** Root-touch scroll / audio / grass so `ignoreCommand` does not skip them. Semicircle framing is on `main`. Do not retry-spam. Do not create projects (25-link cap). Skip explode / steam / glass / tower / earth / v8 / physics / web-3d unless a later visual QA fails.

## Production aliases

| App | Project | Root | Production | Status |
| --- | --- | --- | --- | --- |
| explode-assembly | `vibes-explode` | `experiments/explode-assembly` | [vibes-explode.vercel.app](https://vibes-explode.vercel.app) | PASS (`dpl_ELE1f1XhqGQ7hciZSjkPVLMPmUh8` / `de25d60`) |
| procedural-steam-atlas | `vibes-steam-atlas` | `experiments/procedural-steam-atlas` | [vibes-steam-atlas.vercel.app](https://vibes-steam-atlas.vercel.app) | PASS (`dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` / `a94b16e`) |
| glass-capability-brain | `vibes-glass-capability-brain` | `experiments/glass-capability-brain` | [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app) | PASS (`dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` / `9328191`) |
| earth-timeline | `vibes-earth` | `experiments/earth-timeline` | [vibes-earth.vercel.app](https://vibes-earth.vercel.app) | PASS |
| v8-cutaway | `vibes-v8` | `experiments/v8-cutaway` | [vibes-v8.vercel.app](https://vibes-v8.vercel.app) | PASS |
| web-physics | `vibes-physics` | `experiments/web-physics` | [vibes-physics.vercel.app](https://vibes-physics.vercel.app) | PASS |
| japanese-tower | `vibes-japanese-tower` | `experiments/japanese-tower` | [vibes-japanese-tower.vercel.app](https://vibes-japanese-tower.vercel.app) | PASS (READY; was often 404) |
| blender-semicircle-viewer | `vibes-blender-semicircle` | `experiments/blender-semicircle-viewer` | [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app) | framing on `main` — skip 2026-09-09 wave |
| scroll-product-showcase | `vibes-scroll-product` | `experiments/scroll-product-showcase` | [vibes-scroll-product.vercel.app](https://vibes-scroll-product.vercel.app) | 2026-09-09 Root touch |
| web-3d | `vibes` | `experiments/ai-3d-lanes/web-3d` | — | TBD |
| ballance-roll | — | `experiments/ballance-roll` | — | no project |
| chinese-courtyard | — | `experiments/chinese-courtyard` | — | no project |
| audio-gadget-spin | `vibes-audio-gadget-spin` (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`) | `experiments/audio-gadget-spin` | [vibes-audio-gadget-spin.vercel.app](https://vibes-audio-gadget-spin.vercel.app) | 2026-09-09 Root touch |
| procedural-grass-field | `vibes-procedural-grass-field` | `experiments/procedural-grass-field` | [vibes-procedural-grass-field.vercel.app](https://vibes-procedural-grass-field.vercel.app) | 2026-09-09 Root touch — do not create a project |
| amber-longeron | — | `experiments/amber-longeron` | — | no project |
| nacre-loom | — | `experiments/nacre-loom` | — | no project |
| heartwood-warden | — | `experiments/heartwood-warden` | — | no project |
| moon-dumpling-relay | — | `experiments/moon-dumpling-relay` | — | no project |
| foil-tilt-card | — | `experiments/foil-tilt-card` | — | no project |
| zephyr-vale | — | `experiments/zephyr-vale` | — | no project — post-quota name `vibes-zephyr-vale` |
| cinder-mere | `vibes-cinder-mere` (`prj_pXdvd08peYAlt8s9QrW3yRB6nNvv`) | `experiments/cinder-mere` | — | linked `deploy: false`, SSO off, 0 production |
| kiln-studs | `vibes-kiln-studs` (`prj_qI0BHjZbM8vNYHuhPtpmN91ZOLT8`) | `experiments/kiln-studs` | — | linked `deploy: false`, SSO off, 0 production |
| alba-forum | `vibes-alba-forum` (`prj_q9pJAos2JhRzr1M3uBAalAnAST17`) | `experiments/alba-forum` | — | linked `deploy: false`, SSO off, 0 production |
| brine-causeway | `vibes-brine-causeway` (`prj_UmVE510DKswQAtJf6NVYzOzQvqQf`) | `experiments/brine-causeway` | — | linked `deploy: false`, SSO off, 0 production |
| breakwater | `vibes-breakwater` (`prj_ZR9kwHuMM2cBrQPvtuoXkdwunyho`) | `experiments/breakwater` | — | linked `deploy: false`, SSO off, 0 production |
| keel-hex | — | `experiments/keel-hex` | — | no project — 25-link cap blocked `vibes-keel-hex`; local-only until a slot or Pro |
| fairday-walk | — | `experiments/fairday-walk` | — | no project — post-quota name `vibes-fairday-walk` |

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
