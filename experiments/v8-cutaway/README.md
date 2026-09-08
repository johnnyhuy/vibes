# v8-cutaway

Technical V8 engine cutaway visualisation with real-time gauges and animated internals.

I built this to learn how to visualise mechanical systems with synchronised motion and technical overlays — the kind of engineering diagrams that make complex machinery understandable and beautiful. Inspired by [@DilumSanjaya's interactive V8](https://x.com/DilumSanjaya/status/2096280244663775423) with animated pistons/valves, rotatable view, and live gauges (RPM, firing order, chamber pressure).

## What I Built

A V8 engine cutaway with proper V-configuration and animated internals:

- **90° V-angle** — Two banks of 4 cylinders (proper V8, not inline-8)
- **Animated pistons** — 8 cylinders firing in sequence with realistic stroke patterns
- **Rotating crankshaft** — Synchronised rotation driving piston motion
- **Valve timing** — Intake/exhaust valves opening based on cycle position
- **Live gauges** — RPM, stroke cycle (intake/compression/power/exhaust), chamber pressure
- **Speed control** — Adjust engine speed from 1x to 10x
- **Technical aesthetic** — Monospace typography, clean indicators, metallic materials
- **Orbit controls** — Rotate and zoom to inspect from any angle

## Running It

```bash
npm install
npm run dev
```

Open http://localhost:5173 → orbit camera, adjust speed slider, watch the engine run.

Headed local loop: `docs/previews/v8-cutaway.gif`. I recaptured it at 8× with a slow orbit so the pistons and firing-order chips actually move in the README table.

## Why I Made This

I wanted to understand how to build **technical visualisations** that explain complex mechanical systems — the kind you'd see in engineering documentation or automotive marketing.

This is my learning experiment for:
- **Kinematic chains** — How crankshaft rotation drives piston motion through connecting rods
- **Phase offsets** — Firing order 1-8-4-3-6-5-7-2 (standard V8 pattern)
- **V-configuration geometry** — Two banks at 90° angle sharing one crankshaft
- **Visual indicators** — Connecting 3D motion to real-time 2D gauges
- **Technical aesthetic** — Monospace typography, metallic materials, precise readouts

## The Mechanics

**Crankshaft rotation**: Single rotating shaft, rotates based on `engineSpeed * delta * 2`.

**Piston motion**: `y = sin(crankRotation + phase) * stroke`. Each piston has a phase offset based on firing order.

**V-configuration**: Two banks of 4 cylinders each, positioned at 90° angle to the crankshaft axis.

**Valve timing**: Intake/exhaust valves move with sine wave tied to crank rotation (simplified — real engines use camshafts).

**Gauge updates**: RPM = `engineSpeed * 200 + 300`. Stroke cycle from `crankRotation / (2π) mod 4`. Pressure from sine wave.

## Simplifications

This is an educational prototype, so I simplified:
- **Basic geometry** — Procedural boxes and cylinders, not detailed CAD models
- **No combustion** — Would need particle effects for explosions and exhaust
- **Simplified valve train** — Real engines have camshafts, rocker arms, pushrods
- **No connecting rods** — Pistons move directly from crankshaft rotation
- **No lubrication/cooling** — Just the mechanical basics
- **Uniform firing** — Real V8s have uneven firing intervals for better torque delivery

A production version would use imported CAD geometry, proper connecting rod kinematics, and particle effects for combustion.

## Stack

- **React** — UI state management
- **@react-three/fiber** — Declarative Three.js in React
- **@react-three/drei** — OrbitControls, Grid, helpers
- **Three.js** — 3D rendering engine
- **Vite** — Fast dev server + build tool

Same stack as `explode-assembly` and `earth-timeline` — I'm standardising on React + R3F for interactive 3D demos.

## What's Next

If I return to this, I'd add:
- **Connecting rods** — Proper piston-to-crankshaft linkage geometry
- **Camshafts** — Actual valve train with rocker arms
- **Combustion effects** — Particle systems for explosions and exhaust
- **Cutaway shader** — Progressive reveal with slice plane
- **Torque/power curves** — Live graphs showing engine performance
- **Compare configs** — Side-by-side inline-4, V6, V8, V12

For now, this proves the pattern: V-configuration geometry + kinematic animation + technical UI.

---

Built by Johnny Huynh • This is my kitchen sink • Research and education only — not production code
