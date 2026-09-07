# image-to-3d

Single-image to 3D mesh generation documentation. Inspired by [this X post](https://x.com/omarsar0/status/1832043906668355898) where GPT-6 Astra built a hardware device (GROK BOT style) from one image reference.

I wanted to understand how modern AI turns a single 2D image into a full 3D model with textures — the workflow that's replacing traditional 3D modelling for certain use cases.

## What I Built

Documentation and workflow stubs for image-to-3D mesh generation:

- **providers.md** — Detailed comparison of Meshy, Tripo, Rodin services
- **mesh_client.py** — Dry-run Python client demonstrating the API workflow
- **viewer.html** — Placeholder viewer (opens in browser, shows stand-in for generated mesh)

The theme is **hardware/desk console aesthetic** — think GROK BOT, retro-futuristic control panels, tactile interfaces.

## Running the Stub

```bash
python mesh_client.py
```

Demonstrates the workflow in dry-run mode (no API key needed).

## Why I Made This

After seeing AI generate that GROK BOT hardware from a single image, I wanted to map out:
- Which providers do image-to-3D well
- What the API workflow looks like
- When this approach beats traditional modelling
- Where it fails (and you need CAD instead)

## The Workflow

```
1. Input Image
   desk_console_concept.jpg (clean product shot)
   ↓
2. API Generation (Meshy/Tripo/Rodin)
   2-5 minutes processing
   ↓
3. Output GLB
   Full 3D mesh + PBR textures embedded
   ↓
4. Web Display
   Load in Three.js viewer or AR preview
```

## Provider Comparison

| Provider | Speed | Quality | Best For |
|----------|-------|---------|----------|
| **Meshy** | ~2 min | High | Product shots, hardware |
| **Tripo** | ~1 min | Medium | Quick prototypes |
| **Rodin** | ~5 min | Very High | Hero assets, detailed products |

See `providers.md` for full details on pricing, formats, and API specifics.

## When to Use Image-to-3D

### ✅ Good Use Cases

- **Product visualisation** — Convert product photos to 3D for AR/web
- **Concept validation** — Quick 3D prototype from 2D sketch
- **Asset generation** — Background props for games/films
- **Reverse engineering** — Approximate object geometry from photo

### ❌ Not Good For

- **Precision parts** — Use CAD (experiments/ai-3d-lanes/cad/) instead
- **Functional assemblies** — Need parametric design
- **Engineering tolerances** — Mesh guesses dimensions
- **Animated characters** — Topology usually wrong for rigging

## Hardware Aesthetic

The GROK BOT post inspired a specific aesthetic I'm exploring:

- **Retro-futuristic** — Think 1970s NASA control panels
- **Tactile interfaces** — Buttons, knobs, switches you want to touch
- **Technical typography** — Monospace labels, serial numbers
- **Matte materials** — Brushed metal, soft-touch plastic
- **Accent lighting** — Subtle LEDs, backlit indicators

This aesthetic works great for image-to-3D because it's **form over precise function** — looks matter more than exact dimensions.

## Integration with Other Experiments

**With web-3d** → Generate mesh here, display in Three.js viewer

**With Blender** → Import GLB, refine topology, add materials

**With CAD** → Use generated mesh as reference, model precise version

**With ai-image-texture** → Generate reference image first, then convert to 3D

## What's Next

- Implement full API client with real calls
- Build Three.js viewer that loads generated GLBs
- Compare multi-image vs single-image results
- Test different product categories (electronics, furniture, tools)
- Document topology cleanup workflows

This is my kitchen sink. Research and education only — not production code.
