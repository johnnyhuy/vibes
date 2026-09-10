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

/**
 * Short invented glass ping. Oscillators only — no sample, mute-default.
 */
export function playGlassPing(): void {
  if (muted) return;
  const audio = ensure();
  if (!audio || audio.state !== 'running') return;

  const now = audio.currentTime;
  const master = audio.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.055, now + 0.012);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  master.connect(audio.destination);

  const ping = audio.createOscillator();
  const pingFilter = audio.createBiquadFilter();
  ping.type = 'sine';
  ping.frequency.setValueAtTime(2460, now);
  ping.frequency.exponentialRampToValueAtTime(880, now + 0.18);
  pingFilter.type = 'bandpass';
  pingFilter.frequency.value = 1680;
  pingFilter.Q.value = 4.2;
  ping.connect(pingFilter);
  pingFilter.connect(master);
  ping.start(now);
  ping.stop(now + 0.22);

  const tick = audio.createOscillator();
  const tickGain = audio.createGain();
  tick.type = 'triangle';
  tick.frequency.setValueAtTime(1720, now);
  tick.frequency.exponentialRampToValueAtTime(420, now + 0.07);
  tickGain.gain.setValueAtTime(0.0001, now);
  tickGain.gain.exponentialRampToValueAtTime(0.03, now + 0.006);
  tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  tick.connect(tickGain);
  tickGain.connect(master);
  tick.start(now);
  tick.stop(now + 0.09);
}
