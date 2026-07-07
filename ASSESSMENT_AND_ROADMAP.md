# Code of Meridaeia — Repo Assessment & Roadmap

**Date**: July 2026
**Audience**: You — the maintainer. Written assuming no framework/build-tool background, because this repo doesn't need one.
**What this is**: An honest snapshot of how the repo actually works today, what's healthy, what's drifting, and a prioritized roadmap. Treat this as the current source of truth; most of the other 30+ root `.md` files are historical planning docs (see item R1 below).

---

## Part 1 — How this repo actually works

### The 30-second version

This is a **zero-build vanilla JavaScript browser game**. There is no framework, no bundler, no `npm install` needed to play. `index.html` loads a stack of CSS files and then a chain of `<script>` tags **in order**. Each script defines global variables/objects, and the last one, `game.js`, defines one big class (`CodeOfMeridaeiaGame`) and starts the game on the final line. Open `index.html` through a local server and you're playing.

```
index.html            ← the skeleton: every screen, modal, and button lives here
  ├── styles/…css     ← new modular CSS (variables, reset, themes, buttons…)
  ├── styles.css      ← the original 6,300-line stylesheet (still loaded!)
  ├── fx.js           ← screen shake, particles, visual effects
  ├── music.js        ← background music tracks & playback
  ├── audio.js        ← sound effects
  ├── database.js     ← saves progress in your browser (IndexedDB)
  ├── shop-data.js    ← every weapon/armor/item as a plain JS object
  ├── leaderboard.js  ← online leaderboard (talks to Supabase)
  ├── questions/*.js  ← the question banks, one file per hero/category
  ├── character-stories.js ← hero backstories
  └── game.js         ← THE game: one 3,083-line class that runs everything
```

**The mental model**: `index.html` is the stage, the data files (`questions/`, `shop-data.js`, `character-stories.js`) are the script the actors read from, and `game.js` is the director doing literally everything else — combat math, screens, timers, saving, the boss fight, the shop, the skill tree.

### Where the data lives

- **Your progress** → IndexedDB, inside your own browser (`database.js`). Clear browser data = lose local saves; that's why export/import exists.
- **Leaderboard** → a Supabase (hosted Postgres) project. The URL and "anon key" are hardcoded in `leaderboard.js:5-6`. That's *normal* for Supabase — the anon key is designed to be public — but it means the database's Row Level Security (RLS) rules are the only thing stopping strangers from writing junk scores. Worth verifying (item R6).

### The parts most people's hobby repos don't have (you do — keep them)

1. **A real end-to-end test.** `tests/smoke-test.js` boots the actual game in headless Chrome via Playwright and plays through chapter flow, combat, hints, keyboard play, defeat, and the boss fight. This is your safety net for every change.
2. **A Claude Code agent crew.** `.claude/agents/` defines four scoped roles (question-author, balance-keeper, playtester, loremaster) with clear ownership boundaries. This is genuinely good AI-assisted-development setup.

### How to make a change without breaking things (the loop)

```bash
# 1. serve the game locally
python3 -m http.server 8000        # then open http://localhost:8000

# 2. edit ONE thing (a question, a price, a string)

# 3. refresh the browser, check the console (F12) for red errors

# 4. run the smoke test
node tests/smoke-test.js

# 5. commit
git add -A && git commit -m "describe the one thing you changed"
```

If you only ever internalize one thing from this document, make it that loop. It is the exit from tutorial hell: tiny change → observe → verify → commit.

---

## Part 2 — Assessment: what's healthy, what's drifting

### Healthy ✅

| Thing | Why it matters |
|---|---|
| Zero-build architecture | You can always understand "what runs" by reading `index.html` top to bottom. No magic. |
| Playwright smoke test | Real coverage of real gameplay, runnable in one command. |
| Data/logic separation | Questions, shop items, and stories are plain data files — safe to edit without touching game logic. |
| `.claude/agents` crew | Scoped AI roles with ownership boundaries — this scales your solo effort. |
| Active history | PRs #7–#9 shipped hero wheel, loot systems, videos, audio fixes. The game is alive. |

### Drifting ⚠️

1. **Documentation sprawl.** 35 markdown files at the repo root, most of them point-in-time planning docs from December 2025. The README says "Phase 3.5, ~5,000 lines, boss fight in progress" — but the boss fight, videos, hero wheel, and loot drops have all shipped since. A new visitor (including a fresh AI session!) can't tell what's current.
2. **`game.js` is a god object.** One class, 3,083 lines, owning combat, UI, saves, shop, skills, audio triggers, and the boss. Every feature makes it heavier, and AI edits to it get riskier as it grows.
3. **CSS split-brain.** A migration to modular `styles/` was started (good!) but the legacy 6,330-line `styles.css` is still loaded *in between* the new files (`index.html:30-43`). Cascade-order bugs live exactly in states like this.
4. **Dead code shipped, feature not.** `lore-data.js` (422 lines, 50 lore snippets) exists but is **never loaded** by `index.html` — the Phase 4 lore feature was written as content but never wired in. Free feature sitting on the shelf.
5. **No CI.** The smoke test only runs when someone remembers to run it. Since features land via PRs, a GitHub Action that runs it on every PR would catch breakage automatically.
6. **Media in git.** ~69 MB of assets (music mp3s, mp4 videos) are versioned directly; `.git` is already 85 MB. Fine today, but every video added grows every future clone forever.

---

## Part 3 — Roadmap (prioritized)

Ordered by payoff-per-effort. Each item is sized so one item ≈ one focused session (solo or with Claude).

### Quick wins (do these first)

- **R1. Consolidate the docs.** Keep `README.md` (rewritten to match reality) + this file. Move the other planning/phase docs into `docs/archive/`. One session, huge clarity payoff.
- **R2. Add a root `CLAUDE.md`.** ~30 lines: what the game is, the zero-build architecture, "run `node tests/smoke-test.js` before committing", pointer to `.claude/agents/README.md`. Every future AI session starts smarter.
- **R3. Wire up `lore-data.js`.** The content already exists; add the `<script>` tag and a small "lore snippet after victory" hook in `game.js`. A shipped feature for an afternoon's work — and a perfect first "real" code change for you.
- **R4. CI for the smoke test.** One GitHub Actions workflow: install Playwright, run `node tests/smoke-test.js` on every PR. Add a minimal `package.json` pinning Playwright while you're at it.

### Medium (next few weeks)

- **R5. Finish or freeze the CSS migration.** Either keep extracting from `styles.css` into `styles/` until the legacy file is empty, or declare the migration done and stop adding new module files. The half-state is the worst state. (Run the smoke test + eyeball every screen after each extraction.)
- **R6. Verify Supabase RLS.** In the Supabase dashboard, confirm the leaderboard table only allows inserts/updates shaped like legit score submissions. Ten minutes of checking versus a leaderboard full of garbage later.
- **R7. Start carving `game.js` — gently.** Do **not** big-bang refactor. Extract one self-contained system at a time into its own file (good first candidates: shop logic, save/checkpoint logic), load it as another `<script>` tag, run the smoke test. One extraction per session. Stop any time; every extraction leaves the repo better.
- **R8. Mobile pass.** `styles/responsive/mobile.css` exists; playtest on an actual phone, log what breaks, fix the top 3. (The playtester agent is built for this.)

### Later (when the itch strikes)

- **R9. Content expansion.** New hero/category with its own question bank — this is exactly what the question-author + loremaster + balance-keeper agents were built for, and it exercises the full pipeline (`questions/*.js` → wiring → balance → lore).
- **R10. Deploy to Vercel.** The docs for this already exist (`QUICK_START_GUIDE.md`); a live URL makes playtesting with friends frictionless.
- **R11. Move heavy media out of git.** Git LFS, or host music/video on the deploy target and gitignore them. Do this *before* adding many more videos.

### Explicitly not recommended right now

- Rewriting in a framework (React/etc.). The zero-build setup is a feature for a solo learner, not a limitation.
- A TypeScript migration. Same reason.
- Building accounts/guilds/chat (old Phase 7 plans) before R1–R8. Online social features are a maintenance tax; earn them with a stable core first.

---

## Part 4 — For the "tutorial hell" escape specifically

Tutorial hell ends when you make changes **to a project you own** where you can *see the consequence* of every edit. This repo is unusually good for that:

1. **Level 0**: change one question's wording in `questions/java.js`. Refresh. See it in-game.
2. **Level 1**: change a weapon price in `shop-data.js`. Buy it in-game. (Or ask the balance-keeper agent to critique your change.)
3. **Level 2**: do R3 (wire lore-data.js) — your first real feature ship.
4. **Level 3**: do one extraction from R7 with the smoke test as your safety net.

Each level teaches the same lesson: *read what's there, change one thing, verify, commit.* That loop — not another tutorial — is mastery.
