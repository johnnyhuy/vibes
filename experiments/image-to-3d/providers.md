# AI Image & Texture Generation Providers

Comparison of AI-powered image generation services with focus on 3D texture workflows (as of Sept 2026).

## Provider Overview

| Provider | Specialty | Output | Speed | API | Price |
|----------|-----------|--------|-------|-----|-------|
| **Flux** | Photorealism, text | PNG, JPEG | ~5-10s | ✓ | $0.02-0.05/img |
| **Midjourney** | Artistic, stylised | PNG | ~30-60s | Unofficial | $10/mo (200 imgs) |
| **DALL·E 3** | General purpose | PNG (1024²-1792²) | ~10-20s | ✓ | $0.04-0.08/img |
| **Stable Diffusion** | Open source, custom | PNG, various | ~2-5s | Self-hosted | Free (compute) |
| **Ideogram** | Text rendering | PNG, JPEG | ~10s | ✓ | $0.08/img |
| **Meshy Texture** | 3D texture maps | PBR set (GLB) | ~2min | ✓ | $0.15/texture |
| **Polycam** | Photogrammetry tex | GLB, texture set | ~3min | ✓ | $20/mo |
| **Firefly** | Adobe ecosystem | PNG, JPEG | ~5-10s | ✓ | $5/mo (100 imgs) |

## Detailed Comparison

### Flux (Black Forest Labs)
**Best for**: Photorealistic images, fast prototyping

- **Strengths**: State-of-the-art quality (2026), fast inference, prompt adherence
- **Weaknesses**: Less artistic control than Midjourney
- **API**: REST API with async/sync modes
- **Formats**: PNG, JPEG (up to 2048²)
- **Pricing**: $0.02-0.05/image depending on resolution

**Example use case**: Generate product photos for 3D model reference

---

### Midjourney
**Best for**: Concept art, stylised visuals, creative exploration

- **Strengths**: Unmatched artistic quality, style consistency, community
- **Weaknesses**: No official API, Discord-based workflow
- **API**: Unofficial wrappers (e.g. mj-api.com)
- **Formats**: PNG (default 1024², upscale to 2048²+)
- **Pricing**: $10/mo Basic (200 imgs), $30/mo Standard (unlimited)

**Example use case**: Concept art for game assets before 3D modelling

---

### DALL·E 3 (OpenAI)
**Best for**: General-purpose image generation, content-safe outputs

- **Strengths**: Strong prompt understanding, safe outputs, API maturity
- **Weaknesses**: Less photorealistic than Flux, more expensive
- **API**: OpenAI API (REST)
- **Formats**: PNG (1024², 1024×1792, 1792×1024)
- **Pricing**: $0.04/image (1024²), $0.08/image (HD)

**Example use case**: Reference images for product designs

---

### Stable Diffusion
**Best for**: Custom models, on-premise deployment, research

- **Strengths**: Open source, runs locally, extensible (LoRA, ControlNet)
- **Weaknesses**: Requires GPU, more technical setup
- **API**: Self-hosted (Automatic1111, ComfyUI, A1111 API)
- **Formats**: PNG, JPEG, WebP, custom
- **Pricing**: Free (compute costs only)

**Example use case**: Proprietary texture generation with custom-trained models

---

### Ideogram
**Best for**: Images with readable text, logos, typography

- **Strengths**: Best-in-class text rendering in images
- **Weaknesses**: Less photorealistic than Flux
- **API**: REST API
- **Formats**: PNG, JPEG
- **Pricing**: $0.08/image, $8/mo (100 imgs)

**Example use case**: UI mockups, signage textures, branded content

---

## 3D Texture-Specific Tools

### Meshy Texture AI
**Best for**: PBR texture generation for 3D models

- **Strengths**: Generates full PBR material (diffuse, normal, roughness, metallic)
- **Weaknesses**: Quality varies, needs good prompts
- **API**: REST API
- **Formats**: PNG texture sets, GLB with textures embedded
- **Pricing**: $0.15/texture generation

**Workflow**: Prompt → generates seamless tileable textures + PBR maps → apply to 3D model

**Example**: "rusty metal with paint chips" → diffuse.png, normal.png, roughness.png, metallic.png

---

### Polycam Textures
**Best for**: Photogrammetry-based realistic textures

- **Strengths**: Real-world photorealism, seamless tiling
- **Weaknesses**: Slower, requires good input photos
- **API**: REST API (beta)
- **Formats**: GLB, texture sets (4K-8K), FBX
- **Pricing**: $20/mo Pro (500 scans)

**Workflow**: Upload photos → photogrammetry reconstruction → extract texture → seamless tiling

**Example**: Brick wall photos → 4K tileable brick texture

---

### Adobe Firefly
**Best for**: Adobe ecosystem integration, commercial-safe

- **Strengths**: Trained on Adobe Stock, commercially safe, Photoshop integration
- **Weaknesses**: Less flexible than SD, subscription required
- **API**: REST API (Adobe Creative Cloud)
- **Formats**: PNG, JPEG
- **Pricing**: $5/mo (100 credits), $50/mo (1000 credits)

**Workflow**: Prompt in Firefly → edit in Photoshop → export to 3D workflow

---

## What Each Provider Replaces

| Provider | Replaces | Traditional Tool |
|----------|----------|------------------|
| **Flux** | Stock photography | Shutterstock, Getty Images |
| **Midjourney** | Concept artists (rapid iteration) | Digital painting tools |
| **DALL·E** | General illustration | Illustrator + hours of work |
| **Stable Diffusion** | Custom asset pipelines | In-house art teams |
| **Ideogram** | Typographic design | Designer mockups |
| **Meshy Texture** | Texture artists | Substance Painter workflows |
| **Polycam** | Manual photogrammetry | Reality Capture, Agisoft |
| **Firefly** | Adobe Stock search | Stock photo subscriptions |

## Integration with 3D Pipelines

### Typical Workflow: Image Gen → 3D

1. **Generate reference images** (Flux, Midjourney, DALL·E)
2. **Model in 3D** (Blender, CAD, mesh-gen)
3. **Generate textures** (Meshy Texture, Stable Diffusion + ControlNet)
4. **Apply materials** (Blender nodes, Three.js materials)
5. **Render/deploy** (web-3d, Blender Cycles, Vercel)

### Image-to-Texture Pipeline

```
Flux/DALL·E prompt → image.png
  ↓
Meshy Texture AI → PBR texture set
  ↓
Blender material nodes → applied to mesh
  ↓
GLB export → web-3d viewer
```

### Texture Tools by Use Case

| Need | Use This |
|------|----------|
| Seamless tileable textures | **Meshy Texture** or **Polycam** |
| Custom stylised textures | **Stable Diffusion** + ControlNet |
| Photorealistic one-offs | **Flux** → manual tiling |
| PBR material generation | **Meshy Texture** |
| Quick concept textures | **Midjourney** → project onto UV |

## Formats & File Types

### Common Image Formats
- **PNG** — Lossless, alpha channel, best for textures
- **JPEG** — Lossy, smaller files, no alpha
- **WebP** — Modern format, better compression
- **EXR** — HDR, used in high-end rendering

### PBR Texture Maps
AI texture tools typically generate:
- **Diffuse/Albedo** — Base colour
- **Normal** — Surface detail (faking geometry)
- **Roughness** — Surface smoothness (0=mirror, 1=matte)
- **Metallic** — Metallic vs dielectric (0=non-metal, 1=metal)
- **AO (Ambient Occlusion)** — Shadowed crevices
- **Height/Displacement** — Actual geometry deformation

## Free Tiers & Trials

- **Flux**: No free tier (pay-per-use)
- **Midjourney**: No free tier (was available in 2023)
- **DALL·E**: $5 credit on signup (~100 images)
- **Stable Diffusion**: Free (self-host)
- **Ideogram**: 10 free images on signup
- **Meshy Texture**: 3 free generations
- **Firefly**: 25 free credits/month
- **Polycam**: Free tier (limited scans)

## Choosing a Provider for 3D Work

### For Concept/Reference Images
**Flux** or **Midjourney** — get visual direction before modelling

### For Seamless Textures
**Meshy Texture** or **Stable Diffusion** (with tiling model)

### For Photorealism
**Polycam** (photogrammetry) or **Flux** (high-res prompts)

### For Custom Pipelines
**Stable Diffusion** — train on proprietary data, full control

### For Quick Web Textures
**Firefly** or **Flux** → edit in Photoshop → export 1024² PNG

## Related Services

- **Scenario** — Texture generation for game assets
- **Leonardo.ai** — Image gen with asset management
- **RunwayML** — Video + image gen
- **Lexica** — Stable Diffusion search + generation
- **NightCafe** — Multi-model image gen UI

## Verdict for Vibes Pipelines

| Pipeline Stage | Recommended Tool |
|----------------|------------------|
| Concept art | **Midjourney** |
| Reference photos | **Flux** |
| Custom textures | **Stable Diffusion** |
| PBR material gen | **Meshy Texture** |
| Quick web textures | **Firefly** |
| Photorealistic env | **Polycam** |

**For this experiment lane**: We document the landscape without requiring API keys. Dry-run stubs show workflow patterns.
