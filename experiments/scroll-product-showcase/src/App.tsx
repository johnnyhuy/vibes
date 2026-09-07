import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import ProductScene from './components/ProductScene';

function Reveal({
  children,
  className,
  side = 'center',
  id,
}: {
  children: ReactNode;
  className?: string;
  side?: 'left' | 'right' | 'center';
  id?: string;
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
    <section id={id} ref={ref} className={`block side-${side} ${className ?? ''} ${on ? 'in' : ''}`}>
      {children}
    </section>
  );
}

export default function App() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0.28, 7.1], fov: 28 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.12 }}
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }}
      >
        <ProductScene />
      </Canvas>

      <div className="frame" aria-hidden="true" />

      <div className="page">
        <header className="topbar">
          <span>Aether</span>
          <nav>
            <a href="#silhouette">The drink</a>
            <a href="#transmission">The glass</a>
            <a href="#roll">The roll</a>
            <a href="#clean-room">The notes</a>
          </nav>
          <span>Batch 04</span>
        </header>

        <div className="batch-badge" aria-hidden>
          <strong>04</strong>
          <span>3,000</span>
        </div>

        <Reveal className="hero" side="center">
          <p className="lede">
            I rebuilt the viral glass-bottle scrollytelling pattern without
            borrowing a mesh. Dark green glass, liquid volume, type sitting
            <em> behind</em> the bottle so transmission has something to bend.
          </p>
          <div className="scroll-hint">Scroll — it rolls</div>
          <div className="hero-ctas">
            <a className="pill solid" href="#clean-room">Read the batch notes</a>
            <a className="pill ghost" href="#roll">How it rolls</a>
          </div>
        </Reveal>

        <Reveal id="silhouette" className="feature" side="left">
          <div className="card">
            <p className="kicker">01 — Silhouette</p>
            <h2>On its side</h2>
            <p>
              The himanshubuildss thumb is a wide apothecary cylinder, short neck,
              black cap, lying down. I lathed that profile. A standing perfume
              carafe with a brass stopper was the wrong read.
            </p>
          </div>
        </Reveal>

        <Reveal id="transmission" className="feature" side="right">
          <div className="card">
            <p className="kicker">02 — Transmission</p>
            <h2>Type through glass</h2>
            <p>
              Outer shell: IOR 1.48, transmission 1, short green attenuation.
              Inner volume: darker, IOR 1.39. The lime “AETHER” is a drei Text
              in the scene, not a DOM headline — otherwise the bottle has
              nothing to refract.
            </p>
          </div>
        </Reveal>

        <Reveal id="roll" className="feature" side="left">
          <div className="card">
            <p className="kicker">03 — Roll</p>
            <h2>Scroll is the long axis</h2>
            <p>
              “Scroll — it rolls.” Progress maps to rotation around the
              bottle’s length, damped in useFrame. Strip Lightformers give the
              long speculars. Bidirectional. Native window scroll.
            </p>
          </div>
        </Reveal>

        <Reveal id="clean-room" className="feature" side="right">
          <div className="card">
            <p className="kicker">04 — Clean-room</p>
            <h2>Pattern, not the brand</h2>
            <p>
              I studied the Caldera-class hero (chartreuse, black, horizontal
              glass). I did not copy TEPHRA, the rocks, or the mesh. Aether is
              a fictional batch. Educational only.
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
