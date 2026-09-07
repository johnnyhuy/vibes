# 3D Mesh Generation Providers

Comparison of AI-powered text/image-to-3D mesh services (as of Sept 2026).

## Provider Overview

| Provider | Input | Output | Speed | Quality | API | Price |
|----------|-------|--------|-------|---------|-----|-------|
| **Meshy** | Text, Image | GLB, FBX, OBJ | ~2-3 min | High | ✓ | $0.10-0.30/gen |
| **Tripo AI** | Text, Image | GLB, USDZ | ~1-2 min | High | ✓ | $0.15/gen |
| **Rodin** | Image | GLB, OBJ | ~5 min | Very High | ✓ | $0.50/gen |
| **Luma AI** | Video, Image | GLB, NeRF | ~10 min | Photorealistic | API (beta) | $0.80/gen |
| **Spline AI** | Text | Spline format | ~30 sec | Stylised | In-app only | Free tier |

## Detailed Comparison

### Meshy (meshy.ai)
**Best for**: Production-ready game assets, product visualisation

- **Strengths**: Fast, reliable, good topology, PBR materials
- **Weaknesses**: Can struggle with complex text prompts
- **API**: REST API with webhooks
- **Formats**: GLB (default), FBX, OBJ, USDZ
- **Credits**: Subscription ($20/mo for 200 gens) or pay-as-you-go

**Example use case**: Generate furniture variations for e-commerce

### Tripo AI (tripo3d.ai)
**Best for**: Rapid prototyping, concept validation

- **Strengths**: Fastest generation, clean meshes, draft mode
- **Weaknesses**: Less detail than Rodin/Luma
- **API**: GraphQL API
- **Formats**: GLB, USDZ, FBX
- **Credits**: $16/mo for 100 gens

**Example use case**: Iterate on character concepts quickly

### Rodin (hyperhuman.deemos.com)
**Best for**: Hero assets, detailed characters

- **Strengths**: Highest quality, excellent from single image
- **Weaknesses**: Slower, more expensive
- **API**: REST API
- **Formats**: GLB, OBJ with PBR maps
- **Credits**: Enterprise pricing

**Example use case**: Convert 2D character art to 3D model

### Luma AI (lumalabs.ai)
**Best for**: Photorealistic scanning, product photography

- **Strengths**: NeRF-based, incredible realism, video input
- **Weaknesses**: Slow, needs good input, limited stylisation
- **API**: Invite-only beta
- **Formats**: GLB, NeRF exports, point clouds
- **Credits**: Beta pricing TBD

**Example use case**: Digital twin of physical products

### Spline AI (spline.design)
**Best for**: Web graphics, quick sketches

- **Strengths**: Instant, integrated editor, stylised aesthetic
- **Weaknesses**: Locked to Spline ecosystem, no STL/STEP
- **API**: None (in-app only)
- **Formats**: Spline JSON (export to GLB via editor)
- **Credits**: Free tier + Pro ($9/mo)

**Example use case**: Website hero sections, landing pages

## Choosing a Provider

### For Production Apps
**Meshy** or **Tripo** — reliable APIs, good speed/quality balance

### For Maximum Quality
**Rodin** or **Luma** — when you need the best, cost/time secondary

### For Prototyping
**Tripo** or **Spline** — fast iteration, low friction

### For Realism
**Luma** — photogrammetry-level quality from video

## Common Workflow

1. **Generate** via API (text/image prompt)
2. **Poll** for completion (webhook or status endpoint)
3. **Download** GLB/FBX file
4. **Post-process** (decimation, UV unwrap, retopo if needed)
5. **Import** to game engine / viewer / CAD

## API Rate Limits

- **Meshy**: 10 concurrent, 1000/day
- **Tripo**: 5 concurrent, 500/day
- **Rodin**: 3 concurrent, custom limits
- **Luma**: Beta limits apply

## Free Tiers / Trials

- **Meshy**: 5 free generations on signup
- **Tripo**: 3 free generations
- **Spline**: Unlimited (with branding)
- **Rodin**: No free tier (contact sales)
- **Luma**: Waitlist for API access

## Related Services

- **Zoo (zoo.dev)**: Text → CAD (STEP), not meshes
- **OpenAI Shap-E**: Open source, lower quality
- **Kaedim**: Image → 3D with human QA
- **Scenario**: AI texture generation (complements mesh gen)

## Verdict

| Need | Use This |
|------|----------|
| Fast + cheap + good API | **Tripo** |
| Balanced quality + reliability | **Meshy** |
| Hero assets, spare no expense | **Rodin** |
| Photorealism from video | **Luma** |
| Quick web graphics | **Spline** |

**For this lane**: We stub Meshy as it has the best balance of API maturity and output quality.
