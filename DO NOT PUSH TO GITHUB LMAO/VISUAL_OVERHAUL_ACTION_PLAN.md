# 🎯 Visual Overhaul - Action Plan
## Step-by-Step Implementation Guide

**Goal**: Transform Code of Meridaeia from "vibe coded" to visually stunning  
**Timeline**: 1-2 weeks  
**Difficulty**: Medium (we'll make it easy!)

---

## 📅 Day-by-Day Plan

### Day 1: Generate Hero Portraits (2 hours)

**Morning** (1 hour):
1. Open Gemini image generation
2. Copy prompts from `GEMINI_PROMPTS.md`
3. Generate all 5 hero portraits
4. Download and save to `/assets/heroes/`

**Afternoon** (1 hour):
1. Replace existing hero images in `index.html`
2. Test character selection screen
3. Adjust CSS if needed (sizing, positioning)

**Deliverable**: ✅ Epic hero portraits in character selection

---

### Day 2: Generate Environment Tiles (2 hours)

**Morning** (1 hour):
1. Generate 5 environment tiles (seamless)
2. Download and save to `/assets/environments/`

**Afternoon** (1 hour):
1. Test tiles in CSS (make sure they tile seamlessly)
2. If edges don't match, regenerate with "seamless edges" emphasized
3. Create CSS classes for each environment

**Deliverable**: ✅ 5 tileable environment backgrounds

---

### Day 3: Implement Tiled Backgrounds (3 hours)

**Task**: Add environment tiles to game area

**Step 1**: Update CSS (30 minutes)
```css
/* Add to styles.css */

.game-area {
    position: relative;
    min-height: 100vh;
    background-color: #0a0a0a;
}

/* Environment backgrounds */
.env-wasteland {
    background-image: url('../assets/environments/tile-wasteland.png');
    background-size: 512px 512px;
    background-repeat: repeat;
    background-position: center;
}

.env-forest {
    background-image: url('../assets/environments/tile-forest.png');
    background-size: 512px 512px;
    background-repeat: repeat;
    background-position: center;
}

.env-mountains {
    background-image: url('../assets/environments/tile-mountains.png');
    background-size: 512px 512px;
    background-repeat: repeat;
    background-position: center;
}

.env-lakes {
    background-image: url('../assets/environments/tile-lakes.png');
    background-size: 512px 512px;
    background-repeat: repeat;
    background-position: center;
}

.env-gates {
    background-image: url('../assets/environments/tile-gates.png');
    background-size: 512px 512px;
    background-repeat: repeat;
    background-position: center;
}
```

**Step 2**: Update JavaScript (1 hour)
```javascript
// Add to game.js

class EnvironmentManager {
    constructor() {
        this.currentEnvironment = 'wasteland';
        this.environments = [
            { name: 'wasteland', minDepth: 0, maxDepth: 100 },
            { name: 'forest', minDepth: 100, maxDepth: 200 },
            { name: 'mountains', minDepth: 200, maxDepth: 300 },
            { name: 'lakes', minDepth: 300, maxDepth: 400 },
            { name: 'gates', minDepth: 400, maxDepth: 500 }
        ];
    }
    
    setEnvironment(depth) {
        const env = this.environments.find(
            e => depth >= e.minDepth && depth < e.maxDepth
        );
        
        if (env && env.name !== this.currentEnvironment) {
            this.currentEnvironment = env.name;
            this.updateBackground();
        }
    }
    
    updateBackground() {
        const gameArea = document.getElementById('game-area');
        
        // Remove all environment classes
        this.environments.forEach(env => {
            gameArea.classList.remove(`env-${env.name}`);
        });
        
        // Add current environment class
        gameArea.classList.add(`env-${this.currentEnvironment}`);
    }
}

// Initialize
const environmentManager = new EnvironmentManager();
```

**Step 3**: Test (30 minutes)
1. Load game
2. Manually change environment classes in browser console
3. Verify tiles repeat seamlessly
4. Check mobile responsiveness

**Step 4**: Integrate with progression (1 hour)
```javascript
// In game.js, when monster is defeated:

onMonsterDefeated() {
    this.currentDepth += 10;
    environmentManager.setEnvironment(this.currentDepth);
    // ... rest of code
}
```

**Deliverable**: ✅ Backgrounds change based on depth

---

### Day 4: Redesign Homepage (4 hours)

**Task**: Create epic homepage with lore

**Step 1**: Create new HTML structure (1 hour)
```html
<!-- Replace existing category-select section -->

<section id="homepage" class="homepage">
    <!-- Hero Banner -->
    <div class="hero-banner">
        <div class="hero-background env-wasteland"></div>
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <h1 class="epic-title">
                <span class="title-main">Code of Meridaeia</span>
                <span class="title-sub">The Siege of Meridaeia</span>
            </h1>
            
            <div class="lore-intro">
                <p class="lore-text fade-in" style="animation-delay: 0.5s">
                    The Great Compiler has fallen...
                </p>
                <p class="lore-text fade-in" style="animation-delay: 1.5s">
                    Valerion, your home, is but ash and echoes.
                </p>
                <p class="lore-text fade-in" style="animation-delay: 2.5s">
                    Marakathalessa, the Witch of Corrupted Code, 
                    has stolen the Ancient Logic.
                </p>
                <p class="lore-text fade-in" style="animation-delay: 3.5s">
                    Only you can restore what was lost.
                </p>
            </div>
            
            <button class="cta-button fade-in" 
                    style="animation-delay: 4.5s"
                    onclick="showHeroSelection()">
                ⚔️ Begin Your Descent
            </button>
        </div>
    </div>
    
    <!-- Hero Selection (hidden initially) -->
    <div id="hero-selection" class="hero-selection hidden">
        <h2 class="section-title">Assemble Your Fellowship</h2>
        <p class="section-subtitle">
            Choose your hero to reclaim Valerion from the Witch
        </p>
        
        <div class="heroes-grid">
            <!-- Hero cards here (existing code) -->
        </div>
    </div>
</section>
```

**Step 2**: Add CSS styling (2 hours)
```css
/* Hero Banner */
.hero-banner {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        ellipse at center,
        rgba(10, 10, 10, 0.3) 0%,
        rgba(10, 10, 10, 0.8) 100%
    );
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 800px;
    padding: 2rem;
}

.epic-title {
    margin-bottom: 3rem;
}

.title-main {
    display: block;
    font-size: 4rem;
    font-weight: 700;
    color: var(--accent-gold);
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    margin-bottom: 0.5rem;
}

.title-sub {
    display: block;
    font-size: 1.5rem;
    color: #e0e0e0;
    font-style: italic;
}

.lore-intro {
    margin: 3rem 0;
}

.lore-text {
    font-size: 1.3rem;
    color: #e0e0e0;
    line-height: 1.8;
    margin: 1.5rem 0;
    opacity: 0;
}

.fade-in {
    animation: fadeInUp 1s forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.cta-button {
    font-size: 1.5rem;
    padding: 1.5rem 3rem;
    background: linear-gradient(135deg, var(--accent-gold), #d4af37);
    color: #000;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
}

.cta-button:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(255, 215, 0, 0.5);
}

/* Hero Selection */
.hero-selection {
    padding: 4rem 2rem;
    background: rgba(10, 10, 10, 0.9);
}

.section-title {
    font-size: 3rem;
    color: var(--accent-gold);
    text-align: center;
    margin-bottom: 1rem;
}

.section-subtitle {
    font-size: 1.2rem;
    color: #e0e0e0;
    text-align: center;
    margin-bottom: 3rem;
}

.heroes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}
```

**Step 3**: Add JavaScript (30 minutes)
```javascript
function showHeroSelection() {
    // Hide hero banner
    document.querySelector('.hero-banner').style.display = 'none';
    
    // Show hero selection
    document.getElementById('hero-selection').classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

**Step 4**: Test (30 minutes)
1. Load homepage
2. Watch lore text fade in
3. Click "Begin Your Descent"
4. Verify hero selection appears
5. Test on mobile

**Deliverable**: ✅ Epic homepage with lore introduction

---

### Day 5: Generate Monster Portraits (2 hours)

**Morning** (1 hour):
1. Generate 6 monster portraits
2. Download and save to `/assets/monsters/`

**Afternoon** (1 hour):
1. Update monster HUD to show portraits
2. Test in combat
3. Adjust sizing/positioning

**Deliverable**: ✅ Monster portraits in combat

---

### Day 6: Add Lore Snippets to Combat (3 hours)

**Task**: Show lore after defeating monsters

**Step 1**: Create lore modal HTML (30 minutes)
```html
<!-- Add to index.html -->

<div id="lore-modal" class="lore-modal hidden">
    <div class="lore-modal-content">
        <div class="lore-scroll">
            <div class="lore-header">
                <span class="lore-icon">📜</span>
                <h3>Lore Discovered</h3>
            </div>
            <p id="lore-text" class="lore-text"></p>
            <div class="lore-footer">
                <span id="lore-progress">Lore Fragment 1/50</span>
                <button class="btn" onclick="closeLoreModal()">
                    Continue
                </button>
            </div>
        </div>
    </div>
</div>
```

**Step 2**: Add CSS (1 hour)
```css
.lore-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.5s ease;
}

.lore-modal:not(.hidden) {
    opacity: 1;
}

.lore-scroll {
    max-width: 600px;
    background: linear-gradient(135deg, #2c1810, #1a0f0a);
    border: 3px solid var(--accent-gold);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    position: relative;
}

.lore-scroll::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,...'); /* Parchment texture */
    opacity: 0.1;
    border-radius: 16px;
}

.lore-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
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
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid var(--accent-gold);
    color: #e0e0e0;
    line-height: 1.8;
    font-size: 1.1rem;
    font-family: 'Georgia', serif;
    font-style: italic;
    margin-bottom: 1.5rem;
}

.lore-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lore-progress {
    color: var(--accent-gold);
    font-weight: 600;
}
```

**Step 3**: Add JavaScript (1 hour)
```javascript
// Add to game.js

let loreCollected = [];

function showLoreSnippet(snippet) {
    // Check if already collected
    if (loreCollected.includes(snippet.id)) {
        return;
    }
    
    // Mark as collected
    loreCollected.push(snippet.id);
    
    // Update UI
    document.getElementById('lore-text').textContent = snippet.text;
    document.getElementById('lore-progress').textContent = 
        `Lore Fragment ${loreCollected.length}/50`;
    
    // Show modal
    document.getElementById('lore-modal').classList.remove('hidden');
    
    // Save to database
    saveLoreProgress();
}

function closeLoreModal() {
    document.getElementById('lore-modal').classList.add('hidden');
}

// Call after defeating monster
onMonsterDefeated() {
    // ... existing code ...
    
    // Show random lore snippet
    const snippet = getRandomLoreSnippet();
    if (snippet) {
        setTimeout(() => showLoreSnippet(snippet), 1000);
    }
}
```

**Step 4**: Test (30 minutes)
1. Defeat a monster
2. Verify lore modal appears
3. Check text is readable
4. Test "Continue" button
5. Verify lore doesn't repeat

**Deliverable**: ✅ Lore snippets appear after combat

---

### Day 7: Polish & Test (3 hours)

**Morning** (2 hours):
1. Test entire flow (homepage → hero selection → combat → lore)
2. Fix any bugs
3. Adjust animations
4. Optimize images (compress if needed)
5. Test on mobile

**Afternoon** (1 hour):
1. Deploy to Vercel
2. Test on live site
3. Share with a friend for feedback
4. Make final tweaks

**Deliverable**: ✅ Polished, deployed game with new visuals

---

## 📋 Quick Checklist

### Assets Generated
- [x] 5 hero portraits ✅ COMPLETE (Dec 29, 2025)
- [x] 5 environment tiles ✅ COMPLETE (Dec 29, 2025)
- [ ] 5 atmospheric overlays (optional - available but not integrated)
- [x] 6 monster portraits ✅ COMPLETE (Dec 29, 2025)
- [x] 5+ UI icons ✅ COMPLETE (7 weapon/item icons available)

### Code Implemented
- [x] Hero portraits in character selection ✅ COMPLETE
- [x] Tiled backgrounds in game area ✅ COMPLETE
- [x] Environment manager (changes backgrounds) ✅ COMPLETE
- [x] New homepage with lore intro (already in place)
- [ ] Lore modal after combat (future enhancement)
- [ ] Lore collection tracking (future enhancement)

### Testing Complete
- [x] Homepage loads correctly ✅ VERIFIED
- [x] Hero selection works ✅ VERIFIED
- [x] Backgrounds tile seamlessly ✅ VERIFIED
- [x] Backgrounds change with depth ✅ VERIFIED
- [ ] Lore appears after combat (not yet implemented)
- [ ] Mobile responsive (not yet tested on device)
- [ ] Deployed to Vercel (pending)

---

## 🚀 Quick Start (Right Now!)

**Do these 3 things in the next 30 minutes**:

1. **Generate Artemis portrait** (10 min)
   - Copy prompt from GEMINI_PROMPTS.md
   - Generate in Gemini
   - Download and save

2. **Generate Wasteland tile** (10 min)
   - Copy prompt from GEMINI_PROMPTS.md
   - Generate in Gemini
   - Download and save

3. **Test in game** (10 min)
   - Replace hero image in HTML
   - Add wasteland tile to CSS
   - Refresh and admire!

**You'll feel AMAZING seeing your game come to life!** 🔥

---

**Ready? Let's DO THIS!** 🎨⚔️
