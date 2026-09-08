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

function makeNoise(audio: AudioContext, color: 'wind' | 'surf'): AudioBufferSourceNode {
  const length = audio.sampleRate * 2;
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  const lean = color === 'surf' ? 0.94 : 0.72;
  const mix = color === 'surf' ? 0.06 : 0.28;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = last * lean + white * mix;
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
  master.gain.value = 0.042;
  master.connect(audio.destination);

  const wind = makeNoise(audio, 'wind');
  const windFilter = audio.createBiquadFilter();
  windFilter.type = 'bandpass';
  windFilter.frequency.value = 920;
  windFilter.Q.value = 0.7;
  const windGain = audio.createGain();
  windGain.gain.value = 0.55;
  wind.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(master);
  wind.start();

  const surf = makeNoise(audio, 'surf');
  const surfFilter = audio.createBiquadFilter();
  surfFilter.type = 'lowpass';
  surfFilter.frequency.value = 210;
  const surfGain = audio.createGain();
  surfGain.gain.value = 0.7;
  surf.connect(surfFilter);
  surfFilter.connect(surfGain);
  surfGain.connect(master);
  surf.start();
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
