"""
Stub client for Meshy.ai API.

Set MESHY_API_KEY environment variable to use.
Dry-run mode works without API key for testing.
"""

import os
import json
import time
from typing import Optional, Literal

class MeshyClient:
    """
    Client for Meshy.ai text-to-3D and image-to-3D generation.
    
    Docs: https://docs.meshy.ai/
    """
    
    def __init__(self, api_key: Optional[str] = None, dry_run: bool = False):
        """
        Initialise Meshy client.
        
        Args:
            api_key: Meshy API key (or set MESHY_API_KEY env var)
            dry_run: If True, simulate API calls without making requests
        """
        self.api_key = api_key or os.getenv("MESHY_API_KEY")
        self.dry_run = dry_run
        self.base_url = "https://api.meshy.ai/v1"
        
        if not self.api_key and not dry_run:
            raise ValueError(
                "MESHY_API_KEY not set. Either pass api_key or set environment variable.\n"
                "Get a key at https://app.meshy.ai/api-keys\n"
                "Or use dry_run=True for testing."
            )
    
    def text_to_3d(
        self,
        prompt: str,
        art_style: Literal["realistic", "cartoon", "low-poly", "sculpture"] = "realistic",
        negative_prompt: str = "",
        resolution: Literal["low", "medium", "high"] = "medium"
    ) -> dict:
        """
        Generate 3D mesh from text prompt.
        
        Args:
            prompt: Text description of desired 3D model
            art_style: Visual style for the output
            negative_prompt: Things to avoid in generation
            resolution: Mesh detail level
            
        Returns:
            dict with task_id and status
        """
        if self.dry_run:
            return self._dry_run_response("text_to_3d", prompt)
        
        raise NotImplementedError("Real API calls require implementation with requests library")
    
    def image_to_3d(
        self,
        image_path: str,
        enable_pbr: bool = True,
        resolution: Literal["low", "medium", "high"] = "medium"
    ) -> dict:
        """
        Generate 3D mesh from image.
        
        Args:
            image_path: Path to input image
            enable_pbr: Generate PBR material maps
            resolution: Mesh detail level
            
        Returns:
            dict with task_id and status
        """
        if self.dry_run:
            return self._dry_run_response("image_to_3d", image_path)
        
        raise NotImplementedError("Real API calls require implementation with requests library")
    
    def get_task_status(self, task_id: str) -> dict:
        """
        Poll generation task status.
        
        Args:
            task_id: ID returned from text_to_3d or image_to_3d
            
        Returns:
            dict with status and download_url when complete
        """
        if self.dry_run:
            return {
                "task_id": task_id,
                "status": "succeeded",
                "progress": 100,
                "download_url": "https://example.com/output.glb",
                "thumbnail_url": "https://example.com/thumb.png",
                "model_urls": {
                    "glb": "https://example.com/output.glb",
                    "fbx": "https://example.com/output.fbx",
                    "obj": "https://example.com/output.obj"
                }
            }
        
        raise NotImplementedError("Real API calls require implementation")
    
    def download_model(self, download_url: str, output_path: str) -> None:
        """
        Download generated model file.
        
        Args:
            download_url: URL from task status response
            output_path: Local path to save file
        """
        if self.dry_run:
            print(f"[DRY RUN] Would download from {download_url} to {output_path}")
            return
        
        raise NotImplementedError("Real downloads require implementation")
    
    def _dry_run_response(self, method: str, input_data: str) -> dict:
        """Simulate API response in dry-run mode."""
        task_id = f"dry_{method}_{int(time.time())}"
        
        print(f"\n[DRY RUN] Called {method}")
        print(f"  Input: {input_data}")
        print(f"  Task ID: {task_id}")
        print(f"  Status: In dry-run mode, no actual API call made")
        print(f"  Cost: $0.00 (real call would be ~$0.10-0.30)")
        
        return {
            "task_id": task_id,
            "status": "pending",
            "message": "Dry-run mode: no API call made"
        }

def example_usage():
    """Example workflow with dry-run mode."""
    print("=== Meshy Client Example (Dry Run) ===\n")
    
    client = MeshyClient(dry_run=True)
    
    print("1. Generate from text prompt:")
    task = client.text_to_3d(
        prompt="A futuristic robot arm with hydraulic joints",
        art_style="realistic"
    )
    print(f"   Task created: {task['task_id']}\n")
    
    print("2. Poll task status:")
    status = client.get_task_status(task["task_id"])
    print(f"   Status: {status['status']}")
    print(f"   Download URL: {status.get('download_url', 'pending')}\n")
    
    print("3. Download result:")
    if status['status'] == 'succeeded':
        client.download_model(status['download_url'], "output.glb")
    
    print("\n=== To use with real API ===")
    print("1. Get API key: https://app.meshy.ai/api-keys")
    print("2. Set environment variable: export MESHY_API_KEY='your_key'")
    print("3. Remove dry_run=True from MeshyClient()")
    print("4. Install requests: pip install requests")

if __name__ == "__main__":
    example_usage()
