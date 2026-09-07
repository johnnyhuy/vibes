const DETAILS: Record<
  string,
  { title: string; overview: string; specs: [string, string][] }
> = {
  body: {
    title: 'Body & structure',
    overview: 'Aluminium-intensive unibody. Educational stand-in — not a Tesla diagram.',
    specs: [
      ['Architecture', 'Unibody'],
      ['Skin', 'Painted aluminium'],
    ],
  },
  glass: {
    title: 'Panoramic glass',
    overview: 'Fixed roof glass and cabin glazing as a single system in this explode map.',
    specs: [
      ['Roof', 'Fixed glass'],
      ['Tint', 'Acoustic laminate'],
    ],
  },
  doors: {
    title: 'Doors & closures',
    overview: 'Four side doors plus closures grouped so the gallery stays readable.',
    specs: [
      ['Count', '4 doors'],
      ['Closures', 'Frunk / trunk'],
    ],
  },
  interior: {
    title: 'Passenger cabin',
    overview: 'Seats, dash, and trim collapsed into one cabin group for the 2D pack.',
    specs: [
      ['Rows', '2'],
      ['Layout', '5-seat'],
    ],
  },
  battery: {
    title: 'Battery pack',
    overview: 'Floor-mounted high-voltage pack. Chemistry and capacity are public-range figures, not a teardown.',
    specs: [
      ['Chemistry', 'Lithium-ion'],
      ['Pack', 'Floor skate'],
    ],
  },
  motors: {
    title: 'Dual motors',
    overview: 'Front and rear drive units treated as one system so isolate mode can hide the rest.',
    specs: [
      ['Layout', 'Dual motor'],
      ['Drive', 'AWD'],
    ],
  },
  thermal: {
    title: 'Thermal system',
    overview: 'Heat pump, lines, and exchangers grouped as one thermal tree.',
    specs: [
      ['Loop', 'Heat pump'],
      ['Role', 'Cabin + pack'],
    ],
  },
  suspension: {
    title: 'Suspension',
    overview: 'Control arms and springs packed as a single corner-set for the explode grid.',
    specs: [
      ['Front', 'Double wishbone'],
      ['Rear', 'Multi-link'],
    ],
  },
  wheels: {
    title: 'Wheels & brakes',
    overview: 'Four corners: rim, tyre, caliper. Isolate to read them without the body.',
    specs: [
      ['Corners', '4'],
      ['Brakes', 'Disc'],
    ],
  },
  charging: {
    title: 'Charging & HV',
    overview: 'Charge port and high-voltage distribution as one educational group.',
    specs: [
      ['Port', 'CCS-style'],
      ['Bus', 'High-voltage'],
    ],
  },
  electronics: {
    title: 'Computers & 12V',
    overview: 'Domain controllers and the 12-volt side, not a wiring diagram.',
    specs: [
      ['Low voltage', '12 V'],
      ['Compute', 'Domain ECUs'],
    ],
  },
  lights: {
    title: 'Exterior lighting',
    overview: 'Lamps and signatures grouped so the explode view does not scatter every LED.',
    specs: [
      ['Front', 'LED'],
      ['Rear', 'LED'],
    ],
  },
};

interface Props {
  selectedPart: string | null;
  isolated: boolean;
  onToggleIsolate: () => void;
}

export default function DetailCard({ selectedPart, isolated, onToggleIsolate }: Props) {
  if (!selectedPart) return null;
  const detail = DETAILS[selectedPart];
  if (!detail) return null;

  return (
    <aside className="detail-card glass-panel">
      <p className="panel-kicker">Overview</p>
      <h2>{detail.title}</h2>
      <p className="detail-copy">{detail.overview}</p>
      <dl>
        {detail.specs.map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <button type="button" className="isolate-btn" onClick={onToggleIsolate}>
        {isolated ? 'Show everything' : 'Isolate component'}
      </button>
    </aside>
  );
}
