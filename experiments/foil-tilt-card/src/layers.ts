import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three';
import { CARD } from './card';

const W = 1024;
const H = 1434;

export interface CardAtlas {
  background: CanvasTexture;
  subject: CanvasTexture;
  lineart: CanvasTexture;
  text: CanvasTexture;
  foilMask: CanvasTexture;
  verso: CanvasTexture;
  versoMask: CanvasTexture;
}

function makeCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  return canvas;
}

function ctx2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Foil Tilt Card could not open a 2D context');
  return ctx;
}

function textureFrom(canvas: HTMLCanvasElement, colour = true): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = colour ? SRGBColorSpace : texture.colorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function starfield(ctx: CanvasRenderingContext2D, count: number, alpha: number) {
  for (let i = 0; i < count; i += 1) {
    const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const y = (Math.sin(i * 78.233) * 24634.634) % 1;
    const px = (x < 0 ? x + 1 : x) * W;
    const py = (y < 0 ? y + 1 : y) * H;
    const r = 0.4 + ((i * 17) % 7) * 0.35;
    ctx.fillStyle = `rgba(230, 238, 248, ${alpha * (0.35 + (i % 5) * 0.13)})`;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintNight(ctx: CanvasRenderingContext2D) {
  const sky = ctx.createRadialGradient(W * 0.5, H * 0.42, 40, W * 0.5, H * 0.5, H * 0.72);
  sky.addColorStop(0, '#27466c');
  sky.addColorStop(0.42, '#14243d');
  sky.addColorStop(1, '#070a12');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const bloom = ctx.createRadialGradient(W * 0.62, H * 0.3, 10, W * 0.62, H * 0.3, 280);
  bloom.addColorStop(0, 'rgba(168, 214, 230, 0.28)');
  bloom.addColorStop(1, 'rgba(168, 214, 230, 0)');
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(190, 214, 236, 0.22)';
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.46, 140 + i * 78, 96 + i * 58, -0.18, 0, Math.PI * 2);
    ctx.stroke();
  }

  starfield(ctx, 140, 0.85);

  ctx.fillStyle = 'rgba(232, 213, 163, 0.88)';
  ctx.beginPath();
  ctx.arc(W * 0.72, H * 0.2, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(W * 0.755, H * 0.185, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}

function foxBody(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(W * 0.36, H * 0.78);
  ctx.bezierCurveTo(W * 0.22, H * 0.7, W * 0.2, H * 0.52, W * 0.32, H * 0.46);
  ctx.bezierCurveTo(W * 0.4, H * 0.42, W * 0.58, H * 0.46, W * 0.64, H * 0.56);
  ctx.bezierCurveTo(W * 0.72, H * 0.7, W * 0.58, H * 0.84, W * 0.42, H * 0.82);
  ctx.closePath();
}

function foxHead(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.ellipse(W * 0.4, H * 0.42, 92, 86, -0.28, 0, Math.PI * 2);
}

function foxMuzzle(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(W * 0.28, H * 0.44);
  ctx.quadraticCurveTo(W * 0.18, H * 0.5, W * 0.24, H * 0.56);
  ctx.quadraticCurveTo(W * 0.34, H * 0.54, W * 0.36, H * 0.48);
  ctx.closePath();
}

function ear(ctx: CanvasRenderingContext2D, x: number, y: number, lean: number, tall: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + 70);
  ctx.lineTo(x + lean * 22, y - tall);
  ctx.lineTo(x + lean * 70, y + 58);
  ctx.quadraticCurveTo(x + lean * 16, y + 82, x, y + 70);
  ctx.closePath();
}

function tailPlume(ctx: CanvasRenderingContext2D, ox: number, oy: number, lift: number) {
  ctx.beginPath();
  ctx.moveTo(W * 0.58, H * 0.66);
  ctx.bezierCurveTo(W * 0.74 + ox, H * 0.58 + oy, W * 0.88 + ox, H * 0.4 + lift, W * 0.84 + ox, H * 0.24 + lift);
  ctx.bezierCurveTo(W * 0.76 + ox, H * 0.36 + lift, W * 0.66, H * 0.54, W * 0.54, H * 0.68);
  ctx.closePath();
}

function paintFox(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.46, H * 0.52, 20, W * 0.48, H * 0.52, 360);
  glow.addColorStop(0, 'rgba(127, 212, 216, 0.28)');
  glow.addColorStop(1, 'rgba(127, 212, 216, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(127, 196, 214, 0.34)';
  tailPlume(ctx, 0, 0, 0);
  ctx.fill();
  ctx.fillStyle = 'rgba(232, 213, 163, 0.26)';
  tailPlume(ctx, 36, 18, 36);
  ctx.fill();
  ctx.fillStyle = 'rgba(180, 210, 230, 0.22)';
  tailPlume(ctx, -16, 30, 68);
  ctx.fill();

  ctx.fillStyle = '#2a241f';
  ear(ctx, W * 0.3, H * 0.26, -1, 128);
  ctx.fill();
  ear(ctx, W * 0.44, H * 0.24, 1, 118);
  ctx.fill();
  ctx.fillStyle = '#7fd4d8';
  ctx.globalAlpha = 0.62;
  ear(ctx, W * 0.318, H * 0.29, -0.78, 88);
  ctx.fill();
  ear(ctx, W * 0.45, H * 0.275, 0.78, 80);
  ctx.fill();
  ctx.globalAlpha = 1;

  const fur = ctx.createLinearGradient(W * 0.26, H * 0.4, W * 0.68, H * 0.82);
  fur.addColorStop(0, '#4a3d34');
  fur.addColorStop(0.45, '#221c1a');
  fur.addColorStop(1, '#0e1016');
  ctx.fillStyle = fur;
  foxBody(ctx);
  ctx.fill();

  ctx.fillStyle = '#d9c7af';
  foxHead(ctx);
  ctx.fill();
  ctx.fillStyle = '#cbb6a0';
  foxMuzzle(ctx);
  ctx.fill();

  ctx.fillStyle = '#e8d5a3';
  ctx.beginPath();
  ctx.ellipse(W * 0.44, H * 0.62, 48, 58, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f4e7b8';
  ctx.lineWidth = 11;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(W * 0.44, H * 0.63, 40, 0.45, 2.55);
  ctx.stroke();

  ctx.fillStyle = '#f7f2ea';
  ctx.beginPath();
  ctx.ellipse(W * 0.36, H * 0.405, 18, 12, -0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7fd4d8';
  ctx.beginPath();
  ctx.ellipse(W * 0.365, H * 0.405, 7, 11, -0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1a1e24';
  ctx.beginPath();
  ctx.moveTo(W * 0.22, H * 0.5);
  ctx.quadraticCurveTo(W * 0.176, H * 0.53, W * 0.23, H * 0.552);
  ctx.quadraticCurveTo(W * 0.27, H * 0.53, W * 0.22, H * 0.5);
  ctx.fill();

  ctx.fillStyle = '#3a322c';
  ctx.beginPath();
  ctx.ellipse(W * 0.34, H * 0.76, 28, 16, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(W * 0.5, H * 0.78, 26, 14, -0.1, 0, Math.PI * 2);
  ctx.fill();
}

function paintLineart(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(228, 236, 244, 0.78)';
  ctx.lineWidth = 2.2;
  ctx.lineJoin = 'round';
  foxBody(ctx);
  ctx.stroke();
  foxHead(ctx);
  ctx.stroke();
  foxMuzzle(ctx);
  ctx.stroke();
  ear(ctx, W * 0.3, H * 0.26, -1, 128);
  ctx.stroke();
  ear(ctx, W * 0.44, H * 0.24, 1, 118);
  ctx.stroke();
  tailPlume(ctx, 0, 0, 0);
  ctx.stroke();
  tailPlume(ctx, 30, 24, 40);
  ctx.stroke();
  tailPlume(ctx, -18, 36, 70);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(159, 212, 216, 0.55)';
  ctx.lineWidth = 1.4;
  const nodes = [
    [180, 220],
    [260, 310],
    [200, 420],
    [820, 260],
    [880, 380],
    [760, 470],
    [170, 1100],
    [300, 1220],
    [860, 1160],
  ] as const;
  ctx.beginPath();
  nodes.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = 'rgba(232, 213, 163, 0.85)';
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 3.4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = 'rgba(232, 213, 163, 0.28)';
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.strokeRect(62, 62, W - 124, H - 124);
}

function paintText(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(236, 242, 248, 0.94)';
  ctx.font = '600 42px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(CARD.nameZh, W / 2, 168);

  ctx.font = '640 54px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.fillText(CARD.name.toUpperCase(), W / 2, H - 168);

  ctx.font = '500 26px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(232, 213, 163, 0.9)';
  ctx.fillText(CARD.number, 92, H - 108);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(200, 214, 226, 0.72)';
  ctx.fillText(CARD.serial, W - 92, H - 108);

  ctx.textAlign = 'center';
  ctx.font = '500 18px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(159, 212, 216, 0.7)';
  ctx.fillText(CARD.grade, W / 2, 214);

  ctx.strokeStyle = 'rgba(232, 213, 163, 0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(W - 128, 148, 36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W - 118, 140, 22, 0.4, 2.6);
  ctx.stroke();
}

function paintMask(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#141820';
  ctx.fillRect(0, 0, W, H);
  const rim = ctx.createRadialGradient(W * 0.5, H * 0.48, 80, W * 0.5, H * 0.5, H * 0.62);
  rim.addColorStop(0, '#3a4658');
  rim.addColorStop(0.55, '#8aa0b4');
  rim.addColorStop(1, '#f4f0e4');
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#f6f1dc';
  ctx.beginPath();
  ctx.arc(W * 0.44, H * 0.63, 50, 0, Math.PI * 2);
  ctx.fill();
  tailPlume(ctx, 0, 0, 0);
  ctx.fill();
  ear(ctx, W * 0.3, H * 0.26, -1, 128);
  ctx.fill();
  ear(ctx, W * 0.44, H * 0.24, 1, 118);
  ctx.fill();
  foxHead(ctx);
  ctx.fill();

  starfield(ctx, 80, 1);
}

function paintVerso(ctx: CanvasRenderingContext2D) {
  const field = ctx.createLinearGradient(0, 0, W, H);
  field.addColorStop(0, '#101820');
  field.addColorStop(1, '#07090e');
  ctx.fillStyle = field;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(180, 206, 220, 0.14)';
  ctx.lineWidth = 1;
  const cell = 46;
  const originX = W * 0.5 - cell * 3.5;
  const originY = H * 0.5 - cell * 3.5;
  const pattern = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [0, 1, 1, 0, 1, 1, 0],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
  ];
  pattern.forEach((row, y) => {
    row.forEach((bit, x) => {
      const px = originX + x * cell;
      const py = originY + y * cell;
      ctx.strokeRect(px, py, cell - 6, cell - 6);
      if (bit) {
        ctx.fillStyle = 'rgba(159, 212, 216, 0.16)';
        ctx.fillRect(px + 6, py + 6, cell - 18, cell - 18);
      }
    });
  });

  ctx.strokeStyle = 'rgba(232, 213, 163, 0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W * 0.5, H * 0.38);
  for (let i = 0; i < 6; i += 1) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    ctx.lineTo(W * 0.5 + Math.cos(a) * 92, H * 0.46 + Math.sin(a) * 92);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W * 0.52, H * 0.45, 28, 0.45, 2.55);
  ctx.stroke();

  ctx.fillStyle = 'rgba(236, 242, 248, 0.92)';
  ctx.textAlign = 'center';
  ctx.font = '600 36px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.fillText(CARD.name, W / 2, H * 0.72);
  ctx.font = '500 22px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(232, 213, 163, 0.86)';
  ctx.fillText(CARD.number, W / 2, H * 0.76);
  ctx.font = '500 20px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(180, 198, 212, 0.7)';
  ctx.fillText(CARD.motto, W / 2, H * 0.8);
  ctx.fillText(CARD.serial, W / 2, H * 0.84);
}

function paintVersoMask(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#2a3340';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#f0ead8';
  ctx.beginPath();
  ctx.arc(W * 0.5, H * 0.46, 120, 0, Math.PI * 2);
  ctx.fill();
  starfield(ctx, 40, 1);
}

export function buildCardAtlas(): CardAtlas {
  const night = makeCanvas();
  paintNight(ctx2d(night));

  const subject = makeCanvas();
  paintFox(ctx2d(subject));

  const lineart = makeCanvas();
  paintLineart(ctx2d(lineart));

  const text = makeCanvas();
  paintText(ctx2d(text));

  const mask = makeCanvas();
  paintMask(ctx2d(mask));

  const verso = makeCanvas();
  paintVerso(ctx2d(verso));

  const versoMask = makeCanvas();
  paintVersoMask(ctx2d(versoMask));

  return {
    background: textureFrom(night),
    subject: textureFrom(subject),
    lineart: textureFrom(lineart),
    text: textureFrom(text),
    foilMask: textureFrom(mask, false),
    verso: textureFrom(verso),
    versoMask: textureFrom(versoMask, false),
  };
}

export function disposeAtlas(atlas: CardAtlas) {
  Object.values(atlas).forEach((texture) => texture.dispose());
}
