# v8-cutaway

Technical engine cutaway visualisation with real-time indicators. Inspired by [this X post](https://x.com/DilumSanjaya/status/1832045625846227101) showing an interactive V8 engine with overlays and gauges.

I built this to learn how to visualise mechanical systems with synchronized motion and technical overlays — the kind of engineering diagrams that make complex machinery understandable.

## What I Made

A simplified 8-cylinder engine cutaway with animated internals:

- **Animated pistons** — 8 cylinders firing in sequence with realistic stroke patterns
- **Rotating crankshaft** — Synchronized rotation driving piston motion
- **Valve timing** — Intake/exhaust valves opening based on cycle position
- **Live gauges** — RPM, stroke cycle (intake/compression/power/exhaust), chamber pressure
- **Speed control** — Adjust engine speed from idle to high rev
- **Technical aesthetic** — Monospace font, technical labels, clean indicators

## Running It

```bash
npm install
npm run dev
```

Open in browser → orbit to view, adjust speed slider to change RPM.

## Why I Made This

After seeing AI generate that detailed V8 visualisation, I wanted to understand the mechanics of synchronizing 3D animation with technical readouts.

This is my learning experiment for:
- **Kinematic chains** — How crankshaft rotation drives piston motion
- **Phase offsets** — Each cylinder fires at different crank angle
- **Visual indicators** — Connecting 3D motion to 2D gauges
- **Technical UI design** — Making engineering data readable and elegant

## The Mechanics

**Crankshaft rotation**: Single rotating cylinder, incremented each frame.

**Piston motion**: `y = baseY + sin(crankRotation + phase) * stroke`. Each piston has phase offset.

**Valve timing**: Sine wave with different phase opens/closes valves based on cycle.

**Gauge updates**: RPM calculated from rotation speed. Stroke cycle from crankRotation modulo 4. Pressure from sine wave.

## Simplifications

This is a learning model, so I simplified:
- **8 inline cylinders** instead of V8 (easier to visualize)
- **Simple geometry** — boxes and cylinders instead of detailed CAD
- **No combustion** — would need particle effects for explosions
- **Simplified valve train** — real engines have camshafts, rocker arms
- **No lubrication/cooling** — just the mechanical basics

A production version would import real CAD geometry and add fluid simulations.

## How AI Could Generate This

An agent given "build a V8 engine visualisation" could:
1. **Generate mechanical layout** — LLM outputs cylinder count, bore, stroke, firing order
2. **Calculate kinematics** — Convert crankshaft angle to piston position
3. **Create UI overlays** — Generate gauges from mechanical state
4. **Apply styling** — Technical aesthetic (monospace, grids, precise indicators)

I hand-coded the kinematics, but the pattern is clear for automation.

## What's Next

- Add camshaft and valve train detail
- Show combustion with particle effects
- Display torque/power curves
- Compare different engine configs (inline-4, V6, boxer)
- Export educational animations

This is my kitchen sink. Research and education only.
