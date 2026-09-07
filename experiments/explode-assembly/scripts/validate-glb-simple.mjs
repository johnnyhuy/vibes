#!/usr/bin/env node
/**
 * Simple GLB structure validation
 * Checks GLB magic number, version, and JSON structure
 */

import fs from 'fs';

console.log('🔍 Validating model3.glb structure...\n');

const glbPath = 'public/models/model3.glb';

try {
  const buffer = fs.readFileSync(glbPath);
  
  // Check file size
  console.log(`✅ File exists: ${glbPath}`);
  console.log(`   Size: ${(buffer.length / 1024).toFixed(2)} KB\n`);
  
  // Read GLB header (12 bytes)
  const magic = buffer.readUInt32LE(0);
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  
  // Check magic number (0x46546C67 = "glTF")
  const expectedMagic = 0x46546C67;
  if (magic !== expectedMagic) {
    console.error(`❌ Invalid magic number: 0x${magic.toString(16)} (expected 0x${expectedMagic.toString(16)})`);
    process.exit(1);
  }
  console.log(`✅ Valid GLB magic number: 0x${magic.toString(16)}`);
  
  // Check version
  if (version !== 2) {
    console.error(`❌ Unsupported glTF version: ${version} (expected 2)`);
    process.exit(1);
  }
  console.log(`✅ glTF version: ${version}`);
  
  // Check length
  if (length !== buffer.length) {
    console.error(`❌ Length mismatch: header says ${length}, actual ${buffer.length}`);
    process.exit(1);
  }
  console.log(`✅ Length matches: ${length} bytes`);
  
  // Read first chunk (JSON)
  let offset = 12;
  const chunkLength = buffer.readUInt32LE(offset);
  const chunkType = buffer.readUInt32LE(offset + 4);
  
  // 0x4E4F534A = "JSON"
  const expectedChunkType = 0x4E4F534A;
  if (chunkType !== expectedChunkType) {
    console.error(`❌ First chunk is not JSON: 0x${chunkType.toString(16)}`);
    process.exit(1);
  }
  console.log(`✅ First chunk is JSON (${chunkLength} bytes)`);
  
  // Parse JSON
  offset += 8;
  const jsonString = buffer.toString('utf8', offset, offset + chunkLength);
  const gltf = JSON.parse(jsonString);
  
  console.log(`\n📦 glTF structure:`);
  console.log(`   Asset version: ${gltf.asset?.version || 'unknown'}`);
  console.log(`   Scenes: ${gltf.scenes?.length || 0}`);
  console.log(`   Nodes: ${gltf.nodes?.length || 0}`);
  console.log(`   Meshes: ${gltf.meshes?.length || 0}`);
  console.log(`   Materials: ${gltf.materials?.length || 0}`);
  console.log(`   Buffers: ${gltf.buffers?.length || 0}`);
  
  // Check for nodes with undefined/missing names
  if (gltf.nodes) {
    let namedCount = 0;
    let unnamedCount = 0;
    const sampleNames = [];
    
    gltf.nodes.forEach((node, i) => {
      if (node.name !== undefined && node.name !== null && node.name !== '') {
        namedCount++;
        if (sampleNames.length < 10) {
          sampleNames.push(node.name);
        }
      } else {
        unnamedCount++;
      }
    });
    
    console.log(`\n📝 Node names:`);
    console.log(`   Named nodes: ${namedCount}`);
    console.log(`   Unnamed nodes: ${unnamedCount}`);
    
    if (sampleNames.length > 0) {
      console.log(`\n   Sample names (first 10):`);
      sampleNames.forEach(name => console.log(`   - "${name}"`));
    }
  }
  
  // Check for mesh names
  if (gltf.meshes) {
    const meshNames = [];
    gltf.meshes.forEach((mesh, i) => {
      if (mesh.name && meshNames.length < 10) {
        meshNames.push(mesh.name);
      }
    });
    
    if (meshNames.length > 0) {
      console.log(`\n📝 Sample mesh names (first 10):`);
      meshNames.forEach(name => console.log(`   - "${name}"`));
    }
  }
  
  // Check for extensions
  if (gltf.extensionsUsed && gltf.extensionsUsed.length > 0) {
    console.log(`\n🔌 Extensions used:`);
    gltf.extensionsUsed.forEach(ext => console.log(`   - ${ext}`));
  }
  
  console.log('\n✅ GLB structure validation passed!');
  console.log('   (Note: Mesh geometry data not validated - requires Draco decoder)');
  
} catch (err) {
  console.error('\n❌ Validation FAILED:\n');
  console.error(err);
  process.exit(1);
}
