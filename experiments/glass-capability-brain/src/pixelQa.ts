export interface PixelSample {
  pass: boolean;
  reason: string;
  brightness: number;
  emptyRatio: number;
  samples: number;
}

export interface PixelQaResult extends PixelSample {
  capturedAt: string;
  dataUrl: string | null;
  width: number;
  height: number;
}

const EMPTY_LUMA = 6;

/**
 * Brightness / emptiness heuristic on a raw RGBA buffer.
 * Pass = the frame is not blank and not clipped to pure white.
 * No model, no reference image, no eval.
 */
export function analysePixels(pixels: Uint8Array): PixelSample {
  const samples = pixels.length / 4;
  if (!Number.isInteger(samples) || samples === 0) {
    return {
      pass: false,
      reason: 'Capture was empty — no RGBA samples.',
      brightness: 0,
      emptyRatio: 1,
      samples: 0,
    };
  }

  let lumaSum = 0;
  let empty = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    lumaSum += luma;
    if (a < 8 && luma < EMPTY_LUMA) empty += 1;
  }

  const brightness = lumaSum / samples;
  const emptyRatio = empty / samples;

  if (emptyRatio > 0.92) {
    return {
      pass: false,
      reason: `Mostly empty (${(emptyRatio * 100).toFixed(0)}% transparent/black).`,
      brightness,
      emptyRatio,
      samples,
    };
  }
  if (brightness < 10) {
    return {
      pass: false,
      reason: `Too dark — mean luma ${brightness.toFixed(1)} / 255.`,
      brightness,
      emptyRatio,
      samples,
    };
  }
  if (brightness > 248) {
    return {
      pass: false,
      reason: `Clipped bright — mean luma ${brightness.toFixed(1)} / 255.`,
      brightness,
      emptyRatio,
      samples,
    };
  }

  return {
    pass: true,
    reason: `Frame is drawing. Mean luma ${brightness.toFixed(1)} / 255, ${(emptyRatio * 100).toFixed(0)}% empty.`,
    brightness,
    emptyRatio,
    samples,
  };
}

function readPixelsFromGl(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  width: number,
  height: number
): Uint8Array {
  const sampleW = Math.min(96, width);
  const sampleH = Math.min(54, height);
  const sx = Math.max(0, Math.floor((width - sampleW) / 2));
  const sy = Math.max(0, Math.floor((height - sampleH) / 2));
  const pixels = new Uint8Array(sampleW * sampleH * 4);
  gl.readPixels(sx, sy, sampleW, sampleH, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return pixels;
}

/**
 * Snapshot the live WebGL canvas. prefers toDataURL for the dock thumb
 * and readPixels for the heuristic so we are not decoding a PNG just to grade it.
 */
export function inspectWebGlCanvas(canvas: HTMLCanvasElement): PixelQaResult {
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  const width = canvas.width;
  const height = canvas.height;

  if (!gl) {
    return {
      pass: false,
      reason: 'No WebGL context on the canvas.',
      brightness: 0,
      emptyRatio: 1,
      samples: 0,
      capturedAt: new Date().toISOString(),
      dataUrl: null,
      width,
      height,
    };
  }

  let dataUrl: string | null = null;
  try {
    dataUrl = canvas.toDataURL('image/jpeg', 0.72);
    if (!dataUrl || dataUrl.length < 32) {
      dataUrl = null;
    }
  } catch (error) {
    console.warn('canvas.toDataURL failed', error);
    dataUrl = null;
  }

  const pixels = readPixelsFromGl(gl, width, height);
  const sample = analysePixels(pixels);

  if (sample.pass && !dataUrl) {
    return {
      ...sample,
      pass: false,
      reason: 'Pixels looked fine but toDataURL returned nothing (tainted canvas?).',
      capturedAt: new Date().toISOString(),
      dataUrl,
      width,
      height,
    };
  }

  return {
    ...sample,
    capturedAt: new Date().toISOString(),
    dataUrl,
    width,
    height,
  };
}
