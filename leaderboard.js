// Code of Meridaeia - Leaderboard System
// Phase 4: Global Leaderboard with Supabase Integration

// Supabase Configuration
// SECURITY WARNING: These keys are exposed in the client-side code.
// The security of the data relies entirely on Row Level Security (RLS) policies in Supabase.
// If RLS is not configured correctly, anyone can access or modify the data.
// See SECURITY_AUDIT.md for more details.
const SUPABASE_URL = 'https://rocvmzuccptzypnensyu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvY3ZtenVjY3B0enlwbmVuc3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjQ5MTYsImV4cCI6MjA4MjM0MDkxNn0.7StbxpyMHhAeIOp-v9_3813qgjKG4aX20PVMbA_UrBI';

// Initialize Supabase client (using CDN)
let supabaseClient = null;

// Initialize Supabase when script loads
async function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase library failed to load. Check your internet connection or ad blocker.');
        return false;
    }
    
    if (!supabaseClient) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized for leaderboard');
        } catch (error) {
            console.error('❌ Failed to initialize Supabase client:', error);
            return false;
        }
    }
    return true;
}

class LeaderboardManager {
    constructor() {
        this.currentTab = 'xp';
        this.cachedData = {
            xp: null,
            gold: null,
            monsters: null,
            lastFetch: null
        };
        this.CACHE_DURATION = 30000; // 30 seconds cache
    }

    /**
     * Show the leaderboard modal
     */
    async showLeaderboard(type = 'xp') {
        this.currentTab = type;
        
        // Ensure Supabase is initialized
        const isReady = await initSupabase();
        if (!isReady) {
            this.showError('Leaderboard service is initializing. Please try again in a moment.');
            return;
        }

        // Show modal
        const modal = document.getElementById('leaderboard-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('active');
        }

        // Set active tab
        this.setActiveTab(type);

        // Load leaderboard data
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
        // Note: Ideally this should query 'leaderboard_cache' view, but we query 'player_profiles'
        // This requires RLS to allow reading public profiles. If RLS is strict (owner only), this will fail.
        const { data, error } = await supabaseClient
            .from('player_profiles')
            .select('username, total_xp, total_gold, total_monsters_defeated, created_at')
            .eq('leaderboard_visible', true)
            .order(orderColumn, { ascending: false })
            .limit(100);

        if (error) {
            console.error('Supabase error:', error);
            // If error is permission denied (401/403), it means RLS is preventing access.
            if (error.code === '42501' || error.code === 'PGRST301') {
                console.warn('⚠️ Access denied by RLS policies. Leaderboard may be restricted.');
            }
            throw error;
        }

        return data || [];
    }

    /**
     * Get the current player's rank
     */
    async getPlayerRank(type) {
        if (!supabaseClient) {
            return { rank: '?', value: 0 };
        }

        try {
            // Get current user
            const { data: { user } } = await supabaseClient.auth.getUser();
            
            if (!user) {
                // User not logged in, use local data
                return this.getLocalPlayerRank(type);
            }

            // Get player profile
            const { data: profile, error: profileError } = await supabaseClient
                .from('player_profiles')
                .select('id, total_xp, total_gold, total_monsters_defeated')
                .eq('user_id', user.id)
                .single();

            if (profileError || !profile) {
                console.warn('Could not fetch player profile:', profileError);
                return this.getLocalPlayerRank(type);
            }

            // Determine column to compare
            let column = 'total_xp';
            let playerValue = profile.total_xp;
            if (type === 'gold') {
                column = 'total_gold';
                playerValue = profile.total_gold;
            }
            if (type === 'monsters') {
                column = 'total_monsters_defeated';
                playerValue = profile.total_monsters_defeated;
            }

            // Count how many players have a higher score
            const { count, error: countError } = await supabaseClient
                .from('player_profiles')
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
            return this.getLocalPlayerRank(type);
        }
    }

    /**
     * Get player rank from local IndexedDB data (fallback)
     */
    getLocalPlayerRank(type) {
        const profile = codeQuestDB ? codeQuestDB.getUserProfile() : null;
        
        let value = 0;
        if (type === 'xp') value = profile?.totalXP || 0;
        if (type === 'gold') value = profile?.totalGold || 0;
        if (type === 'monsters') value = profile?.monstersDefeated || 0;

        return {
            rank: '?',
            value: value
        };
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
                    <span class="player-score">${icon} ${value.toLocaleString()}</span>
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
                <span>${icon} ${value.toLocaleString()} ${label}</span>
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
