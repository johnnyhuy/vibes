import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import ProductScene from './components/ProductScene';

export default function App() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
      >
        <ScrollControls pages={3} damping={0.1}>
          <ProductScene />
        </ScrollControls>
      </Canvas>

      <div className="content">
        <section className="hero">
          <h1>Aether</h1>
          <p className="subtitle">The perfume atomiser reimagined</p>
          <div className="scroll-hint">Scroll to explore</div>
        </section>

        <section className="feature">
          <div className="feature-content">
            <h2>Precision Engineering</h2>
            <p>
              I designed Aether to merge form and function. The glass capsule sits within 
              a machined aluminium shell, creating visual tension between transparency and 
              opacity. Every angle reveals a new interplay of light and shadow.
            </p>
          </div>
        </section>

        <section className="feature">
          <div className="feature-content">
            <h2>Light & Refraction</h2>
            <p>
              Watch how the glass bends light as you scroll. This isn't just rendering — 
              it's physics-based simulation using real-world material properties. 
              The inner liquid reacts differently to light than the outer shell.
            </p>
          </div>
        </section>

        <section className="feature">
          <div className="feature-content">
            <h2>Sustainable Luxury</h2>
            <p>
              Made from recycled borosilicate glass and anodised aluminium. Refillable by 
              design. I believe luxury should be timeless, not disposable.
            </p>
          </div>
        </section>

        <footer>
          <p>
            A clean-room scroll-driven 3D pattern exploration • Inspired by{' '}
            <a href="https://x.com/himanshubuildss/status/2096243989439713677" target="_blank" rel="noopener noreferrer">
              himanshubuildss
            </a>
            {' '}• Built with React Three Fiber
          </p>
        </footer>
      </div>
    </>
  );
}
