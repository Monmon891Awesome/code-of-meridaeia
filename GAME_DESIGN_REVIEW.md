# Code of Meridaeia — Game Design Review

*Sample deliverable in the style of Claude-Code-Game-Studios' `/design-review` +
`/balance-check` workflow, applying MDA, Flow, Self-Determination Theory, and
Bartle player types to the current build (branch `claude/game-audit-playability-k0axut`).*

---

## 1. MDA Analysis (Mechanics → Dynamics → Aesthetics)

### Mechanics (rules as implemented)
| Mechanic | Implementation |
|---|---|
| Combat | Multiple-choice answers deal 25+ dmg; monsters have 100 HP |
| Risk | Wrong/timeout costs 1 barrier point; 0 barrier = defeat |
| Timer | 60s base, extendable via accessories/skills |
| Economy | +5 gold per correct, +20 per kill; hints cost 10 gold |
| Progression | XP → levels; chapters gate content; 50% accuracy to clear |
| Boss | Typed answers, 1000 HP, damage scales with fewer hints used |
| Streaks | +10%/consecutive correct (cap +50%) |

### Dynamics (behavior that emerges)
- **Hint economics work:** hints cost gold that also buys gear, so spending on a
  hint is a real trade — good tension. In the boss fight this doubles: hints
  also *reduce your damage*, so hoarding knowledge is rewarded twice.
- **Streak preservation** creates "one more careful read" moments — the player
  slows down at streak 3+ because there's something to lose. Healthy.
- **Barrier management** now matters (defeat exists), but there's no mid-quest
  way to recover barrier except a shop consumable most players won't own yet.
  First-session players who hit 0 barrier lose with no counterplay. *(Watch.)*

### Aesthetics (experiences delivered)
- **Challenge** ✅ strong — real CS questions with stakes.
- **Fantasy** ✅ strong — hero classes map cleverly to disciplines (Malloc the
  Void-Walker for C++ is genuinely good theming).
- **Narrative** ✅ good — chapter intros, lore modals, redemption arc.
- **Fellowship** ⚠️ weakest pillar — the game is fully single-player today
  (leaderboard reads an empty table). See §4.

## 2. Flow-State Check (challenge vs. skill curve)

**Finding F1 — flat difficulty inside chapters.** Questions within a chapter are
shuffled uniformly, so a `hard` question can open Chapter 1 while an `easy` one
closes Chapter 3. Flow design wants a saw-tooth ramp: open easy, close hard.
> **Recommendation:** sort each chapter's drawn questions easy → medium → hard
> after shuffling within each difficulty band. One-line change in
> `continueChapterStart()`; large felt-difficulty payoff.

**Finding F2 — fixed 60s timer regardless of question size.** A 9-line
concurrency question and a one-line definition both get 60s, so pressure is
uneven. Consider +15s when `question.code` is present.

**Finding F3 — no failure recovery loop.** On defeat the player restarts the
chapter cold. A "second wind" (answer one review question correctly to restore
1 barrier, once per quest) keeps the anxiety edge of Flow without the rage-quit
cliff.

## 3. Self-Determination Theory (motivation audit)

| Need | Verdict | Evidence & gap |
|---|---|---|
| **Competence** | ✅ Strong | XP, levels, accuracy %, streak flair, boss damage scaling |
| **Autonomy** | ✅ Good | 5 hero paths freely chosen; shop/skill builds; hint-or-risk choice |
| **Relatedness** | ❌ Missing | Leaderboard UI exists but nothing writes scores (Supabase `player_profiles` never receives data) |

The single highest-leverage motivation fix is finishing the leaderboard write
path — it converts an existing, polished UI from dead weight into the game's
only social feature.

## 4. Bartle Player Types (audience coverage)

- **Achievers** ✅ — achievements, levels, perfect-round bonus. *Expand:* only 4
  achievements exist; boss/streak/economy achievements are free wins.
- **Explorers** ✅ — hero lore modals, monster bestiary, hidden true ending,
  unlockable Marakathalessa story. Best-served type. Keep investing.
- **Socializers** ❌ — blocked on leaderboard writes (§3).
- **Killers** ⚠️ — boss fight + streaks partially serve them; a weekly
  "speedrun" leaderboard (best XP in one chapter) would complete the loop
  using infrastructure the leaderboard fix already requires.

## 5. Prioritized Backlog (sprint-story format)

| # | Story | Type | Size | Why now |
|---|---|---|---|---|
| 1 | Leaderboard score submission (upsert on quest end; anon key + RLS policy) | Feature | M | Unblocks Relatedness + Socializers; UI already built |
| 2 | Intra-chapter difficulty ramp (easy→hard ordering) | Balance | S | Biggest Flow win per line of code |
| 3 | +15s timer bonus on code questions | Balance | S | Evens pressure across question types |
| 4 | "Second wind" barrier recovery (once per quest) | Feature | S | Softens the new defeat mechanic for beginners |
| 5 | 8–10 new achievements (boss slayer, 5-streak, first purchase, all-hero clear) | Content | S | Achiever retention; system already exists |
| 6 | Grimoire of Mistakes: end-of-quest review of missed questions, re-answer for half XP | Feature | M | Turns failure into the actual learning loop |
| 7 | Weekly chapter-speedrun board | Feature | M | Killers; reuses story #1 plumbing |

## 6. Quality-Gate Notes (what already passes)

Verified this sprint: defeat/victory paths, boss win/loss states, keyboard-only
play, touch play in portrait, `prefers-reduced-motion` support in the new
landing sample, and zero console errors across the regression flow. The
combat loop is now mechanically sound; the backlog above is tuning and reach,
not repair.
