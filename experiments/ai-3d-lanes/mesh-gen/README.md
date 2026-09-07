# mesh-gen

Generative 3D mesh lane: documentation, stubs, and viewer for AI mesh generation services.

## What's Here

- **providers.md** — Comprehensive comparison of Meshy, Tripo, Rodin, Luma, Spline AI
- **meshy_client.py** — Stub client with dry-run mode (no API key required)
- **viewer.html** — Sample viewer placeholder (open directly in browser)

## Why Stubs?

AI mesh generation services are:
- **Commercial** — require paid API keys and credits
- **Rate-limited** — not suitable for CI/CD or frequent testing
- **Async** — generation takes 1-10 minutes per model

This lane provides **documentation and workflow examples** without requiring API access.

## Running the Stub

```bash
python meshy_client.py
```

This demonstrates:
1. Text-to-3D generation flow
2. Task polling pattern
3. Download workflow

All in **dry-run mode** (no API calls, no charges).

## Using with Real API

### 1. Get an API Key
- **Meshy**: https://app.meshy.ai/api-keys (5 free generations on signup)
- **Tripo**: https://tripo3d.ai/ (3 free generations)

### 2. Set Environment Variable
```bash
export MESHY_API_KEY='your_key_here'
```

### 3. Implement Real Client
The stub shows the structure. To make real calls:

```bash
pip install requests
```

Then modify `meshy_client.py` to implement actual HTTP requests per [Meshy API docs](https://docs.meshy.ai/).

## Typical Workflow

```python
from meshy_client import MeshyClient

client = MeshyClient()  # Reads MESHY_API_KEY from env

task = client.text_to_3d(
    prompt="A steampunk robot holding a wrench",
    art_style="realistic"
)

while True:
    status = client.get_task_status(task['task_id'])
    if status['status'] == 'succeeded':
        break
    time.sleep(10)

client.download_model(status['download_url'], 'robot.glb')
```

## Why Not Include Full Implementation?

1. **Cost**: Each generation costs $0.10-0.80, unfeasible for open repo testing
2. **Rate limits**: APIs are async and rate-limited
3. **API keys**: Can't commit keys, can't assume users have them
4. **Educational focus**: Documentation + stubs teach the pattern without the cost

## Viewer

Open `viewer.html` in a browser to see the placeholder interface. In a real implementation, this would:
- Accept GLB file upload or URL
- Render with Three.js (like `../web-3d`)
- Show generation parameters and provider info

## Comparison to Other Lanes

| Lane | Runs Locally | Requires External Service | CI-Friendly |
|------|--------------|---------------------------|-------------|
| **web-3d** | ✓ | ✗ | ✓ |
| **blender** | ✓ (if Blender installed) | ✗ | ✓ |
| **cad** | ✓ | ✗ | ✓ |
| **mesh-gen** | Stub only | ✓ (API + $) | ✗ |

Mesh generation is the **only lane requiring external services**, hence the stub approach.

## Extending This Lane

1. Implement full `meshy_client.py` with `requests`
2. Add Three.js viewer to `viewer.html`
3. Compare outputs from multiple providers
4. Build a Streamlit UI for generation
5. Create a queue system for batch generation

## Resources

- [providers.md](./providers.md) — Full provider comparison
- [Meshy API Docs](https://docs.meshy.ai/)
- [Tripo API Docs](https://tripo3d.ai/docs)
- [Rodin API](https://hyperhuman.deemos.com/)
