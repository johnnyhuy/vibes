export type StudioCue = 'click' | 'whoosh';

let ctx: AudioContext | null = null;
let muted = true;

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

export async function setMuted(next: boolean): Promise<void> {
  muted = next;
  const audio = ensure();
  if (!audio) return;
  if (next) {
    await audio.suspend().catch(() => undefined);
    return;
  }
  await audio.resume().catch(() => undefined);
}

export function playCue(kind: StudioCue): void {
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

  if (kind === 'click') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1840, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.045);
    filter.type = 'highpass';
    filter.frequency.value = 380;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.start(now);
    osc.stop(now + 0.08);
    return;
  }

  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);
  filter.type = 'lowpass';
  filter.frequency.value = 640;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
  osc.start(now);
  osc.stop(now + 0.28);
}
