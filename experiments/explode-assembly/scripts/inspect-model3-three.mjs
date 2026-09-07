#!/usr/bin/env node

/**
 * Inspect model3.glb using Three.js GLTFLoader
 * Lists all nodes/meshes to understand what to keep vs. strip
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const modelPath = join(__dirname, '../public/models/model3.glb');

console.log('📦 Loading model3.glb with Three.js...\n');

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const buffer = readFileSync(modelPath);

loader.parse(buffer.buffer, '', (gltf) => {
  const scene = gltf.scene;
  
  console.log(`Scene loaded: ${scene.children.length} root children\n`);
  console.log('=== NODE HIERARCHY ===\n');
  
  let meshCount = 0;
  let nodeCount = 0;
  const allNames = [];
  
  function printNode(node, depth = 0) {
    nodeCount++;
    const indent = '  '.repeat(depth);
    const name = node.name || '(unnamed)';
    const type = node.type;
    const meshInfo = node.type === 'Mesh' ? ' [MESH]' : '';
    const groupInfo = node.type === 'Group' ? ` [GROUP, ${node.children.length} children]` : '';
    
    if (name && name !== '(unnamed)') {
      allNames.push(name);
    }
    
    console.log(`${indent}${name} (${type})${meshInfo}${groupInfo}`);
    
    if (node.type === 'Mesh') {
      meshCount++;
      if (node.geometry) {
        const vertexCount = node.geometry.attributes.position?.count || 0;
        console.log(`${indent}  → ${vertexCount} vertices`);
      }
    }
    
    for (const child of node.children) {
      printNode(child, depth + 1);
    }
  }
  
  for (const child of scene.children) {
    printNode(child);
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total nodes: ${nodeCount}`);
  console.log(`Total meshes: ${meshCount}`);
  console.log(`Named nodes: ${allNames.length}\n`);
  
  console.log('=== NAMED NODES ===\n');
  allNames.forEach((name, i) => {
    console.log(`${i + 1}. ${name}`);
  });
  
  console.log('\n=== ANALYSIS ===\n');
  
  const propKeywords = [
    'light', 'speaker', 'stand', 'traffic', 'room', 'studio', 
    'floor', 'wall', 'prop', 'environment', 'scene', 'camera',
    'lamp', 'pole', 'base', 'pedestal'
  ];
  
  const carKeywords = [
    'body', 'door', 'wheel', 'glass', 'hood', 'trunk', 'seat', 
    'panel', 'bumper', 'motor', 'battery', 'tesla', 'model',
    'chassis', 'fender', 'mirror', 'tire', 'brake', 'suspension',
    'interior', 'exterior', 'roof', 'window', 'windshield'
  ];
  
  const probableProps = allNames.filter(name => {
    const lower = name.toLowerCase();
    return propKeywords.some(kw => lower.includes(kw));
  });
  
  const probableCar = allNames.filter(name => {
    const lower = name.toLowerCase();
    return carKeywords.some(kw => lower.includes(kw));
  });
  
  console.log('Probable PROPS to strip:');
  if (probableProps.length > 0) {
    probableProps.forEach(name => console.log(`  - ${name}`));
  } else {
    console.log('  (none detected by keywords)');
  }
  
  console.log('\nProbable CAR parts to keep:');
  if (probableCar.length > 0) {
    probableCar.forEach(name => console.log(`  - ${name}`));
  } else {
    console.log('  (none detected by keywords — may need manual inspection)');
  }
  
  console.log('\n✅ Inspection complete.\n');
  
  dracoLoader.dispose();
  process.exit(0);
}, (error) => {
  console.error('❌ Error loading model:', error);
  process.exit(1);
});
