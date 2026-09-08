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
  master.gain.value = 0.034;
  master.connect(audio.destination);

  const noise = makeNoise(audio);
  const filter = audio.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 340;
  filter.Q.value = 0.7;
  noise.connect(filter);
  filter.connect(master);
  noise.start();

  const drone = audio.createOscillator();
  const droneGain = audio.createGain();
  drone.type = 'sine';
  drone.frequency.value = 64;
  droneGain.gain.value = 0.16;
  drone.connect(droneGain);
  droneGain.connect(master);
  drone.start();

  const overtone = audio.createOscillator();
  const overtoneGain = audio.createGain();
  overtone.type = 'triangle';
  overtone.frequency.value = 96;
  overtoneGain.gain.value = 0.05;
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
