# The Meridaeia Codex of Design Wisdom

*Deep research: RPG design psychology, medieval feature staples, and learning
science — mapped to what Code of Meridaeia has today and what it should build
next. Compiled July 2026.*

---

## Part I — The Psychology That Powers RPGs

### 1. The Compulsion Loop (anticipation → action → reward)
Every great RPG runs a loop: the player *anticipates* a reward, *acts*, gets
the *reward*, and the reward seeds the next anticipation. The loop must close
in seconds (a hit), minutes (a monster), and hours (a chapter).

**Meridaeia today:** micro-loop is strong (answer → damage → gold/XP).
The session loop is decent (chapter → story unlock). The multi-session loop is
weak — nothing pulls a player back tomorrow.
**Opportunity:** a Daily Bounty (see Part III) closes the missing loop.

### 2. Variable Rewards (the loot-drop principle)
Unpredictable rewards trigger far stronger engagement than fixed ones —
this is why loot drops define the genre. Fixed +5 gold is *wages*; a chance
at a rare drop is *treasure*.

**Meridaeia today:** all rewards are fixed and predictable (5 gold/correct,
20/kill). There is zero variance anywhere in the economy.
**Opportunity #1 (highest impact-per-line in this codex):** monster kills roll
a loot drop with rarity tiers — Common (gray) / Uncommon (green) / Rare (blue)
/ Epic (purple) / Legendary (gold). Even if drops are just gold amounts +
flavor names at first ("Goblin's Cracked Semicolon — 12g"), the *roll moment*
with a rarity color is the dopamine event. Streaks can raise drop quality —
tying luck to mastery keeps it honest.

### 3. Loss Aversion & Streaks (use White Hat, not Black Hat)
Duolingo's streak raised next-day retention from ~12% to ~55%. But research
(Octalysis, Core Drive 8) warns streaks over-reliant on loss aversion
backfire: a long streak lost feels like annihilation and players quit
permanently.

**Meridaeia today:** in-battle answer streak exists (good, low-stakes).
No daily streak.
**Opportunity:** a *daily quest streak* with a mercy mechanic from day one —
a "Barrier Blessing" (streak freeze) earned every 7 days that auto-protects a
missed day. Warm pressure, never a trap.

### 4. Endowed Progress & the Zeigarnik Effect
People finish things that look partially complete, and started-but-unfinished
tasks occupy the mind. RPGs exploit this with quest logs, partially-filled
bars, and "2/3 chapters complete" markers everywhere.

**Meridaeia today:** chapter checkmarks exist but overall campaign progress is
invisible — a player can't see "you are 40% through reclaiming Meridaeia."
**Opportunity:** a Campaign Map / progress sigil on the hero screen: 15
chapters + 1 boss = one visible conquest meter that is never at zero.

### 5. The Octalysis Audit (8 core drives)
| Drive | In Meridaeia | Verdict |
|---|---|---|
| 1. Epic Meaning | Save the realm, redeem the Witch | ✅ Strong |
| 2. Accomplishment | XP, levels, achievements (only 4!) | ⚠️ Thin |
| 3. Creativity/Feedback | Build choices: gear, skills, hints | ✅ OK |
| 4. Ownership | Gold, inventory, named hero | ✅ OK |
| 5. Social Influence | Leaderboard UI exists, no data flows | ❌ Missing |
| 6. Scarcity | Locked heroes/chapters/true ending | ✅ Strong |
| 7. Unpredictability | Nothing is random except question order | ❌ Missing |
| 8. Loss/Avoidance | Barrier + defeat (new) | ✅ Healthy dose |

The two holes — Social (5) and Unpredictability (7) — are exactly the
leaderboard write-path and loot drops. The research converges.

### 6. Flow: the difficulty saw-tooth
Challenge must ride slightly above skill, dipping after peaks. Mixed-difficulty
shuffling breaks this (a hard question can open Chapter 1).

**Opportunity:** order each chapter's questions easy → medium → hard
(one-line sort after shuffle); scale monster HP with difficulty tier so
"harder enemy" is legible fiction, not just a label.

### 7. Juice: impact you can feel
Hit-stop (freezing the frame 3–5 frames on impact) and contextual screen
shake are the cheapest "visceral combat" tools known. Skyrim shipped without
hit-stop and modders spent a decade adding it. Juice must echo the game's
tone — ours is retro-arcade, which tolerates strong juice.

**Meridaeia today:** screen shake, lunges, hit reactions, damage numbers,
SFX — mostly done this cycle.
**Opportunity:** 60–90ms hit-stop on monster kills and boss FINAL BLOW
(brief `animation-play-state` pause + zoom pulse); gold-rain particle burst on
Legendary drops.

---

## Part II — Learning Science (the reason this game exists)

### 8. Retrieval practice is the win condition
Testing yourself beats re-reading — the quiz battle format *is* the
scientifically correct choice. Guard it: never let hints trivially reveal
answers (already capped), and keep explanations teaching the *why*
(house rule in the question-author agent).

### 9. Spaced repetition: the missed-question loop
The single biggest learning upgrade available: track every wrongly-answered
question and re-surface it after a delay (1 day → 3 days → 7 days, SM-2-lite).
Frame it diegetically: **"The Grimoire of Mistakes"** — wrong answers become
*Restless Wraiths* that return to haunt random encounters until defeated
twice in a row, at which point they are "laid to rest" (mastered).
IndexedDB progress records already store `questionId + isCorrect` — the data
layer is done; only the scheduler and encounter hook are missing.

### 10. The grinding trap (research warning)
Learning-game studies flag a failure mode: fun loops make players re-play
content they've already mastered — entertaining, but zero learning. 
**Mitigation:** replayed chapters give reduced XP for questions already
answered correctly twice (loot/gold stays, so replay still feels rewarding);
Wraith encounters (which target weaknesses) give *bonus* XP.

### 11. Cognitive load & scaffolding
Introduce one concept per question; put code front-and-center (done this
cycle: auto-expanded code blocks); explanations immediately after the answer
(done). Keep option counts at 4 — more inflates load without adding rigor.

---

## Part III — Medieval Staples Worth Stealing (prioritized)

| # | Feature | Genre precedent | Meridaeia shape | Size |
|---|---|---|---|---|
| 1 | **Loot rarity tiers** | Diablo/WoW color grammar | Kill drops with rarity roll, colored toast + shelf in inventory | M |
| 2 | **Daily Bounty Board** | MMO dailies, tavern quests | 3 daily challenges ("Slay 5 monsters", "Perfect a chapter", "Answer 3 kernel questions"), gold/XP + streak | M |
| 3 | **Bestiary codex** | Witcher/Skyrim lore books | Kill counters per monster + lore unlocks at 5/25 kills (lore text already exists!) | S |
| 4 | **Grimoire of Mistakes** | (Learning science, dressed as necromancy) | Spaced-repetition wraith encounters | M |
| 5 | **Campaign conquest map** | Every strategy RPG | 5 regions = 5 heroes; visual reclamation of Meridaeia | M |
| 6 | **Blacksmith upgrades** | Crafting lite | Spend gold + "Corrupted Fragments" (rare drops) to upgrade owned gear +1/+2/+3 | M |
| 7 | **Titles & prestige** | Achievements with identity | Earned titles shown under username ("Wraith-Slayer", "Uncompiled") | S |
| 8 | **Random events** | Roguelike shrines | 5% chance per question: a Wandering Merchant (flash sale), Shrine of Logic (free barrier), Mimic (double-or-nothing gold) | M |
| 9 | **New Game+ / Nightmare** | Genre-wide | Timer -20s, barrier 2, XP ×1.5 for completed heroes | S |
| 10 | **Guild/social layer** | MMOs (+40% retention research) | After leaderboard writes: weekly guild XP totals | L |

**Recommended build order:** 3 (bestiary — smallest, uses existing lore) →
1 (loot) → 2 (dailies) → 4 (grimoire) → 5 (map) → the rest.

---

## Part IV — The Image Forge (art pipeline)

The [claude-code-generate-images-mcp](https://github.com/TamerinTECH/claude-code-generate-images-mcp)
server lets Claude generate images straight into the repo — ideal for loot
icons, region art for the campaign map, bounty-board parchment, and wraith
portraits, all needed by Part III.

**Setup (one-time, on your machine):**
```bash
git clone https://github.com/TamerinTECH/claude-code-generate-images-mcp.git
cd claude-code-generate-images-mcp && ./install.sh
# Get a free-tier key: https://aistudio.google.com/app/apikey
```
Then register it (`claude mcp add`, or in `.mcp.json`):
```json
{
  "mcpServers": {
    "image-generator": {
      "command": "node",
      "args": ["<absolute-path-to-clone>/src/index.js"],
      "env": { "GEMINI_API_KEY": "<your-key>" }
    }
  }
}
```
Default model is Gemini image generation (free tier ~15 req/min), Azure
OpenAI (Flux 1.1 Pro / gpt-image-1) optional.

**Meridaeia house style prompt** (prepend to every generation so new art
matches the existing portraits):
> Dark fantasy digital painting with retro pixel-art texture, dramatic rim
> lighting, deep indigo-and-ember palette (#0a0a0f background, #6366f1 arcane
> glow, #ff6b3d ember accents), painterly but crisp, centered subject,
> square composition, no text, style consistent with a 16-bit era RPG
> remastered in HD.

---

## Sources

- [The Compulsion Loop in Game Design Explained](https://www.gamemakers.com/p/the-compulsion-loop-explained)
- [How American Game Developers Use Reward Systems to Maximize Player Retention](https://gamedesigning.org/beyond/how-american-game-developers-use-reward-systems-to-maximize-player-retention/)
- [Master Game Design Psychology and Player Behavior](https://pixune.com/blog/game-design-psychology/)
- [Streak Design: 4 Rules Behind Duolingo's Loop — Yu-kai Chou](https://yukaichou.com/gamification-study/master-the-art-of-streak-design-for-short-term-engagement-and-long-term-success/)
- [What Is Gamification? 8 Core Drives — Yu-kai Chou](https://yukaichou.com/gamification-examples/what-is-gamification/)
- [Duolingo review — how to apply Gamification smarter (Octalysis Group)](https://octalysisgroup.com/duolingo-review/)
- [The Duolingo Streak Uses Habit Research to Keep You Motivated](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)
- [Designing for Motivation: Spaced-Repetition-Based Learning Games](https://www.researchgate.net/publication/268126812_Designing_for_Motivation_Design-Considerations_for_Spaced-Repetition-Based_Learning_Games_on_Mobile_Devices)
- [Optimal spacing — retrievalpractice.org](https://www.retrievalpractice.org/strategies/optimal-spacing)
- [Educational Game Design: Principles and Applications](https://www.drmattlynch.com/educational-game-design-principles-and-applications/)
- [Squeezing more juice out of your game design — GameAnalytics](https://www.gameanalytics.com/blog/squeezing-more-juice-out-of-your-game-design)
- [The "Juice" Problem — Wayline](https://www.wayline.io/blog/the-juice-problem-how-exaggerated-feedback-is-harming-game-design)
- [22 Tips to Increase Player Retention in Games](https://www.game-developers.org/22-tips-to-increase-player-retention-in-games-the-definitive-guide)
- [claude-code-generate-images-mcp](https://github.com/TamerinTECH/claude-code-generate-images-mcp)
