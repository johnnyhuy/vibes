import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import ProductScene from './components/ProductScene';

function Reveal({
  children,
  className,
  side = 'center',
}: {
  children: ReactNode;
  className?: string;
  side?: 'left' | 'right' | 'center';
}) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setOn(entry.isIntersecting),
      { threshold: 0.38, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`block side-${side} ${className ?? ''} ${on ? 'in' : ''}`}>
      {children}
    </section>
  );
}

export default function App() {
  return (
    <>
      <Canvas
        camera={{ position: [0.55, 0.12, 6.4], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }}
      >
        <ProductScene />
      </Canvas>

      <div className="page">
        <Reveal className="hero" side="center">
          <p className="eyebrow">Aether · No. 04</p>
          <h1>Aether</h1>
          <p className="subtitle">A glass bottle, told by the scroll</p>
          <p className="lede">
            I wanted the viral product-hero pattern without borrowing anyone's mesh.
            Scroll and the carafe turns — refractive glass, amber liquid, studio lights.
          </p>
          <div className="scroll-hint">Scroll to rotate</div>
        </Reveal>

        <Reveal className="feature" side="left">
          <div className="card">
            <p className="kicker">01 — Silhouette</p>
            <h2>Lathed, not imported</h2>
            <p>
              The body is a LatheGeometry profile I drew as 2D points — punt, shoulder,
              neck, lip. No GLB. The brass collar and stopper are the only opaque parts,
              so the glass can stay honest about transmission.
            </p>
          </div>
        </Reveal>

        <Reveal className="feature" side="right">
          <div className="card">
            <p className="kicker">02 — Liquid</p>
            <h2>Two indices of refraction</h2>
            <p>
              Outer shell: IOR 1.5, transmission 1, a short attenuation path so edges
              go teal. Inner volume: IOR 1.4, amber attenuation, a disk for the meniscus.
              Light bends twice. That is the whole trick.
            </p>
          </div>
        </Reveal>

        <Reveal className="feature" side="left">
          <div className="card">
            <p className="kicker">03 — Camera</p>
            <h2>Scroll is the dolly</h2>
            <p>
              Progress maps to yaw, a little pitch, and a damped camera arc.
              I dropped drei ScrollControls — the overlay stole the wheel from the
              marketing page. Native window scroll, lerp in useFrame. Bidirectional.
            </p>
          </div>
        </Reveal>

        <Reveal className="feature" side="right">
          <div className="card">
            <p className="kicker">04 — Why this</p>
            <h2>Clean-room product hero</h2>
            <p>
              Inspired by himanshubuildss' glass-bottle scrollytelling, not a copy of
              the asset. Same pattern Apple and Stripe use: fixed canvas, tall page,
              interlocking copy. Mine is Aether — a fictional refill, first person,
              educational.
            </p>
          </div>
        </Reveal>

        <footer>
          <p>
            Clean-room scroll hero · Inspired by{' '}
            <a href="https://x.com/himanshubuildss/status/2096243989439713677" target="_blank" rel="noopener noreferrer">
              himanshubuildss
            </a>
            {' '}· React Three Fiber · Johnny Huynh
          </p>
        </footer>
      </div>
    </>
  );
}
