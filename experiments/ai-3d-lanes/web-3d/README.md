# web-3d

Interactive 3D assembly explorer built with Three.js and Vite.

## Features

- **Assembly Scene**: Exploded view of a 12-part motor assembly
  - Interactive explode slider
  - Click parts to see detailed information
  - Hover highlighting
  - Professional dark UI

- **Cutaway Scene**: Mechanical cross-section visualisation
  - Half-section view of cylindrical motor
  - Rotating internal components
  - Coil windings and shaft detail

## Running Locally

```bash
npm install
npm run dev
```

Open the displayed localhost URL in your browser.

## Build

```bash
npm run build
```

Output in `dist/`

## Deploy to Vercel

This lane is configured for automatic Vercel preview deployments.

**Project**: `vibes` (prj_4b6cXKJVxCYNTn6WuofofmkBZPX6) is linked and ready for preview deploys.

### Setup (one-time)

1. **Import the repository** in Vercel:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import `johnnyhuy/vibes`

2. **Configure Root Directory** (dashboard only):
   - In Project Settings → Build & Development Settings → Root Directory
   - Set to `experiments/ai-3d-lanes/web-3d`
   - Enable "Include source files outside of the Root Directory"
   - **Note**: `rootDirectory` is NOT a valid `vercel.json` property; it must be set in project settings

3. **Verify Framework Detection**:
   - Framework Preset: **Vite** (auto-detected from local `vercel.json`)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Automatic Previews

Once configured:
- ✅ **Production**: Deploys from `main` branch automatically
- ✅ **PR Previews**: Every PR gets a unique preview URL
- ✅ **Comments**: Vercel bot comments on PRs with preview links

## Tech Stack

- **Three.js** — 3D rendering
- **Vite** — Fast dev server and build tool
- **Vanilla JS** — No framework overhead

## Scene Details

### Assembly Parts
12 procedurally generated parts representing a typical electric motor:
- Housing, rotor, stator
- Front/rear bearings and end caps
- Drive shaft, cooling fan
- Terminal box, mounting flange, windings

### Cutaway Scene
Cross-section view revealing:
- Outer shell (with clipping plane)
- Rotor core
- 8 electromagnetic coils
- Central drive shaft

All geometry is procedural — no external model files required.
