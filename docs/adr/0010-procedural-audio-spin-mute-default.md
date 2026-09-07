# ADR-0010: Procedural Headphone Spin, Mute-Default Web Audio

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [audio-gadget-spin.md](../reverse-engineering/audio-gadget-spin.md), [audio-gadget-spin](../../experiments/audio-gadget-spin/), [ADR-0004](./0004-procedural-geometry-over-assets.md)

## Context

Three public posts describe a marketing-site headphone spin, a Blender MCP over-ear, and a product hero with click sounds. I already have a scroll-driven bottle and a studio explode. This pass is the missing **turntable** lesson — orbit + finish swap + a sound the browser will actually allow.

Hobby Vercel quota is still 0 until ~2026-09-08 12:55 UTC. The experiment must stay local.

## Decision

### 1. Procedural cuff, not a brand GLB

**Chosen**: Vite + React + R3F + drei. Headband is a `TubeGeometry`. Cups are `RoundedBox`. The grille is a canvas texture. Materials are `MeshPhysicalMaterial` (clearcoat, sheen, transmission).

**Rejected**:
- Downloading a headphone GLB
- Reconstructing a Sony / Apple / Bose silhouette
- Standing up Blender MCP to export someone else’s cups

**Why**: Clean-room. The Xr0ud thumb is an architecture still anyway — I would be guessing their mesh. ADR-0004 already argues primitives for educational demos.

### 2. Mute defaults ON

**Chosen**: Web Audio oscillators for a short click and a whoosh. The UI toggle starts as **Muted**. `AudioContext.resume()` only runs after the user clicks Sound on.

**Rejected**:
- Auto-playing samples on first load
- Shipping a WAV / MP3
- Copying Gilbert’s synced key sounds

**Why**: Autoplay policies. A kitchen-sink demo that screams on tab open is a bad neighbour. Oscillators keep the bundle asset-free.

### 3. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`.

**Rejected**: `vibes-audio-gadget-spin`, `vibes-ballance-roll`, or a courtyard project while quota is 0.

**Why**: Pending Roots already need the next slots. A new hobby project would burn one.

## Consequences

### Positive

1. You can read how the cuff is built
2. Browsers stay quiet until asked
3. Bundle stays code-only

### Negative

1. Cups are squircles, not sculpted pads
2. Oscillators are not mechanical key sounds
3. Local QA only until a project exists

## Alternatives considered

- **drei `useGLTF` of my own export** — honest later, extra toolchain now
- **HTMLAudioElement samples** — files to license and host; oscillators are enough
- **Scroll-tied spin** — already taught on the bottle (ADR-0005). This one is a turntable

## Validation

```bash
cd experiments/audio-gadget-spin
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 12:55 UTC). If I add one later: Root Directory = `experiments/audio-gadget-spin`.

## References

- [Xr0ud](https://x.com/Xr0ud/status/2096982574132297791)
- [mrblackstudio](https://x.com/mrblackstudio/status/2096893411395600782)
- [Gilbert93533589](https://x.com/Gilbert93533589/status/2096920288319435154)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
