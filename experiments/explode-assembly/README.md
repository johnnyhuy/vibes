# explode-assembly

Tesla-style exploded product visualisation. Inspired by that [viral X post](https://x.com/ashebytes/status/1831768826242351397) about pulling apart a Model X into 334 parts.

I built this to explore how AI agents could generate interactive product visualisations — the kind where you slide through an exploded view, click parts for specs, and feel like you're in a cinematic product reveal.

## What I Made

An interactive exploded assembly viewer showing a fictional electric vehicle drivetrain:

- **Systems sidebar** — Click to highlight chassis, drive unit, battery, cooling, electronics, or exterior
- **Explode slider** — Smoothly transition from assembled to fully exploded view
- **Part details** — Click any component to see name, description, and technical specs
- **Cinematic UI** — Dark, minimal interface inspired by automotive marketing sites

## Running It

```bash
npm install
npm run dev
```

Open in browser → drag to orbit, slide to explode, click parts for details.

## Why I Built This

After seeing GPT-6 Astra generate that Tesla explode site, I wanted to understand the underlying structure. This is my learning experiment for:

1. **Procedural assembly layouts** — How to position components hierarchically
2. **Explode animations** — Calculating offset vectors for dramatic separation
3. **Interactive annotation** — Connecting 3D objects to UI panels
4. **Technical aesthetics** — Making engineering data look elegant

## The Code

**Procedural parts**: Each component defined by system, size, position, and explode offset.

**Smooth transitions**: Explode slider lerps between assembled and offset positions.

**System highlighting**: Clicking sidebar filters parts by system ID and boosts emissive glow.

**Raycasting**: Three.js raycaster picks parts on click, triggers detail card.

## How AI Agents Could Generate This

An agent given "explode view of an electric motor" could:

1. **Generate part manifest** — LLM outputs JSON describing components, hierarchy, spatial relationships
2. **Calculate explode offsets** — Each part pushed outward along assembly axes
3. **Create UI annotations** — Part names + specs → detail cards
4. **Style the scene** — Apply automotive-style materials (metallic, dark background, rim lighting)

I'm not there yet (this is hand-coded), but the structure shows what's possible.

## Differences from ai-3d-lanes/web-3d

**This experiment**: Product marketing focus, polished UI, sidebar navigation, spec cards

**web-3d lane**: Technical explainer, cutaway scene, educational tone

Both use Three.js + Vite, but different aesthetics and use cases.

## What's Next

- Add animation timeline (auto-rotate through systems)
- Generate parts from CAD files instead of boxes
- Connect to real product databases
- Export to video for marketing

This is my kitchen sink. Research and education only — not production code.
