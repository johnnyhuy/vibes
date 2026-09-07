# vibes

These are my kitchen-sink experiments exploring AI-assisted development. Research and education only — not production code.

I'm Johnny Huynh, and this monorepo is where I learn by building. Each experiment is self-contained, documented, and runnable.

## Experiments

### Interactive 3D Demos

#### [procedural-steam-atlas](./experiments/procedural-steam-atlas/)
Stylized locomotive built entirely from runtime TypeScript geometry functions — no .glb, .obj, or image assets required.

**What it is**: Vanilla Three.js + procedural geometry. Mechanical assembly (wheels, boiler, chassis, rivets) generated from primitives (cylinders, spheres, boxes) at runtime. Exploded view, part isolation, dark cinematic studio lighting. Inspired by [@Karthikvarmamkv's Steam Atlas](https://x.com/Karthikvarmamkv/status/2096904712511488420) and [@Craft3dApp](https://x.com/Craft3dApp/status/2096892270851346904).

**Run it**:
```bash
cd experiments/procedural-steam-atlas
npm install && npm run dev
```

**Live**: TBD (pending Vercel setup)

---

#### [explode-assembly](./experiments/explode-assembly/)
Interactive Tesla Model 3 exploded view demo — inspired by [@ashebytes' viral Model X explode](https://x.com/ashebytes/status/2096009146248122416) (334 pieces via GPT-6 Astra).

**What it is**: React + R3F + Three.js exploded assembly viewer. Multi-mesh GLB loader with explosion layout algorithm (2D grid packing). Uses David_Holiday's CC-BY-4.0 Tesla Model 3 from Sketchfab. See [ashemag/model-x-studio](https://github.com/ashemag/model-x-studio) for the pattern.

**Run it**:
```bash
cd experiments/explode-assembly
npm install && npm run dev
```

**Live**: [vibes-explode.vercel.app](https://vibes-explode.vercel.app)

---

#### [earth-timeline](./experiments/earth-timeline/)
Interactive Earth history visualisation spanning 4.5 billion years. Drag the timeline from planetary formation to present day, watch the planet evolve from molten rock to vibrant blue-green.

**Stack**: React + R3F + drei. Procedural textures, orbital camera, cinematic dark UI.

**Run it**:
```bash
cd experiments/earth-timeline
npm install && npm run dev
```

**Live**: [vibes-earth.vercel.app](https://vibes-earth.vercel.app)

---

#### [v8-cutaway](./experiments/v8-cutaway/)
Technical V8 engine cutaway with proper 90° V-configuration, animated pistons, live gauges (RPM, stroke cycle, pressure), and speed control. Orbit to inspect, adjust speed slider to rev.

**Stack**: React + R3F + drei. Parametric geometry, kinematic animation, technical aesthetic.

**Run it**:
```bash
cd experiments/v8-cutaway
npm install && npm run dev
```

**Live**: [vibes-v8.vercel.app](https://vibes-v8.vercel.app)

---

#### [web-physics](./experiments/web-physics/)
Browser-based rigid body physics playground (Three.js + cannon-es). Drop cubes, spheres, and compound shapes into a physics-simulated world.

**Run it**:
```bash
cd experiments/web-physics
npm install && npm run dev
```

**Live**: [vibes-physics.vercel.app](https://vibes-physics.vercel.app)

---

### AI 3D Workflows

#### [ai-3d-lanes](./experiments/ai-3d-lanes/)
Four parallel approaches: **web-3d**, **blender** (MCP vs computer-use), **cad** (CadQuery), **mesh-gen** (docs + stubs).

#### [blender-semicircle-viewer](./experiments/blender-semicircle-viewer/)
Semicircular array of 51 laptop-like objects — demonstrates Blender MCP → Three.js workflow. Inspired by [Legendaryy's Blender MCP demo](https://x.com/Legendaryy/status/2096510965789422001).

**Run it**:
```bash
cd experiments/blender-semicircle-viewer
npm install && npm run dev
```

---

#### [scroll-product-showcase](./experiments/scroll-product-showcase/)
Scroll-driven 3D product hero with glass materials and refraction. Clean-room implementation of the pattern popularised by Apple and recent viral WebGL demos (like [himanshubuildss' glass bottle](https://x.com/himanshubuildss/status/2096243989439713677)).

**What it is**: React + R3F + drei. Fixed canvas with tall scroll container. Scroll progress drives product rotation and camera movement. Procedural torus knot + sphere geometry with MeshPhysicalMaterial transmission for glass effect. Dark cinematic UI.

**Run it**:
```bash
cd experiments/scroll-product-showcase
npm install && npm run dev
```

---

#### [procedural-steam-atlas](./experiments/procedural-steam-atlas/)
Procedurally generated Steam Atlas style — see the [experiment folder](./experiments/procedural-steam-atlas/) for details. Merged in PR #8.

---

### Image, texture & CAD

- [image-to-3d](./experiments/image-to-3d/) — image→mesh stubs
- [ai-image-texture](./experiments/ai-image-texture/) — image gen providers
- [llm-openscad](./experiments/llm-openscad/) — text→OpenSCAD

## Deployment (Vercel)

Each browser demo has its own Vercel project on this repo (Root Directory set in the dashboard). All demos are live on `main`.

| App | Vercel project | Root Directory | Production URL |
| --- | --- | --- | --- |
| web-3d | `vibes` | `experiments/ai-3d-lanes/web-3d` | TBD |
| procedural-steam-atlas | TBD | `experiments/procedural-steam-atlas` | TBD |
| explode-assembly | `vibes-explode` | `experiments/explode-assembly` | vibes-explode.vercel.app |
| earth-timeline | `vibes-earth` | `experiments/earth-timeline` | vibes-earth.vercel.app |
| v8-cutaway | `vibes-v8` | `experiments/v8-cutaway` | vibes-v8.vercel.app |
| web-physics | `vibes-physics` | `experiments/web-physics` | vibes-physics.vercel.app |
| scroll-product-showcase | `vibes-scroll-product` (suggested) | `experiments/scroll-product-showcase` | TBD |
| blender-semicircle-viewer | (not yet linked) | `experiments/blender-semicircle-viewer` | TBD |
| procedural-steam-atlas | (not yet linked) | `experiments/procedural-steam-atlas` | TBD |

PR previews show up as Vercel bot comments on each pull request.

## Documentation

See [./docs](./docs/) for:
- **Architecture Decision Records (ADRs)** — Why the monorepo is structured this way
- **Reverse Engineering Notes** — Clean-room analysis of public patterns (e.g., ashemag's Model X explode)
- **Incidents & Lessons** — Things that went sideways and what I learnt

## Disclaimer

**Research and education only.** Rough, incomplete, or whimsical. Not production. I'm learning in public.

## Licence

MIT — see [LICENSE](./LICENSE)
