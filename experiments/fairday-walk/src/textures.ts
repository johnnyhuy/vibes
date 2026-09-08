import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function paintNoise(
  ctx: CanvasRenderingContext2D,
  size: number,
  a: [number, number, number],
  b: [number, number, number],
  grain: number
) {
  const image = ctx.createImageData(size, size);
  const data = image.data;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const n =
        hash(x * 0.17 + y * 0.31) * 0.55 +
        hash(x * 0.07 + y * 0.11) * 0.3 +
        hash((x + y) * 0.41) * 0.15;
      const t = Math.min(1, Math.max(0, n));
      const i = (y * size + x) * 4;
      data[i] = a[0] + (b[0] - a[0]) * t;
      data[i + 1] = a[1] + (b[1] - a[1]) * t;
      data[i + 2] = a[2] + (b[2] - a[2]) * t;
      data[i + 3] = 255;
      if (grain > 0 && hash(x * 3.1 + y * 7.7) > 1 - grain) {
        const d = (hash(x + y * 19) - 0.5) * 18;
        data[i] = Math.min(255, Math.max(0, data[i] + d));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + d));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + d));
      }
    }
  }
  ctx.putImageData(image, 0, 0);
}

function canvasTexture(draw: (ctx: CanvasRenderingContext2D, size: number) => void, repeat = 4) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Fairday Walk could not allocate a canvas texture');
  draw(ctx, size);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function plasterMap() {
  return canvasTexture((ctx, size) => {
    paintNoise(ctx, size, [232, 214, 190], [210, 184, 158], 0.08);
  }, 3);
}

export function cobbleMap() {
  return canvasTexture((ctx, size) => {
    paintNoise(ctx, size, [186, 170, 150], [168, 150, 130], 0.04);
    ctx.strokeStyle = 'rgba(90, 78, 64, 0.22)';
    ctx.lineWidth = 2;
    const step = 28;
    for (let y = 0; y < size + step; y += step) {
      ctx.beginPath();
      for (let x = 0; x <= size; x += step) {
        const stagger = (Math.floor(y / step) % 2) * (step / 2);
        ctx.rect(x + stagger + hash(x + y) * 3, y + hash(y) * 2, step - 4, step - 5);
      }
      ctx.stroke();
    }
  }, 6);
}

export function tileMap() {
  return canvasTexture((ctx, size) => {
    paintNoise(ctx, size, [196, 88, 54], [154, 58, 36], 0.06);
    ctx.fillStyle = 'rgba(90, 32, 20, 0.18)';
    for (let y = 0; y < size; y += 16) {
      ctx.fillRect(0, y, size, 2);
    }
  }, 5);
}

export function woodMap() {
  return canvasTexture((ctx, size) => {
    paintNoise(ctx, size, [118, 78, 52], [86, 56, 36], 0.02);
    ctx.strokeStyle = 'rgba(50, 30, 18, 0.18)';
    for (let x = 0; x < size; x += 9) {
      ctx.beginPath();
      ctx.moveTo(x + hash(x) * 2, 0);
      ctx.lineTo(x + hash(x + 2) * 2, size);
      ctx.stroke();
    }
  }, 2);
}
