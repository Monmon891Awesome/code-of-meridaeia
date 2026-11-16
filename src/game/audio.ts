// Sound: synthesized effects (no files) plus a shuffled music rotation.
// Browsers only allow audio after a user gesture, so nothing starts until
// unlock() is called from a click.

type Sfx =
  | 'select' | 'correct' | 'wrong' | 'hit' | 'crit' | 'cast' | 'swing' | 'death' | 'spawn'
  | 'levelup' | 'fanfare' | 'defeat' | 'hint' | 'buy' | 'heal' | 'tick' | 'boss' | 'loot';

const TRACKS = [
  '/assets/music/dungeon-jig.mp3',
  '/assets/music/deep-below-stone.mp3',
  '/assets/music/silver-vault-march.mp3',
  '/assets/music/moonlit-siege-feast.mp3',
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private music: HTMLAudioElement | null = null;
  private queue: string[] = [];
  private failures = 0;
  private settings = { music: true, sfx: true, volume: 0.35 };

  configure(settings: { music: boolean; sfx: boolean; volume: number }) {
    this.settings = { ...settings };
    if (!this.music) return;
    this.music.volume = settings.volume;
    if (settings.music) this.music.play().catch(() => {});
    else this.music.pause();
  }

  /** Call from a user gesture. Safe to call repeatedly. */
  unlock() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) this.ctx = new Ctor();
    }
    if (this.ctx?.state === 'suspended') void this.ctx.resume();
    if (!this.music) {
      this.music = new Audio();
      this.music.preload = 'none';
      this.music.volume = this.settings.volume;
      this.music.addEventListener('ended', () => this.nextTrack());
      this.music.addEventListener('playing', () => { this.failures = 0; });
      this.music.addEventListener('error', () => {
        if (++this.failures < TRACKS.length) this.nextTrack();
      });
      if (this.settings.music) this.nextTrack();
    }
  }

  private nextTrack() {
    if (!this.music) return;
    if (!this.queue.length) this.queue = [...TRACKS].sort(() => Math.random() - 0.5);
    this.music.src = this.queue.pop()!;
    if (this.settings.music) this.music.play().catch(() => {});
  }

  private tone(freq: number, dur: number, type: OscillatorType = 'triangle', vol = 0.08, when = 0, slideTo?: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private noise(dur: number, vol = 0.12, when = 0, cutoff = 1800) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t0 = ctx.currentTime + when;
    const length = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(t0);
  }

  play(name: Sfx) {
    if (!this.settings.sfx || !this.ctx) return;
    try {
      switch (name) {
        case 'select': this.tone(520, 0.06, 'triangle', 0.05); break;
        case 'correct': this.tone(660, 0.1); this.tone(990, 0.18, 'triangle', 0.08, 0.08); break;
        case 'wrong': this.tone(220, 0.18, 'sawtooth', 0.06, 0, 140); this.tone(150, 0.3, 'sawtooth', 0.05, 0.14, 90); break;
        case 'swing': this.noise(0.18, 0.08, 0, 3200); break;
        case 'cast': this.tone(300, 0.35, 'sine', 0.07, 0, 1200); this.noise(0.3, 0.03, 0, 5000); break;
        case 'hit': this.noise(0.16, 0.2, 0, 900); this.tone(110, 0.16, 'square', 0.08, 0, 60); break;
        case 'crit': this.noise(0.25, 0.25, 0, 1400); this.tone(90, 0.25, 'square', 0.1, 0, 45); this.tone(1320, 0.2, 'triangle', 0.06, 0.02); break;
        case 'death': this.tone(400, 0.6, 'sawtooth', 0.06, 0, 50); this.noise(0.6, 0.08, 0, 700); break;
        case 'spawn': this.tone(120, 0.4, 'sine', 0.07, 0, 360); break;
        case 'loot': [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, 0.14, 'triangle', 0.06, i * 0.07)); break;
        case 'levelup': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.07, i * 0.09)); break;
        case 'fanfare': [523, 523, 659, 784, 1047].forEach((f, i) => this.tone(f, i === 4 ? 0.5 : 0.14, 'triangle', 0.08, i * 0.13)); break;
        case 'defeat': [392, 330, 262, 196].forEach((f, i) => this.tone(f, 0.3, 'sawtooth', 0.05, i * 0.2)); break;
        case 'hint': this.tone(880, 0.08, 'sine', 0.06); this.tone(1320, 0.12, 'sine', 0.06, 0.07); break;
        case 'buy': this.tone(1200, 0.06, 'square', 0.04); this.tone(1600, 0.1, 'square', 0.04, 0.06); break;
        case 'heal': this.tone(440, 0.3, 'sine', 0.07, 0, 880); break;
        case 'tick': this.tone(1000, 0.04, 'square', 0.04); break;
        case 'boss': this.tone(80, 1.2, 'sawtooth', 0.09, 0, 40); this.tone(160, 1.2, 'sawtooth', 0.05, 0.1, 55); break;
      }
    } catch {
      // Audio is a nicety; never let it break the game.
    }
  }
}

export const audio = new AudioEngine();
