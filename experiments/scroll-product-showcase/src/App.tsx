import { useLayoutEffect as useExhibitLayout } from 'react';
import { useThree as useExhibitThree } from '@react-three/fiber';
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
        <ExhibitFraming />
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
          <p className="lede">Glass, light, and a slow roll. Scroll to turn the bottle and see the lettering bend through it.</p>
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
              A broad glass body, a short neck, and a dark cap. Turn the bottle
              to see the profile change from a clean silhouette to a ribbon of light.
            </p>
          </div>
        </Reveal>

        <Reveal id="transmission" className="feature" side="right">
          <div className="card">
            <p className="kicker">02 — Transmission</p>
            <h2>Type through glass</h2>
            <p>
              Light slows and bends as it enters the glass. The green liquid
              absorbs some of it; the lettering behind the bottle reveals the distortion.
            </p>
          </div>
        </Reveal>

        <Reveal id="roll" className="feature" side="left">
          <div className="card">
            <p className="kicker">03 — Roll</p>
            <h2>Scroll is the long axis</h2>
            <p>
              Your scroll turns the bottle around its length. Move back up
              to reverse the roll and watch the studio reflections travel across the surface.
            </p>
          </div>
        </Reveal>

        <Reveal id="clean-room" className="feature" side="right">
          <div className="card">
            <p className="kicker">04 — About the study</p>
            <h2>A study in glass</h2>
            <p>
              Aether is a fictional product, made to explore glass, refraction,
              and motion on the web. The bottle is built from a revolved profile.
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

// Preserve the subject's horizontal field of view on portrait screens.
function ExhibitFraming() {
  const { camera, size } = useExhibitThree();
  useExhibitLayout(() => {
    camera.zoom = .85 * Math.min(1, size.width / size.height / 1.25);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}
