#!/usr/bin/env python3
"""
LLM + OpenSCAD Part Generator

Demonstrates how to use LLMs to generate parametric OpenSCAD code.
In dry-run mode, selects from example templates.
"""

import os
import sys
from typing import Optional

class OpenSCADGenerator:
    """
    Generator that uses LLM to create OpenSCAD code from natural language.
    """
    
    def __init__(self, dry_run: bool = False):
        """
        Initialise generator.
        
        Args:
            dry_run: If True, use template selection instead of LLM API
        """
        self.dry_run = dry_run
        self.examples_dir = os.path.join(os.path.dirname(__file__), "examples")
    
    def generate(self, prompt: str, output_file: Optional[str] = None) -> str:
        """
        Generate OpenSCAD code from natural language prompt.
        
        Args:
            prompt: Natural language description of desired part
            output_file: Optional output .scad file path
            
        Returns:
            Generated OpenSCAD code as string
        """
        if self.dry_run:
            return self._dry_run_generate(prompt, output_file)
        
        raise NotImplementedError(
            "Real LLM integration requires OpenAI/Anthropic API key.\n"
            "Use dry_run=True to use example templates."
        )
    
    def _dry_run_generate(self, prompt: str, output_file: Optional[str]) -> str:
        """
        Dry-run mode: match prompt to example templates.
        """
        prompt_lower = prompt.lower()
        
        # Simple keyword matching to example files
        if "bracket" in prompt_lower or "l-shaped" in prompt_lower:
            example_file = "bracket.scad"
            description = "L-shaped mounting bracket"
        elif "enclosure" in prompt_lower or "box" in prompt_lower:
            example_file = "enclosure.scad"
            description = "Parametric enclosure box with lid"
        elif "gear" in prompt_lower:
            example_file = "gear.scad"
            description = "Involute spur gear"
        else:
            # Default to bracket
            example_file = "bracket.scad"
            description = "L-shaped mounting bracket (default)"
        
        example_path = os.path.join(self.examples_dir, example_file)
        
        print(f"\n[DRY RUN] LLM + OpenSCAD Generator")
        print(f"  Prompt: {prompt}")
        print(f"  Matched template: {description}")
        print(f"  Example file: {example_file}")
        
        if not os.path.exists(example_path):
            print(f"  ⚠️  Example file not found: {example_path}")
            return ""
        
        with open(example_path, 'r') as f:
            code = f.read()
        
        if output_file:
            with open(output_file, 'w') as f:
                f.write(code)
            print(f"  ✓ Written to: {output_file}")
        
        print(f"  ✓ Generated {len(code)} characters of OpenSCAD code")
        print(f"\n  To render: openscad -o {output_file or 'output'}.stl {output_file or example_file}")
        print(f"  To preview: openscad {output_file or example_file}")
        
        return code
    
    def list_examples(self) -> list[str]:
        """List available example templates."""
        if not os.path.exists(self.examples_dir):
            return []
        
        return [f for f in os.listdir(self.examples_dir) if f.endswith('.scad')]

def example_usage():
    """Demonstrate the generator in dry-run mode."""
    print("=== LLM + OpenSCAD Part Generator ===\n")
    
    generator = OpenSCADGenerator(dry_run=True)
    
    # Example 1: Generate a bracket
    print("Example 1: Generate mounting bracket")
    code = generator.generate(
        "Create an L-shaped mounting bracket with holes for M4 screws",
        output_file="generated_bracket.scad"
    )
    
    print("\n" + "="*50 + "\n")
    
    # Example 2: Generate an enclosure
    print("Example 2: Generate electronics enclosure")
    code = generator.generate(
        "Make a rectangular enclosure box with a snap-fit lid",
        output_file="generated_enclosure.scad"
    )
    
    print("\n" + "="*50 + "\n")
    
    # Example 3: List available templates
    print("Example 3: Available templates")
    examples = generator.list_examples()
    print(f"  Found {len(examples)} examples:")
    for ex in examples:
        print(f"    - {ex}")
    
    print("\n" + "="*50)
    print("\n=== Real LLM Integration ===")
    print("To use with actual LLM (GPT-4, Claude):")
    print("1. Get API key from OpenAI or Anthropic")
    print("2. Set OPENAI_API_KEY or ANTHROPIC_API_KEY env var")
    print("3. Install: pip install openai anthropic")
    print("4. Implement _llm_generate() method with API calls")
    print("\n=== Prompt Engineering Tips ===")
    print("• Be specific about dimensions (mm)")
    print("• Request parametric design with exposed variables")
    print("• Ask for comments explaining calculations")
    print("• Specify 3D printing constraints if applicable")
    print("• See prompt_templates.md for more examples")

def main():
    """CLI interface."""
    if len(sys.argv) > 1 and sys.argv[1] == "--help":
        print("Usage:")
        print("  python generate_part.py                    # Run examples")
        print("  python generate_part.py 'prompt'           # Generate from prompt")
        print("  python generate_part.py 'prompt' out.scad  # Save to file")
        return
    
    if len(sys.argv) == 1:
        # No args: run examples
        example_usage()
    elif len(sys.argv) == 2:
        # Prompt only
        generator = OpenSCADGenerator(dry_run=True)
        generator.generate(sys.argv[1])
    else:
        # Prompt + output file
        generator = OpenSCADGenerator(dry_run=True)
        generator.generate(sys.argv[1], sys.argv[2])

if __name__ == "__main__":
    main()
