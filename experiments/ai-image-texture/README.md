# ai-image-texture

AI-powered image and texture generation documentation and workflow stubs.

## What's Here

- **providers.md** — Comprehensive comparison of Flux, DALL·E, Midjourney, Stable Diffusion, Ideogram, and 3D texture tools
- **image_client.py** — Dry-run stub client demonstrating API workflow patterns
- **viewer.html** — Placeholder viewer showing procedural noise (open in browser)

## Why Stubs?

AI image generation services are:
- **Commercial** — require paid API keys and credits
- **Rate-limited** — not suitable for frequent automated testing
- **Provider-specific** — each has unique API shapes and pricing

This lane provides **documentation and workflow patterns** without requiring API access.

## Running the Stub

```bash
python image_client.py
```

Demonstrates:
1. Image generation from text prompts
2. Seamless texture generation (PBR maps)
3. Status polling pattern
4. Download workflow

All in **dry-run mode** (no API calls, no charges).

## Using with Real APIs

### 1. Get an API Key

- **Flux**: [replicate.com](https://replicate.com/) ($0.02-0.05/image)
- **DALL·E**: [platform.openai.com](https://platform.openai.com/) ($5 free credit on signup)
- **Midjourney**: [midjourney.com](https://midjourney.com/) ($10/mo subscription)
- **Stable Diffusion**: Self-host (free) or [replicate.com](https://replicate.com/)

### 2. Set Environment Variable

```bash
export FLUX_API_KEY='your_key_here'
# or
export OPENAI_API_KEY='your_key_here'
```

### 3. Implement Real Client

The stub shows the structure. To make real calls:

```bash
pip install requests pillow
```

Then modify `image_client.py` to implement actual HTTP requests per provider docs.

## How Image Gen Feeds 3D Pipelines

This lane demonstrates how AI image generation integrates with other vibes experiments:

### Typical Pipeline

```
1. Concept Generation
   image_client.py → reference.png
   ↓
2. 3D Modelling
   Blender (experiments/ai-3d-lanes/blender/) → model.glb
   ↓
3. Texture Generation
   image_client.py (texture mode) → PBR maps
   ↓
4. Material Application
   Blender nodes or Three.js materials
   ↓
5. Web Deployment
   experiments/ai-3d-lanes/web-3d/ → Vercel
```

### Integration Points

**With Blender Lane**:
- Generate reference images → import as background in Blender
- Generate PBR textures → load in Shader Editor nodes
- Generate environment maps → use for lighting

**With Web-3D Lane**:
- Generate textures → load via `THREE.TextureLoader`
- Generate environment maps → use as scene background
- Generate normal maps → enhance visual detail without geometry

**With CAD Lane**:
- Generate reference sketches → trace for technical drawings
- Generate material finishes → preview on parametric parts

### Example Workflow: Product Visualisation

```python
# 1. Generate concept
client = ImageGenClient(provider="flux")
concept = client.generate_image(
    prompt="Sleek wireless headphones, matte black finish, studio lighting"
)

# 2. Model in Blender (experiments/ai-3d-lanes/blender/)
# Use concept.png as reference → model headphones.glb

# 3. Generate custom texture
texture = client.generate_texture(
    prompt="Matte black aluminum with subtle brushed finish",
    seamless=True,
    pbr=True
)

# 4. Apply in web-3d
# Load texture_diffuse.png, texture_normal.png, texture_roughness.png
# Display in experiments/ai-3d-lanes/web-3d/
```

## Providers by Use Case

| Need | Recommended Provider |
|------|---------------------|
| Quick concept art | **Flux** or **Midjourney** |
| Product reference photos | **DALL·E 3** |
| Seamless textures | **Meshy Texture** or **Stable Diffusion** |
| Photorealistic materials | **Polycam** (photogrammetry) |
| Custom training | **Stable Diffusion** (LoRA/fine-tuning) |
| Text in images | **Ideogram** |
| Adobe integration | **Firefly** |

## Texture Types Explained

AI texture generators typically output:

- **Diffuse/Albedo** — Base colour (no lighting baked in)
- **Normal Map** — Simulates surface detail via RGB → XYZ normals
- **Roughness** — How matte (1.0) vs glossy (0.0) the surface is
- **Metallic** — Metallic (1.0) vs dielectric (0.0) materials
- **Ambient Occlusion** — Pre-baked shadows in crevices
- **Height/Displacement** — Actual geometry deformation

See `providers.md` for detailed format and workflow information.

## Comparison to Other Lanes

| Lane | Purpose | AI Role |
|------|---------|---------|
| **ai-image-texture** | Generate visuals | Create reference images + textures |
| **ai-3d-lanes/mesh-gen** | Generate geometry | Create 3D meshes from text/images |
| **ai-3d-lanes/blender** | Automate scenes | Script rendering workflows |
| **ai-3d-lanes/web-3d** | Display results | Interactive web viewer |

**This lane's advantage**: Generates the visual layer (colours, materials) that makes 3D models look real.

## Extending This Experiment

1. Implement full `image_client.py` with real API calls
2. Add viewer that loads/displays generated images
3. Build texture tiling tool (seamless wrapping)
4. Create ControlNet integration (image-to-image)
5. Generate PBR bakers (convert photos → PBR maps)

## Resources

- [providers.md](./providers.md) — Full provider comparison
- [Flux API docs](https://replicate.com/black-forest-labs/flux)
- [OpenAI DALL·E docs](https://platform.openai.com/docs/guides/images)
- [Stable Diffusion guide](https://github.com/CompVis/stable-diffusion)
- [PBR texture workflow](https://learnopengl.com/PBR/Theory)
