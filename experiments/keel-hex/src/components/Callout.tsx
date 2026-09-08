import { Html, Line } from '@react-three/drei';
import type { Vec3 } from '../types';

interface Props {
  text: string;
  tip?: Vec3;
  end?: Vec3;
}

export default function Callout({ text, tip = [0, 0.02, 0], end = [0.18, 0.12, 0.1] }: Props) {
  return (
    <group>
      <Line points={[tip, end]} color="#2a2723" lineWidth={1} transparent opacity={0.45} />
      <Html position={end} center style={{ pointerEvents: 'none' }}>
        <span className="callout">{text}</span>
      </Html>
    </group>
  );
}
