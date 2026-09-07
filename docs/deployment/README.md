# Deployment notes

Each browser demo is its own Vercel project on this repo. **Root Directory** is a dashboard field, not something `vercel.json` can pin — see [Vercel Root Directory hints](./vercel-root-directories.md).

Sibling-folder commits skip via `ignored-build-step` and do **not** refresh production aliases.

Hobby quota on `johnnyhuy-dev` resets after the 2026-09-07 burn (~**2026-09-08 20:39 UTC**; earlier notes said 12:55). Do not retry-spam deploys. After reset, one each: (1) **semicircle** production from the git-main framing fix — git-main *preview* PASS, production still FAIL on stale `25587f54` (2) **scroll-product** first READY (still 404) (3) **audio-gadget** first production (4) **grass** (`vibes-procedural-grass-field`) (5) only then ballance / courtyard / amber-longeron / nacre-loom. Skip explode / steam / glass / tower unless a later visual QA fails. `vibes-audio-gadget-spin` (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`) is linked `deploy: false`, SSO off, Root `experiments/audio-gadget-spin` — no production, do not redeploy yet. Do not create projects for ballance-roll, chinese-courtyard, amber-longeron, nacre-loom, or a new grass app. If `vibes-procedural-grass-field` already exists `deploy: false`, leave it idle.

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
| blender-semicircle-viewer | `vibes-blender-semicircle` | `experiments/blender-semicircle-viewer` | [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app) | FAIL — stale `25587f54`, cropped |
| scroll-product-showcase | `vibes-scroll-product` | `experiments/scroll-product-showcase` | — | 404 / no READY production |
| web-3d | `vibes` | `experiments/ai-3d-lanes/web-3d` | — | TBD |
| ballance-roll | — | `experiments/ballance-roll` | — | no project |
| chinese-courtyard | — | `experiments/chinese-courtyard` | — | no project |
| audio-gadget-spin | `vibes-audio-gadget-spin` (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`) | `experiments/audio-gadget-spin` | — | linked `deploy: false`, SSO off, 0 production |
| procedural-grass-field | — | `experiments/procedural-grass-field` | — | no project (if `vibes-procedural-grass-field` already exists `deploy: false`, leave it idle) |
| amber-longeron | — | `experiments/amber-longeron` | — | no project |
| nacre-loom | — | `experiments/nacre-loom` | — | no project |

PR previews appear as Vercel bot comments when quota allows.

## Related

- [Root Directory checklist](./vercel-root-directories.md)
- [Quota incident](../incidents/2026-09-07-vercel-deploy-quota.md)
- [Audio-gadget linked before quota](../incidents/2026-09-07-audio-gadget-linked-before-quota.md)
- [steam-atlas wrong Root](../incidents/2026-09-08-steam-atlas-wrong-root.md)
- [glass auto-deploy on tower merge](../incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md)
- [Visual QA](../visual-qa/README.md)
