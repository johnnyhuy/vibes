let ctx: AudioContext | null = null;
let muted = true;
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
    last = last * 0.9 + white * 0.1;
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
  master.gain.value = 0.038;
  master.connect(audio.destination);

  const noise = makeNoise(audio);
  const filter = audio.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 280;
  noise.connect(filter);
  filter.connect(master);
  noise.start();

  const reed = audio.createOscillator();
  const reedGain = audio.createGain();
  reed.type = 'sine';
  reed.frequency.value = 73;
  reedGain.gain.value = 0.18;
  reed.connect(reedGain);
  reedGain.connect(master);
  reed.start();

  const overtone = audio.createOscillator();
  const overtoneGain = audio.createGain();
  overtone.type = 'sine';
  overtone.frequency.value = 110;
  overtoneGain.gain.value = 0.08;
  overtone.connect(overtoneGain);
  overtoneGain.connect(master);
  overtone.start();
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
