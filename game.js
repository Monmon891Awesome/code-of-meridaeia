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

        // Combat Hint State (Regular Questions)
        this.combatHintIndex = 0;
        this.hintsUsedThisQuestion = 0;
    }

    async init() {
        // Initialize database
        await codeQuestDB.init();

        // Load or create user profile
        this.userProfile = await codeQuestDB.getUserProfile();
        if (!this.userProfile) {
            const username = prompt('Welcome to Code of Meridaeia! Enter your username:') || 'Player';
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

        // Track session start
        await codeQuestDB.trackEvent('session_start', {
            username: this.userProfile.username,
            level: this.userProfile.level
        });

    }

    // ============ CATEGORY MANAGEMENT ============

    selectCategory(category) {
        this.currentCategory = category;
        let allQuestions = [];

        // Set hero information based on category
        switch (category) {
            case 'java':
                // Merge all Java tier questions
                allQuestions = [
                    ...(typeof javaTier1Interactive !== 'undefined' ? javaTier1Interactive : []),
                    ...(typeof javaTier2Fundamentals !== 'undefined' ? javaTier2Fundamentals : []),
                    ...(typeof javaTier3Intermediate !== 'undefined' ? javaTier3Intermediate : []),
                    ...(typeof javaTier4Advanced !== 'undefined' ? javaTier4Advanced : []),
                    ...(typeof javaTier5Mastery !== 'undefined' ? javaTier5Mastery : []),
                    ...(typeof javaQuestions !== 'undefined' ? javaQuestions : []) // Legacy questions
                ];
                this.selectedHero = {
                    category: category,
                    heroName: 'Grom the Uncompiled',
                    heroClass: 'Barbarian Warrior',
                    heroPortrait: 'assets/heroes/hero-grom-portrait.png',
                    fullImage: 'assets/heroes/hero-grom-full.png',
                    allQuestions: allQuestions,
                    color: '#f89820'
                };
                break;
            case 'cpp':
                // Merge all C++ tier questions
                allQuestions = [
                    ...(typeof cppTier1Foundations !== 'undefined' ? cppTier1Foundations : []),
                    ...(typeof cppTier2OOP !== 'undefined' ? cppTier2OOP : []),
                    ...(typeof cppTier3Modern !== 'undefined' ? cppTier3Modern : []),
                    ...(typeof cppQuestions !== 'undefined' ? cppQuestions : []) // Legacy questions
                ];
                this.selectedHero = {
                    category: category,
                    heroName: 'Malloc the Void-Walker',
                    heroClass: 'Dark Wizard',
                    heroPortrait: 'assets/heroes/hero-malloc-portrait.png',
                    fullImage: 'assets/heroes/hero-malloc-full.png',
                    allQuestions: allQuestions,
                    color: '#00599C'
                };
                break;
            case 'networking':
                // Merge all Networking tier questions
                allQuestions = [
                    ...(typeof networkingTier1Foundations !== 'undefined' ? networkingTier1Foundations : []),
                    ...(typeof networkingTier2APIs !== 'undefined' ? networkingTier2APIs : []),
                    ...(typeof networkingTier3Security !== 'undefined' ? networkingTier3Security : []),
                    ...(typeof networkingQuestions !== 'undefined' ? networkingQuestions : []) // Legacy questions
                ];
                this.selectedHero = {
                    category: category,
                    heroName: 'Ser Handshake',
                    heroClass: 'Knight Paladin',
                    heroPortrait: 'assets/heroes/hero-handshake-portrait.png',
                    fullImage: 'assets/heroes/hero-handshake-full.png',
                    allQuestions: allQuestions,
                    color: '#10b981'
                };
                break;
            case 'dataEngineering':
                // Merge all Data Engineering tier questions
                allQuestions = [
                    ...(typeof dataEngineeringTier1SQL !== 'undefined' ? dataEngineeringTier1SQL : []),
                    ...(typeof dataEngineeringTier2Pipelines !== 'undefined' ? dataEngineeringTier2Pipelines : []),
                    ...(typeof dataEngineeringTier3Advanced !== 'undefined' ? dataEngineeringTier3Advanced : []),
                    ...(typeof dataEngineeringQuestions !== 'undefined' ? dataEngineeringQuestions : []) // Legacy questions
                ];
                this.selectedHero = {
                    category: category,
                    heroName: 'Artemis the Stream-Caller',
                    heroClass: 'Knight Archer',
                    heroPortrait: 'assets/heroes/hero-artemis-portrait.png',
                    fullImage: 'assets/heroes/hero-artemis-full.png',
                    allQuestions: allQuestions,
                    color: '#8b5cf6'
                };
                break;
            case 'kernel':
                allQuestions = typeof kernelQuestions !== 'undefined' ? [...kernelQuestions] : [];
                this.selectedHero = {
                    category: category,
                    heroName: 'Vulkun of Ring Zero',
                    heroClass: 'Dragonoid Mercenary',
                    heroPortrait: 'assets/heroes/hero-vulkun-portrait.png',
                    fullImage: 'assets/heroes/hero-vulkun-full.png',
                    allQuestions: allQuestions,
                    color: '#ef4444'
                };
                break;
            case 'marakathalessa':
                // Check if unlocked
                if (!this.isMarakathalessaUnlocked()) {
                    this.showNotification('🔒 Defeat the boss to unlock her story!');
                    return;
                }
                allQuestions = typeof marakathalessaQuestions !== 'undefined' ? [...marakathalessaQuestions] : [];
                this.selectedHero = {
                    category: category,
                    heroName: 'Marakathalessa Redeemed',
                    heroClass: 'Corrupted Mage',
                    heroPortrait: 'assets/monsters/boss-marakathalessa-alt.png',
                    fullImage: 'assets/monsters/boss-marakathalessa-alt.png',
                    allQuestions: allQuestions,
                    color: '#a855f7'
                };
                break;
            default:
                console.error('Unknown category:', category);
                return;
        }

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
            { chapter1: false, chapter2: false, chapter3: false, chapter4: false, chapter5: false };

        // Check if this hero has extended chapters (Java has 5)
        const hasExtendedChapters = this.currentCategory === 'java';
        const card4 = document.getElementById('chapter-card-4');
        const card5 = document.getElementById('chapter-card-5');

        // Show/hide extended chapter cards
        if (hasExtendedChapters) {
            card4?.classList.remove('hidden');
            card5?.classList.remove('hidden');
        } else {
            card4?.classList.add('hidden');
            card5?.classList.add('hidden');
        }

        // Count questions per chapter
        const ch1Count = this.selectedHero.allQuestions.filter(q => q.chapter === 1).length;
        const ch2Count = this.selectedHero.allQuestions.filter(q => q.chapter === 2).length;
        const ch3Count = this.selectedHero.allQuestions.filter(q => q.chapter === 3).length;
        const ch4Count = this.selectedHero.allQuestions.filter(q => q.chapter === 4).length;
        const ch5Count = this.selectedHero.allQuestions.filter(q => q.chapter === 5).length;

        // Update chapter counts
        document.getElementById('ch1-count').textContent = ch1Count;
        document.getElementById('ch2-count').textContent = ch2Count;
        document.getElementById('ch3-count').textContent = ch3Count;
        if (document.getElementById('ch4-count')) {
            document.getElementById('ch4-count').textContent = ch4Count;
        }
        if (document.getElementById('ch5-count')) {
            document.getElementById('ch5-count').textContent = ch5Count;
        }

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

        // Chapter 4 (Java extended) - unlocks after Chapter 3
        if (hasExtendedChapters && card4) {
            card4.classList.remove('locked', 'completed');
            if (chapterProgress.chapter4) {
                card4.classList.add('completed');
                document.getElementById('ch4-status').textContent = '✅ Completed';
            } else if (chapterProgress.chapter3) {
                document.getElementById('ch4-status').textContent = '🔓 Unlocked';
            } else {
                card4.classList.add('locked');
                document.getElementById('ch4-status').textContent = '🔒 Complete Chapter III';
            }
        }

        // Chapter 5 (Java extended) - unlocks after Chapter 4
        if (hasExtendedChapters && card5) {
            card5.classList.remove('locked', 'completed');
            if (chapterProgress.chapter5) {
                card5.classList.add('completed');
                document.getElementById('ch5-status').textContent = '✅ Completed';
            } else if (chapterProgress.chapter4) {
                document.getElementById('ch5-status').textContent = '🔓 Unlocked';
            } else {
                card5.classList.add('locked');
                document.getElementById('ch5-status').textContent = '🔒 Complete Chapter IV';
            }
        }

        // Track event
        codeQuestDB.trackEvent('chapter_select_shown', { category: this.currentCategory });
    }


    selectChapter(chapterNum) {
        // Check if chapter is unlocked
        const chapterProgress = this.userProfile.chapterProgress?.[this.currentCategory] ||
            { chapter1: false, chapter2: false, chapter3: false, chapter4: false, chapter5: false };

        const isUnlocked =
            chapterNum === 1 ||
            (chapterNum === 2 && chapterProgress.chapter1) ||
            (chapterNum === 3 && chapterProgress.chapter2) ||
            (chapterNum === 4 && chapterProgress.chapter3) ||
            (chapterNum === 5 && chapterProgress.chapter4);

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
    }

    completeChapter() {
        if (!this.currentCategory || !this.currentChapter) return;

        // Mark chapter as complete
        if (!this.userProfile.chapterProgress) {
            this.userProfile.chapterProgress = {
                java: { chapter1: false, chapter2: false, chapter3: false, chapter4: false, chapter5: false },
                cpp: { chapter1: false, chapter2: false, chapter3: false },
                networking: { chapter1: false, chapter2: false, chapter3: false },
                dataEngineering: { chapter1: false, chapter2: false, chapter3: false },
                kernel: { chapter1: false, chapter2: false, chapter3: false }
            };
        }

        // Ensure Java has extended chapter fields
        if (this.currentCategory === 'java' && !this.userProfile.chapterProgress.java.hasOwnProperty('chapter4')) {
            this.userProfile.chapterProgress.java.chapter4 = false;
            this.userProfile.chapterProgress.java.chapter5 = false;
        }

        const chapterKey = `chapter${this.currentChapter}`;
        this.userProfile.chapterProgress[this.currentCategory][chapterKey] = true;
        codeQuestDB.saveUserProfile(this.userProfile);

        // Show completion notification
        const chapterNames = ['The Awakening', 'Rising Storm', 'The Reckoning', 'Advanced Trials', 'Mastery Path'];
        const chapterName = chapterNames[this.currentChapter - 1] || `Chapter ${this.currentChapter}`;
        this.showNotification(`📖 Chapter ${this.currentChapter}: ${chapterName} Complete!`);

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

        // Hide hero select, show boss fight
        document.getElementById('category-select').classList.add('hidden');
        document.getElementById('boss-fight-area').classList.remove('hidden');

        // Track event
        codeQuestDB.trackEvent('boss_fight_started', {});

        // Show first question
        this.showBossQuestion();
    }

    showBossQuestion() {
        if (this.currentBossQuestionIndex >= this.bossQuestions.length) {
            // All questions answered - boss defeated
            this.defeatBoss();
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

    submitBossAnswer() {
        const answer = document.getElementById('code-answer').value.trim().toLowerCase();
        if (!answer) {
            this.showNotification('Please enter an answer');
            return;
        }

        // Check if answer is correct (case-insensitive, flexible matching)
        const acceptedAnswers = this.currentBossQuestion.acceptedAnswers.map(a => a.toLowerCase().trim());
        const isCorrect = acceptedAnswers.includes(answer);

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
            feedbackText.textContent = 'Critical Hit!';

            // Deal damage based on how few hints were used
            const baseDamage = 100;
            const damage = baseDamage + (30 * (3 - this.currentHintIndex));
            this.bossHP -= damage;

            // Show damage notification
            this.showNotification(`⚔️ ${damage} damage dealt!`);

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
            feedbackText.textContent = 'Miss!';

            // Boss counterattacks - reduce barrier points
            if (this.userProfile.barrierPoints > 0) {
                this.userProfile.barrierPoints--;
                codeQuestDB.saveUserProfile(this.userProfile);
            }

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

        // Check if this is first defeat
        if (!this.userProfile.bossDefeated) {
            this.userProfile.bossDefeated = 'incomplete';
            codeQuestDB.saveUserProfile(this.userProfile);
            this.showIncompleteEnding();
        } else {
            // Already defeated once - check for true ending (Phase D)
            if (this.isAllHeroesComplete()) {
                this.userProfile.bossDefeated = 'true';
                codeQuestDB.saveUserProfile(this.userProfile);
                this.showTrueEnding();
            } else {
                this.showIncompleteEnding();
            }
        }

        // Track event
        codeQuestDB.trackEvent('boss_defeated', {
            type: this.userProfile.bossDefeated
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
        // Get story data
        const story = characterStories[category];
        if (!story) return;

        // Get the appropriate chapter intro
        let storyText = '';
        if (chapterNum === 1) {
            storyText = story.chapter1Intro;
        } else if (chapterNum === 2) {
            storyText = story.chapter2Intro;
        } else if (chapterNum === 3) {
            storyText = story.chapter3Intro;
        } else if (chapterNum === 4) {
            storyText = story.chapter4Intro;
        } else if (chapterNum === 5) {
            storyText = story.chapter5Intro;
        }

        if (!storyText) return;

        // Update modal content
        document.getElementById('story-hero-name').textContent = story.heroName;
        document.getElementById('story-hero-title').textContent = story.title;
        document.getElementById('story-text').textContent = storyText;

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
        this.userProfile.storyProgress += 5;
        this.userProfile.barrierPoints = this.userProfile.barrierPoints || 3;
        codeQuestDB.saveUserProfile(this.userProfile);

        // Reset game state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalAnswered = 0;
        this.isGameActive = true;
        this.currentMonsterHP = this.monsterMaxHP;
        this.goldEarned = 0;

        // Track chapter selection
        codeQuestDB.trackEvent('chapter_selected', {
            category: this.currentCategory,
            chapter: this.currentChapter
        });

        // Show first question
        this.showQuestion();

        // Update UI
        document.getElementById('chapter-select').classList.add('hidden');
        document.getElementById('game-area').classList.remove('hidden');
        document.getElementById('current-category').textContent =
            `${this.getCategoryDisplayName(this.currentCategory)} - Chapter ${this.currentChapter}`;

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

        // Update question number
        document.getElementById('question-number').textContent =
            `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;

        // Update difficulty badge
        const diffBadge = document.getElementById('difficulty-badge');
        diffBadge.textContent = this.currentQuestion.difficulty.toUpperCase();
        diffBadge.className = `difficulty-badge ${this.currentQuestion.difficulty}`;

        // Update Monster HUD
        this.updateMonsterHUD();
        const monsterName = this.getRandomMonsterName(this.currentQuestion.difficulty);
        document.getElementById('monster-name').textContent = monsterName;

        // Update monster portrait
        const monsterPortrait = document.getElementById('monster-portrait');
        if (monsterPortrait && this.monsterPortraits[monsterName]) {
            monsterPortrait.src = this.monsterPortraits[monsterName];
        }

        const monsterType = document.getElementById('monster-type');
        monsterType.textContent = this.currentQuestion.difficulty.toUpperCase();
        monsterType.className = `monster-type ${this.currentQuestion.difficulty}`;

        // Check if this is an interactive code exercise
        const isCodeExercise = ['code-typing', 'code-completion', 'fix-bug', 'build-from-scratch', 'project'].includes(this.currentQuestion.type);

        if (isCodeExercise && typeof codeExercise !== 'undefined') {
            // Render interactive code exercise
            const questionContainer = document.getElementById('question-text');
            questionContainer.innerHTML = codeExercise.renderQuestion(this.currentQuestion);

            // Hide traditional options
            document.getElementById('options-container').innerHTML = '';
            document.getElementById('code-block').classList.add('hidden');
        } else {
            // Traditional multiple choice question
            // Update question text
            document.getElementById('question-text').textContent = this.currentQuestion.question;

            // Update code block
            const codeBlock = document.getElementById('code-block');
            if (this.currentQuestion.code) {
                codeBlock.classList.remove('hidden');
                document.getElementById('code-content').textContent = this.currentQuestion.code;
            } else {
                codeBlock.classList.add('hidden');
            }

            // Update options
            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';

            this.currentQuestion.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span>${option}`;
                button.onclick = () => this.selectAnswer(index);
                optionsContainer.appendChild(button);
            });
        }

        // Hide feedback
        document.getElementById('feedback-container').classList.add('hidden');
        document.getElementById('next-btn').classList.add('hidden');

        // Reset and setup combat hints
        this.combatHintIndex = 0;
        this.hintsUsedThisQuestion = 0;
        this.resetCombatHints();

        // Start timer
        this.startTimer();
    }

    // ============ COMBAT HINTS (Regular Questions) ============

    resetCombatHints() {
        const hintSection = document.getElementById('combat-hint-section');
        const currentHint = document.getElementById('combat-current-hint');
        const hintsRemaining = document.getElementById('combat-hints-remaining');

        if (!hintSection || !this.currentQuestion) return;

        // Check if this question has hints
        const hints = this.currentQuestion.hints || [];

        if (hints.length === 0) {
            // No hints available for this question
            hintSection.classList.add('hidden');
        } else {
            // Show hint section
            hintSection.classList.remove('hidden');
            currentHint.classList.add('hidden');
            currentHint.textContent = '';
            hintsRemaining.textContent = `${hints.length} hints remaining`;
        }
    }

    showCombatHint() {
        const cost = 5; // Gold cost per hint

        if (!this.currentQuestion || !this.currentQuestion.hints) {
            this.showNotification('No hints available for this question');
            return;
        }

        const hints = this.currentQuestion.hints;

        // Check if we have gold
        if (this.userProfile.gold < cost) {
            this.showNotification('💰 Not enough gold! (need 5)');
            return;
        }

        // Check if we have hints left
        if (this.combatHintIndex >= hints.length) {
            this.showNotification('No more hints available');
            return;
        }

        // Deduct gold
        this.userProfile.gold -= cost;
        codeQuestDB.saveUserProfile(this.userProfile);
        this.updateProfileUI();

        // Get and display hint
        const hint = hints[this.combatHintIndex];
        const currentHintEl = document.getElementById('combat-current-hint');
        const hintsRemainingEl = document.getElementById('combat-hints-remaining');

        // Show hint with animation
        currentHintEl.textContent = hint;
        currentHintEl.classList.remove('hidden');
        currentHintEl.style.animation = 'none';
        currentHintEl.offsetHeight; // Trigger reflow
        currentHintEl.style.animation = 'fadeIn 0.3s ease-out';

        // Update counters
        this.combatHintIndex++;
        this.hintsUsedThisQuestion++;

        // Update remaining display
        const remaining = hints.length - this.combatHintIndex;
        hintsRemainingEl.textContent = `${remaining} hints remaining`;

        // Show notification
        this.showNotification(`💡 Hint revealed! (-${cost} Gold)`);

        // Track event for analytics
        codeQuestDB.trackEvent('combat_hint_used', {
            questionId: this.currentQuestion.id,
            category: this.currentCategory,
            hintIndex: this.combatHintIndex,
            hintsUsedThisQuestion: this.hintsUsedThisQuestion
        });
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
        timerEl.textContent = this.timeLeft;

        // Change color based on time
        if (this.timeLeft <= 10) {
            timerEl.classList.add('urgent');
        } else {
            timerEl.classList.remove('urgent');
        }

        // Update progress ring
        const progress = (this.timeLeft / 60) * 100;
        document.getElementById('timer-progress').style.background =
            `conic-gradient(var(--accent) ${progress}%, transparent ${progress}%)`;
    }

    timeUp() {
        clearInterval(this.timerInterval);

        // Hide hint section when time is up
        const hintSection = document.getElementById('combat-hint-section');
        if (hintSection) hintSection.classList.add('hidden');

        this.showFeedback(false, -1);
        this.totalAnswered++;
    }

    // ============ ANSWER HANDLING ============

    selectAnswer(index) {
        clearInterval(this.timerInterval);

        const isCorrect = index === this.currentQuestion.correctAnswer;

        // Disable all buttons
        document.querySelectorAll('.option-btn').forEach((btn, i) => {
            btn.disabled = true;
            if (i === this.currentQuestion.correctAnswer) {
                btn.classList.add('correct');
            } else if (i === index && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Hide hint section after answering
        const hintSection = document.getElementById('combat-hint-section');
        if (hintSection) hintSection.classList.add('hidden');

        this.totalAnswered++;

        if (isCorrect) {
            this.correctAnswers++;
            let xpGained = this.calculateXP();

            // Apply XP multiplier from accessory
            if (this.userProfile.equipped?.accessories?.stats?.xpMultiplier) {
                xpGained *= this.userProfile.equipped.accessories.stats.xpMultiplier;
            }

            // Apply skill bonuses
            const xpSkillMultiplier = 1 + this.getSkillBonus('xpMultiplier');
            xpGained *= xpSkillMultiplier;

            xpGained = Math.floor(xpGained);

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
            const hpBar = document.getElementById('hp-bar');
            hpBar.classList.add('hp-bar-hit');
            setTimeout(() => hpBar.classList.remove('hp-bar-hit'), 300);

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
            // Wrong answer: reduce barrier points
            if (this.userProfile.barrierPoints > 0) {
                this.userProfile.barrierPoints--;
                this.showBarrierDamage();
                this.updateCharacterSheet();
            }
        }

        this.userProfile.totalQuestionsAnswered++;

        // Save progress
        codeQuestDB.saveProgress({
            category: this.currentCategory,
            questionId: this.currentQuestion.id,
            isCorrect: isCorrect,
            timeRemaining: this.timeLeft,
            xpGained: isCorrect ? this.calculateXP() : 0
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

        this.showFeedback(isCorrect, index);
        this.updateProfileUI();
    }

    calculateXP() {
        const baseXP = this.xpMultipliers[this.currentQuestion.difficulty];
        const timeBonus = Math.floor((this.timeLeft / 60) * this.maxTimeBonus);
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
        const xpForNextLevel = this.userProfile.level * 100;
        if (this.userProfile.xp >= xpForNextLevel) {
            this.userProfile.level++;
            this.showLevelUpNotification();

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
        document.getElementById('hp-bar').style.width = `${hpPercent}%`;
        document.getElementById('hp-text').textContent = `${hp} / ${this.monsterMaxHP} HP`;
        document.getElementById('gold-earned').textContent = this.userProfile.gold || 0;
    }

    monsterDefeated() {
        // Bonus gold for kill
        this.goldEarned += 20;
        this.userProfile.gold = (this.userProfile.gold || 0) + this.goldEarned;

        // Increment story progress and update environment
        this.userProfile.storyProgress = (this.userProfile.storyProgress || 0) + 20;
        this.updateEnvironmentByProgress();

        // Reset monster HP for next encounter
        this.currentMonsterHP = this.monsterMaxHP;

        // Notification
        this.showNotification(`🗡️ Monster Slain! +${this.goldEarned} Gold`);

        // Track event
        codeQuestDB.trackEvent('monster_defeated', { goldEarned: this.goldEarned });

        // Save and reset
        codeQuestDB.saveUserProfile(this.userProfile);
        this.goldEarned = 0;
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

    showFeedback(isCorrect, selectedIndex) {
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackText = document.getElementById('feedback-text');
        const explanation = document.getElementById('explanation');

        feedbackContainer.classList.remove('hidden');

        if (selectedIndex === -1) {
            feedbackIcon.textContent = '⏰';
            feedbackText.textContent = 'Time\'s Up!';
            feedbackContainer.classList.remove('correct');
            feedbackContainer.classList.add('incorrect');
        } else if (isCorrect) {
            feedbackIcon.textContent = '✅';
            feedbackText.textContent = `Correct! +${this.calculateXP()} XP`;
            feedbackContainer.classList.remove('incorrect');
            feedbackContainer.classList.add('correct');
        } else {
            feedbackIcon.textContent = '❌';
            feedbackText.textContent = 'Incorrect';
            feedbackContainer.classList.remove('correct');
            feedbackContainer.classList.add('incorrect');
        }

        explanation.textContent = this.currentQuestion.explanation;
        document.getElementById('next-btn').classList.remove('hidden');
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    // ============ GAME STATE ============

    endGame() {
        this.isGameActive = false;
        clearInterval(this.timerInterval);

        document.getElementById('game-area').classList.add('hidden');
        document.getElementById('results-screen').classList.remove('hidden');

        const accuracy = Math.round((this.correctAnswers / this.totalAnswered) * 100);

        document.getElementById('final-score').textContent = this.score;
        document.getElementById('questions-correct').textContent =
            `${this.correctAnswers} / ${this.totalAnswered}`;
        document.getElementById('accuracy').textContent = `${accuracy}%`;

        // Update category progress
        const catProgress = this.userProfile.categoryProgress[this.currentCategory];
        catProgress.completed += this.totalAnswered;
        catProgress.correct += this.correctAnswers;
        codeQuestDB.saveUserProfile(this.userProfile);

        // Phase B: Mark chapter as complete if player got at least 50% correct
        if (accuracy >= 50 && this.currentChapter) {
            this.completeChapter();
        }

        // Track game completion
        codeQuestDB.trackEvent('game_completed', {
            category: this.currentCategory,
            chapter: this.currentChapter,
            score: this.score,
            correct: this.correctAnswers,
            total: this.totalAnswered,
            accuracy
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

        // XP progress to next level
        const xpForNextLevel = this.userProfile.level * 100;
        const progress = (this.userProfile.xp % 100) / xpForNextLevel * 100;
        document.getElementById('xp-progress').style.width = `${progress}%`;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'toast-notification';
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
            const username = prompt('Enter new username:') || 'Player';
            this.userProfile = await codeQuestDB.initializeNewUser(username);
            this.achievements = [];
            this.updateProfileUI();
            this.showNotification('🔄 Progress reset!');
        }
    }

    // ============ CHARACTER SHEET (Phase 2) ============

    toggleCharacterSheet() {
        const content = document.getElementById('sheet-content');
        const icon = document.getElementById('sheet-toggle-icon');

        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            icon.textContent = '▼';
        } else {
            content.classList.add('collapsed');
            icon.textContent = '▶';
        }
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
        const monsterHud = document.getElementById('monster-hud');
        if (!monsterHud) return;

        const damageEl = document.createElement('div');
        damageEl.className = 'damage-number';
        damageEl.textContent = `-${damage}`;

        // Position randomly around the monster HUD
        const rect = monsterHud.getBoundingClientRect();
        damageEl.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 100}px`;
        damageEl.style.top = `${rect.top + rect.height / 2}px`;

        document.body.appendChild(damageEl);

        setTimeout(() => damageEl.remove(), 1500);
    }

    showGoldCoin() {
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
                    <span class="shop-item-icon">${item.icon}</span>
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
        const skillBonus = this.getSkillBonus('barrierPoints');
        maxBarrier += skillBonus;

        return maxBarrier;
    }

    // Helper method for code exercises to call when answer is correct
    handleCorrectAnswer() {
        // For code exercises, don't use selectAnswer which shows duplicate feedback
        // Instead, directly handle the correct answer logic
        clearInterval(this.timerInterval);

        this.totalAnswered++;
        this.correctAnswers++;

        let xpGained = this.calculateXP();

        // Apply XP multiplier from accessory
        if (this.userProfile.equipped?.accessories?.stats?.xpMultiplier) {
            xpGained *= this.userProfile.equipped.accessories.stats.xpMultiplier;
        }

        // Apply skill bonuses
        const xpSkillMultiplier = 1 + this.getSkillBonus('xpMultiplier');
        xpGained *= xpSkillMultiplier;
        xpGained = Math.floor(xpGained);

        this.score += xpGained;
        this.userProfile.xp += xpGained;
        this.userProfile.correctAnswers++;
        this.userProfile.totalQuestionsAnswered++;

        // Combat damage
        const damage = this.calculateAttackDamage();
        this.currentMonsterHP -= damage;

        // Calculate gold with multipliers
        let goldEarned = 5;
        if (this.userProfile.equipped?.accessories?.stats?.goldMultiplier) {
            goldEarned *= this.userProfile.equipped.accessories.stats.goldMultiplier;
        }
        const skillMultiplier = 1 + this.getSkillBonus('goldMultiplier');
        goldEarned *= skillMultiplier;
        this.goldEarned += Math.floor(goldEarned);

        // Visual feedback
        this.showDamageNumber(damage);
        document.querySelector('.app-container')?.classList.add('screen-shake');
        setTimeout(() => {
            document.querySelector('.app-container')?.classList.remove('screen-shake');
        }, 500);
        this.showGoldCoin();
        this.updateMonsterHUD();

        // Monster defeated?
        if (this.currentMonsterHP <= 0) {
            this.monsterDefeated();
            return;
        }

        // Check for level up
        this.checkLevelUp();

        // Save progress
        codeQuestDB.saveProgress({
            category: this.currentCategory,
            questionId: this.currentQuestion.id,
            isCorrect: true,
            timeRemaining: this.timeLeft,
            xpGained: xpGained
        });
        codeQuestDB.saveUserProfile(this.userProfile);
        this.updateProfileUI();

        // Show next button (don't show duplicate feedback)
        document.getElementById('next-btn')?.classList.remove('hidden');
    }
}

// Initialize game when DOM is ready
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new CodeOfMeridaeiaGame();
    game.init();
});
