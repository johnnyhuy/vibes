"""
Stub client for AI image generation APIs (Flux, DALL·E, etc.).

Set API_KEY environment variable to use.
Dry-run mode works without API key for testing.
"""

import os
import time
from typing import Optional, Literal

class ImageGenClient:
    """
    Generic client for AI image generation services.
    
    Supports multiple providers via adapter pattern.
    """
    
    def __init__(
        self, 
        provider: Literal["flux", "dalle", "midjourney", "ideogram"] = "flux",
        api_key: Optional[str] = None,
        dry_run: bool = False
    ):
        """
        Initialise image generation client.
        
        Args:
            provider: Which service to use
            api_key: API key (or set {PROVIDER}_API_KEY env var)
            dry_run: If True, simulate API calls without making requests
        """
        self.provider = provider
        self.dry_run = dry_run
        
        env_key = f"{provider.upper()}_API_KEY"
        self.api_key = api_key or os.getenv(env_key)
        
        if not self.api_key and not dry_run:
            raise ValueError(
                f"{env_key} not set. Either pass api_key or set environment variable.\n"
                f"Get a key at the provider's website.\n"
                f"Or use dry_run=True for testing."
            )
    
    def generate_image(
        self,
        prompt: str,
        negative_prompt: str = "",
        width: int = 1024,
        height: int = 1024,
        style: Optional[str] = None
    ) -> dict:
        """
        Generate image from text prompt.
        
        Args:
            prompt: Text description of desired image
            negative_prompt: Things to avoid
            width: Image width in pixels
            height: Image height in pixels
            style: Optional style preset (provider-specific)
            
        Returns:
            dict with task_id and status
        """
        if self.dry_run:
            return self._dry_run_response("generate_image", prompt)
        
        raise NotImplementedError(
            "Real API calls require implementation with requests library"
        )
    
    def generate_texture(
        self,
        prompt: str,
        seamless: bool = True,
        pbr: bool = True
    ) -> dict:
        """
        Generate seamless texture (if provider supports it).
        
        Args:
            prompt: Material description
            seamless: Generate tileable texture
            pbr: Generate PBR maps (diffuse, normal, roughness, metallic)
            
        Returns:
            dict with task_id and texture URLs
        """
        if self.dry_run:
            return self._dry_run_response("generate_texture", prompt)
        
        raise NotImplementedError(
            "Texture generation requires provider-specific implementation"
        )
    
    def get_status(self, task_id: str) -> dict:
        """
        Check generation task status.
        
        Args:
            task_id: ID returned from generate_*
            
        Returns:
            dict with status and image URL when complete
        """
        if self.dry_run:
            return {
                "task_id": task_id,
                "status": "succeeded",
                "progress": 100,
                "image_url": "https://example.com/output.png",
                "thumbnail_url": "https://example.com/thumb.png"
            }
        
        raise NotImplementedError("Real API calls require implementation")
    
    def download_image(self, image_url: str, output_path: str) -> None:
        """
        Download generated image.
        
        Args:
            image_url: URL from task status response
            output_path: Local path to save file
        """
        if self.dry_run:
            print(f"[DRY RUN] Would download from {image_url} to {output_path}")
            return
        
        raise NotImplementedError("Real downloads require implementation")
    
    def _dry_run_response(self, method: str, prompt: str) -> dict:
        """Simulate API response in dry-run mode."""
        task_id = f"dry_{self.provider}_{method}_{int(time.time())}"
        
        print(f"\n[DRY RUN] Called {self.provider}.{method}")
        print(f"  Prompt: {prompt}")
        print(f"  Task ID: {task_id}")
        print(f"  Status: In dry-run mode, no actual API call made")
        
        # Estimate cost
        cost_map = {
            "flux": "$0.02-0.05",
            "dalle": "$0.04-0.08",
            "midjourney": "~$0.05 (subscription)",
            "ideogram": "$0.08"
        }
        print(f"  Cost: $0.00 (real call would be {cost_map.get(self.provider, '~$0.05')})")
        
        return {
            "task_id": task_id,
            "status": "pending",
            "provider": self.provider,
            "message": "Dry-run mode: no API call made"
        }

def example_usage():
    """Example workflows with dry-run mode."""
    print("=== AI Image Generation Client (Dry Run) ===\n")
    
    # Example 1: Generate concept image with Flux
    print("Example 1: Generate concept art")
    client = ImageGenClient(provider="flux", dry_run=True)
    
    task = client.generate_image(
        prompt="A futuristic robot arm with hydraulic joints, industrial setting, dramatic lighting",
        negative_prompt="blurry, low quality",
        width=1024,
        height=1024
    )
    print(f"   Task created: {task['task_id']}\n")
    
    # Example 2: Generate seamless texture
    print("Example 2: Generate seamless texture")
    texture_task = client.generate_texture(
        prompt="Rusty metal panels with paint chips and weathering",
        seamless=True,
        pbr=True
    )
    print(f"   Texture task: {texture_task['task_id']}\n")
    
    # Example 3: Check status
    print("Example 3: Check task status")
    status = client.get_status(task["task_id"])
    print(f"   Status: {status['status']}")
    print(f"   Image URL: {status.get('image_url', 'pending')}\n")
    
    # Example 4: Download (dry-run)
    print("Example 4: Download result")
    if status['status'] == 'succeeded':
        client.download_image(status['image_url'], "output.png")
    
    print("\n=== To use with real APIs ===")
    print("1. Get API key from provider (Flux: replicate.com, DALL·E: openai.com)")
    print("2. Set environment variable: export FLUX_API_KEY='your_key'")
    print("3. Remove dry_run=True from ImageGenClient()")
    print("4. Install requests: pip install requests pillow")
    print("\n=== Integration with 3D Pipelines ===")
    print("• Generate reference: ImageGenClient → concept.png")
    print("• Model in Blender: Use concept as reference plane")
    print("• Generate texture: ImageGenClient(texture mode) → PBR maps")
    print("• Apply in Three.js: Load texture in web-3d viewer")

if __name__ == "__main__":
    example_usage()
