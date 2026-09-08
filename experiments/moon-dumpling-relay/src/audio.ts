export type RelayCue = 'eat' | 'dash' | 'chili' | 'tea' | 'bell';

let ctx: AudioContext | null = null;
let muted = true;
let bed: { gain: GainNode; osc: OscillatorNode[] } | null = null;

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

function ctor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  return window.AudioContext ?? (window as AudioWindow).webkitAudioContext ?? null;
}

function ensure(): AudioContext | null {
  if (ctx) return ctx;
  const AudioCtor = ctor();
  if (!AudioCtor) return null;
  ctx = new AudioCtor();
  return ctx;
}

export function isMuted(): boolean {
  return muted;
}

function stopBed(): void {
  if (!bed || !ctx) return;
  const now = ctx.currentTime;
  bed.gain.gain.cancelScheduledValues(now);
  bed.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  for (const osc of bed.osc) {
    try {
      osc.stop(now + 0.14);
    } catch {
      // already stopped
    }
  }
  bed = null;
}

function startBed(audio: AudioContext): void {
  if (bed) return;
  const gain = audio.createGain();
  gain.gain.value = 0.0001;
  gain.connect(audio.destination);
  const freqs = [196, 247, 294];
  const osc = freqs.map((freq, index) => {
    const node = audio.createOscillator();
    const voice = audio.createGain();
    node.type = index === 0 ? 'sine' : 'triangle';
    node.frequency.value = freq;
    voice.gain.value = index === 0 ? 0.22 : 0.08;
    node.connect(voice);
    voice.connect(gain);
    node.start();
    return node;
  });
  gain.gain.exponentialRampToValueAtTime(0.035, audio.currentTime + 0.4);
  bed = { gain, osc };
}

export async function setMuted(next: boolean): Promise<void> {
  muted = next;
  const audio = ensure();
  if (!audio) return;
  if (next) {
    stopBed();
    await audio.suspend().catch(() => undefined);
    return;
  }
  await audio.resume().catch(() => undefined);
  startBed(audio);
}

export function playCue(kind: RelayCue): void {
  if (muted) return;
  const audio = ensure();
  if (!audio || audio.state !== 'running') return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  gain.gain.setValueAtTime(0.0001, now);

  if (kind === 'eat') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.start(now);
    osc.stop(now + 0.18);
    return;
  }

  if (kind === 'dash') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
    filter.type = 'highpass';
    filter.frequency.value = 180;
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.start(now);
    osc.stop(now + 0.16);
    return;
  }

  if (kind === 'chili') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.22);
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.start(now);
    osc.stop(now + 0.3);
    return;
  }

  if (kind === 'tea') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, now);
    osc.frequency.exponentialRampToValueAtTime(784, now + 0.18);
    filter.type = 'bandpass';
    filter.frequency.value = 900;
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
    osc.start(now);
    osc.stop(now + 0.28);
    return;
  }

  osc.type = 'sine';
  osc.frequency.setValueAtTime(392, now);
  osc.frequency.exponentialRampToValueAtTime(262, now + 0.35);
  filter.type = 'lowpass';
  filter.frequency.value = 1200;
  gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  osc.start(now);
  osc.stop(now + 0.42);
}
