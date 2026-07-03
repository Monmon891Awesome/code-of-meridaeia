// Code of Meridaeia - Leaderboard System
// Global leaderboard on Supabase: reads the top 100 and, unlike the old
// version, actually SUBMITS scores. No login needed - each browser holds a
// random player id in localStorage and upserts its own row.

// ============ CONFIG - paste your NEW Supabase project here ============
// 1. Create a project at https://supabase.com/dashboard
// 2. SQL Editor -> run supabase-setup.sql (in this repo)
// 3. Settings -> API -> copy "Project URL" and the "anon public" key below
const LEADERBOARD_CONFIG = {
    url: 'PASTE_YOUR_NEW_SUPABASE_URL',        // e.g. 'https://abcdefgh.supabase.co'
    anonKey: 'PASTE_YOUR_NEW_ANON_PUBLIC_KEY'  // the long 'eyJ...' anon key (safe to ship - RLS protects the data)
};
// =======================================================================

const LEADERBOARD_TABLE = 'leaderboard';

function isLeaderboardConfigured() {
    return LEADERBOARD_CONFIG.url.startsWith('https://') &&
        LEADERBOARD_CONFIG.anonKey.length > 40;
}

// Initialize Supabase client (library comes from the CDN script tag)
let supabaseClient = null;

async function initSupabase() {
    if (!isLeaderboardConfigured()) return false;
    if (typeof window.supabase === 'undefined') {
        console.warn('Supabase library not loaded yet, will retry...');
        return false;
    }
    if (!supabaseClient) {
        supabaseClient = window.supabase.createClient(
            LEADERBOARD_CONFIG.url, LEADERBOARD_CONFIG.anonKey);
        console.log('✅ Supabase client initialized for leaderboard');
    }
    return true;
}

class LeaderboardManager {
    constructor() {
        this.currentTab = 'xp';
        this.cachedData = { xp: null, gold: null, monsters: null, lastFetch: null };
        this.CACHE_DURATION = 30000; // 30 seconds cache
        this._submitTimer = null;
        this._lastSubmitted = null;
    }

    // ============ PLAYER IDENTITY (no login required) ============
    // A random UUID minted once per browser. It is the row key on the
    // leaderboard - keep localStorage and you keep your entry.
    getPlayerId() {
        let id = null;
        try { id = localStorage.getItem('meridaeia_player_id'); } catch (_) { /* private mode */ }
        if (!id) {
            id = (crypto.randomUUID) ? crypto.randomUUID() :
                'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                    const r = Math.random() * 16 | 0;
                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            try { localStorage.setItem('meridaeia_player_id', id); } catch (_) { /* ok */ }
        }
        return id;
    }

    // ============ SCORE SUBMISSION ============
    // Called by the game after kills, level-ups, and run ends. Debounced so
    // a burst of kills becomes a single network write.
    queueSubmit(profile) {
        if (!profile || !isLeaderboardConfigured()) return;
        clearTimeout(this._submitTimer);
        this._submitTimer = setTimeout(() => this.submitScore(profile), 4000);
    }

    async submitScore(profile) {
        try {
            if (!(await initSupabase())) return;

            const row = {
                player_id: this.getPlayerId(),
                username: String(profile.username || 'Adventurer').slice(0, 24),
                total_xp: Math.max(0, Math.floor(profile.xp || 0)),
                total_gold: Math.max(0, Math.floor(profile.gold || 0)),
                total_monsters_defeated: Math.max(0, Math.floor(profile.monstersDefeated || 0)),
                level: Math.max(1, Math.floor(profile.level || 1))
            };

            // Skip the write if nothing changed since the last submit
            const snapshot = JSON.stringify(row);
            if (snapshot === this._lastSubmitted) return;

            const { error } = await supabaseClient
                .from(LEADERBOARD_TABLE)
                .upsert(row, { onConflict: 'player_id' });

            if (error) {
                // The guard trigger rejects decreases (e.g. after a profile
                // reset); that's expected - the board keeps your best run.
                console.warn('Leaderboard submit rejected:', error.message);
                return;
            }
            this._lastSubmitted = snapshot;
            this.cachedData.lastFetch = null; // next open refetches
            console.log('🏆 Score submitted to the leaderboard');
        } catch (err) {
            console.warn('Leaderboard submit failed:', err);
        }
    }

    /**
     * Show the leaderboard modal
     */
    async showLeaderboard(type = 'xp') {
        this.currentTab = type;

        // Show modal first so feedback is instant
        const modal = document.getElementById('leaderboard-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('active');
        }
        this.setActiveTab(type);

        if (!isLeaderboardConfigured()) {
            this.showError('The global leaderboard is not set up yet. (Dev: run supabase-setup.sql and fill LEADERBOARD_CONFIG in leaderboard.js.)');
            return;
        }

        const isReady = await initSupabase();
        if (!isReady) {
            this.showError('Leaderboard service is initializing. Please try again in a moment.');
            return;
        }

        await this.loadLeaderboard(type);
    }

    /**
     * Close the leaderboard modal
     */
    closeLeaderboard() {
        const modal = document.getElementById('leaderboard-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('active');
        }
    }

    /**
     * Switch between leaderboard tabs
     */
    async switchTab(type) {
        this.currentTab = type;
        this.setActiveTab(type);
        if (!isLeaderboardConfigured()) return;
        await this.loadLeaderboard(type);
    }

    /**
     * Set the active tab styling
     */
    setActiveTab(type) {
        const tabs = document.querySelectorAll('.leaderboard-tab');
        tabs.forEach(tab => {
            if (tab.dataset.type === type) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    /**
     * Load leaderboard data from Supabase
     */
    async loadLeaderboard(type) {
        try {
            this.showLoading();

            // Check cache first
            const now = Date.now();
            if (this.cachedData[type] && this.cachedData.lastFetch &&
                (now - this.cachedData.lastFetch < this.CACHE_DURATION)) {
                console.log('📦 Using cached leaderboard data');
                this.displayLeaderboard(this.cachedData[type], type);
                await this.displayPlayerRank(type);
                return;
            }

            // Fetch fresh data
            const leaderboardData = await this.fetchLeaderboard(type);

            // Cache the data
            this.cachedData[type] = leaderboardData;
            this.cachedData.lastFetch = now;

            // Display leaderboard
            this.displayLeaderboard(leaderboardData, type);

            // Display player's rank
            await this.displayPlayerRank(type);

        } catch (error) {
            console.error('Error loading leaderboard:', error);
            this.showError('Failed to load leaderboard. Please try again.');
        }
    }

    /**
     * Fetch leaderboard data from Supabase
     */
    async fetchLeaderboard(type) {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        // Determine which column to sort by
        let orderColumn = 'total_xp';
        if (type === 'gold') orderColumn = 'total_gold';
        if (type === 'monsters') orderColumn = 'total_monsters_defeated';

        // Fetch top 100 players
        const { data, error } = await supabaseClient
            .from(LEADERBOARD_TABLE)
            .select('username, total_xp, total_gold, total_monsters_defeated, created_at')
            .order(orderColumn, { ascending: false })
            .limit(100);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        return data || [];
    }

    /**
     * Get the current player's rank: count players with a higher submitted
     * score than ours. No login needed - our own row is keyed by player id.
     */
    async getPlayerRank(type) {
        const local = await this.getLocalPlayerValue(type);

        if (!supabaseClient) {
            return { rank: '?', value: local };
        }

        try {
            // Our submitted row (may lag local play by one debounce window)
            const { data: mine } = await supabaseClient
                .from(LEADERBOARD_TABLE)
                .select('total_xp, total_gold, total_monsters_defeated')
                .eq('player_id', this.getPlayerId())
                .maybeSingle();

            if (!mine) {
                return { rank: '?', value: local };
            }

            let column = 'total_xp';
            let playerValue = mine.total_xp;
            if (type === 'gold') { column = 'total_gold'; playerValue = mine.total_gold; }
            if (type === 'monsters') { column = 'total_monsters_defeated'; playerValue = mine.total_monsters_defeated; }

            const { count, error: countError } = await supabaseClient
                .from(LEADERBOARD_TABLE)
                .select('*', { count: 'exact', head: true })
                .gt(column, playerValue);

            if (countError) {
                console.error('Error counting rank:', countError);
                return { rank: '?', value: playerValue };
            }

            return {
                rank: (count || 0) + 1,
                value: playerValue
            };

        } catch (error) {
            console.error('Error getting player rank:', error);
            return { rank: '?', value: local };
        }
    }

    /**
     * Current value from the local profile (used before the first submit)
     */
    async getLocalPlayerValue(type) {
        let profile = null;
        try {
            profile = typeof codeQuestDB !== 'undefined' ? await codeQuestDB.getUserProfile() : null;
        } catch (e) {
            console.warn('Could not load local profile for rank:', e);
        }

        if (type === 'gold') return profile?.gold || 0;
        if (type === 'monsters') return profile?.monstersDefeated || 0;
        return profile?.xp || 0;
    }

    /**
     * Display leaderboard data in the UI
     */
    displayLeaderboard(data, type) {
        const container = document.getElementById('leaderboard-list');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="leaderboard-empty">
                    <p>🏆 No players on the leaderboard yet!</p>
                    <p class="empty-subtitle">Be the first to claim your spot!</p>
                </div>
            `;
            return;
        }

        // Generate leaderboard rows
        const rows = data.map((player, index) => {
            const rank = index + 1;
            let value = player.total_xp;
            let icon = '⭐';

            if (type === 'gold') {
                value = player.total_gold;
                icon = '💰';
            } else if (type === 'monsters') {
                value = player.total_monsters_defeated;
                icon = '⚔️';
            }

            // Medal for top 3
            let rankDisplay = `#${rank}`;
            if (rank === 1) rankDisplay = '🥇';
            if (rank === 2) rankDisplay = '🥈';
            if (rank === 3) rankDisplay = '🥉';

            return `
                <div class="leaderboard-row ${rank <= 3 ? 'top-rank' : ''}" data-rank="${rank}">
                    <span class="rank-badge">${rankDisplay}</span>
                    <span class="player-name">${this.escapeHtml(player.username)}</span>
                    <span class="player-score">${icon} ${(value || 0).toLocaleString()}</span>
                </div>
            `;
        }).join('');

        container.innerHTML = rows;
    }

    /**
     * Display the current player's rank
     */
    async displayPlayerRank(type) {
        const rankElement = document.getElementById('player-rank-display');
        if (!rankElement) return;

        const { rank, value } = await this.getPlayerRank(type);

        let icon = '⭐';
        let label = 'XP';
        if (type === 'gold') {
            icon = '💰';
            label = 'Gold';
        } else if (type === 'monsters') {
            icon = '⚔️';
            label = 'Monsters';
        }

        rankElement.innerHTML = `
            <div class="your-rank">
                <span class="rank-label">Your Rank:</span>
                <span class="rank-value">#${rank}</span>
            </div>
            <div class="your-score">
                <span>${icon} ${(value || 0).toLocaleString()} ${label}</span>
            </div>
        `;
    }

    /**
     * Show loading state
     */
    showLoading() {
        const container = document.getElementById('leaderboard-list');
        if (container) {
            container.innerHTML = `
                <div class="leaderboard-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading leaderboard...</p>
                </div>
            `;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const container = document.getElementById('leaderboard-list');
        if (container) {
            container.innerHTML = `
                <div class="leaderboard-error">
                    <p>⚠️ ${message}</p>
                </div>
            `;
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Refresh leaderboard data (force refresh)
     */
    async refresh() {
        // Clear cache
        this.cachedData[this.currentTab] = null;
        await this.loadLeaderboard(this.currentTab);
    }
}

// Create global instance
const leaderboard = new LeaderboardManager();

// Initialize Supabase when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}

// Export for use in game.js
window.leaderboard = leaderboard;
