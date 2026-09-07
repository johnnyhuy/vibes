# earth-timeline

Interactive Earth history visualisation exploring 4.5 billion years from planetary formation to present day.

I wanted to make geologic time tangible — something you can scroll through, watch evolve, and experience viscerally, not just read about in a textbook. Inspired by [@alwayspriyesh's Earth timeline demo](https://x.com/alwayspriyesh/status/2096819464688005440) (GPT-6 Astra in ~30 minutes) — I'm exploring how to build similar interactive timeline experiences with clean-room patterns.

## What I Built

A cinematic Earth visualisation with a timeline spanning 4.5 billion years:

- **Timeline scrub** — Drag through 9 major eras from Hadean to Anthropocene
- **Visual evolution** — Earth transforms from molten brown → deep ocean blue → vibrant green as life emerges
- **Atmosphere appearance** — Clouds and atmosphere fade in as the planet stabilises
- **Era descriptions** — Info card provides context for each geological period
- **Auto-play** — Watch 4.5 billion years unfold in 10 seconds
- **Orbit controls** — Rotate and zoom to explore the planet up close

## Running It

```bash
npm install
npm run dev
```

Open http://localhost:5173 → drag timeline slider, click play, orbit the planet.

## Why I Made This

I wanted to understand how to build **interactive timeline visualisations** that make abstract concepts (like geologic time) viscerally understandable.

This is my learning experiment for:
- **Temporal mapping** — Compressing 4.5 billion years into a 0-100 slider
- **Visual storytelling** — Using colour transitions and atmospheric effects to convey planetary evolution
- **React + R3F architecture** — Managing 3D state declaratively
- **Cinematic presentation** — Dark UI, smooth animations, orbital camera

## The Approach

**React + R3F stack**: React for UI state, React Three Fiber for declarative 3D, drei for helpers (OrbitControls, Stars).

**Procedural textures**: Canvas-generated Earth surface with continents and oceans. No external image assets.

**Timeline keyframes**: Array of 9 eras with timestamp, colour, cloud/atmosphere opacity. App finds current era based on slider position.

**Visual transitions**: Earth material colour interpolates between eras. Clouds and atmosphere fade in as the planet cools and life emerges.

**Auto-play**: useEffect with setInterval increments slider value every 100ms.

## Simplifications

This is an educational prototype, so I simplified:
- **Procedural textures** — No real Earth map or satellite imagery
- **Static continents** — No tectonic drift or plate movement
- **9 eras** — Condensed from hundreds of geological periods
- **Basic atmosphere** — Glow shell, not Rayleigh scattering physics
- **Uniform rotation** — Earth spins at constant speed (reality: days lengthen over time)

A production version would use NASA Blue Marble textures, tectonic animations, and proper atmospheric rendering.

## Stack

- **React** — UI state management
- **@react-three/fiber** — Declarative Three.js in React
- **@react-three/drei** — OrbitControls, Stars, helpers
- **Three.js** — 3D rendering engine
- **Vite** — Fast dev server + build tool

This is the same stack as `explode-assembly` — I'm converging on React + R3F for interactive 3D demos because it makes state management and UI integration trivial.

## What's Next

If I return to this, I'd add:
- **Tectonic plate animation** — Watch Pangaea form and break apart
- **Event markers** — Asteroid impacts, mass extinctions, ice ages
- **Atmospheric composition charts** — Track O₂, CO₂, temperature over time
- **Era deep-dives** — Zoom into the Cambrian explosion, show life emergence
- **NASA textures** — Replace procedural with Blue Marble imagery

For now, this proves the pattern: timeline scrubbing + visual evolution + cinematic presentation.

---

Built by Johnny Huynh • This is my kitchen sink • Research and education only — not production code
