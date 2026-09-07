#!/usr/bin/env node
/**
 * Minimal GLB validation smoke test
 * Loads model3.glb and checks basic structure
 */

import fs from 'fs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';

console.log('🔍 Validating model3.glb...\n');

const glbPath = 'public/models/model3.glb';

// Check file exists and size
try {
  const stats = fs.statSync(glbPath);
  console.log(`✅ File exists: ${glbPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
} catch (err) {
  console.error(`❌ File not found: ${glbPath}`);
  process.exit(1);
}

// Read GLB binary
const buffer = fs.readFileSync(glbPath);
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

console.log(`   ArrayBuffer size: ${(arrayBuffer.byteLength / 1024).toFixed(2)} KB\n`);

// Setup DRACOLoader for compressed meshes
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

// Attempt to parse with GLTFLoader
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.parse(
  arrayBuffer,
  '',
  (gltf) => {
    console.log('✅ GLTFLoader.parse succeeded\n');
    
    const scene = gltf.scene;
    console.log('📦 Scene structure:');
    console.log(`   Root name: "${scene.name}"`);
    console.log(`   Children: ${scene.children.length}`);
    
    // Count nodes and meshes
    let nodeCount = 0;
    let meshCount = 0;
    const meshNames = [];
    
    scene.traverse((node) => {
      nodeCount++;
      if (node.isMesh) {
        meshCount++;
        if (meshNames.length < 10) {
          meshNames.push(node.name || '<unnamed>');
        }
      }
    });
    
    console.log(`   Total nodes: ${nodeCount}`);
    console.log(`   Total meshes: ${meshCount}`);
    console.log(`\n📝 Sample mesh names (first 10):`);
    meshNames.forEach(name => console.log(`   - ${name}`));
    
    // Check for undefined names
    let undefinedNameCount = 0;
    scene.traverse((node) => {
      if (typeof node.name === 'undefined') {
        undefinedNameCount++;
      }
    });
    
    if (undefinedNameCount > 0) {
      console.log(`\n⚠️  Warning: ${undefinedNameCount} nodes have undefined names`);
    } else {
      console.log(`\n✅ All nodes have defined names`);
    }
    
    console.log('\n✅ GLB validation passed!');
    process.exit(0);
  },
  (error) => {
    console.error('\n❌ GLTFLoader.parse FAILED:\n');
    console.error(error);
    console.error('\n💀 GLB file is CORRUPT or INVALID');
    process.exit(1);
  }
);
