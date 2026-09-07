# earth-timeline

Interactive Earth history visualisation. Inspired by [this X post](https://x.com/akshdeeps/status/1832134890432381354) showing an Earth timeline site that lets you scrub through 4.5 billion years.

I wanted to explore how to make geologic time tangible — something you can scroll through, not just read about.

## What I Built

A procedural Earth globe with a timeline slider spanning from planetary formation to present day:

- **Timeline scrub** — Slide through 9 major eras from Hadean to Anthropocene
- **Visual evolution** — Earth color shifts from molten brown → ocean blue → green with life
- **Atmosphere appearance** — Clouds and atmosphere fade in as conditions allow
- **Era descriptions** — Info card explains what's happening at each stage
- **Auto-play** — "Play the story" button to watch evolution unfold

## Running It

```bash
npm install
npm run dev
```

Open in browser → drag timeline to explore Earth's history.

## Why I Made This

After seeing GPT-6 Astra build that Earth civilisation site in 30 minutes, I wanted to understand the mechanics of interactive timeline visualisation.

This is my learning experiment for:
- **Temporal mapping** — Converting billions of years to 0-100 slider
- **State transitions** — Switching visual appearance based on timeline position
- **Procedural textures** — Generating Earth-like surfaces from noise
- **Narrative pacing** — Making geological eons feel engaging

## The Approach

**Procedural planet**: Canvas-generated texture with oceans + continents, no image assets.

**Timeline keyframes**: Array of eras with time/color/description. Slider finds nearest keyframe.

**Visual evolution**: Material color interpolates. Clouds/atmosphere opacity tied to timeline position.

**Auto-play**: setInterval increments slider value, creates animation loop.

## Simplifications

This is a learning experiment, so I simplified:
- **No real Earth map** — procedural noise instead of actual geography
- **No tectonic drift** — continents don't move (that would require animated textures)
- **Simplified timeline** — 9 keyframes instead of full geological scale
- **Basic atmosphere** — glow shell instead of proper Rayleigh scattering

For a production version, you'd want real topography data, tectonic animation, and atmospheric physics.

## How AI Could Generate This

An agent given "build an Earth history timeline" could:
1. **Generate timeline data** — LLM outputs era names, dates, descriptions
2. **Create procedural planet** — Generate texture from Perlin noise
3. **Map time to visual states** — Calculate color transitions between eras
4. **Build UI controls** — Slider + play button + info cards

I hand-coded this, but the structure shows what's automatable.

## What's Next

- Add tectonic plate animation
- Show asteroid impacts / major events
- Temperature / atmospheric composition charts
- Zoom into specific eras (Cambrian explosion detail view)
- Export as video for education

This is my kitchen sink. Research and education only.
