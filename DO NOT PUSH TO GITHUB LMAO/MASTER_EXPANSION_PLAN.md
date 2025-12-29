# 🎮 Code of Meridaeia - Master Expansion Plan

**Total Scope**: 4 Major Phases  
**Estimated Timeline**: 2-4 weeks  
**Backup Tag**: `v1.0-visual-complete`

---

## Phase A: UI/UX Improvements

**Goal**: Make the game responsive, uniform, and mobile-optimized.

### A1. Responsive Image Sizing
- Ensure all hero/monster portraits scale uniformly
- Use CSS `object-fit` and `aspect-ratio` for consistency
- Test at multiple viewport sizes

#### [MODIFY] [styles.css](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/styles.css)
- Add responsive image classes
- Set max-width constraints
- Use CSS Grid/Flexbox for uniform cards

### A2. Collapsible Bottom Navigation
- Add toggle button to show/hide bottom bar
- Save preference to localStorage
- Auto-collapse on small screens

#### [MODIFY] [index.html](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/index.html)
- Add toggle button element

#### [MODIFY] [game.js](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/game.js)
- Add toggle function and state management

### A3. Force Landscape on Mobile
- Detect portrait orientation
- Show "rotate device" overlay
- Lock orientation if supported by browser

#### [MODIFY] [styles.css](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/styles.css)
- Add landscape lock CSS

#### [MODIFY] [index.html](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/index.html)
- Add rotation prompt overlay

### A4. Remove Skip Intro Button
- Hide the skip button temporarily
- Will be re-enabled after story improvements

#### [MODIFY] [index.html](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/index.html)
- Comment out skip intro button

---

## Phase B: Chapter System & Story Progression

**Goal**: Restructure game with 3 chapters per character (30 questions each).

### B1. Question Restructure
- Organize existing questions into chapters
- Add 18+ new questions per character (to reach 30)
- Tag questions with chapter number

#### [MODIFY] Question files:
- `questions/java.js` → 30 questions, 3 chapters
- `questions/cpp.js` → 30 questions, 3 chapters
- `questions/networking.js` → 30 questions, 3 chapters
- `questions/data-engineering.js` → 30 questions, 3 chapters
- `questions/kernel.js` → 30 questions, 3 chapters

### B2. Chapter Selection UI
- Add chapter selection screen after hero selection
- Show locked/unlocked chapters
- Display progress per chapter

#### [MODIFY] [index.html](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/index.html)
- Add chapter selection section

### B3. Story Integration
- Add story text between chapters
- Create lore snippets that advance the narrative
- Each chapter ends with a mini-boss or story revelation

#### [NEW] [story-data.js](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/story-data.js)
- Chapter intro/outro text
- Story progression per character

### B4. Progress Tracking
- Track which chapters are complete
- Save to database
- Unlock next chapter on completion

#### [MODIFY] [database.js](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/database.js)
- Add chapter progress schema

---

## Phase C: Marakathalessa Boss Fight

**Goal**: Create final boss encounter with code-typing mechanic.

### C1. Boss Fight Unlock
- Unlock after completing all 3 chapters of ANY character
- Show as locked until condition met

#### [MODIFY] [game.js](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/game.js)
- Add unlock condition check

### C2. Code Typing Input
- Replace multiple choice with text input
- Validate against correct answer
- Case-insensitive matching with flexibility

#### [NEW] Component: Code Input Challenge
- Text area for code input
- Syntax highlighting (optional)
- Submit and validate

### C3. Hint System
- Provide progressive hints
- Hints cost gold or reduce XP
- Thematic hints (e.g., `println("Use staff void")`)

#### [MODIFY] [game.js](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/game.js)
- Add hint display logic

### C4. "Incomplete" Defeat
- First time defeating Marakathalessa = incomplete ending
- She escapes, reveals more lore
- Player must complete OTHER paths to truly defeat

---

## Phase D: True Ending & Marakathalessa Unlock

**Goal**: Reward players who complete ALL paths with the true ending.

### D1. All-Path Completion Check
- Track completion of all 5 character storylines
- Store in database

### D2. True Final Boss
- Enhanced Marakathalessa fight
- Harder questions from all categories
- "The Legion of 404" is revealed

### D3. Marakathalessa Playable Character
- Unlock as 6th playable character
- Her story is about her corruption
- 3 chapters of her backstory

#### [MODIFY] Question files:
- [NEW] `questions/marakathalessa.js` → 30 questions, her story

### D4. Legion of 404 Lore
- Introduce the mysterious organization
- They are the true villains
- Sets up future expansion

#### [MODIFY] [lore-data.js](file:///Users/monskiemonmon427/LGTM%20Antigravity%20Made%20Game/lore-data.js)
- Add Legion of 404 lore entries

---

## Verification Plan

### Per-Phase Testing

| Phase | Tests |
|-------|-------|
| A | Responsive on mobile, landscape lock works, menus toggle |
| B | Chapters load correctly, progress saves, stories display |
| C | Boss unlocks, code input works, hints display |
| D | True ending triggers, Marakathalessa unlocks |

### Browser Testing
- Chrome Desktop
- Chrome Mobile (DevTools)
- Safari iOS (if available)
- Actual mobile device

---

## Priority Order

```
Phase A (UI) → Phase B (Chapters) → Phase C (Boss) → Phase D (Unlock)
     ↓              ↓                   ↓               ↓
  1-2 days       3-5 days            2-3 days        2-3 days
```

> [!IMPORTANT]
> Each phase should be committed separately for easy rollback.

---

## Quick Reference

### Git Backup Tag
```bash
git tag v1.0-visual-complete  # Created Dec 29, 2025
```

### Restore if needed
```bash
git checkout v1.0-visual-complete
```
