// Code of Meridaeia Database Module - IndexedDB Implementation
// This module handles all data persistence using IndexedDB

// Database configuration
const DB_NAME = 'CodeOfMeridaeiaDB';
const DB_VERSION = 1;

class CodeOfMeridaeiaDatabase {
    constructor() {
        this.db = null;
        this.isReady = false;
    }

    // Initialize the database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.isReady = true;
                console.log('🎮 Code of Meridaeia Database initialized!');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // User Profile Store
                if (!db.objectStoreNames.contains('userProfile')) {
                    const userStore = db.createObjectStore('userProfile', { keyPath: 'id' });
                    userStore.createIndex('username', 'username', { unique: true });
                }

                // Progress Store - tracks completed questions
                if (!db.objectStoreNames.contains('progress')) {
                    const progressStore = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
                    progressStore.createIndex('category', 'category', { unique: false });
                    progressStore.createIndex('questionId', 'questionId', { unique: false });
                    progressStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Checkpoints Store - save states
                if (!db.objectStoreNames.contains('checkpoints')) {
                    const checkpointStore = db.createObjectStore('checkpoints', { keyPath: 'id', autoIncrement: true });
                    checkpointStore.createIndex('name', 'name', { unique: false });
                    checkpointStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Achievements Store
                if (!db.objectStoreNames.contains('achievements')) {
                    const achievementStore = db.createObjectStore('achievements', { keyPath: 'id' });
                    achievementStore.createIndex('unlockedAt', 'unlockedAt', { unique: false });
                }

                // Analytics Store - for data engineering learning
                if (!db.objectStoreNames.contains('analytics')) {
                    const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
                    analyticsStore.createIndex('eventType', 'eventType', { unique: false });
                    analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                console.log('📊 Database schema created!');
            };
        });
    }

    // ============ USER PROFILE OPERATIONS ============

    async saveUserProfile(profile) {
        return this._transaction('userProfile', 'readwrite', (store) => {
            return store.put({ id: 'main', ...profile });
        });
    }

    async getUserProfile() {
        let profile = await this._transaction('userProfile', 'readonly', (store) => {
            return store.get('main');
        });

        // Migration: Add missing RPG fields for existing users
        if (profile && profile.gold === undefined) {
            profile.gold = 0;
            profile.characterClass = null;
            profile.equipped = { weapon: null, armor: null, scrolls: 0 };
            profile.inventory = [];
            profile.storyProgress = 0;
            profile.currentMonsterHP = 100;
            profile.barrierPoints = 3;
            if (!profile.categoryProgress.kernel) {
                profile.categoryProgress.kernel = { completed: 0, correct: 0 };
            }
            await this.saveUserProfile(profile);
            console.log('📦 User profile migrated to RPG schema');
        }

        // Migration: Add chapterProgress for existing users (Phase B)
        if (profile && !profile.chapterProgress) {
            profile.chapterProgress = {
                java: { chapter1: false, chapter2: false, chapter3: false },
                cpp: { chapter1: false, chapter2: false, chapter3: false },
                networking: { chapter1: false, chapter2: false, chapter3: false },
                dataEngineering: { chapter1: false, chapter2: false, chapter3: false },
                kernel: { chapter1: false, chapter2: false, chapter3: false }
            };
            await this.saveUserProfile(profile);
            console.log('📖 User profile migrated to Chapter system');
        }

        return profile;
    }

    async initializeNewUser(username) {
        const profile = {
            id: 'main',
            username: username,
            xp: 0,
            level: 1,
            totalQuestionsAnswered: 0,
            correctAnswers: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastPlayedDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            categoryProgress: {
                java: { completed: 0, correct: 0 },
                cpp: { completed: 0, correct: 0 },
                networking: { completed: 0, correct: 0 },
                dataEngineering: { completed: 0, correct: 0 },
                kernel: { completed: 0, correct: 0 }
            },
            // Chapter Progress - tracks completed chapters per hero
            chapterProgress: {
                java: { chapter1: false, chapter2: false, chapter3: false },
                cpp: { chapter1: false, chapter2: false, chapter3: false },
                networking: { chapter1: false, chapter2: false, chapter3: false },
                dataEngineering: { chapter1: false, chapter2: false, chapter3: false },
                kernel: { chapter1: false, chapter2: false, chapter3: false },
                marakathalessa: { chapter1: false, chapter2: false, chapter3: false }
            },
            // RPG Attributes
            characterClass: null,
            gold: 0,
            equipped: {
                weapon: null,
                armor: null,
                scrolls: 0
            },
            inventory: [],
            storyProgress: 0,
            currentMonsterHP: 100,
            barrierPoints: 3, // Hints as Shields/Barrier
            bossDefeated: null, // Phase C: 'incomplete' or 'true'
            marakathalessaUnlocked: false // Phase D: true after true ending
        };
        await this.saveUserProfile(profile);
        return profile;
    }

    // ============ PROGRESS OPERATIONS ============

    async saveProgress(progressEntry) {
        const entry = {
            ...progressEntry,
            timestamp: new Date().toISOString()
        };
        return this._transaction('progress', 'readwrite', (store) => {
            return store.add(entry);
        });
    }

    async getProgressByCategory(category) {
        return this._transaction('progress', 'readonly', (store) => {
            const index = store.index('category');
            return index.getAll(category);
        });
    }

    async getAllProgress() {
        return this._transaction('progress', 'readonly', (store) => {
            return store.getAll();
        });
    }

    // ============ CHECKPOINT OPERATIONS ============

    async createCheckpoint(name, gameState) {
        const checkpoint = {
            name: name,
            timestamp: new Date().toISOString(),
            gameState: JSON.stringify(gameState)
        };
        return this._transaction('checkpoints', 'readwrite', (store) => {
            return store.add(checkpoint);
        });
    }

    async getAllCheckpoints() {
        return this._transaction('checkpoints', 'readonly', (store) => {
            return store.getAll();
        });
    }

    async loadCheckpoint(id) {
        return this._transaction('checkpoints', 'readonly', (store) => {
            return store.get(id);
        });
    }

    async deleteCheckpoint(id) {
        return this._transaction('checkpoints', 'readwrite', (store) => {
            return store.delete(id);
        });
    }

    // ============ ACHIEVEMENT OPERATIONS ============

    async unlockAchievement(achievementId, achievementData) {
        const achievement = {
            id: achievementId,
            ...achievementData,
            unlockedAt: new Date().toISOString()
        };
        return this._transaction('achievements', 'readwrite', (store) => {
            return store.put(achievement);
        });
    }

    async getAchievements() {
        return this._transaction('achievements', 'readonly', (store) => {
            return store.getAll();
        });
    }

    // ============ ANALYTICS OPERATIONS ============
    // Track events for data engineering learning experience

    async trackEvent(eventType, eventData) {
        const event = {
            eventType: eventType,
            data: eventData,
            timestamp: new Date().toISOString(),
            sessionId: this._getSessionId()
        };
        return this._transaction('analytics', 'readwrite', (store) => {
            return store.add(event);
        });
    }

    async getAnalytics(eventType = null) {
        return this._transaction('analytics', 'readonly', (store) => {
            if (eventType) {
                const index = store.index('eventType');
                return index.getAll(eventType);
            }
            return store.getAll();
        });
    }

    async getAnalyticsSummary() {
        const allEvents = await this.getAnalytics();

        // Aggregate data - simulating ETL process
        const summary = {
            totalEvents: allEvents.length,
            eventsByType: {},
            eventsPerDay: {},
            averageSessionDuration: 0
        };

        allEvents.forEach(event => {
            // Count by type
            summary.eventsByType[event.eventType] = (summary.eventsByType[event.eventType] || 0) + 1;

            // Count by day
            const day = event.timestamp.split('T')[0];
            summary.eventsPerDay[day] = (summary.eventsPerDay[day] || 0) + 1;
        });

        return summary;
    }

    // ============ EXPORT/IMPORT for Data Portability ============

    async exportAllData() {
        const data = {
            exportedAt: new Date().toISOString(),
            version: DB_VERSION,
            userProfile: await this.getUserProfile(),
            progress: await this.getAllProgress(),
            checkpoints: await this.getAllCheckpoints(),
            achievements: await this.getAchievements(),
            analytics: await this.getAnalytics()
        };
        return JSON.stringify(data, null, 2);
    }

    async importData(jsonString) {
        const data = JSON.parse(jsonString);

        if (data.userProfile) {
            await this.saveUserProfile(data.userProfile);
        }

        // Note: Progress, checkpoints, achievements would need more complex merging logic
        console.log('📥 Data imported successfully!');
        return true;
    }

    // ============ UTILITY METHODS ============

    _getSessionId() {
        if (!window._codeQuestSessionId) {
            window._codeQuestSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return window._codeQuestSessionId;
    }

    _transaction(storeName, mode, callback) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(storeName, mode);
            const store = transaction.objectStore(storeName);
            const request = callback(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Clear all data (for testing)
    async clearAllData() {
        const stores = ['userProfile', 'progress', 'checkpoints', 'achievements', 'analytics'];
        for (const storeName of stores) {
            await this._transaction(storeName, 'readwrite', (store) => store.clear());
        }
        console.log('🗑️ All data cleared!');
    }
}

// Export singleton instance
const codeQuestDB = new CodeOfMeridaeiaDatabase();
