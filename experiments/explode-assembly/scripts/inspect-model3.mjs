#!/usr/bin/env node

/**
 * Inspect model3.glb to list all nodes/meshes and their hierarchy
 * This helps us understand what to keep vs. strip
 */

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const modelPath = join(__dirname, '../public/models/model3.glb');

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

console.log('📦 Loading model3.glb...\n');

const doc = await io.read(modelPath);
const root = doc.getRoot();
const scene = root.getDefaultScene();

console.log(`Scene: ${scene.getName() || '(unnamed)'}`);
console.log(`Total nodes: ${root.listNodes().length}`);
console.log(`Total meshes: ${root.listMeshes().length}\n`);

console.log('=== NODE HIERARCHY ===\n');

function printNode(node, depth = 0) {
  const indent = '  '.repeat(depth);
  const mesh = node.getMesh();
  const name = node.getName() || '(unnamed)';
  const meshInfo = mesh ? ` [MESH: ${mesh.getName() || 'unnamed'}, ${mesh.listPrimitives().length} primitives]` : '';
  
  console.log(`${indent}${name}${meshInfo}`);
  
  for (const child of node.listChildren()) {
    printNode(child, depth + 1);
  }
}

for (const node of scene.listChildren()) {
  printNode(node);
}

console.log('\n=== MESH NAMES ===\n');

const meshes = root.listMeshes();
meshes.forEach((mesh, i) => {
  const name = mesh.getName() || `(unnamed_${i})`;
  const primitiveCount = mesh.listPrimitives().length;
  const vertexCount = mesh.listPrimitives().reduce((sum, prim) => {
    const position = prim.getAttribute('POSITION');
    return sum + (position ? position.getCount() : 0);
  }, 0);
  
  console.log(`${i + 1}. ${name} — ${primitiveCount} primitive(s), ${vertexCount} vertices`);
});

console.log('\n=== ANALYSIS ===\n');

// Analyze node names to detect props vs car parts
const nodeNames = root.listNodes().map(n => n.getName() || '').filter(n => n.length > 0);
const propKeywords = ['light', 'speaker', 'stand', 'traffic', 'room', 'studio', 'floor', 'wall', 'prop', 'environment'];
const carKeywords = ['body', 'door', 'wheel', 'glass', 'hood', 'trunk', 'seat', 'panel', 'bumper', 'motor', 'battery'];

const probableProps = nodeNames.filter(name => 
  propKeywords.some(kw => name.toLowerCase().includes(kw))
);

const probableCar = nodeNames.filter(name =>
  carKeywords.some(kw => name.toLowerCase().includes(kw))
);

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

console.log('\n✅ Inspection complete. Review the hierarchy above.\n');
