import { useEffect, useState } from 'react';
import { CAPABILITIES, type CapabilityId } from '../capabilities';
import { inspectWebGlCanvas, type PixelQaResult } from '../pixelQa';

interface Props {
  selectedId: CapabilityId | null;
  canvas: HTMLCanvasElement | null;
  onClose: () => void;
}

function PixelQaPanel({ canvas }: { canvas: HTMLCanvasElement | null }) {
  const [result, setResult] = useState<PixelQaResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    setError(null);
    if (!canvas) {
      setError('Canvas is not ready yet.');
      return;
    }
    try {
      setResult(inspectWebGlCanvas(canvas));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Pixel read failed.';
      console.error('Pixel QA failed', caught);
      setError(message);
    }
  };

  useEffect(() => {
    const id = window.setTimeout(run, 180);
    return () => window.clearTimeout(id);
  }, [canvas]);

  return (
    <div className="demo-box">
      <div className="demo-box-head">
        <span>Live canvas read</span>
        <button type="button" className="text-btn" onClick={run}>
          Run again
        </button>
      </div>
      {error && <p className="demo-fail">{error}</p>}
      {result && (
        <>
          <p className={result.pass ? 'demo-pass' : 'demo-fail'}>
            {result.pass ? 'Pass' : 'Fail'} — {result.reason}
          </p>
          <dl className="demo-meta">
            <div>
              <dt>Mean luma</dt>
              <dd>{result.brightness.toFixed(1)}</dd>
            </div>
            <div>
              <dt>Empty</dt>
              <dd>{(result.emptyRatio * 100).toFixed(0)}%</dd>
            </div>
            <div>
              <dt>Buffer</dt>
              <dd>
                {result.width}×{result.height}
              </dd>
            </div>
          </dl>
          {result.dataUrl && (
            <img className="demo-thumb" src={result.dataUrl} alt="Downscaled screenshot of this WebGL canvas" />
          )}
        </>
      )}
      {!result && !error && <p className="demo-pending">Reading the WebGL canvas…</p>}
    </div>
  );
}

export default function Dock({ selectedId, canvas, onClose }: Props) {
  const node = CAPABILITIES.find((item) => item.id === selectedId);
  if (!node) return null;

  return (
    <aside className="dock" style={{ ['--accent' as string]: node.color }}>
      <button type="button" className="dock-close" onClick={onClose} aria-label="Close dock">
        ×
      </button>
      <p className="dock-kicker">{node.kicker}</p>
      <h2>{node.name}</h2>
      <p className="dock-copy">{node.copy}</p>
      {node.kind === 'pixel-qa' ? (
        <PixelQaPanel canvas={canvas} />
      ) : (
        <div className="demo-box stub">
          <p>{node.stubNote}</p>
        </div>
      )}
    </aside>
  );
}
