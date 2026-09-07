import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

function noise(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const a = noise(x0, y0);
  const b = noise(x0 + 1, y0);
  const c = noise(x0, y0 + 1);
  const d = noise(x0 + 1, y0 + 1);
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 4; i += 1) {
    value += smoothNoise(x * freq, y * freq) * amp;
    freq *= 2.05;
    amp *= 0.5;
  }
  return value;
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function paintWood(kind: 'amber' | 'walnut'): { albedo: HTMLCanvasElement; roughness: HTMLCanvasElement } {
  const size = 512;
  const albedo = document.createElement('canvas');
  const roughness = document.createElement('canvas');
  albedo.width = roughness.width = size;
  albedo.height = roughness.height = size;
  const color = albedo.getContext('2d');
  const rough = roughness.getContext('2d');
  if (!color || !rough) throw new Error('Could not paint the wood grain');

  const pixels = color.createImageData(size, size);
  const rPixels = rough.createImageData(size, size);

  const light = kind === 'amber' ? [168, 118, 72] : [86, 58, 40];
  const mid = kind === 'amber' ? [148, 100, 60] : [70, 48, 34];
  const dark = kind === 'amber' ? [126, 84, 50] : [52, 36, 26];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      const warp = fbm(u * 1.6, v * 0.35) * 0.22;
      const rings = Math.sin((u + warp) * 18 + fbm(u * 0.8, v * 0.25) * 2.4);
      const grain = fbm(u * 10, v * 0.7);
      const tone = 0.52 + rings * 0.08 + grain * 0.1;
      const t = Math.min(1, Math.max(0, tone));
      const shade =
        t < 0.5
          ? [mix(dark[0], mid[0], t * 2), mix(dark[1], mid[1], t * 2), mix(dark[2], mid[2], t * 2)]
          : [mix(mid[0], light[0], (t - 0.5) * 2), mix(mid[1], light[1], (t - 0.5) * 2), mix(mid[2], light[2], (t - 0.5) * 2)];
      const i = (y * size + x) * 4;
      pixels.data[i] = shade[0];
      pixels.data[i + 1] = shade[1];
      pixels.data[i + 2] = shade[2];
      pixels.data[i + 3] = 255;
      const r = Math.floor(mix(150, 200, t));
      rPixels.data[i] = r;
      rPixels.data[i + 1] = r;
      rPixels.data[i + 2] = r;
      rPixels.data[i + 3] = 255;
    }
  }

  color.putImageData(pixels, 0, 0);
  rough.putImageData(rPixels, 0, 0);
  return { albedo, roughness };
}

function canvasTexture(canvas: HTMLCanvasElement, colourSpace: boolean): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  if (colourSpace) texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 8;
  texture.repeat.set(1.4, 1);
  return texture;
}

export function createWoodMaps(kind: 'amber' | 'walnut' = 'amber') {
  const { albedo, roughness } = paintWood(kind);
  return {
    map: canvasTexture(albedo, true),
    roughnessMap: canvasTexture(roughness, false)
  };
}
