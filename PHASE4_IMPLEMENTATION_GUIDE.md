# 🚀 Phase 4 Quick Start Guide
## The Descent to Meridaeia - Implementation Steps

**Goal**: Add visual progression showing the journey deeper into Meridaeia  
**Timeline**: 2-3 weeks  
**Difficulty**: Medium

---

## 📋 Checklist

### Week 1: Assets & Data
- [ ] Create/generate 5 environment backgrounds
- [ ] Write 50 lore snippets (10 per environment)
- [ ] Create lore snippet UI mockup
- [ ] Design depth meter UI

### Week 2: Core Implementation
- [ ] Add progression tracking system
- [ ] Implement background changing logic
- [ ] Create lore snippet modal
- [ ] Add depth meter to UI

### Week 3: Polish & Testing
- [ ] Add transition animations
- [ ] Test all lore snippets
- [ ] Balance depth progression
- [ ] Deploy and test

---

## 🎨 Step 1: Create Environment Backgrounds

### Option A: AI Generation (Fastest)

Use the `generate_image` tool to create backgrounds:

**Prompts**:
1. **Scorched Wasteland**: "Post-apocalyptic wasteland with cracked earth, dead trees, orange sky, desolate landscape, dark fantasy art style"
2. **Corrupted Forest**: "Dark corrupted forest with twisted trees, purple fog, glowing corruption, eerie atmosphere, fantasy game background"
3. **Broken Mountains**: "Shattered mountain range, floating rocks, dark storm clouds, ominous peaks, epic fantasy landscape"
4. **Dark Lakes**: "Dark underground lakes, bioluminescent water, cave ceiling with stalactites, mysterious blue glow, fantasy dungeon"
5. **Gates of Meridaeia**: "Massive dark fortress gates, corrupted architecture, ominous towers, final boss approach, epic dark fantasy"

### Option B: Find Free Assets

**Resources**:
- OpenGameArt.org
- Itch.io (free game assets)
- Unsplash (with filters)

### Requirements:
- Resolution: 1920x1080 minimum
- Format: PNG or WebP
- Dark/moody aesthetic
- Horizontal orientation

---

## 📝 Step 2: Write Lore Snippets

### Template

```javascript
{
    id: 'environment_number',
    environment: 'wasteland|forest|mountains|lakes|gates',
    text: '2-4 sentences of lore. Keep it mysterious and intriguing.',
    unlocks: 'Lore Fragment X/50',
    depth: 0-500 // Depth at which this appears
}
```

### Writing Guidelines

1. **Keep it short** (3-4 sentences max)
2. **End with mystery** (make them want more)
3. **Reveal gradually** (don't explain everything)
4. **Connect to programming** (subtle references)
5. **Biblical parallels** (optional, subtle)

### Example Snippets

```javascript
// Wasteland (Depth 0-100)
{
    id: 'wasteland_01',
    environment: 'wasteland',
    text: 'The Syntax Goblin falls, whispering: "The Great Compiler once parsed all code with perfect logic. But Marakathalessa corrupted its core with a single semicolon. Now only those who understand the Ancient Syntax can restore it."',
    unlocks: 'Lore Fragment 1/50',
    depth: 10
},

// Forest (Depth 100-200)
{
    id: 'forest_01',
    environment: 'forest',
    text: 'You enter the Corrupted Forest. The trees here were once the Library of Algorithms - each trunk carved with sorting methods, each leaf a data structure. Now they twist and writhe, their logic corrupted by the Witch\'s dark magic.',
    unlocks: 'Lore Fragment 11/50',
    depth: 110
},

// Mountains (Depth 200-300)
{
    id: 'mountains_01',
    environment: 'mountains',
    text: 'The Broken Mountains were shattered when the Great Compiler fell. Each floating rock is a fragment of its memory - Stack, Heap, Register. Collect them all, and you might reconstruct what was lost.',
    unlocks: 'Lore Fragment 21/50',
    depth: 210
},

// Lakes (Depth 300-400)
{
    id: 'lakes_01',
    environment: 'lakes',
    text: 'The Dark Lakes were once the Data Streams - pure information flowing from source to destination. Now they are stagnant, filled with corrupted packets and lost connections. Artemis the Stream-Caller once purified these waters. Can you finish her work?',
    unlocks: 'Lore Fragment 31/50',
    depth: 310
},

// Gates (Depth 400-500)
{
    id: 'gates_01',
    environment: 'gates',
    text: 'You stand before the Gates of Meridaeia. The fortress looms above, built from the bones of failed compilers. Marakathalessa waits within, guarding the Ancient Logic. This is it. The final descent.',
    unlocks: 'Lore Fragment 41/50',
    depth: 410
}
```

---

## 💻 Step 3: Implement Progression System

### Create `progression-system.js`

```javascript
// progression-system.js
class ProgressionSystem {
    constructor() {
        this.currentDepth = 0;
        this.maxDepth = 500;
        this.currentEnvironment = 'wasteland';
        this.loreCollected = [];
        this.environments = [
            { 
                name: 'wasteland', 
                minDepth: 0, 
                maxDepth: 100,
                background: 'assets/environments/landscape-wasteland.png',
                title: 'The Scorched Wasteland',
                description: 'Surface level - Where your journey begins'
            },
            { 
                name: 'forest', 
                minDepth: 100, 
                maxDepth: 200,
                background: 'assets/environments/corrupted-forest.png',
                title: 'The Corrupted Forest',
                description: '100 feet deep - The Library of Lost Algorithms'
            },
            { 
                name: 'mountains', 
                minDepth: 200, 
                maxDepth: 300,
                background: 'assets/environments/broken-mountains.png',
                title: 'The Broken Mountains',
                description: '200 feet deep - Fragments of the Great Compiler'
            },
            { 
                name: 'lakes', 
                minDepth: 300, 
                maxDepth: 400,
                background: 'assets/environments/dark-lakes.png',
                title: 'The Dark Lakes',
                description: '300 feet deep - Corrupted Data Streams'
            },
            { 
                name: 'gates', 
                minDepth: 400, 
                maxDepth: 500,
                background: 'assets/environments/gates-meridaeia.png',
                title: 'The Gates of Meridaeia',
                description: '400 feet deep - The Final Approach'
            }
        ];
    }

    // Called when a monster is defeated
    onMonsterDefeated(monsterLevel) {
        // Each monster defeated = 10 feet deeper
        this.currentDepth += 10;
        
        // Cap at max depth
        if (this.currentDepth > this.maxDepth) {
            this.currentDepth = this.maxDepth;
        }
        
        // Check for environment change
        this.checkEnvironmentChange();
        
        // Reveal lore snippet
        this.revealLoreSnippet();
        
        // Update UI
        this.updateDepthMeter();
        
        // Save progress
        this.saveProgress();
    }

    checkEnvironmentChange() {
        const newEnv = this.environments.find(env => 
            this.currentDepth >= env.minDepth && 
            this.currentDepth < env.maxDepth
        );
        
        if (newEnv && newEnv.name !== this.currentEnvironment) {
            this.currentEnvironment = newEnv.name;
            this.transitionToEnvironment(newEnv);
        }
    }

    transitionToEnvironment(environment) {
        // Show transition screen
        this.showEnvironmentTransition(environment);
        
        // Change background
        setTimeout(() => {
            this.changeBackground(environment.background);
        }, 2000);
    }

    showEnvironmentTransition(environment) {
        const modal = document.createElement('div');
        modal.className = 'environment-transition';
        modal.innerHTML = `
            <div class="transition-content">
                <h2>${environment.title}</h2>
                <p>${environment.description}</p>
                <div class="depth-indicator">
                    <span class="depth-icon">⬇️</span>
                    <span class="depth-text">${this.currentDepth} feet deep</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fade in
        setTimeout(() => modal.classList.add('visible'), 100);
        
        // Fade out after 4 seconds
        setTimeout(() => {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 1000);
        }, 4000);
    }

    changeBackground(backgroundPath) {
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.style.backgroundImage = `url('${backgroundPath}')`;
            gameArea.style.backgroundSize = 'cover';
            gameArea.style.backgroundPosition = 'center';
            gameArea.style.backgroundAttachment = 'fixed';
        }
    }

    revealLoreSnippet() {
        // Get lore snippet for current depth
        const snippet = this.getLoreSnippetForDepth(this.currentDepth);
        
        if (snippet && !this.loreCollected.includes(snippet.id)) {
            this.showLoreModal(snippet);
            this.loreCollected.push(snippet.id);
        }
    }

    getLoreSnippetForDepth(depth) {
        // Find snippet closest to current depth that hasn't been collected
        const availableSnippets = loreSnippets.filter(
            snippet => !this.loreCollected.includes(snippet.id)
        );
        
        if (availableSnippets.length === 0) return null;
        
        // Get snippets for current environment
        const currentEnvSnippets = availableSnippets.filter(
            snippet => snippet.environment === this.currentEnvironment
        );
        
        if (currentEnvSnippets.length === 0) return null;
        
        // Return random snippet from current environment
        return currentEnvSnippets[
            Math.floor(Math.random() * currentEnvSnippets.length)
        ];
    }

    showLoreModal(snippet) {
        const modal = document.createElement('div');
        modal.className = 'lore-modal';
        modal.innerHTML = `
            <div class="lore-content">
                <div class="lore-header">
                    <span class="lore-icon">📜</span>
                    <h3>Lore Discovered</h3>
                </div>
                <div class="lore-text">
                    <p>${snippet.text}</p>
                </div>
                <div class="lore-footer">
                    <span class="lore-unlock">${snippet.unlocks}</span>
                    <button class="btn-small" onclick="this.closest('.lore-modal').remove()">
                        Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fade in
        setTimeout(() => modal.classList.add('visible'), 100);
    }

    updateDepthMeter() {
        // Update depth meter UI
        const depthMeter = document.getElementById('depth-meter');
        if (depthMeter) {
            const percentage = (this.currentDepth / this.maxDepth) * 100;
            depthMeter.querySelector('.depth-progress').style.width = `${percentage}%`;
            depthMeter.querySelector('.depth-text').textContent = 
                `${this.currentDepth} / ${this.maxDepth} feet`;
        }
    }

    async saveProgress() {
        // Save to database
        if (typeof codeQuestDB !== 'undefined') {
            await codeQuestDB.saveProgressionData({
                currentDepth: this.currentDepth,
                currentEnvironment: this.currentEnvironment,
                loreCollected: this.loreCollected
            });
        }
    }

    async loadProgress() {
        // Load from database
        if (typeof codeQuestDB !== 'undefined') {
            const data = await codeQuestDB.getProgressionData();
            if (data) {
                this.currentDepth = data.currentDepth || 0;
                this.currentEnvironment = data.currentEnvironment || 'wasteland';
                this.loreCollected = data.loreCollected || [];
                
                // Set correct background
                const env = this.environments.find(e => e.name === this.currentEnvironment);
                if (env) {
                    this.changeBackground(env.background);
                }
                
                this.updateDepthMeter();
            }
        }
    }
}

// Initialize
const progressionSystem = new ProgressionSystem();
```

---

## 🎨 Step 4: Add UI Elements

### Add Depth Meter to `index.html`

Add this inside the `#game-area` section:

```html
<!-- Depth Meter -->
<div id="depth-meter" class="depth-meter">
    <div class="depth-header">
        <span class="depth-icon">⬇️</span>
        <span class="depth-label">Descent to Meridaeia</span>
    </div>
    <div class="depth-bar">
        <div class="depth-progress" style="width: 0%"></div>
    </div>
    <div class="depth-footer">
        <span class="depth-text">0 / 500 feet</span>
        <span class="environment-name">The Scorched Wasteland</span>
    </div>
</div>
```

### Add CSS to `styles.css`

```css
/* Depth Meter */
.depth-meter {
    position: fixed;
    top: 100px;
    right: 20px;
    width: 250px;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid var(--accent-gold);
    border-radius: 12px;
    padding: 15px;
    backdrop-filter: blur(10px);
    z-index: 100;
}

.depth-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.depth-icon {
    font-size: 1.5rem;
}

.depth-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--accent-gold);
}

.depth-bar {
    width: 100%;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
}

.depth-progress {
    height: 100%;
    background: linear-gradient(90deg, #ff6b6b, #ee5a6f, #c44569);
    transition: width 0.5s ease;
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}

.depth-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
}

.depth-text {
    color: #fff;
    font-weight: 500;
}

.environment-name {
    color: var(--accent-gold);
    font-style: italic;
}

/* Lore Modal */
.lore-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.5s ease;
}

.lore-modal.visible {
    opacity: 1;
}

.lore-content {
    max-width: 600px;
    background: linear-gradient(135deg, #2c1810, #1a0f0a);
    border: 3px solid var(--accent-gold);
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    position: relative;
}

.lore-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23000" opacity="0.1" width="100" height="100"/><path d="M0,0 L100,100 M100,0 L0,100" stroke="%23fff" opacity="0.03"/></svg>');
    border-radius: 16px;
    pointer-events: none;
}

.lore-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.lore-icon {
    font-size: 2rem;
}

.lore-header h3 {
    color: var(--accent-gold);
    font-size: 1.5rem;
    margin: 0;
}

.lore-text {
    background: rgba(0, 0, 0, 0.3);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid var(--accent-gold);
}

.lore-text p {
    color: #e0e0e0;
    line-height: 1.8;
    font-size: 1.1rem;
    margin: 0;
    font-family: 'Georgia', serif;
    font-style: italic;
}

.lore-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lore-unlock {
    color: var(--accent-gold);
    font-weight: 600;
    font-size: 0.9rem;
}

/* Environment Transition */
.environment-transition {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 1s ease;
}

.environment-transition.visible {
    opacity: 1;
}

.transition-content {
    text-align: center;
    max-width: 600px;
    padding: 40px;
}

.transition-content h2 {
    font-size: 3rem;
    color: var(--accent-gold);
    margin-bottom: 20px;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.transition-content p {
    font-size: 1.3rem;
    color: #e0e0e0;
    margin-bottom: 30px;
    line-height: 1.6;
}

.depth-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 1.5rem;
    color: #ff6b6b;
}
```

---

## 🔗 Step 5: Integrate with Game Logic

### Modify `game.js`

Find the `checkAnswer()` function and add:

```javascript
async checkAnswer(selectedIndex) {
    // ... existing code ...
    
    if (isCorrect) {
        // ... existing code ...
        
        // NEW: Trigger progression system
        progressionSystem.onMonsterDefeated(this.currentMonster.level);
    }
    
    // ... rest of existing code ...
}
```

### Load progression on game start

Add to the `init()` function:

```javascript
async init() {
    // ... existing code ...
    
    // Load progression data
    await progressionSystem.loadProgress();
    
    // ... rest of existing code ...
}
```

---

## 📦 Step 6: Create Lore Data File

Create `lore-data.js`:

```javascript
// lore-data.js
const loreSnippets = [
    // WASTELAND (0-100 feet)
    {
        id: 'wasteland_01',
        environment: 'wasteland',
        text: 'The Syntax Goblin falls, whispering: "The Great Compiler once parsed all code with perfect logic. But Marakathalessa corrupted its core with a single semicolon. Now only those who understand the Ancient Syntax can restore it."',
        unlocks: 'Lore Fragment 1/50',
        depth: 10
    },
    // ... add 49 more snippets ...
];
```

---

## ✅ Testing Checklist

- [ ] Depth meter appears in game
- [ ] Depth increases when monsters are defeated
- [ ] Background changes at 100, 200, 300, 400 feet
- [ ] Lore snippets appear randomly
- [ ] Lore snippets don't repeat
- [ ] Environment transitions are smooth
- [ ] Progress saves and loads correctly
- [ ] Mobile responsive

---

## 🚀 Deployment

1. Test locally
2. Commit changes
3. Push to GitHub
4. Vercel auto-deploys
5. Test on live site
6. Share with friends!

---

## 📞 Need Help?

If you get stuck:
1. Check browser console for errors
2. Test each system independently
3. Ask for help with specific error messages

---

**Next**: Once Phase 4 is complete, move to Phase 5 (Collectible Relics)!

God bless! 🙏
