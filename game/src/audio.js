// Farmyard Dash — tiny synthesised sound effects (WebAudio, no audio files).
// Every sound is a short oscillator blip, so the game ships no media at all.
export function createSoundBank() {
  let context = null;
  let muted = false;

  function ensureContext() {
    if (context === null) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
    }
    if (context.state === 'suspended') context.resume();
    return context;
  }

  function beep(freqStart, freqEnd, duration, type, volume) {
    if (muted) return;
    const ctx = ensureContext();
    if (ctx === null) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  return {
    unlock() { ensureContext(); },
    toggleMute() { muted = !muted; return muted; },
    isMuted() { return muted; },
    jump() { beep(280, 620, 0.16, 'sine', 0.16); },
    corn() { beep(880, 1320, 0.1, 'triangle', 0.14); beep(1320, 1760, 0.12, 'triangle', 0.1); },
    hit() { beep(220, 60, 0.28, 'sawtooth', 0.2); },
    caught() { beep(392, 98, 0.7, 'sawtooth', 0.2); beep(196, 49, 0.7, 'triangle', 0.14); },
    escaped() {
      [523, 659, 784, 1047].forEach((freq, index) => {
        setTimeout(() => beep(freq, freq, 0.22, 'triangle', 0.16), index * 130);
      });
    },
    click() { beep(660, 660, 0.05, 'square', 0.06); },
  };
}
