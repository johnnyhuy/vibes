# explode-assembly

**Tesla Model 3 2021 Long Range** — Exploded view recreation. Inspired by that [viral X post](https://x.com/ashebytes/status/1831768826242351397) showing a Model X pulled apart into 334 modeled pieces.

I built this as an educational recreation of the 2021 Model 3 Long Range architecture. This is an **unofficial project** — not affiliated with Tesla, Inc.

## What I Made

An interactive exploded assembly viewer showing the 2021 Model 3 LR with accurate system groups:

- **12 system groups** — Body, glass roof, doors, cabin, battery pack (82 kWh structural), dual motors (AWD), thermal (heat pump), suspension, wheels & brakes, charging & HV, computers, lighting
- **~80 individual parts** — Enough density to feel like a real product explode (not just 5 blobs)
- **Explode slider** — Smoothly transition from assembled Model 3 to fully exploded
- **Part details** — Click components to see real 2021 LR specs (kWh, kW, dual motor config, HW3, etc.)
- **System isolation** — Highlight entire systems (e.g., show only battery pack)
- **Cinematic UI** — Dark, minimal interface matching Tesla's aesthetic

## Running It

```bash
npm install
npm run dev
```

Open in browser → drag to orbit, slide to explode, click parts for details.

## Disclaimer

This is an **unofficial educational recreation** of the 2021 Tesla Model 3 Long Range architecture using publicly available specifications. Not affiliated with, endorsed by, or connected to Tesla, Inc.

All technical specifications are sourced from:
- Official Tesla specs (tesla.com archives)
- EPA filings
- Teardown reports (Munro Live, etc.)
- Owner's manual data

No proprietary CAD data, OEM meshes, or Sketchfab assets were used.

## Why I Built This

After seeing that viral Model X explode demo, I wanted to understand the underlying structure. This is my learning experiment for:

1. **Procedural assembly layouts** — How to position components hierarchically
2. **Explode animations** — Calculating offset vectors for dramatic separation
3. **Interactive annotation** — Connecting 3D objects to UI panels
4. **Technical aesthetics** — Making engineering data look elegant

## Technical Details

### 2021 Model 3 Long Range Specs

- **Dual Motor AWD**: Front induction + rear permanent magnet (combined 346 hp / 258 kW)
- **Battery**: Structural pack, ~82 kWh usable, NCA/NMC cells, 4416 cells
- **Range**: ~353 miles EPA (2021)
- **Charging**: 250 kW DC peak (CCS), 11.5 kW AC onboard
- **Thermal**: Heat pump system (2021+ refresh with Octovalve)
- **Computers**: AMD Ryzen MCU, FSD Computer HW3.0
- **Suspension**: Double wishbone front, multi-link rear

### The Code

**Procedural Model 3 shape**: ~80 boxes positioned to match fastback sedan proportions (~4.7m long, ~1.85m wide, ~2.88m wheelbase scaled to viewport).

**System grouping**: 12 systems with 4-10 parts each for density.

**Explode offsets**: Each part has a vector defining where it moves when exploded.

**Real specs**: Detail cards show actual 2021 LR specifications.

## Using Your Own Model 3 GLB

If you have a licensed Model 3 mesh (from Sketchfab, TurboSquid, or your own work), you can load it:

```
http://localhost:5173/?model=https://example.com/model3.glb
```

Or add a file input UI. The code will attempt to map mesh names to systems automatically (looks for keywords like "battery", "motor", "door", etc. in mesh names).

## How AI Agents Could Generate This

An agent given "explode view of a 2021 Model 3 Long Range" could:

1. **Research architecture** — LLM fetches public specs, EPA data, teardown reports
2. **Generate part manifest** — Outputs JSON with system groups, part names, positions, specs
3. **Calculate layout** — Model 3 proportions (fastback sedan, ~2.88m wheelbase) → procedural geometry
4. **Create explode offsets** — Push parts outward along assembly axes
5. **Style the scene** — Tesla aesthetic (dark UI, cinematic lighting, clean typography)

I hand-coded this, but the structure shows what's automatable.

## Differences from ai-3d-lanes/web-3d

**explode-assembly (Model 3)**: Specific product recreation, real specs, automotive marketing aesthetic, density (~80 parts)

**web-3d lane**: Generic motor assembly, educational cutaway, fewer parts

Both use Three.js + Vite, but this one targets product visualisation fidelity.

## What's Next

- Add animation timeline (auto-rotate through systems)
- Generate parts from CAD files instead of boxes
- Connect to real product databases
- Export to video for marketing

## Sources

- [Tesla Model 3 Specs (2021)](https://www.tesla.com/model3) (archived)
- EPA certification data
- [Munro Live teardown reports](https://www.youtube.com/c/MunroLive)
- Owner's manual technical specifications

This is my kitchen sink. Research and education only — not production code. Not affiliated with Tesla, Inc.
