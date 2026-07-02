# Meridaeia Studio Crew

Project-scoped Claude Code agents, inspired by the
[Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios)
pattern but trimmed to the four roles this game actually needs. Claude Code
picks these up automatically; ask for a role by name or let delegation happen
from the task description.

| Agent | Owns | Example ask |
|---|---|---|
| **question-author** | `questions/*.js` content and schemas | "Add 12 Python questions for a new hero, 4 per chapter" |
| **balance-keeper** | XP/gold/barrier/boss numbers, shop & skill costs | "Players level too fast mid-game — retune the curve" |
| **playtester** | `tests/smoke-test.js`, manual QA checklist | "Verify the new consumable works on mobile and desktop" |
| **loremaster** | Story, lore, and voice across all player-facing text | "Write the chapter intros for the new Python hero" |

Boundaries: the balance-keeper never edits UI code, the loremaster never
touches mechanics, the playtester reports rather than fixes gameplay code,
and the question-author flags (or is explicitly asked to make) the game.js /
index.html wiring for new categories.
