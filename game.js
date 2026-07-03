// Code of Meridaeia Game Engine
class CodeOfMeridaeiaGame {
    constructor() {
        this.currentCategory = null;
        this.currentChapter = null;  // Phase B: Chapter system
        this.selectedHero = null;    // Phase B: Selected hero info
        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.score = 0;
        this.correctAnswers = 0;
        this.totalAnswered = 0;
        this.timeLeft = 60;
        this.timerInterval = null;
        this.isGameActive = false;
        this.userProfile = null;
        this.achievements = [];

        // XP multipliers by difficulty
        this.xpMultipliers = {
            easy: 10,
            medium: 20,
            hard: 30
        };

        // Time bonus scale
        this.maxTimeBonus = 10;

        // Combat state (Phase 2)
        this.currentMonsterHP = 100;
        this.monsterMaxHP = 100;
        this.goldEarned = 0;

        // Monster Bestiary
        this.monsterNames = {
            easy: ['Syntax Goblin', 'Null Pointer Wolf'],
            medium: ['Memory Leak Demon', 'Segfault Wraith'],
            hard: ['Corrupted Compiler', 'Marakathalessa']
        };

        // Monster Portraits (mapped to names)
        this.monsterPortraits = {
            'Syntax Goblin': 'assets/monsters/monster-syntax-goblin.png',
            'Null Pointer Wolf': 'assets/monsters/monster-null-wolf.png',
            'Memory Leak Demon': 'assets/monsters/monster-memory-demon.png',
            'Segfault Wraith': 'assets/monsters/monster-segfault-wraith.png',
            'Corrupted Compiler': 'assets/monsters/monster-corrupted-compiler.png',
            'Marakathalessa': 'assets/monsters/boss-marakathalessa-alt.png'
        };

        // Boss Fight State (Phase C)
        this.isBossFighting = false;
        this.bossQuestions = [];
        this.currentBossQuestionIndex = 0;
        this.currentBossQuestion = null;
        this.currentHintIndex = 0;
        this.bossHP = 1000;
        this.bossMaxHP = 1000;

        // ============ BIBLICAL VALUES: VIRTUE MESSAGES ============
        // Subtle integration of wisdom, perseverance, grace themes
        this.virtueMessages = {
            correct: [
                "Wisdom grows with each victory.",
                "Patience and study bear fruit.",
                "Your perseverance is rewarded.",
                "Knowledge is the beginning of wisdom.",
                "Well done! Keep pressing forward.",
                "Diligence leads to mastery.",
                "Every step forward is progress.",
                "Your dedication shines through.",
                "The path of understanding unfolds.",
                "Excellence comes through practice."
            ],
            incorrect: [
                "Grace covers all mistakes. Learn and grow.",
                "Even heroes stumble. Rise again.",
                "Every failure plants seeds of wisdom.",
                "Patience with yourself is strength.",
                "Mistakes are teachers in disguise.",
                "The journey matters more than perfection.",
                "Tomorrow brings new opportunities.",
                "Growth comes through challenge.",
                "Persistence overcomes all obstacles.",
                "Take heart, redemption is always possible."
            ],
            streak: [
                "Your consistency inspires!",
                "A pattern of excellence emerges.",
                "Faithfulness in the small things.",
                "Building momentum through dedication.",
                "Steadfast and sure!"
            ]
        };

        // Track answer streak for virtue bonuses
        this.currentStreak = 0;

        // ============ LOOT TABLE (variable rewards) ============
        // Weighted rarity roll on every monster kill. A hot streak
        // (3+) upgrades the player's luck by one reroll.
        this.lootTable = [
            {
                rarity: 'common', label: 'Common', weight: 55, gold: [4, 10],
                items: ["Goblin's Cracked Semicolon", 'Rusty Loop Counter', 'Torn Stack Frame', 'Bent Null Terminator']
            },
            {
                rarity: 'uncommon', label: 'Uncommon', weight: 25, gold: [12, 20],
                items: ['Vial of Sanitized Input', 'Polished Boolean Gem', 'Cloak of Caught Exceptions', 'Wolf-Fang Pointer']
            },
            {
                rarity: 'rare', label: 'Rare', weight: 13, gold: [25, 40],
                items: ['Rune of Constant Time', 'Demonhide Debugger', 'Chalice of Closed Sockets', 'Wraithbone Compiler Flag']
            },
            {
                rarity: 'epic', label: 'Epic', weight: 5.5, gold: [50, 80],
                items: ['Crown of the Root User', 'Heart of the Deadlock Dragon', 'Sigil of Zero Downtime']
            },
            {
                rarity: 'legendary', label: 'LEGENDARY', weight: 1.5, gold: [120, 200],
                items: ['Blade of the Final Keyword', 'The Uncorrupted Kernel', "Marakathalessa's Lost Tear"]
            }
        ];
    }

    // Roll the loot table; streaks of 3+ grant a second roll, keeping
    // the better result (luck rewards mastery, not just grinding)
    rollLoot() {
        const roll = () => {
            const total = this.lootTable.reduce((s, t) => s + t.weight, 0);
            let r = Math.random() * total;
            for (const tier of this.lootTable) {
                r -= tier.weight;
                if (r <= 0) return tier;
            }
            return this.lootTable[0];
        };

        let tier = roll();
        if (this.currentStreak >= 3) {
            const second = roll();
            const rank = (t) => this.lootTable.indexOf(t);
            if (rank(second) > rank(tier)) tier = second;
        }

        const gold = tier.gold[0] + Math.floor(Math.random() * (tier.gold[1] - tier.gold[0] + 1));
        const item = tier.items[Math.floor(Math.random() * tier.items.length)];
        return { rarity: tier.rarity, label: tier.label, gold, item };
    }

    showLootDrop(loot) {
        const toast = document.createElement('div');
        toast.className = `toast-notification loot-toast loot-${loot.rarity}`;
        toast.setAttribute('role', 'status');
        toast.innerHTML = `<span class="loot-label">${loot.label} DROP</span>` +
            `<span class="loot-name">${this.escapeHtml(loot.item)}</span>` +
            `<span class="loot-gold">+${loot.gold} 💰</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), loot.rarity === 'legendary' ? 5000 : 3600);

        if (loot.rarity === 'legendary' || loot.rarity === 'epic') {
            this.playSound('fanfare');
        } else {
            this.playSound('coin');
        }
    }

    async init() {
        // Restore "play in portrait" choice before anything renders
        if (localStorage.getItem('portraitOk') === '1') {
            document.body.classList.add('portrait-ok');
        }

        // Initialize database
        await codeQuestDB.init();

        // Load or create user profile
        this.userProfile = await codeQuestDB.getUserProfile();
        if (!this.userProfile) {
            const username = await this.askUsername();
            this.userProfile = await codeQuestDB.initializeNewUser(username);
        }

        // Load achievements
        this.achievements = await codeQuestDB.getAchievements();

        // Update UI with profile
        this.updateProfileUI();

        // Initialize nav state (Phase A)
        this.initNavState();

        // Check if boss should be unlocked (Phase C)
        this.updateBossCardStatus();

        // Check if Marakathalessa playable is unlocked (Phase D)
        this.updateMaraCardStatus();

        // Build the hero selection wheel
        this.initHeroWheel();

        // Keyboard controls: 1-4 / A-D pick an answer, Enter/Space continues
        this.initKeyboardControls();

        // Track session start
        await codeQuestDB.trackEvent('session_start', {
            username: this.userProfile.username,
            level: this.userProfile.level
        });

        console.log('🎮 Code of Meridaeia initialized!', this.userProfile);
    }

    initKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Never hijack typing (boss fight answer box, prompts, etc.)
            const tag = document.activeElement?.tagName;
            if (tag === 'TEXTAREA' || tag === 'INPUT' || e.metaKey || e.ctrlKey || e.altKey) return;

            // Never act underneath an open modal
            if (document.querySelector('.modal:not(.hidden), .lore-modal:not(.hidden), .story-modal:not(.hidden), .welcome-modal:not(.hidden), .overlay:not(.hidden)')) return;

            // Hero wheel controls when the antechamber is visible
            const categorySelect = document.getElementById('category-select');
            if (categorySelect && !categorySelect.classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') { e.preventDefault(); this.spinWheel(-1); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); this.spinWheel(1); }
                else if (e.key === 'Enter') { e.preventDefault(); this.confirmWheelSelection(); }
                return;
            }

            const gameArea = document.getElementById('game-area');
            if (!gameArea || gameArea.classList.contains('hidden')) return;

            const feedbackVisible = !document.getElementById('feedback-container')
                .classList.contains('hidden');

            if (feedbackVisible) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('next-btn')?.click();
                }
                return;
            }

            // Map 1-4 and A-D to answer cards
            const key = e.key.toLowerCase();
            let index = -1;
            if (key >= '1' && key <= '4') index = parseInt(key, 10) - 1;
            else if (key >= 'a' && key <= 'd') index = key.charCodeAt(0) - 97;
            else if (key === 'h') { this.useHint(); return; }

            if (index >= 0) {
                const cards = document.querySelectorAll('#options-container .answer-card, #options-container .option-btn');
                const card = cards[index];
                if (card && !card.disabled && !card.classList.contains('disabled')) {
                    card.click();
                }
            }
        });
    }

    // ============ HERO WHEEL (StarCraft-style reveal) ============
    // Heroes sit on a spinnable wheel. Locked ones appear only as dark
    // silhouettes - you know something is there, not what it is.

    getWheelEntries() {
        return [
            {
                key: 'java', name: 'Grom the Uncompiled', cls: 'Barbarian Warrior',
                tag: 'Java', count: '12 Questions', img: 'assets/heroes/hero-grom-portrait.png',
                video: 'assets/video/hero-grom.mp4',
                desc: 'Master of the "Write Once, Crush Everywhere" arts. High resilience and brute force.',
                locked: () => false
            },
            {
                key: 'cpp', name: 'Malloc the Void-Walker', cls: 'Dark Wizard',
                tag: 'C++', count: '12 Questions', img: 'assets/heroes/hero-malloc-portrait.png',
                desc: 'Wielder of volatile arcane memory. High power, but one slip leads to a Void Segfault.',
                locked: () => false
            },
            {
                key: 'networking', name: 'Ser Handshake', cls: 'Knight Paladin',
                tag: 'Networking', count: '12 Questions', img: 'assets/heroes/hero-handshake-portrait.png',
                video: 'assets/video/hero-handshake.mp4',
                desc: 'Guardian of the Great Gateway. Restoring the Three-Way Handshake of light.',
                locked: () => false
            },
            {
                key: 'dataEngineering', name: 'Artemis the Stream-Caller', cls: 'Knight Archer',
                tag: 'Data Eng', count: '12 Questions', img: 'assets/heroes/hero-artemis-portrait.png',
                video: 'assets/video/hero-artemis.mp4',
                desc: 'Purifier of the Corrupted Lakes. Her Pipeline of Arrows never misses the mark.',
                locked: () => false
            },
            {
                key: 'kernel', name: 'Vulkun of Ring Zero', cls: 'Dragonoid Mercenary',
                tag: 'Kernel Dev', count: '30 Questions', img: 'assets/heroes/hero-vulkun-portrait.png',
                video: 'assets/video/hero-vulkun.mp4',
                desc: 'Born from Silicon fires. Master of the Low-Level Ring Zero magic.',
                locked: () => false
            },
            {
                key: 'boss', name: 'Marakathalessa', cls: 'The Witch of Corrupted Code',
                tag: '⚔️ BOSS FIGHT', count: '10 Trials', img: 'assets/monsters/boss-marakathalessa-alt.png',
                video: 'assets/video/boss-marakathalessa.mp4',
                desc: 'The ancient sorceress who corrupted the realm. Face her if you dare.',
                locked: () => !this.isBossUnlocked(),
                lockHint: 'A great evil stirs... Complete all 3 chapters of any hero to face her.'
            },
            {
                key: 'marakathalessa', name: 'Marakathalessa Redeemed', cls: 'Corrupted Mage',
                tag: '🔮 Her Story', count: '12 Questions', img: 'assets/monsters/boss-marakathalessa-alt.png',
                video: 'assets/video/boss-marakathalessa.mp4',
                desc: 'Play her story. Learn how she fell to the Legion of 404.',
                locked: () => !this.isMarakathalessaUnlocked(),
                lockHint: 'A soul awaits redemption... Defeat the boss and complete every hero to hear her story.'
            }
        ];
    }

    initHeroWheel() {
        this.wheelIndex = this.wheelIndex || 0;
        this.renderHeroWheel();
    }

    renderHeroWheel() {
        const wheel = document.getElementById('hero-wheel');
        if (!wheel) return;

        const entries = this.getWheelEntries();
        const step = 360 / entries.length;

        // Build medallions once, then only update transforms/state
        if (wheel.children.length !== entries.length) {
            wheel.innerHTML = '';
            entries.forEach((entry, i) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'wheel-medallion';
                btn.innerHTML = `
                    <img src="${entry.img}" alt="" draggable="false">
                    <span class="medallion-lock" aria-hidden="true">🔒</span>`;
                btn.onclick = () => {
                    if (i === this.wheelIndex) {
                        this.confirmWheelSelection();
                    } else {
                        this.spinWheelTo(i);
                    }
                };
                wheel.appendChild(btn);
            });
        }

        [...wheel.children].forEach((btn, i) => {
            const entry = entries[i];
            const isLocked = entry.locked();
            const angle = ((i - this.wheelIndex) * step + 540) % 360 - 180; // normalized -180..180
            btn.style.transform =
                `rotate(${angle}deg) translateY(calc(var(--wheel-radius, 150px) * -1)) rotate(${-angle}deg)`;
            btn.classList.toggle('focused', i === this.wheelIndex);
            btn.classList.toggle('locked', isLocked);
            btn.setAttribute('aria-label', isLocked
                ? 'A locked, shadowed figure'
                : `${entry.name}, ${entry.cls}`);
        });

        this.updateWheelDetail(entries[this.wheelIndex]);
    }

    updateWheelDetail(entry) {
        const detail = document.getElementById('wheel-detail');
        if (!detail || !entry) return;

        // Cancel any pending fight-clip load from a previous spin so fast
        // spinning never stacks up video downloads.
        if (this._wheelVideoTimer) {
            clearTimeout(this._wheelVideoTimer);
            this._wheelVideoTimer = null;
        }

        const isLocked = entry.locked();
        if (isLocked) {
            detail.innerHTML = `
                <span class="wheel-tag wheel-tag-locked">🔒 SEALED</span>
                <h3 class="wheel-name">???</h3>
                <p class="wheel-class">Unknown</p>
                <p class="wheel-desc">${this.escapeHtml(entry.lockHint || 'This figure is shrouded in darkness.')}</p>
                <button class="wheel-begin locked" disabled>Sealed by Dark Magic</button>`;
            return;
        }

        // A framed portrait poster shows instantly; the fight clip fades in
        // once the wheel has settled on this hero.
        detail.innerHTML = `
            <div class="wheel-hero-media">
                <img class="wheel-hero-poster" src="${entry.img}" alt="" draggable="false">
            </div>
            <span class="wheel-tag">${this.escapeHtml(entry.tag)} · ${this.escapeHtml(entry.count)}</span>
            <h3 class="wheel-name">${this.escapeHtml(entry.name)}</h3>
            <p class="wheel-class">${this.escapeHtml(entry.cls)}</p>
            <p class="wheel-desc">${this.escapeHtml(entry.desc)}</p>
            <button class="wheel-begin" onclick="game.confirmWheelSelection()">⚔️ Choose ${this.escapeHtml(entry.name.split(' ')[0])}</button>`;

        this.maybePlayWheelClip(entry, detail);
    }

    // Lazily bring the focused hero to life with their combat clip. Bails on
    // reduced-motion or Save-Data, and waits ~350ms so spinning past a hero
    // never triggers a download.
    maybePlayWheelClip(entry, detail) {
        if (!entry.video) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const conn = navigator.connection;
        if (conn && (conn.saveData || /^(slow-)?2g$/.test(conn.effectiveType || ''))) return;

        this._wheelVideoTimer = setTimeout(() => {
            const media = detail.querySelector('.wheel-hero-media');
            if (!media || media.querySelector('video')) return;
            const video = document.createElement('video');
            video.className = 'wheel-hero-video';
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = 'auto';
            video.setAttribute('aria-hidden', 'true');
            video.addEventListener('canplay', () => {
                media.classList.add('has-video');
                video.play().catch(() => { /* poster remains */ });
            }, { once: true });
            video.addEventListener('error', () => video.remove(), { once: true });
            video.src = entry.video;
            media.appendChild(video);
        }, 350);
    }

    spinWheel(direction) {
        const n = this.getWheelEntries().length;
        this.wheelIndex = (this.wheelIndex + direction + n) % n;
        this.renderHeroWheel();
        this.playSound('click');
    }

    spinWheelTo(index) {
        const n = this.getWheelEntries().length;
        // Take the shortest rotation direction
        const diff = ((index - this.wheelIndex) % n + n) % n;
        this.wheelIndex = index;
        this.renderHeroWheel();
        this.playSound('click');
        return diff;
    }

    confirmWheelSelection() {
        const entry = this.getWheelEntries()[this.wheelIndex];
        if (!entry) return;

        if (entry.locked()) {
            this.showNotification(`🔒 ${entry.lockHint || 'This path is sealed.'}`);
            this.playSound('wrong');
            return;
        }

        if (entry.key === 'boss') {
            this.selectBoss();
        } else {
            this.selectCategory(entry.key);
        }
    }

    // ============ CATEGORY MANAGEMENT ============

    selectCategory(category) {
        this.currentCategory = category;
        this.selectedHero = null;

        // Get hero info for category
        let heroClass = '';
        let heroName = '';
        let heroPortrait = '';
        let allQuestions = [];

        switch (category) {
            case 'java':
                allQuestions = [...javaQuestions];
                heroClass = 'Barbarian Warrior';
                heroName = 'Grom the Uncompiled';
                heroPortrait = 'assets/heroes/hero-grom-portrait.png';
                break;
            case 'cpp':
                allQuestions = [...cppQuestions];
                heroClass = 'Dark Wizard';
                heroName = 'Malloc the Void-Walker';
                heroPortrait = 'assets/heroes/hero-malloc-portrait.png';
                break;
            case 'networking':
                allQuestions = [...networkingQuestions];
                heroClass = 'Knight Paladin';
                heroName = 'Ser Handshake';
                heroPortrait = 'assets/heroes/hero-handshake-portrait.png';
                break;
            case 'dataEngineering':
                allQuestions = [...dataEngineeringQuestions];
                heroClass = 'Knight Archer';
                heroName = 'Artemis the Stream-Caller';
                heroPortrait = 'assets/heroes/hero-artemis-portrait.png';
                break;
            case 'kernel':
                allQuestions = [...kernelQuestions];
                heroClass = 'Dragonoid Mercenary';
                heroName = 'Vulkun of Ring Zero';
                heroPortrait = 'assets/heroes/hero-vulkun-portrait.png';
                break;
            case 'marakathalessa':
                // Check if unlocked
                if (!this.isMarakathalessaUnlocked()) {
                    this.showNotification('🔒 Defeat the boss to unlock her story!');
                    return;
                }
                allQuestions = [...marakathalessaQuestions];
                heroClass = 'Corrupted Mage';
                heroName = 'Marakathalessa Redeemed';
                heroPortrait = 'assets/monsters/boss-marakathalessa-alt.png';
                break;
        }

        // Store hero info for later
        this.selectedHero = {
            category,
            heroClass,
            heroName,
            heroPortrait,
            allQuestions
        };

        // Show chapter selection UI
        this.showChapterSelect();
    }

    // ============ CHAPTER SYSTEM (Phase B) ============

    showChapterSelect() {
        // Hide hero selection, show chapter selection
        document.getElementById('category-select').classList.add('hidden');
        document.getElementById('chapter-select').classList.remove('hidden');

        // Update chapter hero name
        document.getElementById('chapter-hero-name').textContent =
            `${this.selectedHero.heroName}'s Journey`;

        // Get chapter progress for this hero
        const chapterProgress = this.userProfile.chapterProgress?.[this.currentCategory] ||
            { chapter1: false, chapter2: false, chapter3: false };

        // Count questions per chapter
        const ch1Count = this.selectedHero.allQuestions.filter(q => q.chapter === 1).length;
        const ch2Count = this.selectedHero.allQuestions.filter(q => q.chapter === 2).length;
        const ch3Count = this.selectedHero.allQuestions.filter(q => q.chapter === 3).length;

        // Update chapter counts
        document.getElementById('ch1-count').textContent = ch1Count;
        document.getElementById('ch2-count').textContent = ch2Count;
        document.getElementById('ch3-count').textContent = ch3Count;

        // Update chapter cards based on progress
        const card1 = document.getElementById('chapter-card-1');
        const card2 = document.getElementById('chapter-card-2');
        const card3 = document.getElementById('chapter-card-3');

        // Chapter 1 is always unlocked
        card1.classList.remove('locked', 'completed');
        if (chapterProgress.chapter1) {
            card1.classList.add('completed');
            document.getElementById('ch1-status').textContent = '✅ Completed';
        } else {
            document.getElementById('ch1-status').textContent = '🔓 Unlocked';
        }

        // Chapter 2 unlocks after Chapter 1
        card2.classList.remove('locked', 'completed');
        if (chapterProgress.chapter2) {
            card2.classList.add('completed');
            document.getElementById('ch2-status').textContent = '✅ Completed';
        } else if (chapterProgress.chapter1) {
            document.getElementById('ch2-status').textContent = '🔓 Unlocked';
        } else {
            card2.classList.add('locked');
            document.getElementById('ch2-status').textContent = '🔒 Complete Chapter I';
        }

        // Chapter 3 unlocks after Chapter 2
        card3.classList.remove('locked', 'completed');
        if (chapterProgress.chapter3) {
            card3.classList.add('completed');
            document.getElementById('ch3-status').textContent = '✅ Completed';
        } else if (chapterProgress.chapter2) {
            document.getElementById('ch3-status').textContent = '🔓 Unlocked';
        } else {
            card3.classList.add('locked');
            document.getElementById('ch3-status').textContent = '🔒 Complete Chapter II';
        }

        // Track event
        codeQuestDB.trackEvent('chapter_select_shown', { category: this.currentCategory });
    }

    selectChapter(chapterNum) {
        // Check if chapter is unlocked
        const chapterProgress = this.userProfile.chapterProgress?.[this.currentCategory] ||
            { chapter1: false, chapter2: false, chapter3: false };

        const isUnlocked =
            chapterNum === 1 ||
            (chapterNum === 2 && chapterProgress.chapter1) ||
            (chapterNum === 3 && chapterProgress.chapter2);

        if (!isUnlocked) {
            this.showNotification('🔒 Complete the previous chapter first!');
            return;
        }

        // Show character story before starting chapter (Phase E)
        this.showChapterStory(this.currentCategory, chapterNum);

        this.currentChapter = chapterNum;

        // Note: Actual chapter start happens in continueChapterStart() after story closes
    }

    backToHeroSelect() {
        document.getElementById('chapter-select').classList.add('hidden');
        document.getElementById('category-select').classList.remove('hidden');
        this.currentCategory = null;
        this.selectedHero = null;
        this.renderHeroWheel(); // refresh lock states
    }

    completeChapter() {
        if (!this.currentCategory || !this.currentChapter) return;

        // Mark chapter as complete
        if (!this.userProfile.chapterProgress) {
            this.userProfile.chapterProgress = {};
        }
        // Older profiles may be missing newer heroes (e.g. marakathalessa)
        if (!this.userProfile.chapterProgress[this.currentCategory]) {
            this.userProfile.chapterProgress[this.currentCategory] =
                { chapter1: false, chapter2: false, chapter3: false };
        }

        const chapterKey = `chapter${this.currentChapter}`;
        this.userProfile.chapterProgress[this.currentCategory][chapterKey] = true;
        codeQuestDB.saveUserProfile(this.userProfile);

        // Show completion notification
        const chapterNames = ['The Awakening', 'Rising Storm', 'The Reckoning'];
        this.showNotification(`📖 Chapter ${this.currentChapter}: ${chapterNames[this.currentChapter - 1]} Complete!`);

        // Track event
        codeQuestDB.trackEvent('chapter_completed', {
            category: this.currentCategory,
            chapter: this.currentChapter
        });
    }

    getCategoryDisplayName(category) {
        const names = {
            java: '🪓 Barbarian (Java)',
            cpp: '🔮 Wizard (C++)',
            networking: '🛡️ Paladin (Networking)',
            dataEngineering: '🏹 Archer (Data Eng)',
            kernel: '🐉 Mercenary (Kernel)'
        };
        return names[category] || category;
    }

    // ============ BOSS FIGHT SYSTEM (Phase C) ============

    isBossUnlocked() {
        const progress = this.userProfile.chapterProgress;
        if (!progress) return false;

        // Check if any hero has all 3 chapters complete
        for (const hero of Object.keys(progress)) {
            const cp = progress[hero];
            if (cp.chapter1 && cp.chapter2 && cp.chapter3) {
                return true;
            }
        }
        return false;
    }

    updateBossCardStatus() {
        const bossCard = document.getElementById('boss-card');
        if (!bossCard) return;

        if (this.isBossUnlocked()) {
            bossCard.classList.remove('locked');
            document.getElementById('boss-status').textContent = '⚔️ Challenge Available';
            document.getElementById('boss-lock-overlay').style.display = 'none';
        }
    }

    selectBoss() {
        if (!this.isBossUnlocked()) {
            this.showNotification('🔒 Complete all 3 chapters of any hero first!');
            return;
        }

        // Start boss fight
        this.isBossFighting = true;
        this.bossQuestions = [...bossQuestions];
        this.shuffleArray(this.bossQuestions);
        this.currentBossQuestionIndex = 0;
        this.bossHP = this.bossMaxHP;

        // Enter the fight with a full barrier - it is your health in this battle
        this.userProfile.barrierPoints = this.getMaxBarrierPoints();
        codeQuestDB.saveUserProfile(this.userProfile);

        // Hide hero select
        document.getElementById('category-select').classList.add('hidden');

        // Track event
        codeQuestDB.trackEvent('boss_fight_started', {});

        // Her descent plays as a cinematic; then the trial begins. Skips
        // instantly under reduced-motion or if the clip can't play.
        this.playCinematic('assets/video/boss-marakathalessa.mp4',
            'She descends. The Witch of Corrupted Code awaits...').then(() => {
            document.getElementById('boss-fight-area').classList.remove('hidden');
            this.showBossQuestion();
        });
    }

    // Full-screen video cinematic (boss entrance, etc.). Resolves when the
    // clip ends, is skipped, fails to load, or under reduced-motion - so it
    // never traps the player or blocks the flow that follows.
    playCinematic(src, caption) {
        return new Promise(resolve => {
            if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
                resolve();
                return;
            }
            const overlay = document.createElement('div');
            overlay.className = 'cinematic-overlay';
            overlay.innerHTML = `
                <video class="cinematic-video" muted playsinline preload="auto" aria-hidden="true"></video>
                <div class="cinematic-caption">${this.escapeHtml(caption || '')}</div>
                <button class="cinematic-skip" type="button">Skip ▸</button>`;
            document.body.appendChild(overlay);

            const video = overlay.querySelector('video');
            let finished = false;
            const guard = setTimeout(() => finishFade(), 12000);

            const finishInstant = () => {
                if (finished) return;
                finished = true;
                clearTimeout(guard);
                overlay.remove();
                resolve();
            };
            const finishFade = () => {
                if (finished) return;
                finished = true;
                clearTimeout(guard);
                overlay.classList.add('fade-out');
                setTimeout(() => { overlay.remove(); resolve(); }, 500);
            };

            overlay.querySelector('.cinematic-skip').addEventListener('click', finishFade);
            video.addEventListener('ended', finishFade, { once: true });
            video.addEventListener('error', finishInstant, { once: true });
            video.addEventListener('canplay', () => {
                requestAnimationFrame(() => overlay.classList.add('visible'));
                video.play().catch(finishInstant);
            }, { once: true });
            video.src = src;
        });
    }

    showBossQuestion() {
        // Victory: boss HP depleted
        if (this.bossHP <= 0) {
            this.defeatBoss();
            return;
        }

        // Out of barrier: Marakathalessa wins this round
        if ((this.userProfile.barrierPoints || 0) <= 0) {
            this.bossFightLost('barrier');
            return;
        }

        if (this.currentBossQuestionIndex >= this.bossQuestions.length) {
            // Ran out of challenges before breaking her HP - she escapes
            this.bossFightLost('survived');
            return;
        }

        this.currentBossQuestion = this.bossQuestions[this.currentBossQuestionIndex];
        this.currentHintIndex = 0;

        // Update question number
        document.getElementById('boss-question-number').textContent =
            `Challenge ${this.currentBossQuestionIndex + 1} of ${this.bossQuestions.length}`;

        // Update question text
        document.getElementById('boss-question-text').textContent = this.currentBossQuestion.question;

        // Update code block
        const codeBlock = document.getElementById('boss-code-block');
        if (this.currentBossQuestion.code) {
            codeBlock.classList.remove('hidden');
            document.getElementById('boss-code').textContent = this.currentBossQuestion.code;
        } else {
            codeBlock.classList.add('hidden');
        }

        // Clear input
        document.getElementById('code-answer').value = '';
        document.getElementById('code-answer').disabled = false;

        // Reset hints
        document.getElementById('current-hint').classList.add('hidden');
        document.getElementById('current-hint').textContent = '';
        document.getElementById('hints-remaining').textContent =
            `${this.currentBossQuestion.hints.length} hints remaining`;

        // Hide feedback and next button
        document.getElementById('boss-feedback').classList.add('hidden');
        document.getElementById('boss-next-btn').classList.add('hidden');

        // Update HP bar
        this.updateBossHPBar();
    }

    updateBossHPBar() {
        const hpPercent = Math.max(0, (this.bossHP / this.bossMaxHP) * 100);
        document.getElementById('boss-hp-bar').style.width = `${hpPercent}%`;
        document.getElementById('boss-hp-text').textContent = `${Math.max(0, this.bossHP)} / ${this.bossMaxHP}`;
    }

    // Normalize a typed answer for forgiving comparison:
    // lowercase, trimmed, collapsed whitespace (and a no-space variant)
    normalizeBossAnswer(text) {
        const collapsed = text.toLowerCase().trim().replace(/\s+/g, ' ');
        return [collapsed, collapsed.replace(/\s+/g, '')];
    }

    submitBossAnswer() {
        const rawAnswer = document.getElementById('code-answer').value;
        if (!rawAnswer.trim()) {
            this.showNotification('Please enter an answer');
            return;
        }

        // Check if answer is correct (case-insensitive, whitespace-tolerant)
        const [answer, answerNoSpaces] = this.normalizeBossAnswer(rawAnswer);
        const isCorrect = this.currentBossQuestion.acceptedAnswers.some(a => {
            const [accepted, acceptedNoSpaces] = this.normalizeBossAnswer(a);
            return accepted === answer || acceptedNoSpaces === answerNoSpaces;
        });

        // Disable input
        document.getElementById('code-answer').disabled = true;

        // Show feedback
        const feedback = document.getElementById('boss-feedback');
        const feedbackIcon = document.getElementById('boss-feedback-icon');
        const feedbackText = document.getElementById('boss-feedback-text');
        const explanation = document.getElementById('boss-explanation');

        feedback.classList.remove('hidden', 'correct', 'incorrect');

        if (isCorrect) {
            feedback.classList.add('correct');
            feedbackIcon.textContent = '✅';

            // Deal damage based on how few hints were used
            const baseDamage = 100;
            const damage = baseDamage + (30 * Math.max(0, 3 - this.currentHintIndex));
            this.bossHP -= damage;
            feedbackText.textContent = this.bossHP <= 0 ? 'FINAL BLOW!' : 'Critical Hit!';

            // Show damage notification
            this.showNotification(`⚔️ ${damage} damage dealt!`);
            this.playSound('correct');

            // Visual effects
            this.updateBossHPBar();

            // Track correct answer
            codeQuestDB.trackEvent('boss_answer_correct', {
                questionId: this.currentBossQuestion.id,
                hintsUsed: this.currentHintIndex,
                damage
            });
        } else {
            feedback.classList.add('incorrect');
            feedbackIcon.textContent = '❌';

            // Boss counterattacks - reduce barrier points
            if (this.userProfile.barrierPoints > 0) {
                this.userProfile.barrierPoints--;
                codeQuestDB.saveUserProfile(this.userProfile);
            }

            const barrierLeft = this.userProfile.barrierPoints || 0;
            feedbackText.textContent = barrierLeft > 0
                ? `Miss! Marakathalessa counterattacks! 🛡️ ${barrierLeft} barrier left`
                : 'Miss! Your barrier is destroyed!';
            this.playSound('wrong');

            // Track incorrect answer
            codeQuestDB.trackEvent('boss_answer_incorrect', {
                questionId: this.currentBossQuestion.id,
                userAnswer: answer
            });
        }

        explanation.textContent = this.currentBossQuestion.explanation;
        document.getElementById('boss-next-btn').classList.remove('hidden');
    }

    showBossHint() {
        const cost = 10;

        if (this.userProfile.gold < cost) {
            this.showNotification('💰 Not enough gold (need 10)');
            return;
        }

        if (this.currentHintIndex >= this.currentBossQuestion.hints.length) {
            this.showNotification('No more hints available');
            return;
        }

        // Deduct gold
        this.userProfile.gold -= cost;
        codeQuestDB.saveUserProfile(this.userProfile);

        // Show hint
        const hint = this.currentBossQuestion.hints[this.currentHintIndex++];
        const hintElement = document.getElementById('current-hint');
        hintElement.textContent = hint;
        hintElement.classList.remove('hidden');

        // Update hints remaining
        const remaining = this.currentBossQuestion.hints.length - this.currentHintIndex;
        document.getElementById('hints-remaining').textContent = `${remaining} hints remaining`;

        // Update gold display
        this.updateProfileUI();

        this.showNotification(`💡 Hint revealed! (-${cost} Gold)`);

        // Track event
        codeQuestDB.trackEvent('boss_hint_used', {
            questionId: this.currentBossQuestion.id,
            hintIndex: this.currentHintIndex
        });
    }

    nextBossQuestion() {
        this.currentBossQuestionIndex++;
        this.showBossQuestion();
    }

    defeatBoss() {
        this.isBossFighting = false;
        this.playSound('fanfare');

        // True ending requires every hero's story to be complete (Phase D)
        if (this.isAllHeroesComplete()) {
            this.userProfile.bossDefeated = 'true';
            codeQuestDB.saveUserProfile(this.userProfile);
            this.showTrueEnding();
        } else {
            this.userProfile.bossDefeated = this.userProfile.bossDefeated || 'incomplete';
            codeQuestDB.saveUserProfile(this.userProfile);
            this.showIncompleteEnding();
        }

        // Track event
        codeQuestDB.trackEvent('boss_defeated', {
            type: this.userProfile.bossDefeated
        });

        // A slain boss counts on the Monsters tab too - and is worth shouting about
        this.userProfile.monstersDefeated = (this.userProfile.monstersDefeated || 0) + 1;
        if (window.leaderboard) leaderboard.queueSubmit(this.userProfile);
    }

    bossFightLost(reason) {
        this.isBossFighting = false;
        this.playSound('defeat');

        document.getElementById('boss-fight-area').classList.add('hidden');
        document.getElementById('results-screen').classList.remove('hidden');

        document.querySelector('.results-icon').textContent = '💀';
        document.querySelector('.results-card h2').textContent =
            reason === 'barrier' ? 'Your Barrier Shattered!' : 'Marakathalessa Endures...';
        document.getElementById('final-score').textContent = 'Defeated';
        document.getElementById('questions-correct').textContent =
            `${this.bossMaxHP - Math.max(0, this.bossHP)} dmg`;
        document.getElementById('accuracy').textContent = 'Retry';

        this.showNotification(reason === 'barrier'
            ? '💀 Her counterattacks broke through! Train, stock up on gold for hints, and challenge her again.'
            : '🌩️ You survived her trials but her power remains. Strike harder — fewer hints deal more damage!');

        codeQuestDB.trackEvent('boss_fight_lost', {
            reason,
            damageDealt: this.bossMaxHP - Math.max(0, this.bossHP)
        });
    }

    isAllHeroesComplete() {
        const progress = this.userProfile.chapterProgress;
        if (!progress) return false;

        const heroes = ['java', 'cpp', 'networking', 'dataEngineering', 'kernel'];
        return heroes.every(hero => {
            const cp = progress[hero];
            return cp && cp.chapter1 && cp.chapter2 && cp.chapter3;
        });
    }

    showIncompleteEnding() {
        document.getElementById('boss-fight-area').classList.add('hidden');
        document.getElementById('results-screen').classList.remove('hidden');

        // Override results with boss defeat message
        document.querySelector('.results-icon').textContent = '⚔️';
        document.querySelector('.results-card h2').textContent = 'Boss Defeated... For Now';
        document.getElementById('final-score').textContent = 'Escaped';
        document.getElementById('questions-correct').textContent = '???';
        document.getElementById('accuracy').textContent = '???';

        // Show lore notification
        this.showNotification('📜 "I am but a pawn... The Legion of 404 awaits... Complete ALL heroes to find the truth!"');
    }

    showTrueEnding() {
        document.getElementById('boss-fight-area').classList.add('hidden');
        document.getElementById('results-screen').classList.remove('hidden');

        // Override results with true ending message
        document.querySelector('.results-icon').textContent = '👑';
        document.querySelector('.results-card h2').textContent = 'TRUE VICTORY!';
        document.getElementById('final-score').textContent = 'Champion';
        document.getElementById('questions-correct').textContent = '100%';
        document.getElementById('accuracy').textContent = 'MASTER';

        this.showNotification('🏆 You have defeated Marakathalessa and saved Meridaeia!');

        // Unlock Marakathalessa as playable character
        this.userProfile.marakathalessaUnlocked = true;
        codeQuestDB.saveUserProfile(this.userProfile);

        // Show Artemis/Vulkun reunion scene after a delay (Phase E)
        setTimeout(() => {
            this.showReunionScene();
        }, 3000);
    }

    abandonBossFight() {
        if (confirm('Retreat from the boss fight? Your progress will be lost.')) {
            this.isBossFighting = false;
            document.getElementById('boss-fight-area').classList.add('hidden');
            document.getElementById('category-select').classList.remove('hidden');
            this.showNotification('You retreated from the battle...');
        }
    }

    // ============ MARAKATHALESSA PLAYABLE (Phase D) ============

    isMarakathalessaUnlocked() {
        return this.userProfile.bossDefeated === 'true' || this.userProfile.marakathalessaUnlocked === true;
    }

    updateMaraCardStatus() {
        const maraCard = document.getElementById('mara-playable-card');
        if (!maraCard) return;

        if (this.isMarakathalessaUnlocked()) {
            maraCard.classList.remove('locked');
            document.getElementById('mara-status').textContent = '✨ Story Unlocked';
            document.getElementById('mara-lock-overlay').style.display = 'none';
        }
    }

    // ============ CHARACTER STORIES (Phase E) ============

    showChapterStory(category, chapterNum) {
        // Get story data - if none exists, start the chapter directly
        const story = typeof characterStories !== 'undefined' ? characterStories[category] : null;
        const storyText = story ? story[`chapter${chapterNum}Intro`] : null;

        if (!story || !storyText) {
            this.pendingChapterStart = false;
            this.currentChapter = chapterNum;
            this.continueChapterStart();
            return;
        }

        // Update modal content
        document.getElementById('story-hero-name').textContent = story.heroName;
        document.getElementById('story-hero-title').textContent = story.title;
        document.getElementById('story-text').textContent = storyText;

        // Portrait and chapter badge (modern story popup)
        const portrait = document.getElementById('story-hero-portrait');
        if (portrait) {
            const heroData = this.getHeroData(category);
            portrait.src = heroData.image;
            portrait.alt = story.heroName;
        }
        const badge = document.getElementById('story-chapter-badge');
        if (badge) {
            badge.textContent = ['Chapter I', 'Chapter II', 'Chapter III'][chapterNum - 1] || 'Chapter';
        }

        // Set hero-specific color
        const modal = document.getElementById('story-modal');
        modal.setAttribute('data-hero', category);
        modal.classList.remove('hidden');

        // Store that we need to continue after story
        this.pendingChapterStart = true;
    }

    closeStory() {
        document.getElementById('story-modal').classList.add('hidden');

        // If we were about to start a chapter, continue with it
        if (this.pendingChapterStart) {
            this.pendingChapterStart = false;
            this.continueChapterStart();
        }
    }

    continueChapterStart() {
        // This continues the chapter selection after story is closed
        // Filter questions for this chapter
        this.questions = this.selectedHero.allQuestions.filter(q => q.chapter === this.currentChapter);

        // Shuffle questions
        this.shuffleArray(this.questions);

        // Set up hero
        this.userProfile.characterClass = this.selectedHero.heroClass;
        this.userProfile.currentMonsterHP = 100;
        this.userProfile.storyProgress = (this.userProfile.storyProgress || 0) + 5;
        // Restore barrier to full at the start of every quest
        this.userProfile.barrierPoints = this.getMaxBarrierPoints();
        codeQuestDB.saveUserProfile(this.userProfile);

        // Reset game state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalAnswered = 0;
        this.isGameActive = true;
        this.currentMonsterHP = this.monsterMaxHP;
        this.currentMonsterName = null;
        this.goldEarned = 0;
        this.currentStreak = 0;
        this.playerDefeated = false;

        // Update hero name and portrait in the battle HUD
        const heroNameDisplay = document.getElementById('hero-name-display');
        if (heroNameDisplay) {
            const firstName = this.selectedHero.heroName.split(' ')[0];
            heroNameDisplay.textContent = firstName.toUpperCase();
        }
        const heroOrbImg = document.getElementById('hero-orb-img');
        if (heroOrbImg && this.selectedHero.heroPortrait) {
            heroOrbImg.src = this.selectedHero.heroPortrait;
        }
        this.updateHeroHPBar();

        // Track chapter selection
        codeQuestDB.trackEvent('chapter_selected', {
            category: this.currentCategory,
            chapter: this.currentChapter
        });

        // Show first question
        this.showQuestion();

        // Update UI
        const chapterSelect = document.getElementById('chapter-select');
        const gameArea = document.getElementById('game-area');
        const currentCategoryEl = document.getElementById('current-category');

        if (chapterSelect) chapterSelect.classList.add('hidden');
        if (gameArea) gameArea.classList.remove('hidden');
        if (currentCategoryEl) {
            currentCategoryEl.textContent =
                `${this.getCategoryDisplayName(this.currentCategory)} - Chapter ${this.currentChapter}`;
        }

        // Set initial environment based on story progress
        this.updateEnvironmentByProgress();

        // Update character sheet with selected hero
        this.updateCharacterSheet();
    }

    showReunionScene() {
        // Epic Artemis/Vulkun reunion after true ending
        const reunionText = storyConnections.reunion;

        document.getElementById('story-hero-name').textContent = "The Twins Reunited";
        document.getElementById('story-hero-title').textContent = "Elemari & Eke";
        document.getElementById('story-text').textContent = reunionText;

        const portrait = document.getElementById('story-hero-portrait');
        if (portrait) {
            portrait.src = 'assets/heroes/hero-artemis-portrait.png';
            portrait.alt = 'The Twins Reunited';
        }
        const badge = document.getElementById('story-chapter-badge');
        if (badge) badge.textContent = 'Finale';

        const modal = document.getElementById('story-modal');
        modal.setAttribute('data-hero', 'dataEngineering'); // Purple theme
        modal.classList.remove('hidden');
    }

    skipIntro() {
        const intro = document.getElementById('intro-cinematic');
        if (intro) {
            intro.style.opacity = '0';
            setTimeout(() => {
                intro.classList.add('hidden');
                codeQuestDB.trackEvent('intro_skipped', {});
            }, 2000);
        }
    }

    // ============ QUESTION DISPLAY ============

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
            return;
        }

        this.currentQuestion = this.questions[this.currentQuestionIndex];

        // Update question counter (Bookworm layout)
        const questionCounter = document.getElementById('question-counter');
        if (questionCounter) {
            questionCounter.textContent = `Q${this.currentQuestionIndex + 1}/${this.questions.length}`;
        }
        // Legacy fallback
        const questionNumber = document.getElementById('question-number');
        if (questionNumber) {
            questionNumber.textContent = `Q${this.currentQuestionIndex + 1}/${this.questions.length}`;
        }

        // Update difficulty badge
        const diffBadge = document.getElementById('difficulty-display') || document.getElementById('difficulty-badge');
        if (diffBadge) {
            diffBadge.textContent = this.currentQuestion.difficulty.toUpperCase();
            diffBadge.className = `difficulty-badge ${this.currentQuestion.difficulty}`;
        }

        // Update Monster HUD
        this.updateMonsterHUD();

        // Keep the same monster until it is defeated (identity persists across questions)
        if (!this.currentMonsterName) {
            this.currentMonsterName = this.getRandomMonsterName(this.currentQuestion.difficulty);
        }
        const monsterName = this.currentMonsterName;

        // Update monster name display (Bookworm layout)
        const monsterNameDisplay = document.getElementById('monster-name-display');
        if (monsterNameDisplay) {
            monsterNameDisplay.textContent = monsterName.toUpperCase();
        }
        // Legacy fallback
        const monsterNameLegacy = document.getElementById('monster-name');
        if (monsterNameLegacy) {
            monsterNameLegacy.textContent = monsterName;
        }

        // Update monster portrait orb (Bookworm layout)
        const monsterOrbImg = document.getElementById('monster-orb-img');
        if (monsterOrbImg && this.monsterPortraits[monsterName]) {
            monsterOrbImg.src = this.monsterPortraits[monsterName];
        }
        // Legacy fallback
        const monsterPortrait = document.getElementById('monster-portrait');
        if (monsterPortrait && this.monsterPortraits[monsterName]) {
            monsterPortrait.src = this.monsterPortraits[monsterName];
        }

        const monsterType = document.getElementById('monster-type');
        if (monsterType) {
            monsterType.textContent = this.currentQuestion.difficulty.toUpperCase();
            monsterType.className = `monster-type ${this.currentQuestion.difficulty}`;
        }

        // Update question text
        document.getElementById('question-text').textContent = this.currentQuestion.question;

        // Update code block (Bookworm uses expandable details element)
        const codeBlockContainer = document.getElementById('code-block-container');
        const codeBlockLegacy = document.getElementById('code-block');

        if (this.currentQuestion.code) {
            document.getElementById('code-content').textContent = this.currentQuestion.code;
            if (codeBlockContainer) {
                codeBlockContainer.style.display = 'block';
                // Code is essential to answering - show it expanded by default
                codeBlockContainer.open = true;
            }
            if (codeBlockLegacy) {
                codeBlockLegacy.classList.remove('hidden');
            }
        } else {
            if (codeBlockContainer) {
                codeBlockContainer.style.display = 'none';
            }
            if (codeBlockLegacy) {
                codeBlockLegacy.classList.add('hidden');
            }
        }

        // Shuffle answer options each time so replays can't be memorized by letter
        const shuffledOptions = this.currentQuestion.options.map((text, originalIndex) => ({
            text,
            isCorrect: originalIndex === this.currentQuestion.correctAnswer
        }));
        this.shuffleArray(shuffledOptions);
        this.currentCorrectIndex = shuffledOptions.findIndex(o => o.isCorrect);

        // Generate poker-style card hand answers
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        // Check if we're using Bookworm layout (card-hand class)
        const isCardHand = optionsContainer.classList.contains('card-hand');

        shuffledOptions.forEach((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-label', `Answer ${letter}: ${option.text}`);

            if (isCardHand) {
                // Poker-style answer card (text always visible for touch/screen-reader users)
                button.className = 'answer-card';
                button.innerHTML = `
                <span class="card-letter">${letter}</span>
                <span class="card-answer-text">${this.escapeHtml(option.text)}</span>
            `;
            } else {
                // Legacy button style
                button.className = 'option-btn';
                button.innerHTML = `<span class="option-letter">${letter}</span><span class="option-text">${this.escapeHtml(option.text)}</span>`;
            }
            button.onclick = () => this.selectAnswer(index);
            optionsContainer.appendChild(button);
        });

        // Hide feedback
        document.getElementById('feedback-container').classList.add('hidden');
        document.getElementById('next-btn').classList.add('hidden');

        // Start timer
        this.startTimer();
    }
    // ============ TIMER ============

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        // Calculate total timer with bonuses
        let timerDuration = 60; // Base 60 seconds

        // Add accessory bonus
        if (this.userProfile.equipped?.accessories?.stats?.timerBonus) {
            timerDuration += this.userProfile.equipped.accessories.stats.timerBonus;
        }

        // Add skill bonuses
        timerDuration += this.getSkillBonus('timerBonus');

        this.timeLeft = timerDuration;
        this.timerDuration = timerDuration;
        this.updateTimerUI();

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();

            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimerUI() {
        const timerEl = document.getElementById('timer');
        timerEl.textContent = `⏱️ ${this.timeLeft}`;

        // Change color based on time
        if (this.timeLeft <= 10) {
            timerEl.classList.add('urgent');
        } else {
            timerEl.classList.remove('urgent');
        }

        // Update progress ring (if exists in old layout)
        const timerProgress = document.getElementById('timer-progress');
        if (timerProgress) {
            const progress = (this.timeLeft / (this.timerDuration || 60)) * 100;
            timerProgress.style.background =
                `conic-gradient(var(--accent) ${progress}%, transparent ${progress}%)`;
        }
    }

    // Use a hint - costs gold, eliminates one wrong answer
    useHint() {
        const hintCost = 10;

        if ((this.userProfile.gold || 0) < hintCost) {
            this.showNotification('💰 Not enough gold for a hint! (need 10)');
            return;
        }

        // Get all option buttons or answer cards
        const optionBtns = document.querySelectorAll('.option-btn');
        const answerCards = document.querySelectorAll('.answer-card');
        const options = optionBtns.length > 0 ? optionBtns : answerCards;

        if (!options.length || !this.currentQuestion) return;

        // Find wrong answers that haven't been eliminated yet
        const wrongOptions = [...options].filter((el, idx) =>
            idx !== this.currentCorrectIndex && !el.disabled && !el.classList.contains('disabled')
        );

        // Always leave at least one wrong answer so hints can't fully solve it
        if (wrongOptions.length <= 1) {
            this.showNotification('No more hints available for this question!');
            return;
        }

        // Eliminate one random wrong answer
        const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        randomWrong.disabled = true;
        randomWrong.classList.add('disabled');
        randomWrong.style.opacity = '0.3';

        // Deduct gold
        this.userProfile.gold = (this.userProfile.gold || 0) - hintCost;
        codeQuestDB.saveUserProfile(this.userProfile);
        this.updateMonsterHUD();
        this.showNotification(`💡 Used hint (-${hintCost} Gold)`);
    }

    timeUp() {
        clearInterval(this.timerInterval);

        // Disable remaining options and reveal the correct answer
        document.querySelectorAll('.option-btn, .answer-card').forEach((el, i) => {
            el.disabled = true;
            el.classList.add('disabled');
            if (i === this.currentCorrectIndex) el.classList.add('correct');
        });

        this.totalAnswered++;

        // Running out of time hurts like a wrong answer
        if (this.userProfile.barrierPoints > 0) {
            this.userProfile.barrierPoints--;
            this.showBarrierDamage();
            this.updateCharacterSheet();
        }
        if (this.userProfile.barrierPoints <= 0) {
            this.playerDefeated = true;
        }

        this.userProfile.totalQuestionsAnswered++;
        this.updateHeroHPBar();
        codeQuestDB.saveUserProfile(this.userProfile);

        this.showFeedback(false, -1);
    }

    // ============ ANSWER HANDLING ============

    selectAnswer(index) {
        if (!this.isGameActive || !this.currentQuestion) return;
        clearInterval(this.timerInterval);

        const isCorrect = index === this.currentCorrectIndex;

        // Handle both legacy buttons and new poker-style cards
        const optionButtons = document.querySelectorAll('.option-btn');
        const answerCards = document.querySelectorAll('.answer-card');

        // Disable legacy option buttons
        optionButtons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === this.currentCorrectIndex) {
                btn.classList.add('correct');
            } else if (i === index && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Disable poker-style answer cards
        answerCards.forEach((card, i) => {
            card.disabled = true;
            card.classList.add('disabled');
            if (i === this.currentCorrectIndex) {
                card.classList.add('correct');
            } else if (i === index && !isCorrect) {
                card.classList.add('incorrect');
            }
        });

        this.totalAnswered++;

        let xpGained = 0;
        if (isCorrect) {
            this.correctAnswers++;

            // calculateXP() already applies accessory and skill multipliers
            xpGained = this.calculateXP();

            // Streak bonus: +10% XP per consecutive correct answer beyond the first (max +50%)
            const streakBonus = Math.min(this.currentStreak, 5) * 0.1;
            xpGained = Math.floor(xpGained * (1 + streakBonus));

            this.score += xpGained;
            this.userProfile.xp += xpGained;
            this.userProfile.correctAnswers++;

            // Combat damage (25 HP per correct answer)
            const damage = this.calculateAttackDamage();
            this.currentMonsterHP -= damage;

            // Calculate gold with multipliers
            let goldEarned = 5;

            // Apply gold multiplier from accessory
            if (this.userProfile.equipped?.accessories?.stats?.goldMultiplier) {
                goldEarned *= this.userProfile.equipped.accessories.stats.goldMultiplier;
            }

            // Apply skill bonuses
            const skillMultiplier = 1 + this.getSkillBonus('goldMultiplier');
            goldEarned *= skillMultiplier;

            this.goldEarned += Math.floor(goldEarned);

            // Visual feedback: damage number
            this.showDamageNumber(damage);

            // Visual feedback: screen shake
            document.querySelector('.app-container').classList.add('screen-shake');
            setTimeout(() => {
                document.querySelector('.app-container').classList.remove('screen-shake');
            }, 500);

            // Visual feedback: HP bar shake
            const hpBar = document.getElementById('hp-bar') || document.getElementById('monster-hp-fill');
            if (hpBar) {
                hpBar.classList.add('hp-bar-hit');
                setTimeout(() => hpBar.classList.remove('hp-bar-hit'), 300);
            }

            // Visual feedback: gold coin
            this.showGoldCoin();

            this.updateMonsterHUD();

            // Monster defeated?
            if (this.currentMonsterHP <= 0) {
                this.monsterDefeated();
            }

            // Check for level up
            this.checkLevelUp();
        } else {
            // Wrong answer: the monster strikes back at your barrier
            if (this.userProfile.barrierPoints > 0) {
                this.userProfile.barrierPoints--;
                this.showBarrierDamage();
                this.updateCharacterSheet();
                this.playAttackAnimation('monster');
            }

            // Out of barrier points - the hero falls
            if (this.userProfile.barrierPoints <= 0) {
                this.playerDefeated = true;
            }
        }

        this.userProfile.totalQuestionsAnswered++;
        this.updateHeroHPBar();

        // Save progress
        codeQuestDB.saveProgress({
            category: this.currentCategory,
            questionId: this.currentQuestion.id,
            isCorrect: isCorrect,
            timeRemaining: this.timeLeft,
            xpGained
        });

        // Update profile in DB
        codeQuestDB.saveUserProfile(this.userProfile);

        // Track event
        codeQuestDB.trackEvent('question_answered', {
            questionId: this.currentQuestion.id,
            category: this.currentCategory,
            isCorrect,
            timeRemaining: this.timeLeft
        });

        this.showFeedback(isCorrect, index, xpGained);
        this.updateProfileUI();
    }

    calculateXP() {
        const baseXP = this.xpMultipliers[this.currentQuestion.difficulty] || this.xpMultipliers.medium;
        const timeBonus = Math.floor((this.timeLeft / (this.timerDuration || 60)) * this.maxTimeBonus);
        let totalXP = baseXP + timeBonus;

        // Apply XP multiplier from accessory
        if (this.userProfile.equipped?.accessories?.stats?.xpMultiplier) {
            totalXP *= this.userProfile.equipped.accessories.stats.xpMultiplier;
        }

        // Apply skill bonuses
        const skillMultiplier = 1 + this.getSkillBonus('xpMultiplier');
        totalXP *= skillMultiplier;

        return Math.floor(totalXP);
    }

    checkLevelUp() {
        let leveledUp = false;
        while (this.userProfile.xp >= this.userProfile.level * 100) {
            this.userProfile.level++;
            leveledUp = true;
        }

        if (leveledUp) {
            this.showLevelUpNotification();
            this.playSound('levelup');

            // Track level up
            codeQuestDB.trackEvent('level_up', { newLevel: this.userProfile.level });
        }
    }

    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <span class="level-up-icon">🎉</span>
                <span class="level-up-text">Level Up!</span>
                <span class="new-level">Level ${this.userProfile.level}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    // ============ COMBAT SYSTEM (Phase 2) ============

    getRandomMonsterName(difficulty) {
        const pool = this.monsterNames[difficulty] || this.monsterNames.easy;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    updateMonsterHUD() {
        const hp = Math.max(0, this.currentMonsterHP);
        const hpPercent = (hp / this.monsterMaxHP) * 100;

        // Update monster HP bar - support both legacy and Bookworm layouts
        const legacyHpBar = document.getElementById('hp-bar');
        const monsterHpFill = document.getElementById('monster-hp-fill');

        if (legacyHpBar) legacyHpBar.style.width = `${hpPercent}%`;
        if (monsterHpFill) monsterHpFill.style.width = `${hpPercent}%`;

        // Update hero stats in battle arena
        const heroGold = document.getElementById('hero-gold');
        const heroBarrier = document.getElementById('hero-barrier');
        const charGold = document.getElementById('char-gold');
        const charBarrier = document.getElementById('char-barrier');

        if (heroGold) heroGold.textContent = this.userProfile.gold || 0;
        if (heroBarrier) heroBarrier.textContent = this.userProfile.barrierPoints || 3;
        if (charGold) charGold.textContent = this.userProfile.gold || 0;
        if (charBarrier) charBarrier.textContent = this.userProfile.barrierPoints || 3;

        // Keep the dashboard gold chip in sync during battle
        const headerGold = document.getElementById('header-gold');
        if (headerGold) headerGold.textContent = this.userProfile.gold || 0;
    }

    monsterDefeated() {
        // Roll the loot table - the variable-reward moment of the kill
        const loot = this.rollLoot();

        // Banked per-answer gold + the loot drop
        this.userProfile.gold = (this.userProfile.gold || 0) + this.goldEarned + loot.gold;

        // Lifetime kill counter feeds the global leaderboard's Monsters tab
        this.userProfile.monstersDefeated = (this.userProfile.monstersDefeated || 0) + 1;
        if (window.leaderboard) leaderboard.queueSubmit(this.userProfile);

        // Increment story progress and update environment
        this.userProfile.storyProgress = (this.userProfile.storyProgress || 0) + 20;
        this.updateEnvironmentByProgress();

        // Reset monster HP and spawn a new monster on the next question
        this.currentMonsterHP = this.monsterMaxHP;
        const slainName = this.currentMonsterName;
        this.currentMonsterName = null;

        // Kill notification, then the loot reveal lands a beat later
        this.showNotification(`🗡️ ${slainName || 'Monster'} Slain!`);
        this.playSound('victory');
        setTimeout(() => this.showLootDrop(loot), 650);

        // Track event
        codeQuestDB.trackEvent('monster_defeated', {
            goldEarned: this.goldEarned,
            lootRarity: loot.rarity,
            lootGold: loot.gold
        });

        // Save and reset
        codeQuestDB.saveUserProfile(this.userProfile);
        this.goldEarned = 0;
        this.updateMonsterHUD();
    }

    // Environment Management
    setEnvironment(envName) {
        const gameArea = document.getElementById('game-area');
        const environments = ['wasteland', 'forest', 'mountains', 'lakes', 'gates'];

        // Remove all environment classes
        environments.forEach(env => {
            gameArea.classList.remove(`env-${env}`);
        });

        // Add new environment class
        if (envName && environments.includes(envName)) {
            gameArea.classList.add(`env-${envName}`);
        }
    }

    updateEnvironmentByProgress() {
        const progress = this.userProfile.storyProgress || 0;

        // Environment progression based on story progress
        if (progress >= 400) {
            this.setEnvironment('gates');
        } else if (progress >= 300) {
            this.setEnvironment('lakes');
        } else if (progress >= 200) {
            this.setEnvironment('mountains');
        } else if (progress >= 100) {
            this.setEnvironment('forest');
        } else {
            this.setEnvironment('wasteland');
        }
    }

    showFeedback(isCorrect, selectedIndex, xpGained = 0) {
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackText = document.getElementById('feedback-text');
        const explanation = document.getElementById('explanation');
        const virtueFeedback = document.getElementById('virtue-feedback');

        feedbackContainer.classList.remove('hidden');

        // Get virtue message based on result
        let virtueMsg = '';
        if (selectedIndex === -1) {
            feedbackIcon.textContent = '⏰';
            feedbackText.textContent = 'Time\'s Up!';
            feedbackText.className = 'feedback-title-big incorrect';
            feedbackContainer.classList.remove('correct');
            feedbackContainer.classList.add('incorrect');
            this.currentStreak = 0;
            virtueMsg = this.getRandomVirtueMessage('incorrect');
            this.playSound('wrong');
        } else if (isCorrect) {
            feedbackIcon.textContent = '✅';
            this.currentStreak++;
            const streakLabel = this.currentStreak >= 2 ? ` 🔥x${this.currentStreak}` : '';
            feedbackText.textContent = `Correct! +${xpGained} XP${streakLabel}`;
            feedbackText.className = 'feedback-title-big correct';
            feedbackContainer.classList.remove('incorrect');
            feedbackContainer.classList.add('correct');

            // Special streak message for 3+ correct in a row
            if (this.currentStreak >= 3) {
                virtueMsg = this.getRandomVirtueMessage('streak');
            } else {
                virtueMsg = this.getRandomVirtueMessage('correct');
            }

            // Trigger hero attack animation
            this.playAttackAnimation('hero');
            this.playSound('correct');
        } else {
            feedbackIcon.textContent = this.playerDefeated ? '💀' : '❌';
            feedbackText.textContent = this.playerDefeated ? 'Your barrier has shattered!' : 'Incorrect';
            feedbackText.className = 'feedback-title-big incorrect';
            feedbackContainer.classList.remove('correct');
            feedbackContainer.classList.add('incorrect');
            this.currentStreak = 0;
            virtueMsg = this.getRandomVirtueMessage('incorrect');

            // Hero takes the hit at the monster's moment of impact
            setTimeout(() => this.playHurtAnimation('hero'), 180);
            this.playSound('wrong');
        }

        // Display virtue message (Biblical values integration)
        if (virtueFeedback) {
            virtueFeedback.textContent = virtueMsg;
            virtueFeedback.style.display = virtueMsg ? 'block' : 'none';
        }

        explanation.textContent = this.currentQuestion.explanation;
        const nextBtn = document.getElementById('next-btn');
        nextBtn.classList.remove('hidden');
        // Focus the continue button so Enter/Space work immediately
        // and screen readers land on the next action
        nextBtn.focus();
    }

    // Get random virtue message for biblical values integration
    getRandomVirtueMessage(type) {
        const messages = this.virtueMessages[type] || this.virtueMessages.correct;
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Play attack animation: 3D lunge on the battle portrait orb.
    // Hero (left side) lunges right; monster (right side) mirrors.
    playAttackAnimation(who) {
        const orb = document.getElementById(
            who === 'hero' ? 'hero-portrait-orb' : 'monster-portrait-orb'
        );
        if (orb) {
            const lungeClass = who === 'hero' ? 'orb-attack-right' : 'orb-attack-left';
            orb.classList.remove('orb-attack-right', 'orb-attack-left', 'orb-hurt');
            void orb.offsetWidth; // restart animation if re-triggered quickly
            orb.classList.add(lungeClass);
            setTimeout(() => orb.classList.remove(lungeClass), 550);
        }

        // Legacy sprite layout fallback
        const spriteContainer = document.getElementById(
            who === 'hero' ? 'hero-sprite-container' : 'monster-sprite-container'
        );
        if (spriteContainer) {
            spriteContainer.classList.add('attacking');
            setTimeout(() => spriteContainer.classList.remove('attacking'), 400);
        }
    }

    // Play hurt animation: recoil shake + impact flash on the orb
    playHurtAnimation(who) {
        const orb = document.getElementById(
            who === 'hero' ? 'hero-portrait-orb' : 'monster-portrait-orb'
        );
        if (orb) {
            orb.classList.remove('orb-attack-right', 'orb-attack-left', 'orb-hurt');
            void orb.offsetWidth;
            orb.classList.add('orb-hurt');
            setTimeout(() => orb.classList.remove('orb-hurt'), 500);
        }

        // Legacy sprite layout fallback
        const spriteContainer = document.getElementById(
            who === 'hero' ? 'hero-sprite-container' : 'monster-sprite-container'
        );
        if (spriteContainer) {
            spriteContainer.classList.add('hurt');
            setTimeout(() => spriteContainer.classList.remove('hurt'), 300);
        }
    }

    nextQuestion() {
        if (this.playerDefeated) {
            this.endGame(true);
            return;
        }
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    // ============ GAME STATE ============

    endGame(defeated = false) {
        this.isGameActive = false;
        clearInterval(this.timerInterval);

        document.getElementById('game-area').classList.add('hidden');
        document.getElementById('results-screen').classList.remove('hidden');

        const accuracy = this.totalAnswered > 0
            ? Math.round((this.correctAnswers / this.totalAnswered) * 100)
            : 0;

        // Results header changes based on victory or defeat
        const resultsIcon = document.querySelector('.results-icon');
        const resultsTitle = document.querySelector('.results-card h2');
        if (defeated) {
            if (resultsIcon) resultsIcon.textContent = '💀';
            if (resultsTitle) resultsTitle.textContent = 'Your Barrier Shattered...';
            this.playSound('defeat');
        } else {
            if (resultsIcon) resultsIcon.textContent = '🏆';
            if (resultsTitle) resultsTitle.textContent = 'Quest Complete!';
            this.playSound('fanfare');
        }

        this.countUp(document.getElementById('final-score'), this.score);
        document.getElementById('questions-correct').textContent =
            `${this.correctAnswers} / ${this.totalAnswered}`;
        this.countUp(document.getElementById('accuracy'), accuracy, '%');

        // Credit any gold earned that wasn't banked by a monster kill
        if (this.goldEarned > 0) {
            this.userProfile.gold = (this.userProfile.gold || 0) + this.goldEarned;
            this.goldEarned = 0;
        }

        // Update category progress (create the entry if this category is new, e.g. marakathalessa)
        if (!this.userProfile.categoryProgress[this.currentCategory]) {
            this.userProfile.categoryProgress[this.currentCategory] = { completed: 0, correct: 0 };
        }
        const catProgress = this.userProfile.categoryProgress[this.currentCategory];
        catProgress.completed += this.totalAnswered;
        catProgress.correct += this.correctAnswers;
        codeQuestDB.saveUserProfile(this.userProfile);

        // A finished run is the canonical moment to sync the global leaderboard
        if (window.leaderboard) leaderboard.queueSubmit(this.userProfile);

        // Phase B: Mark chapter as complete if the player survived with at least 50% accuracy
        if (!defeated && accuracy >= 50 && this.currentChapter) {
            this.completeChapter();
        } else if (defeated) {
            this.showNotification('💀 Defeated! Regroup and try the chapter again.');
        } else if (this.currentChapter) {
            this.showNotification('📖 You need at least 50% accuracy to complete the chapter. Try again!');
        }

        // Track game completion
        codeQuestDB.trackEvent('game_completed', {
            category: this.currentCategory,
            chapter: this.currentChapter,
            score: this.score,
            correct: this.correctAnswers,
            total: this.totalAnswered,
            accuracy,
            defeated
        });

        // Check achievements
        this.checkAchievements();
    }

    playAgain() {
        document.getElementById('results-screen').classList.add('hidden');
        // Return to chapter selection for same hero
        if (this.selectedHero) {
            this.showChapterSelect();
        } else {
            document.getElementById('category-select').classList.remove('hidden');
        }
    }

    backToMenu() {
        this.isGameActive = false;
        clearInterval(this.timerInterval);
        document.getElementById('game-area').classList.add('hidden');
        document.getElementById('results-screen').classList.add('hidden');
        document.getElementById('chapter-select').classList.add('hidden');
        document.getElementById('category-select').classList.remove('hidden');
        this.currentCategory = null;
        this.currentChapter = null;
        this.selectedHero = null;
        this.renderHeroWheel(); // refresh lock states
    }

    // ============ ACHIEVEMENTS ============

    async checkAchievements() {
        const newAchievements = [];

        // First Question
        if (this.userProfile.totalQuestionsAnswered >= 1 &&
            !this.hasAchievement('first_question')) {
            newAchievements.push({
                id: 'first_question',
                name: 'First Steps',
                description: 'Answer your first question',
                icon: '🎯'
            });
        }

        // Perfect Round
        if (this.correctAnswers === this.totalAnswered && this.totalAnswered >= 5 &&
            !this.hasAchievement('perfect_round')) {
            newAchievements.push({
                id: 'perfect_round',
                name: 'Perfect!',
                description: 'Get all questions correct in a round',
                icon: '⭐'
            });
        }

        // Level 5
        if (this.userProfile.level >= 5 && !this.hasAchievement('level_5')) {
            newAchievements.push({
                id: 'level_5',
                name: 'Getting Good',
                description: 'Reach Level 5',
                icon: '📈'
            });
        }

        // 50 Questions
        if (this.userProfile.totalQuestionsAnswered >= 50 &&
            !this.hasAchievement('questions_50')) {
            newAchievements.push({
                id: 'questions_50',
                name: 'Dedicated Learner',
                description: 'Answer 50 questions',
                icon: '📚'
            });
        }

        // Unlock and display achievements
        for (const achievement of newAchievements) {
            await codeQuestDB.unlockAchievement(achievement.id, achievement);
            this.achievements.push(achievement);
            this.showAchievementUnlock(achievement);
        }
    }

    hasAchievement(id) {
        return this.achievements.some(a => a.id === id);
    }

    showAchievementUnlock(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-info">
                    <span class="achievement-label">Achievement Unlocked!</span>
                    <span class="achievement-name">${achievement.name}</span>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 4000);
    }

    // ============ CHECKPOINTS ============

    async saveCheckpoint() {
        const name = prompt('Name your checkpoint:') || `Checkpoint ${Date.now()}`;

        const gameState = {
            userProfile: this.userProfile,
            currentCategory: this.currentCategory,
            score: this.score,
            correctAnswers: this.correctAnswers,
            totalAnswered: this.totalAnswered
        };

        await codeQuestDB.createCheckpoint(name, gameState);

        // Track event
        await codeQuestDB.trackEvent('checkpoint_created', { name });

        this.showNotification('💾 Checkpoint saved!');
    }

    async loadCheckpoints() {
        const checkpoints = await codeQuestDB.getAllCheckpoints();

        const modal = document.getElementById('checkpoints-modal');
        const list = document.getElementById('checkpoints-list');

        list.innerHTML = '';

        if (checkpoints.length === 0) {
            list.innerHTML = '<p class="no-checkpoints">No checkpoints saved yet.</p>';
        } else {
            checkpoints.reverse().forEach(cp => {
                const item = document.createElement('div');
                item.className = 'checkpoint-item';
                item.innerHTML = `
                    <div class="checkpoint-info">
                        <span class="checkpoint-name">${cp.name}</span>
                        <span class="checkpoint-date">${new Date(cp.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="checkpoint-actions">
                        <button onclick="game.restoreCheckpoint(${cp.id})" class="btn-small">Load</button>
                        <button onclick="game.deleteCheckpoint(${cp.id})" class="btn-small btn-danger">Delete</button>
                    </div>
                `;
                list.appendChild(item);
            });
        }

        modal.classList.remove('hidden');
    }

    async restoreCheckpoint(id) {
        const checkpoint = await codeQuestDB.loadCheckpoint(id);
        if (checkpoint) {
            const gameState = JSON.parse(checkpoint.gameState);

            this.userProfile = gameState.userProfile;
            await codeQuestDB.saveUserProfile(this.userProfile);

            this.updateProfileUI();
            this.closeModal('checkpoints-modal');
            this.showNotification('✅ Checkpoint restored!');

            // Track event
            await codeQuestDB.trackEvent('checkpoint_restored', { checkpointId: id });
        }
    }

    async deleteCheckpoint(id) {
        if (confirm('Delete this checkpoint?')) {
            await codeQuestDB.deleteCheckpoint(id);
            this.loadCheckpoints(); // Refresh list
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // ============ DATA EXPORT/IMPORT ============

    async exportData() {
        const data = await codeQuestDB.exportAllData();

        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `codequest-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('📦 Data exported!');
    }

    async importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            const text = await file.text();
            await codeQuestDB.importData(text);

            // Reload profile
            this.userProfile = await codeQuestDB.getUserProfile();
            this.updateProfileUI();

            this.showNotification('📥 Data imported!');
        };

        input.click();
    }

    // ============ ANALYTICS ============

    async showAnalytics() {
        const summary = await codeQuestDB.getAnalyticsSummary();
        const progress = await codeQuestDB.getAllProgress();

        const modal = document.getElementById('analytics-modal');
        const content = document.getElementById('analytics-content');

        // Calculate category stats
        const categoryStats = {};
        progress.forEach(p => {
            if (!categoryStats[p.category]) {
                categoryStats[p.category] = { total: 0, correct: 0 };
            }
            categoryStats[p.category].total++;
            if (p.isCorrect) categoryStats[p.category].correct++;
        });

        content.innerHTML = `
            <div class="analytics-section">
                <h4>📊 Session Overview</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${summary.totalEvents}</span>
                        <span class="stat-label">Total Events</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${progress.length}</span>
                        <span class="stat-label">Questions Answered</span>
                    </div>
                </div>
            </div>
            
            <div class="analytics-section">
                <h4>📈 Category Performance</h4>
                ${Object.entries(categoryStats).map(([cat, stats]) => `
                    <div class="category-stat">
                        <span class="cat-name">${this.getCategoryDisplayName(cat)}</span>
                        <div class="cat-bar">
                            <div class="cat-fill" style="width: ${(stats.correct / stats.total) * 100}%"></div>
                        </div>
                        <span class="cat-percent">${Math.round((stats.correct / stats.total) * 100)}%</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="analytics-section">
                <h4>🗓️ Activity by Event Type</h4>
                <div class="event-types">
                    ${Object.entries(summary.eventsByType).map(([type, count]) => `
                        <div class="event-type">
                            <span>${type.replace('_', ' ')}</span>
                            <span class="event-count">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    // ============ UI HELPERS ============

    updateProfileUI() {
        if (!this.userProfile) return;

        document.getElementById('username').textContent = this.userProfile.username;
        document.getElementById('level').textContent = this.userProfile.level;
        document.getElementById('total-xp').textContent = this.userProfile.xp;

        const headerGold = document.getElementById('header-gold');
        if (headerGold) headerGold.textContent = this.userProfile.gold || 0;

        // XP progress within the current level
        // (level N is reached at (N-1)*100 XP, next level at N*100 XP)
        const prevThreshold = (this.userProfile.level - 1) * 100;
        const nextThreshold = this.userProfile.level * 100;
        const progress = Math.max(0, Math.min(100,
            ((this.userProfile.xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100
        ));
        document.getElementById('xp-progress').style.width = `${progress}%`;

        // XP ring around the dashboard avatar
        const avatar = document.getElementById('profile-avatar');
        if (avatar) avatar.style.setProperty('--xp-ring', `${progress}%`);
    }

    // Hero HP bar reflects barrier points (visible defeat pressure)
    updateHeroHPBar() {
        const max = this.getMaxBarrierPoints();
        const current = Math.max(0, this.userProfile.barrierPoints || 0);

        const heroHpFill = document.getElementById('hero-hp-fill');
        if (heroHpFill) {
            heroHpFill.style.width = `${Math.min(100, (current / max) * 100)}%`;
        }

        // Dungeon pressure: darkness closes in as the barrier fails.
        // danger 0 = safe, 1 = wounded, 2 = one hit from death
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            const danger = current <= 0 ? 2 : (current === 1 ? 2 : (current / max <= 0.5 ? 1 : 0));
            gameArea.setAttribute('data-danger', danger);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Retro sound effects (delegated to gameSFX, no-op if audio unavailable)
    playSound(name) {
        if (window.gameSFX) window.gameSFX.play(name);
    }

    // Animated number count-up for results (instant under reduced motion)
    countUp(el, target, suffix = '') {
        if (!el) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches || target <= 0) {
            el.textContent = `${target}${suffix}`;
            return;
        }
        const t0 = performance.now();
        const duration = 900;
        const tick = (now) => {
            const p = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = `${Math.round(target * eased)}${suffix}`;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'toast-notification';
        notification.setAttribute('role', 'status');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // ============ RESET ============

    async resetProgress() {
        if (confirm('⚠️ This will delete ALL your progress. Are you sure?')) {
            await codeQuestDB.clearAllData();
            const username = await this.askUsername();
            this.userProfile = await codeQuestDB.initializeNewUser(username);
            this.achievements = [];
            this.updateProfileUI();
            this.showNotification('🔄 Progress reset!');
        }
    }

    // Welcome modal replaces the old blocking prompt() popup.
    // Resolves with a sanitized hero name; falls back to prompt()
    // if the modal markup is missing.
    askUsername() {
        return new Promise((resolve) => {
            const modal = document.getElementById('welcome-modal');
            const input = document.getElementById('welcome-username');
            const startBtn = document.getElementById('welcome-start-btn');

            if (!modal || !input || !startBtn) {
                resolve(prompt('Welcome to Code of Meridaeia! Enter your username:') || 'Player');
                return;
            }

            modal.classList.remove('hidden');
            input.value = '';
            input.focus();

            const submit = () => {
                const name = input.value.trim().slice(0, 20) || 'Player';
                modal.classList.add('hidden');
                startBtn.removeEventListener('click', submit);
                input.removeEventListener('keydown', onKey);
                this.playSound('click');
                resolve(name);
            };
            const onKey = (e) => {
                if (e.key === 'Enter') submit();
            };

            startBtn.addEventListener('click', submit);
            input.addEventListener('keydown', onKey);
        });
    }

    // ============ CHARACTER SHEET (Phase 2) ============

    toggleCharacterSheet() {
        const overlay = document.getElementById('character-sheet-overlay');

        if (overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden');
            // Sync data to overlay
            const overlayPortrait = document.getElementById('overlay-hero-portrait');
            const heroPortrait = document.getElementById('current-hero-portrait');
            if (overlayPortrait && heroPortrait) {
                overlayPortrait.src = heroPortrait.src;
            }
        } else {
            overlay.classList.add('hidden');
        }
    }

    // ============ LORE MODALS (Bookworm-Style UI) ============

    openHeroLoreModal() {
        const modal = document.getElementById('hero-lore-modal');
        if (!modal || !this.currentCategory) return;

        const story = typeof characterStories !== 'undefined' ? characterStories[this.currentCategory] : null;
        if (!story) return;

        // Set portrait
        const portrait = document.getElementById('hero-full-portrait');
        const heroOrb = document.getElementById('hero-orb-img');
        if (portrait && heroOrb) {
            portrait.src = heroOrb.src;
        }

        // Set title and subtitle
        document.getElementById('hero-modal-title').textContent = story.heroName;
        document.getElementById('hero-modal-subtitle').textContent = story.title;

        // Set backstory
        document.getElementById('hero-backstory').textContent = story.fullBackstory;

        // Set story progress
        const progressEl = document.getElementById('hero-story-progress');
        if (progressEl) {
            const chapterProgress = this.userProfile.chapterProgress?.[this.currentCategory] || {};
            let progressHTML = '';

            for (let i = 1; i <= 3; i++) {
                const isComplete = chapterProgress[`chapter${i}`] === true;
                const chapterIntro = story[`chapter${i}Intro`];
                const preview = chapterIntro ? chapterIntro.substring(0, 80) + '...' : 'Locked';

                progressHTML += `
                    <div class="${isComplete ? 'chapter-complete' : 'chapter-locked'}">
                        <strong>Chapter ${i}:</strong> ${isComplete ? '✅ Complete' : '🔒 Locked'}
                        ${isComplete ? `<br><em>"${preview}"</em>` : ''}
                    </div>
                `;
            }
            progressEl.innerHTML = progressHTML;
        }

        modal.classList.remove('hidden');
    }

    closeHeroLoreModal() {
        const modal = document.getElementById('hero-lore-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    openMonsterLoreModal() {
        const modal = document.getElementById('monster-lore-modal');
        if (!modal) return;

        const monsterName = this.currentMonsterName || 'Unknown Creature';

        // Set portrait
        const portrait = document.getElementById('monster-full-portrait');
        const monsterOrb = document.getElementById('monster-orb-img');
        if (portrait && monsterOrb) {
            portrait.src = monsterOrb.src;
        }

        // Set title
        document.getElementById('monster-modal-title').textContent = monsterName;

        // Generate monster lore based on type
        const loreText = this.getMonsterLore(monsterName);
        document.getElementById('monster-lore-text').textContent = loreText;

        modal.classList.remove('hidden');
    }

    closeMonsterLoreModal() {
        const modal = document.getElementById('monster-lore-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    getMonsterLore(monsterName) {
        // Monster lore database
        const monsterLore = {
            'Syntax Goblin': 'Once a humble data structure, corrupted by Marakathalessa\'s dark magic. It now prowls the wasteland, causing syntax errors in all who cross its path.',
            'Null Pointer Wolf': 'A spectral beast born from dereferenced memory. It hunts those who forget to initialize their variables, leading them into null dimensions.',
            'Memory Leak Demon': 'This creature was once a function - clean, pure, purposeful. But when the Great Compiler fell, it lost its return statement and now wanders forever, never completing.',
            'Segfault Wraith': 'The ghost of a crashed program, forever trapped between memory segments. It seeks to drag others into the void of undefined behavior.',
            'Array Bounds Golem': 'A massive construct built from overflowed buffers. Each step it takes corrupts the memory around it, leaving chaos in its wake.',
            'Deadlock Dragon': 'Two threads fought for the same resource. Neither would yield. They fused into this nightmare, forever waiting for what will never come.',
            'Race Condition Specter': 'It exists in multiple states simultaneously, never quite solid. You can never predict when it will strike or where it will appear.',
            'Heap Corruption Horror': 'Born from a double-free, this abomination\'s very existence violates the laws of memory management.',
            'Stack Overflow Titan': 'It grew from infinite recursion - a function calling itself without end. Now it towers over the wasteland, an eternal loop made flesh.',
            'Garbage Collector Reaper': 'Once the guardian of clean memory, now twisted into a dark harvester. It no longer frees unused memory - it claims souls.'
        };

        return monsterLore[monsterName] ||
            `A corrupted creature of the wasteland, twisted by Marakathalessa's dark magic. It attacks all who dare challenge the corruption of Meridaeia.`;
    }

    // ============ PHASE A: COLLAPSIBLE NAVIGATION ============

    toggleBottomNav() {
        const bottomBar = document.querySelector('.bottom-bar');
        const toggleBtn = document.getElementById('nav-toggle');
        const toggleIcon = document.getElementById('nav-toggle-icon');

        if (bottomBar.classList.contains('collapsed')) {
            bottomBar.classList.remove('collapsed');
            toggleBtn.classList.remove('nav-hidden');
            toggleIcon.textContent = '☰';
        } else {
            bottomBar.classList.add('collapsed');
            toggleBtn.classList.add('nav-hidden');
            toggleIcon.textContent = '⚙️';
        }

        // Save preference
        localStorage.setItem('navCollapsed', bottomBar.classList.contains('collapsed'));
    }

    initNavState() {
        const isCollapsed = localStorage.getItem('navCollapsed') === 'true';
        if (isCollapsed) {
            const bottomBar = document.querySelector('.bottom-bar');
            const toggleBtn = document.getElementById('nav-toggle');
            const toggleIcon = document.getElementById('nav-toggle-icon');

            if (bottomBar) {
                bottomBar.classList.add('collapsed');
                toggleBtn?.classList.add('nav-hidden');
                if (toggleIcon) toggleIcon.textContent = '⚙️';
            }
        }
    }

    updateCharacterSheet() {
        if (!this.userProfile) return;

        // Get hero data based on category
        const heroData = this.getHeroData(this.currentCategory);

        // Update portrait
        const portrait = document.getElementById('current-hero-portrait');
        if (portrait && heroData.image) {
            portrait.src = heroData.image;
        }

        // Dashboard avatar shows the active hero
        const avatarImg = document.getElementById('avatar-img');
        const avatarEmoji = document.getElementById('avatar-emoji');
        if (avatarImg && heroData.image && this.currentCategory) {
            avatarImg.src = heroData.image;
            avatarImg.classList.remove('hidden');
            if (avatarEmoji) avatarEmoji.classList.add('hidden');
        }

        // Update class name and identity
        const className = document.getElementById('character-class-name');
        const identityName = document.getElementById('character-identity-name');
        if (className) className.textContent = heroData.className || 'Hero';
        if (identityName) identityName.textContent = heroData.identity || '';

        // Update stats
        document.getElementById('char-gold').textContent = this.userProfile.gold || 0;
        document.getElementById('char-barrier').textContent = this.userProfile.barrierPoints || 3;
        document.getElementById('char-attack').textContent = this.calculateAttackDamage();

        // Update equipment
        const equipped = this.userProfile.equipped || {};
        document.getElementById('equipped-weapon').textContent = equipped.weapons?.name || 'None';
        document.getElementById('equipped-armor').textContent = equipped.armor?.name || 'None';
        document.getElementById('equipped-accessory').textContent = equipped.accessories?.name || 'None';
    }

    getHeroData(category) {
        const heroMap = {
            java: {
                className: 'Barbarian Warrior',
                identity: 'Grom the Uncompiled',
                image: 'assets/heroes/hero-grom-portrait.png'
            },
            cpp: {
                className: 'Dark Wizard',
                identity: 'Malloc the Void-Walker',
                image: 'assets/heroes/hero-malloc-portrait.png'
            },
            networking: {
                className: 'Knight Paladin',
                identity: 'Ser Handshake',
                image: 'assets/heroes/hero-handshake-portrait.png'
            },
            dataEngineering: {
                className: 'Knight Archer',
                identity: 'Artemis the Stream-Caller',
                image: 'assets/heroes/hero-artemis-portrait.png'
            },
            kernel: {
                className: 'Dragonoid Mercenary',
                identity: 'Vulkun of Ring Zero',
                image: 'assets/heroes/hero-vulkun-portrait.png'
            },
            marakathalessa: {
                className: 'Corrupted Mage',
                identity: 'Marakathalessa Redeemed',
                image: 'assets/monsters/boss-marakathalessa-alt.png'
            }
        };
        return heroMap[category] || { className: 'Hero', identity: '', image: 'assets/heroes/hero-grom-portrait.png' };
    }

    calculateAttackDamage() {
        let baseDamage = 25;

        // Add weapon bonus
        if (this.userProfile.equipped?.weapons?.stats?.attackBonus) {
            baseDamage += this.userProfile.equipped.weapons.stats.attackBonus;
        }

        // Add skill bonuses
        const skillBonus = this.getSkillBonus('attackBonus');
        baseDamage += skillBonus;

        return baseDamage;
    }

    // ============ COMBAT VISUAL FEEDBACK (Phase 2) ============

    showDamageNumber(damage) {
        // Monster hurt reaction lands at the moment of "impact",
        // mid-way through the hero's lunge
        setTimeout(() => this.playHurtAnimation('monster'), 180);

        // Pokemon-style damage element (if present in layout)
        const monsterDamage = document.getElementById('monster-damage');
        if (monsterDamage) {
            monsterDamage.textContent = `-${damage}`;
            monsterDamage.classList.remove('hidden');
            setTimeout(() => monsterDamage.classList.add('hidden'), 1000);
            return;
        }

        // Float a damage number over whichever monster anchor exists
        // (portrait orb in the current layout, monster HUD in legacy)
        const anchor = document.getElementById('monster-portrait-orb') ||
            document.getElementById('monster-hud');
        if (!anchor) return;

        const damageEl = document.createElement('div');
        damageEl.className = 'damage-number';
        damageEl.textContent = `-${damage}`;

        const rect = anchor.getBoundingClientRect();
        damageEl.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 60}px`;
        damageEl.style.top = `${rect.top}px`;

        document.body.appendChild(damageEl);

        setTimeout(() => damageEl.remove(), 1500);
    }

    showGoldCoin() {
        this.playSound('coin');
        const goldDisplay = document.querySelector('.gold-display');
        if (!goldDisplay) return;

        const coinEl = document.createElement('div');
        coinEl.className = 'gold-coin-float';
        coinEl.textContent = '💰 +5';

        const rect = goldDisplay.getBoundingClientRect();
        coinEl.style.left = `${rect.left + rect.width / 2}px`;
        coinEl.style.top = `${rect.top}px`;

        document.body.appendChild(coinEl);

        setTimeout(() => coinEl.remove(), 1200);
    }

    showBarrierDamage() {
        const barrierStat = document.getElementById('char-barrier');
        if (!barrierStat) return;

        const parent = barrierStat.closest('.char-stat');
        if (parent) {
            parent.classList.add('barrier-break');
            setTimeout(() => parent.classList.remove('barrier-break'), 600);
        }

        this.showNotification('🛡️ Barrier Point Lost!');
    }

    // ============ SHOP SYSTEM (Phase 3) ============

    openShop() {
        const modal = document.getElementById('shop-modal');
        modal.classList.remove('hidden');
        this.renderShopInventory('weapons');
        this.updateShopGold();
    }

    closeShop() {
        document.getElementById('shop-modal').classList.add('hidden');
    }

    switchShopTab(category) {
        this.renderShopInventory(category);
    }

    renderShopInventory(category) {
        const container = document.getElementById('shop-inventory');
        const items = shopInventory[category];

        container.innerHTML = items.map(item => `
            <div class="shop-item">
                <div class="shop-item-header">
                    ${item.icon.startsWith('assets/') ?
                `<img src="${item.icon}" alt="${item.name}" class="shop-item-icon-img">` :
                `<span class="shop-item-icon">${item.icon}</span>`}
                    <div class="shop-item-info">
                        <h3>${item.name}</h3>
                        <p class="shop-item-desc">${item.description}</p>
                    </div>
                </div>
                ${this.renderItemStats(item)}
                <div class="shop-item-price">
                    <span>💰</span>
                    <span>${item.price}</span>
                </div>
                <button class="buy-btn" onclick="game.purchaseItem('${item.id}', '${category}')"
                    ${this.userProfile.gold < item.price ? 'disabled' : ''}>
                    ${this.userProfile.gold < item.price ? 'Not Enough Gold' : 'Purchase'}
                </button>
            </div>
        `).join('');

        // Update active tab
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
    }

    renderItemStats(item) {
        if (!item.stats) return '';

        const stats = [];
        if (item.stats.attackBonus) stats.push(`+${item.stats.attackBonus} Attack`);
        if (item.stats.barrierBonus) stats.push(`+${item.stats.barrierBonus} Max Barrier`);
        if (item.stats.goldMultiplier) stats.push(`+${Math.round((item.stats.goldMultiplier - 1) * 100)}% Gold`);
        if (item.stats.xpMultiplier) stats.push(`+${Math.round((item.stats.xpMultiplier - 1) * 100)}% XP`);
        if (item.stats.timerBonus) stats.push(`+${item.stats.timerBonus}s Timer`);

        return `<div class="shop-item-stats">${stats.map(s => `<span>✓ ${s}</span>`).join('')}</div>`;
    }

    purchaseItem(itemId, category) {
        const item = shopInventory[category].find(i => i.id === itemId);

        if (!item || this.userProfile.gold < item.price) {
            this.showNotification('❌ Not enough gold!');
            return;
        }

        // Deduct gold
        this.userProfile.gold -= item.price;

        // Add to inventory or equip
        if (category === 'consumables') {
            this.addToInventory(item);
        } else {
            this.equipItem(item, category);
        }

        // Save and update UI
        codeQuestDB.saveUserProfile(this.userProfile);
        this.updateShopGold();
        this.updateCharacterSheet();
        this.renderShopInventory(category);

        this.showNotification(`✅ Purchased ${item.name}!`);
        codeQuestDB.trackEvent('item_purchased', { itemId, category, price: item.price });
    }

    equipItem(item, slot) {
        // Unequip old item if exists
        if (this.userProfile.equipped[slot]) {
            this.addToInventory(this.userProfile.equipped[slot]);
        }

        // Equip new item
        this.userProfile.equipped[slot] = item;
    }

    addToInventory(item) {
        if (!this.userProfile.inventory) this.userProfile.inventory = [];

        // Stack consumables
        if (item.stackable) {
            const existing = this.userProfile.inventory.find(i => i.id === item.id);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
                return;
            }
            item.quantity = 1;
        }

        this.userProfile.inventory.push(item);
    }

    updateShopGold() {
        document.getElementById('shop-gold').textContent = this.userProfile.gold || 0;
    }

    // ============ SKILLS SYSTEM (Phase 3) ============

    openSkills() {
        const modal = document.getElementById('skills-modal');
        modal.classList.remove('hidden');
        this.renderSkillTree();
        this.updateAvailableXP();
    }

    closeSkills() {
        document.getElementById('skills-modal').classList.add('hidden');
    }

    renderSkillTree() {
        const container = document.getElementById('skill-tree-container');

        container.innerHTML = Object.entries(skillTree).map(([categoryKey, category]) => {
            return `
                <div class="skill-category">
                    <div class="skill-category-header">
                        <span class="skill-category-icon">${category.icon}</span>
                        <span class="skill-category-name">${category.name}</span>
                    </div>
                    <div class="skills-list">
                        ${category.skills.map(skill => this.renderSkill(skill)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderSkill(skill) {
        const currentLevel = this.getSkillLevel(skill.id);
        const isMaxed = currentLevel >= skill.maxLevel;
        const canAfford = this.userProfile.xp >= skill.cost;

        return `
            <div class="skill-item">
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-level">Level ${currentLevel}/${skill.maxLevel}</span>
                </div>
                <p class="skill-desc">${skill.description}</p>
                <div class="skill-footer">
                    <div class="skill-cost">
                        <span>⭐</span>
                        <span>${skill.cost} XP</span>
                    </div>
                    ${isMaxed ?
                '<span class="skill-maxed">✓ Maxed</span>' :
                `<button class="upgrade-btn" onclick="game.upgradeSkill('${skill.id}')" 
                            ${!canAfford ? 'disabled' : ''}>
                            ${!canAfford ? 'Not Enough XP' : 'Upgrade'}
                        </button>`
            }
                </div>
            </div>
        `;
    }

    getSkillLevel(skillId) {
        if (!this.userProfile.skills) this.userProfile.skills = {};
        return this.userProfile.skills[skillId] || 0;
    }

    upgradeSkill(skillId) {
        // Find the skill
        let skill = null;
        for (const category of Object.values(skillTree)) {
            skill = category.skills.find(s => s.id === skillId);
            if (skill) break;
        }

        if (!skill) return;

        const currentLevel = this.getSkillLevel(skillId);

        if (currentLevel >= skill.maxLevel) {
            this.showNotification('❌ Skill already maxed!');
            return;
        }

        if (this.userProfile.xp < skill.cost) {
            this.showNotification('❌ Not enough XP!');
            return;
        }

        // Deduct XP
        this.userProfile.xp -= skill.cost;

        // Upgrade skill
        if (!this.userProfile.skills) this.userProfile.skills = {};
        this.userProfile.skills[skillId] = currentLevel + 1;

        // Save and update UI
        codeQuestDB.saveUserProfile(this.userProfile);
        this.updateAvailableXP();
        this.updateProfileUI();
        this.renderSkillTree();

        this.showNotification(`✅ Upgraded ${skill.name}!`);
        codeQuestDB.trackEvent('skill_upgraded', { skillId, newLevel: this.userProfile.skills[skillId] });
    }

    updateAvailableXP() {
        document.getElementById('available-xp').textContent = this.userProfile.xp || 0;
    }

    // Apply skill effects
    getSkillBonus(effectType) {
        if (!this.userProfile.skills) return 0;

        let total = 0;
        for (const category of Object.values(skillTree)) {
            for (const skill of category.skills) {
                const level = this.getSkillLevel(skill.id);
                if (level > 0 && skill.effect[effectType]) {
                    if (effectType.includes('Multiplier')) {
                        // Multiplicative bonuses
                        total += (skill.effect[effectType] - 1) * level;
                    } else {
                        // Additive bonuses
                        total += skill.effect[effectType] * level;
                    }
                }
            }
        }

        return total;
    }

    // ============ CONSUMABLES & INVENTORY (Phase 3) ============

    openInventory() {
        const modal = document.getElementById('inventory-modal');
        modal.classList.remove('hidden');
        this.renderInventory();
    }

    closeInventory() {
        document.getElementById('inventory-modal').classList.add('hidden');
    }

    renderInventory() {
        const container = document.getElementById('inventory-items');
        const inventory = this.userProfile.inventory || [];

        if (inventory.length === 0) {
            container.innerHTML = '<p class="empty-inventory">Your inventory is empty. Visit the shop to purchase items!</p>';
            return;
        }

        container.innerHTML = inventory.map(item => `
            <div class="inventory-item">
                <div class="inventory-item-header">
                    <span class="inventory-item-icon">${item.icon}</span>
                    <div class="inventory-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                    </div>
                </div>
                ${item.quantity ? `<div class="item-quantity">x${item.quantity}</div>` : ''}
                <button class="use-btn" onclick="game.useConsumable('${item.id}')">
                    Use
                </button>
            </div>
        `).join('');
    }

    useConsumable(itemId) {
        const inventory = this.userProfile.inventory || [];
        const item = inventory.find(i => i.id === itemId);

        if (!item) {
            this.showNotification('❌ Item not found!');
            return;
        }

        // Apply consumable effect
        switch (itemId) {
            case 'scroll_skip':
                // Skip current question without penalty
                if (!this.isGameActive) {
                    this.showNotification('⚠️ Can only use during a question!');
                    return;
                }
                this.showNotification('📜 Question Skipped!');
                this.nextQuestion();
                break;

            case 'potion_shield':
                // Restore 1 barrier point
                const maxBarrier = this.getMaxBarrierPoints();
                if (this.userProfile.barrierPoints >= maxBarrier) {
                    this.showNotification('⚠️ Barrier already at maximum!');
                    return;
                }
                this.userProfile.barrierPoints = Math.min(this.userProfile.barrierPoints + 1, maxBarrier);
                this.updateCharacterSheet();
                this.showNotification('🛡️ Barrier Restored!');
                break;

            case 'time_crystal':
                // Add 15 seconds to timer
                if (!this.isGameActive) {
                    this.showNotification('⚠️ Can only use during a question!');
                    return;
                }
                this.timeLeft += 15;
                this.updateTimerUI();
                this.showNotification('⏰ +15 Seconds!');
                break;

            default:
                this.showNotification('❌ Unknown item effect!');
                return;
        }

        // Remove or decrement item
        if (item.quantity && item.quantity > 1) {
            item.quantity--;
        } else {
            const index = inventory.indexOf(item);
            inventory.splice(index, 1);
        }

        // Save and update UI
        codeQuestDB.saveUserProfile(this.userProfile);
        this.renderInventory();
        codeQuestDB.trackEvent('consumable_used', { itemId });
    }

    getMaxBarrierPoints() {
        let maxBarrier = 3; // Base barrier

        // Add armor bonus
        if (this.userProfile.equipped?.armor?.stats?.barrierBonus) {
            maxBarrier += this.userProfile.equipped.armor.stats.barrierBonus;
        }

        // Add skill bonuses
        const skillBonus = this.getSkillBonus('barrierBonus');
        maxBarrier += skillBonus;

        return maxBarrier;
    }
}

// Initialize game
const game = new CodeOfMeridaeiaGame();
document.addEventListener('DOMContentLoaded', () => game.init());
