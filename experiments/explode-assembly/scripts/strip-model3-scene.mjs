#!/usr/bin/env node

/**
 * Strip non-car props from model3.glb
 * 
 * Removes:
 * - Cylinder012 (traffic light stand)
 * - Debris_Tires, Debris_Tires.001 (piled wheels on floor)
 * - WallDeskSpeakers_mesh (studio speakers)
 * 
 * Keeps:
 * - All Tesla Model 3 car parts (wheels, body panels, interior, etc.)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, '../public/models/model3.glb');
const tempGltfPath = '/tmp/model3-temp.gltf';
const outputPath = join(__dirname, '../public/models/model3.glb');
const backupPath = join(__dirname, '../public/models/model3-original.glb.backup');

console.log('🔧 Stripping props from model3.glb...\n');

// 1. Back up original
console.log('📦 Backing up original model3.glb...');
execSync(`cp "${inputPath}" "${backupPath}"`);
console.log(`   ✓ Saved to model3-original.glb.backup\n`);

// 2. Convert GLB to GLTF JSON for editing
console.log('📄 Converting GLB to GLTF for editing...');
execSync(`npx gltf-pipeline -i "${inputPath}" -o "${tempGltfPath}" -j`);
console.log('   ✓ Converted to GLTF\n');

// 3. Load and parse GLTF
console.log('🔍 Analyzing scene graph...');
const gltf = JSON.parse(readFileSync(tempGltfPath, 'utf8'));

// Props to remove (node names)
const propsToRemove = [
  'Cylinder012',              // Traffic light stand
  'Debris_Tires',             // Piled wheels
  'Debris_Tires.001',         // Piled wheels
  'WallDeskSpeakers_mesh',    // Studio speakers
  'WallDeskSpeakers_mesh.001' // Studio speakers
];

// Meshes to remove (mesh names) 
const meshesToRemove = [
  'Cylinder012-Mesh',
  'Debris_Tires',
  'Debris_Tires.001',
  'WallDeskSpeakers_mesh_1',
  'WallDeskSpeakers_mesh_1.001'
];

const beforeNodeCount = gltf.nodes.length;
const beforeMeshCount = gltf.meshes.length;

console.log(`   Nodes before: ${beforeNodeCount}`);
console.log(`   Meshes before: ${beforeMeshCount}\n`);

// 4. Find and mark nodes/meshes to remove
const nodeIndicesToRemove = new Set();
const meshIndicesToRemove = new Set();

gltf.nodes.forEach((node, index) => {
  if (propsToRemove.includes(node.name)) {
    console.log(`   🗑️  Marking node for removal: "${node.name}"`);
    nodeIndicesToRemove.add(index);
    
    if (node.mesh !== undefined) {
      meshIndicesToRemove.add(node.mesh);
    }
  }
});

gltf.meshes.forEach((mesh, index) => {
  if (meshesToRemove.includes(mesh.name)) {
    console.log(`   🗑️  Marking mesh for removal: "${mesh.name}"`);
    meshIndicesToRemove.add(index);
  }
});

// 5. Remove references to these nodes from parent nodes
gltf.nodes.forEach((node) => {
  if (node.children) {
    node.children = node.children.filter(childIndex => !nodeIndicesToRemove.has(childIndex));
  }
});

// 6. Remove nodes and meshes (in reverse order to preserve indices)
const sortedNodeIndices = Array.from(nodeIndicesToRemove).sort((a, b) => b - a);
const sortedMeshIndices = Array.from(meshIndicesToRemove).sort((a, b) => b - a);

sortedNodeIndices.forEach(index => {
  gltf.nodes.splice(index, 1);
});

sortedMeshIndices.forEach(index => {
  gltf.meshes.splice(index, 1);
});

// 7. Update mesh indices in remaining nodes
gltf.nodes.forEach(node => {
  if (node.mesh !== undefined) {
    let adjustedMeshIndex = node.mesh;
    for (const removedIndex of sortedMeshIndices) {
      if (node.mesh > removedIndex) {
        adjustedMeshIndex--;
      }
    }
    node.mesh = adjustedMeshIndex;
  }
});

// 8. Update children indices in remaining nodes
gltf.nodes.forEach(node => {
  if (node.children) {
    node.children = node.children.map(childIndex => {
      let adjustedIndex = childIndex;
      for (const removedIndex of sortedNodeIndices) {
        if (childIndex > removedIndex) {
          adjustedIndex--;
        }
      }
      return adjustedIndex;
    });
  }
});

const afterNodeCount = gltf.nodes.length;
const afterMeshCount = gltf.meshes.length;

console.log(`\n📊 Results:`);
console.log(`   Nodes: ${beforeNodeCount} → ${afterNodeCount} (removed ${beforeNodeCount - afterNodeCount})`);
console.log(`   Meshes: ${beforeMeshCount} → ${afterMeshCount} (removed ${beforeMeshCount - afterMeshCount})\n`);

// 9. Save cleaned GLTF
console.log('💾 Saving cleaned GLTF...');
writeFileSync(tempGltfPath, JSON.stringify(gltf, null, 2));
console.log('   ✓ Saved\n');

// 10. Convert back to GLB
console.log('📦 Converting back to GLB...');
execSync(`npx gltf-pipeline -i "${tempGltfPath}" -o "${outputPath}" -b`);
console.log('   ✓ Converted to GLB\n');

// 11. Show file sizes
const originalSize = (readFileSync(backupPath).length / 1024).toFixed(1);
const newSize = (readFileSync(outputPath).length / 1024).toFixed(1);

console.log('📏 File sizes:');
console.log(`   Original: ${originalSize} KB`);
console.log(`   Cleaned:  ${newSize} KB`);
console.log(`   Saved:    ${(originalSize - newSize).toFixed(1)} KB (${((1 - newSize / originalSize) * 100).toFixed(1)}%)\n`);

// 12. Clean up temp file
execSync(`rm "${tempGltfPath}"`);

console.log('✅ Done! Cleaned model3.glb now contains ONLY the Tesla Model 3 car.\n');
console.log('   Original backed up as: model3-original.glb.backup');
console.log('   New model3.glb ready for use.\n');
