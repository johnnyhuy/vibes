import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SLOTS } from './hifi-slots.mjs';

const root = resolve(process.argv.includes('--root')
  ? process.argv[process.argv.indexOf('--root') + 1]
  : join(fileURLToPath(new URL('.', import.meta.url)), '..'));

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function sourceText() {
  return walk(join(root, 'src'))
    .filter((file) => /\.(ts|tsx|js|jsx)$/.test(file) && basename(file) !== 'assets.ts')
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');
}

function glbOk(path) {
  if (!existsSync(path)) return false;
  const head = readFileSync(path).subarray(0, 4).toString('ascii');
  return head === 'glTF';
}

const src = sourceText();
const report = SLOTS.map((slot) => {
  const files = slot.files.map((rel) => {
    const path = join(root, rel);
    const present = existsSync(path);
    const valid = extname(rel) === '.glb' ? glbOk(path) : present && statSync(path).size > 32;
    return { rel, present, valid };
  });
  const wired = slot.needles.some((needle) => src.includes(needle));
  const onDisk = files.every((file) => file.valid);
  return { id: slot.id, onDisk, wired, dressed: onDisk && wired, files };
});

const dressed = report.filter((slot) => slot.dressed).length;
const out = {
  root,
  dressed_slots: dressed,
  total_slots: SLOTS.length,
  slots: Object.fromEntries(report.map((slot) => [slot.id, slot])),
};

process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
