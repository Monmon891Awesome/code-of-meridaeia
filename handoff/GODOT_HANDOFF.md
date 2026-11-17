# Code of Meridaeia — Godot Handoff

This file briefs whoever builds the Godot version (a person, or a Claude Code session). It is self-contained: you can build from this file plus the `data/` folder next to it.

## 1. The goal

Rebuild Code of Meridaeia as a **native macOS game in Godot 4**, on an Apple Silicon Mac (M1).

- Single-player only. No accounts, no server, no leaderboard.
- Same game as the web version: same questions, rules, numbers and story.
- New visuals. The web version's 3D characters are built from code shapes and do **not** carry over.

The web version stays live. This port does not replace it.

## 2. What the game is

A coding-quiz RPG. The player picks a hero, enters a chapter, and fights monsters by answering coding questions.

- **Right answer:** the hero attacks the monster.
- **Wrong answer or time runs out:** the monster hits the hero's barrier.
- **Barrier at 0:** the hero is defeated and the chapter fails.

### Screen flow

1. **Title** → Begin.
2. **Prologue** story card (first time only).
3. **Hero select** — a carousel of 7 entries: 5 heroes, the boss, and one unlockable hero.
4. **Chapter select** — 3 chapters per hero, unlocked in order.
5. **Chapter story** card → **Battle**.
6. **Results** → back to chapters or heroes.

The Armory (shop), Skills, Bag, Codex, Hero sheet and Settings open as pop-ups from a top bar. During a battle only the Bag and Settings are available.

## 3. The data folder

Everything in `data/` is plain JSON exported from the web version. Load it in Godot with `FileAccess` and `JSON.parse_string`. **Do not retype any of it.**

| File | Contents |
|---|---|
| `questions.json` | Multiple-choice questions, keyed by hero. Each has `chapter` (1–3), `difficulty`, `question`, `code` (may be null), 4 `options`, `correctAnswer` (index 0–3), `explanation`. |
| `boss_questions.json` | 10 typed-answer boss questions with `acceptedAnswers` and 3 `hints` each. |
| `heroes.json` | The 6 playable heroes (name, class, tag, description, accent colour, melee or ranged) and the list of 5 main heroes. |
| `monsters.json` | The 5 monsters (name, tier, lore, accent colour) and which appear at each difficulty. |
| `shop.json` | Weapons, armor, accessories, consumables with prices and stats. |
| `skills.json` | The skill tree: 3 branches, costs, max levels, effects. |
| `lore.json` | 50 lore fragments (10 per region) and 5 secret "Legion of 404" entries. |
| `stories.json` | Hero backstories, chapter intro text, prologue, epilogue and reunion text. |
| `balance.json` | Every tunable number, the loot table, feedback messages, achievements, chapter and region names. |

To refresh the JSON after the web version changes, run this in the web repo:

```bash
node tools/export-godot-data.mjs
```

## 4. The rules

All numbers below live in `data/balance.json`. Read them from there; never hardcode them.

### Battle

- A chapter is all of one hero's questions for that chapter, in random order. Answer options are shuffled too.
- Timer: **60 seconds** per question, plus bonuses. At 0 it counts as a wrong answer.
- Barrier: **3** points, plus bonuses. It refills at the start of every chapter.
- Monster HP: **100**. Hero damage: **25**, plus weapon bonus.
- The monster stays until it dies. When it dies, the next question brings a new one, chosen by that question's difficulty: easy → Syntax Goblin or Null Pointer Wolf; medium → Memory Leak Demon or Segfault Wraith; hard → Corrupted Compiler.
- **Hint:** costs 10 gold, removes one wrong option, always leaves at least one wrong option.
- A chapter is **cleared** when the hero is not defeated and accuracy is at least **50%**.

### Rewards

- XP per correct answer: easy 10, medium 20, hard 30, plus up to 10 for time left. Then accessory and skill multipliers. Then a streak bonus of +10% per earlier correct answer in a row, capped at +50%.
- Gold: 5 per correct answer, multiplied by accessory and skill bonuses. It is held until the monster dies or the chapter ends, then paid out.
- **Loot:** every monster kill rolls the loot table for bonus gold and a flavour item name. With a streak of 3 or more, roll twice and keep the rarer result.
- Each kill also unlocks one lore fragment, preferring the current region.
- Level up when XP reaches `level × 100`. Spending XP on skills never lowers the level.

### Regions

Story progress rises by 5 per chapter started and 20 per monster killed. The battle backdrop follows it: 0 Wasteland, 100 Forest, 200 Mountains, 300 Lakes, 400 Gates. The boss fight always uses the Throne room.

### Gear, items and skills

- Buying a weapon, armor or accessory equips it. One item per slot. Owned gear can be swapped in the Bag.
- **Scroll of Skipping:** skips the current question with no penalty.
- **Potion of Shielding:** restores 1 barrier, in battle only, not above the maximum.
- **Time Crystal:** adds 30 seconds to the current question.
- Skills cost XP. All eight must work: Extended Focus (+10s per level), Critical Strike (10% chance of double damage), Barrier Mastery (+1 barrier per level), Treasure Hunter (+20% gold per level), Quick Learner (+15% XP per level), Monster Bounty (+10 gold per kill per level), Mystic Insight (auto-removes one wrong option on hard questions), Second Chance (the first wrong answer each chapter costs no barrier).

### Boss fight

- Unlocks when **any one** hero has all 3 chapters cleared.
- Boss HP **1000**. Ten typed-answer questions in random order. No timer.
- Answers ignore upper/lower case and spaces.
- Correct: damage is `100 + 30 × (3 − hints used)`, so 100 to 190.
- Wrong: lose 1 barrier.
- Hints cost 10 gold each, up to 3 per question.
- Lose if the barrier hits 0, or if all ten questions are used and the boss still has HP.
- The boss must stay beatable with every hint used: 10 × 100 = 1000.

### Endings

- Beat the boss **without** all 5 main heroes complete → "Boss Defeated... For Now". She escapes.
- Beat the boss **with** all 5 complete → True Victory. This unlocks the sixth hero (Marakathalessa Redeemed) and the Legion of 404 lore, then shows the epilogue and reunion story cards.

### Saving

Save automatically after every change. Saved: XP, level, gold, owned and equipped gear, bag, skills, chapter progress, story progress, boss result, unlocked lore, achievements, stats, settings. Use Godot's `user://` folder.

## 5. What exists and what must be made

| Carries over as-is | Must be made new in Godot |
|---|---|
| All JSON in `data/` | 3D models for 6 heroes, 5 monsters and the boss |
| The rules in section 4 | Animations: idle, attack, cast, hit, block, death, defeat, victory, spawn |
| 2D portraits (`public/assets/heroes/`, `public/assets/monsters/` in the web repo) | 6 battle arenas |
| 4 music tracks (`public/assets/music/` in the web repo) | All menus and the battle screen |
| | Sound effects (the web version generates them in code) |
| | Save system |

**Rules reference:** `src/game/logic.ts` and `src/game/store.ts` in the web repo are the exact, tested rules. `tests/unit/logic.test.ts` lists the behaviours worth re-testing in Godot.

**Look reference:** play the web version, or see the screenshots in `production/qa/evidence/` in the web repo.

## 6. Decisions the owner still has to make

Ask the owner before building past step 3 below.

1. **Where the 3D models come from.** Free animated packs, AI model tools, or models the owner supplies. This is the biggest open question.
2. **Art style.** Keep the low-poly look, or go for something else.
3. **Window and controls.** Mouse only, or keyboard too. Fixed window or resizable.

## 7. Build order

Build one small working thing at a time. Run the game after each step.

1. **Project setup.** New Godot 4 project, GDScript, macOS export preset.
2. **Load the data.** Read every JSON file into a data autoload. Print the question counts to confirm: java 12, cpp 12, networking 12, dataEngineering 12, kernel 30, marakathalessa 12, boss 10.
3. **Rules with tests.** Write the rules from section 4 as plain scripts with no scenes, and unit-test them.
4. **One grey-box battle.** Capsules for the hero and monster, a question panel, timer, barrier, HP. Playable start to finish.
5. **Owner decides on models** (section 6).
6. **One real hero and one real monster** with animations, in one arena.
7. **Menus:** title, hero select, chapter select, results, story cards.
8. **Systems:** shop, skills, bag, codex, hero sheet, settings, saving.
9. **Boss fight and both endings.**
10. **Remaining heroes, monsters and arenas.**
11. **Sound and music.**
12. **Export a macOS build** and test it on the M1.

## 8. Rules for whoever builds this

- Do not change questions, prices or balance numbers. They are the owner's. Flag anything that looks wrong instead.
- Read every number from `balance.json`.
- The owner is not a programmer. Explain in plain language, one step at a time, and ask before making choices for them.
- Show the game running, with a screenshot, before calling a step done.

## 9. Known differences from the original 2D game

The web 3D version fixed these, and the Godot version should keep the fixes:

- Consumables work (their item IDs did not match in the 2D game).
- Time Crystal gives 30 seconds, as its description says.
- Barrier Mastery raises the barrier.
- Scroll of Skipping skips any question, not only hard ones.
