# vibes

These are my kitchen-sink experiments exploring AI-assisted development. Research and education only — not production code.

I'm Johnny Huynh, and this monorepo is where I learn by building. Each experiment is self-contained, documented, and runnable.

## Experiments

### Interactive 3D Demos

#### [explode-assembly](./experiments/explode-assembly/)
Tesla-style exploded product visualisation. Inspired by [this X post](https://x.com/ashebytes/status/1831768826242351397).

**What it is**: Cinematic assembly viewer with systems sidebar, explode slider, and part detail cards. Dark automotive UI.

**Run it**:
```bash
cd experiments/explode-assembly
npm install && npm run dev
```

---

#### [earth-timeline](./experiments/earth-timeline/)
Interactive Earth history spanning 4.5 billion years. Inspired by [this X post](https://x.com/akshdeeps/status/1832134890432381354).

**What it is**: Procedural globe with timeline scrub through geological eras. Watch evolution unfold.

**Run it**:
```bash
cd experiments/earth-timeline
npm install && npm run dev
```

---

#### [v8-cutaway](./experiments/v8-cutaway/)
Technical engine visualisation with live gauges. Inspired by [this X post](https://x.com/DilumSanjaya/status/1832045625846227101).

**What it is**: Animated 8-cylinder engine showing piston motion, valve timing, RPM, and stroke cycles.

**Run it**:
```bash
cd experiments/v8-cutaway
npm install && npm run dev
```

---

#### [web-physics](./experiments/web-physics/)
Browser-based rigid body physics playground.

**What it is**: Click to spawn boxes, Space for spheres, watch collisions and gravity. Built with Three.js + cannon-es.

**Run it**:
```bash
cd experiments/web-physics
npm install && npm run dev
```

---

### AI 3D Workflows

#### [ai-3d-lanes](./experiments/ai-3d-lanes/)
Four parallel approaches to AI-assisted 3D creation:

1. **web-3d** — Interactive Three.js exploded assembly (original demo)
2. **blender** — Blender MCP scripting vs computer-use comparison (inspired by [this X post](https://x.com/developedbyed/status/1831768826242351397))
3. **cad** — Parametric CAD with CadQuery
4. **mesh-gen** — AI mesh generation services (docs + stubs)

Each lane has its own README with setup instructions.

---

### Image & Texture Generation

#### [image-to-3d](./experiments/image-to-3d/)
Single-image to 3D mesh generation. Inspired by [GROK BOT X post](https://x.com/omarsar0/status/1832043906668355898).

**What it is**: Documentation + dry-run stub for Meshy/Tripo/Rodin workflows. Hardware desk-console aesthetic.

**Run it**:
```bash
cd experiments/image-to-3d
python mesh_client.py  # Dry-run mode, no API key needed
open viewer.html       # Browser placeholder viewer
```

---

#### [ai-image-texture](./experiments/ai-image-texture/)
AI image generation landscape overview.

**What it is**: Provider comparison (Flux, DALL·E, Midjourney, Stable Diffusion, Meshy Texture, Polycam) + dry-run client + viewer.

**Run it**:
```bash
cd experiments/ai-image-texture
python image_client.py
open viewer.html
```

---

### Code-First CAD

#### [llm-openscad](./experiments/llm-openscad/)
Text-to-CAD using LLMs to generate OpenSCAD code.

**What it is**: Example .scad files (bracket, enclosure, gear) + prompt templates for effective LLM CAD generation.

**Run it**:
```bash
cd experiments/llm-openscad
python generate_part.py  # Dry-run mode, selects templates
# With OpenSCAD installed:
openscad -o out.stl examples/bracket.scad
```

---

## Philosophy

I built these experiments to understand how AI agents generate interactive content — the kind of demos where you slide through exploded views, scrub timelines, and see physics simulations.

Each experiment answers specific questions:
- **explode-assembly**: How do product marketing sites structure exploded views?
- **earth-timeline**: How do you make billions of years feel tangible?
- **v8-cutaway**: How do you sync 3D animation with technical readouts?
- **web-physics**: How do agents generate physics scenarios from prompts?
- **blender**: When does MCP beat computer-use for automation?
- **image-to-3d**: When does mesh generation beat traditional modelling?
- **llm-openscad**: How do LLMs emit parametric CAD code?

## Structure

```
vibes/
├── experiments/
│   ├── explode-assembly/      # Tesla-style product explode
│   ├── earth-timeline/         # Interactive globe + geologic time
│   ├── v8-cutaway/             # Engine cutaway with gauges
│   ├── web-physics/            # Physics playground
│   ├── ai-3d-lanes/            # 4 AI 3D workflows
│   ├── image-to-3d/            # Image→mesh (GROK BOT aesthetic)
│   ├── ai-image-texture/       # Image generation providers
│   └── llm-openscad/           # Text→CAD generation
├── LICENSE                      # MIT
└── README.md                    # This file
```

## Deployment

**web-3d** (from ai-3d-lanes) is deployed on Vercel with automatic PR previews:
- Production: Deploys from `main`
- Previews: Every PR gets a unique URL
- Root Directory set to `experiments/ai-3d-lanes/web-3d`

Other experiments are local-only for now.

## Adding Experiments

1. Create `experiments/<name>/`
2. Add a clear README explaining what and why
3. Include setup/run instructions
4. Update this root README
5. Keep it simple — working code over perfect code

## Disclaimer

**Research and education only.** These experiments are rough, incomplete, or whimsical. Not production code. I'm learning in public.

## Licence

MIT — see [LICENSE](./LICENSE)
