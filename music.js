// Code of Meridaeia - Wasteland Radio
// Background music player for the player's own Suno tracks.
// Radio-feel: shuffled rotation, gentle crossfades, "now playing" toasts.
// Autoplay-policy safe: arms on the first user gesture (click/key), which
// for new players is the welcome modal's Begin button.

class WastelandRadio {
    constructor() {
        this.tracks = [
            { id: 'dungeon-jig', title: 'Dungeon Jig', src: 'assets/music/dungeon-jig.mp3' },
            { id: 'deep-below-stone', title: 'Deep Below Stone', src: 'assets/music/deep-below-stone.mp3' },
            { id: 'silver-vault-march', title: 'Silver Vault March', src: 'assets/music/silver-vault-march.mp3' },
            { id: 'moonlit-siege-feast', title: 'Moonlit Siege Feast', src: 'assets/music/moonlit-siege-feast.mp3' }
        ];

        this.audio = new Audio();
        this.audio.preload = 'none';
        this.targetVolume = parseFloat(localStorage.getItem('musicVolume') || '0.35');
        this.muted = localStorage.getItem('musicMuted') === 'true';
        this.queue = [];
        this.started = false;
        this.fadeTimer = null;

        this.errorStreak = 0;
        this.audio.addEventListener('ended', () => this.next());
        this.audio.addEventListener('playing', () => { this.errorStreak = 0; });
        // If a track fails to load (offline etc.), quietly try the next one -
        // but give up after a full rotation of failures
        this.audio.addEventListener('error', () => {
            this.errorStreak++;
            if (this.errorStreak < this.tracks.length && !this.muted) this.next();
        });

        // Arm on user gestures. Browsers only grant audio playback for
        // "activation" events (click / keydown / touchend - NOT pointerdown
        // on touch devices), and the first attempt can still be rejected.
        // So: keep listening and retry on every gesture until playback
        // genuinely starts.
        this._armHandler = () => this._tryArm();
        document.addEventListener('click', this._armHandler);
        document.addEventListener('keydown', this._armHandler);
        document.addEventListener('touchend', this._armHandler);

        document.addEventListener('DOMContentLoaded', () => this.updateToggleUI());
    }

    _tryArm() {
        if (this.started || this.muted) {
            // Muted players have made a choice; stop watching gestures
            if (this.muted) this._disarm();
            return;
        }
        this.start();
    }

    _disarm() {
        document.removeEventListener('click', this._armHandler);
        document.removeEventListener('keydown', this._armHandler);
        document.removeEventListener('touchend', this._armHandler);
    }

    shuffleQueue() {
        this.queue = [...this.tracks];
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
        // The intro deserves the deepest track: open with Deep Below Stone
        // on the very first rotation, then let the shuffle rule
        const introIdx = this.queue.findIndex(t => t.id === 'deep-below-stone');
        if (!this.started && introIdx > 0) {
            [this.queue[0], this.queue[introIdx]] = [this.queue[introIdx], this.queue[0]];
        }
    }

    start() {
        if (this.queue.length === 0) this.shuffleQueue();
        this.playTrack(this.queue[0]);
    }

    next() {
        const current = this.queue.shift();
        if (this.queue.length === 0) {
            this.shuffleQueue();
            // avoid immediate repeat of the same track
            if (current && this.queue[0].id === current.id && this.queue.length > 1) {
                this.queue.push(this.queue.shift());
            }
        }
        this.playTrack(this.queue[0]);
    }

    playTrack(track) {
        if (!track || this.muted) return;
        this.audio.src = track.src;
        this.audio.volume = 0;
        const played = this.audio.play();
        if (played) {
            played.then(() => {
                // Playback genuinely started: stop watching gestures
                this.started = true;
                this._disarm();
                this.fadeTo(this.targetVolume, 1500);
                this.announce(track);
            }).catch(() => { /* autoplay blocked; retried on the next gesture */ });
        }
    }

    fadeTo(target, ms) {
        clearInterval(this.fadeTimer);
        const step = 50;
        const start = this.audio.volume;
        const delta = target - start;
        let elapsed = 0;
        this.fadeTimer = setInterval(() => {
            elapsed += step;
            const p = Math.min(1, elapsed / ms);
            this.audio.volume = Math.max(0, Math.min(1, start + delta * p));
            if (p >= 1) {
                clearInterval(this.fadeTimer);
                if (target === 0) this.audio.pause();
            }
        }, step);
    }

    announce(track) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification now-playing-toast';
        toast.setAttribute('role', 'status');
        toast.textContent = `🎵 Now playing: ${track.title}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('musicMuted', this.muted);
        this.updateToggleUI();

        if (this.muted) {
            this.fadeTo(0, 600);
        } else if (this.audio.src && this.audio.paused) {
            this.audio.play().then(() => this.fadeTo(this.targetVolume, 800)).catch(() => {});
        } else if (!this.audio.src) {
            this.start();
        } else {
            this.fadeTo(this.targetVolume, 800);
        }
    }

    updateToggleUI() {
        const icon = document.getElementById('music-toggle-icon');
        if (icon) icon.textContent = this.muted ? '🔇' : '🎵';
        const btn = document.getElementById('music-toggle');
        if (btn) btn.setAttribute('aria-pressed', String(!this.muted));
    }
}

const gameMusic = new WastelandRadio();
window.gameMusic = gameMusic;
