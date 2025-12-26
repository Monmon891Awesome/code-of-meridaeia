# 🏰 Master Plan: CodeQuest - The Siege of Meridaeia

## I. The Lore: The Shattering of Valerion
Your village, Valerion, was razed by **Marakathalessa**, the Witch of Shadow. She stole the **Golden Compiler**, the source of all logic. You are the lone survivor, marching toward the abandoned city of **Meridaeia** to reclaim your heritage and avenge your people.

---

## II. The Hero Classes (Learning Categories)
| Category | Hero Class | Narrative Identity |
| :--- | :--- | :--- |
| **Java** | **Barbarian Warrior** | *Grom the Uncompiled*. Resilient and powerful. "Write once, crush everywhere." |
| **C++** | **Dark Wizard** | *Malloc the Void-Walker*. Master of arcane memory. High power, but one slip leads to a Segfault. |
| **Networking** | **Knight Paladin** | *Ser Handshake*. Defender of the Great Gateway. Restoring the Three-Way Connection. |
| **Data Engineering** | **Knight Archer** | *Artemis the Stream-Caller*. Cleaning the corrupted Data Lake with her ETL Longbow. |
| **Kernel Dev** | **Dragonoid Mercenary** | *Vulkun of Ring Zero*. Born from the silicon depths. Reclaiming Root Privilege. |

---

## III. Phase-Based Roadmap

### Phase 1: The Soul of the Hero (UI & Narrative)
*   **Character Selection:** Replace the modern grid with character portraits and lore bios.
*   **State Migration:** Update `database.js` to store RPG attributes (Gold, EXP, Class).
*   **The Intro:** Cinematic text-crawl of the fall of Valerion.

### Phase 2: Trial of the Path (Combat Engine)
*   **Monster HUD:** Every quiz encounter has a monster with **100 HP**. 
*   **The Strike:** Correct answers deal **25 DMG**.
*   **Loot System:** Earn 5 Gold/10 EXP per hit. 20 Bonus Gold/50 EXP per kill (4 hits).
*   **Fail Penalty:** Missing a question triggers a monster counter-attack, draining **Barrier Points** (Hints).

### Phase 3: The Armory of Meridaeia (Economy)
*   **The Shop:** Visit the Hidden Camp to buy equipment:
    *   **Weapons:** Multipliers for Gold/EXP.
    *   **Armor:** Increases maximum Hints/Shields.
    *   **Scrolls of Skipping:** Consumables to bypass Hard questions (Cost: 50 Gold).
*   **Skill Tree:** Spend EXP to increase question timers or reveal auto-hints.

### Phase 4: Shadow of Marakathalessa (The Finale)
*   **The Long Road:** A visual progress map showing the distance to Meridaeia.
*   **The convergence:** Storylines meet at Question 50.
*   **The Boss:** A final 10-question gauntlet against the Witch of Shadow.

---

## IV. Technical Implementation Notes
1.  **Asset Management:** Centralize all SVG icons in `/assets/icons/`.
2.  **RPG Logic:** Integrate into `game.js` as a `combatController` class.
3.  **Persistence:** Use IndexedDB to ensure character progress and equipment are saved between sessions.
