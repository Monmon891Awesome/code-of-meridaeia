// Code of Meridaeia - Retro Sound Effects
// Tiny WebAudio synth: no audio files to download, works offline.
// All effects are short 8-bit style chip tones. Muted state persists.

class RetroSFX {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('sfxMuted') === 'true';
        this.updateToggleUI();
    }

    // AudioContext must be created after a user gesture in most browsers
    _ensureContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return false;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return true;
    }

    // Play a single tone. type: oscillator wave, freq in Hz, dur in seconds
    _tone(freq, dur, type = 'square', volume = 0.08, when = 0) {
        const t0 = this.ctx.currentTime + when;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t0);
        gain.gain.setValueAtTime(volume, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t0);
        osc.stop(t0 + dur);
    }

    play(name) {
        if (this.muted) return;
        if (!this._ensureContext()) return;

        try {
            switch (name) {
                case 'correct': // rising ding
                    this._tone(660, 0.1);
                    this._tone(880, 0.15, 'square', 0.08, 0.09);
                    break;
                case 'wrong': // descending buzz
                    this._tone(220, 0.15, 'sawtooth');
                    this._tone(160, 0.25, 'sawtooth', 0.07, 0.12);
                    break;
                case 'victory': // monster slain arpeggio
                    this._tone(523, 0.1);
                    this._tone(659, 0.1, 'square', 0.08, 0.1);
                    this._tone(784, 0.2, 'square', 0.08, 0.2);
                    break;
                case 'fanfare': // quest complete
                    this._tone(523, 0.12);
                    this._tone(659, 0.12, 'square', 0.08, 0.12);
                    this._tone(784, 0.12, 'square', 0.08, 0.24);
                    this._tone(1047, 0.35, 'square', 0.09, 0.36);
                    break;
                case 'levelup': // sparkly rise
                    this._tone(440, 0.08, 'triangle');
                    this._tone(554, 0.08, 'triangle', 0.08, 0.08);
                    this._tone(659, 0.08, 'triangle', 0.08, 0.16);
                    this._tone(880, 0.25, 'triangle', 0.09, 0.24);
                    break;
                case 'defeat': // sad slide
                    this._tone(392, 0.2, 'sawtooth', 0.07);
                    this._tone(311, 0.2, 'sawtooth', 0.07, 0.18);
                    this._tone(233, 0.4, 'sawtooth', 0.07, 0.36);
                    break;
                case 'coin':
                    this._tone(988, 0.06, 'square', 0.06);
                    this._tone(1319, 0.15, 'square', 0.06, 0.06);
                    break;
                case 'click':
                    this._tone(700, 0.04, 'square', 0.04);
                    break;
            }
        } catch (e) {
            // Audio is a nice-to-have; never let it break gameplay
            console.warn('SFX error:', e);
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('sfxMuted', this.muted);
        this.updateToggleUI();
        if (!this.muted) this.play('click');
    }

    updateToggleUI() {
        const icon = document.getElementById('sound-toggle-icon');
        if (icon) icon.textContent = this.muted ? '🔇' : '🔊';
        const btn = document.getElementById('sound-toggle');
        if (btn) btn.setAttribute('aria-pressed', String(!this.muted));
    }
}

const gameSFX = new RetroSFX();
window.gameSFX = gameSFX;

// Sync the toggle icon once the DOM exists (script loads before <nav>)
document.addEventListener('DOMContentLoaded', () => gameSFX.updateToggleUI());
