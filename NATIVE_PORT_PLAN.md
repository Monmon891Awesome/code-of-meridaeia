# Native macOS Port Plan

Status: future plan. Nothing here has been started.

## Goal

A native macOS version of Code of Meridaeia, built in a game engine instead of the browser.

## Engine choice

Recommendation: **Godot 4**. This is a judgement call, not a fact. It fits a solo developer who wants free tools and a gentler learning curve.

| | Godot 4 | Unity |
|---|---|---|
| Cost | Free, no fees ever | Free tier, fees at higher revenue |
| Mac export | Built in | Built in |
| Learning curve | Easier, lighter | Steeper, heavier |
| Ready-made assets | Fewer | Huge asset store |
| Game Studio fork | Supported | Supported |

Pick Unity instead if ready-made assets matter more than simplicity.

## Steps, in order

1. **Play the web version first.** Decide what is fun and what to cut. A port is the wrong time to find that out.
2. **Get real 3D models.** The web version's characters are built from code shapes and do not carry over. Use free animated packs or AI model tools.
3. **Set up the engine** with the Game Studio fork (`/setup-engine`).
4. **Port the data first.** Questions, shop, skills, lore, stories and balance numbers move over almost as-is.
5. **Rebuild one battle** in the engine before anything else, to prove the core loop.
6. **Build the rest:** menus, shop, skill tree, boss fight, saves.
7. **Export for Mac.**

## What carries over

| Carries over | Must be rebuilt |
|---|---|
| Questions (`src/data/questions/`) | 3D characters and arenas |
| Shop, skills, lore, stories (`src/data/`) | Animations |
| Balance numbers (`BALANCE` in `src/data/index.ts`) | Menus and battle screens |
| Game rules (`src/game/logic.ts`, as a reference to rewrite) | Sound hookup and save system |

## Honest notes

- This is a rebuild, not a conversion.
- Sharing a Mac app without security warnings needs a paid Apple Developer account (yearly fee). Running it on your own Mac does not.
- The web version stays live on Vercel the whole time. The port does not replace it.

## Open decisions

- Godot or Unity (recommendation above).
- Where the 3D models come from.
- Whether the port lives in this repo or a new one.
