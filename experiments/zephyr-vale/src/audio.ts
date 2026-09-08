let ctx: AudioContext | null = null;
let muted = true;
let windGain: GainNode | null = null;
let bedStarted = false;

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

function makeNoise(audio: AudioContext): AudioBufferSourceNode {
  const length = audio.sampleRate * 2;
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = last * 0.86 + white * 0.14;
    data[i] = last;
  }
  const source = audio.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function startBed(audio: AudioContext): void {
  if (bedStarted) return;
  bedStarted = true;

  const master = audio.createGain();
  master.gain.value = 0.045;
  master.connect(audio.destination);
  windGain = master;

  const noise = makeNoise(audio);
  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 420;
  noise.connect(filter);
  filter.connect(master);
  noise.start();

  const hum = audio.createOscillator();
  const humGain = audio.createGain();
  hum.type = 'sine';
  hum.frequency.value = 98;
  humGain.gain.value = 0.22;
  hum.connect(humGain);
  humGain.connect(master);
  hum.start();

  const fifth = audio.createOscillator();
  const fifthGain = audio.createGain();
  fifth.type = 'sine';
  fifth.frequency.value = 147;
  fifthGain.gain.value = 0.12;
  fifth.connect(fifthGain);
  fifthGain.connect(master);
  fifth.start();
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
  startBed(audio);
  await audio.resume().catch(() => undefined);
}

export function playSlipCue(): void {
  if (muted) return;
  const audio = ensure();
  if (!audio || audio.state !== 'running') return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(620, now);
  osc.frequency.exponentialRampToValueAtTime(240, now + 0.18);
  filter.type = 'bandpass';
  filter.frequency.value = 480;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.24);
}

export function windLevel(): number {
  return windGain?.gain.value ?? 0;
}
