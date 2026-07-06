// Code of Meridaeia - The Codex
// A collectible knowledge base that fills in as you play. The Bestiary is
// stealth-teaching: every monster you defeat unlocks its card AND the real
// programming concept it embodies. Lore and Hero dossiers deepen the world.
//
// Bestiary keys MUST match the names in game.js `monsterNames` so kills unlock
// the right card.

const CODEX = {
    // ============ BESTIARY ============
    // Each foe is a real bug/error given flesh. `concept` is the teaching payload.
    bestiary: [
        {
            id: 'syntax-goblin',
            name: 'Syntax Goblin',
            portrait: 'assets/monsters/monster-syntax-goblin.png',
            difficulty: 'Common',
            lore: 'Once a humble data structure, corrupted by Marakathalessa\'s dark magic. It prowls the wasteland, scattering missing semicolons and unclosed brackets in its wake.',
            concept: {
                title: 'Syntax Errors',
                text: 'A syntax error means your code breaks the grammar of the language — a missing `;`, an unclosed `)` or `}`, a typo in a keyword. The compiler refuses to even start until the grammar is fixed. They are the most common error a beginner meets, and the easiest to slay once you learn to read the compiler\'s pointing finger.',
                example: 'int x = 5   // ❌ missing semicolon\nint x = 5;  // ✅'
            }
        },
        {
            id: 'null-pointer-wolf',
            name: 'Null Pointer Wolf',
            portrait: 'assets/monsters/monster-null-wolf.png',
            difficulty: 'Common',
            lore: 'A spectral beast born from dereferenced memory. It hunts those who forget to initialize their variables, luring them into null dimensions where nothing exists.',
            concept: {
                title: 'Null / None References',
                text: 'A null (or `None`, `nil`, `nullptr`) reference points at "nothing." Ask it for a value or a method and the program lurches — a NullPointerException in Java, a segfault in C++. Tony Hoare, who invented null, called it his "billion-dollar mistake." Guard against it: check before you use.',
                example: 'if (user != null) {\n    user.getName(); // safe\n}'
            }
        },
        {
            id: 'memory-leak-demon',
            name: 'Memory Leak Demon',
            portrait: 'assets/monsters/monster-memory-demon.png',
            difficulty: 'Rare',
            lore: 'This creature was once a function — clean, pure, purposeful. But when the Great Compiler fell, it lost its return statement and now wanders forever, holding memory it will never release.',
            concept: {
                title: 'Memory Leaks',
                text: 'A memory leak is memory you allocated but never gave back. Do it in a loop and your program swells until it is killed. Languages with a garbage collector (Java, Python) free most of it for you; in C/C++ every `new`/`malloc` needs its matching `delete`/`free`. Modern C++ uses smart pointers so the cleanup happens on its own.',
                example: 'int* p = new int[100];\n// ... use it ...\ndelete[] p; // ✅ give it back'
            }
        },
        {
            id: 'segfault-wraith',
            name: 'Segfault Wraith',
            portrait: 'assets/monsters/monster-segfault-wraith.png',
            difficulty: 'Rare',
            lore: 'The ghost of a crashed program, forever trapped between memory segments. It seeks to drag others into the void of undefined behavior.',
            concept: {
                title: 'Segmentation Faults',
                text: 'A segfault happens when a program touches memory it is not allowed to — reading past the end of an array, following a dangling pointer, writing to read-only memory. The operating system slams the door and the program dies. They feel scary but they are honest: the crash is exactly where the illegal access happened.',
                example: 'int a[3];\na[7] = 1; // ❌ out of bounds → undefined behavior'
            }
        },
        {
            id: 'corrupted-compiler',
            name: 'Corrupted Compiler',
            portrait: 'assets/monsters/monster-corrupted-compiler.png',
            difficulty: 'Elite',
            lore: 'A twisted shard of the Great Compiler itself, turned against the realm. It speaks only in cryptic error codes and refuses every offering that is not perfectly formed.',
            concept: {
                title: 'The Compiler',
                text: 'A compiler translates the code you write into instructions the machine can run, checking as it goes. Its errors can feel hostile, but each one is a gift: it caught a mistake before your users did. Learn to read them top-to-bottom — the first error often causes the rest. A warning is the compiler whispering; heed those too.',
                example: 'error: expected \';\' before \'}\' token\n// → read the line number, fix the first one first'
            }
        },
        {
            id: 'marakathalessa',
            name: 'Marakathalessa',
            portrait: 'assets/monsters/boss-marakathalessa-alt.png',
            difficulty: 'BOSS',
            lore: 'The Witch of Corrupted Code. Once the realm\'s greatest Architect, she made a forbidden bargain to save a dying apprentice — and became the vessel of the very corruption she fought. She is not wicked. She is grieving.',
            concept: {
                title: 'Technical Debt',
                text: 'Marakathalessa embodies technical debt: a "quick fix" taken under pressure that compounds into something monstrous. Every shortcut you skip documenting, every "I\'ll clean it later," borrows against the future at interest. Debt is not always evil — sometimes you must ship — but unpaid, it corrupts a whole system. The cure is the same as her redemption: face it, name it, and refactor with care.',
                example: '// TODO: temporary hack, fix before release\n// ...three years later, still here'
            }
        }
    ],

    // ============ LORE (the world) ============
    // Unlocked by progress. `unlocked(profile)` decides visibility so there is
    // no fragile flag-tracking to migrate.
    lore: [
        {
            id: 'great-compiler',
            title: 'The Great Compiler',
            text: 'Before the fall, Meridaeia was written by the Great Compiler — a perfect, ordered intelligence that turned pure thought into living Code. Every river, every stone, every hero was a well-formed expression. When it fell silent, the grammar of the world began to break.',
            hint: 'Begin any chapter to remember the world before the fall.',
            unlocked: (p) => (p.storyProgress || 0) >= 1 || CODEX.countMonsters(p) >= 1
        },
        {
            id: 'legion-404',
            title: 'The Legion of 404',
            text: 'They are the bugs that wish to be born — entropy given will. Where the Compiler brought order, the Legion brings the Not-Found: the missing file, the broken link, the answer that isn\'t there. Marakathalessa did not create them. She only opened the door.',
            hint: 'Defeat 3 monsters to glimpse the enemy behind the enemies.',
            unlocked: (p) => CODEX.countMonsters(p) >= 3
        },
        {
            id: 'fall-of-valerion',
            title: 'The Fall of Valerion',
            text: 'Valerion was the shining capital, its towers shaped like heat-sinks, cooled by rivers of clean logic. When the apprentice\'s Void Segfault spread, Marakathalessa traded the city\'s order for a single life. The towers still stand — but corrupted green runes crawl their walls, and no one remembers who the child was.',
            hint: 'Complete a full chapter to uncover the capital\'s fate.',
            unlocked: (p) => CODEX.anyChapterComplete(p)
        },
        {
            id: 'the-barrier',
            title: 'The Barrier of Hints',
            text: 'A hero\'s Barrier is not armor — it is grace. Each shard is a mistake forgiven, a chance to try again. Spend them wisely; when the last shard shatters, even the bravest Seeker must retreat and regroup. To fall is not to fail. To refuse to rise again — that is the only true defeat.',
            hint: 'Fall in battle once to learn the meaning of the Barrier.',
            unlocked: (p) => (p.timesDefeated || 0) >= 1 || CODEX.anyChapterComplete(p)
        },
        {
            id: 'the-lost-tear',
            title: "Marakathalessa's Lost Tear",
            text: 'They say a single tear of golden light still lives inside the Witch — the last uncorrupted part of her, the part that remembers the child she tried to save. To defeat her is easy. To remember her is the true ending. The realm was not lost to evil. It was lost to grief.',
            hint: 'Defeat the Witch to hold her one remaining light.',
            unlocked: (p) => p.bossDefeated === 'true' || p.bossDefeated === 'incomplete'
        }
    ],

    // ============ HERO DOSSIERS ============
    // Portraits + a one-line tease here; the deep story lives in
    // character-stories.js. A dossier unlocks once you complete a chapter of
    // that hero (or, for the boss/redeemed, on the relevant milestone).
    heroes: [
        { key: 'java', name: 'Grom the Uncompiled', cls: 'Barbarian Warrior', portrait: 'assets/heroes/hero-grom-portrait.png' },
        { key: 'cpp', name: 'Malloc the Void-Walker', cls: 'Dark Wizard', portrait: 'assets/heroes/hero-malloc-portrait.png' },
        { key: 'networking', name: 'Ser Handshake', cls: 'Knight Paladin', portrait: 'assets/heroes/hero-handshake-portrait.png' },
        { key: 'dataEngineering', name: 'Artemis the Stream-Caller', cls: 'Knight Archer', portrait: 'assets/heroes/hero-artemis-portrait.png' },
        { key: 'kernel', name: 'Vulkun of Ring Zero', cls: 'Dragonoid Mercenary', portrait: 'assets/heroes/hero-vulkun-portrait.png' }
    ],

    // ---- helpers used by unlock predicates ----
    countMonsters(p) {
        return ((p.codex && p.codex.monsters) || []).length;
    },
    anyChapterComplete(p) {
        const cp = p.chapterProgress || {};
        return Object.values(cp).some(h => h && (h.chapter1 || h.chapter2 || h.chapter3));
    }
};

// Stable id for a monster name (matches bestiary ids)
CODEX.monsterId = function (name) {
    const entry = CODEX.bestiary.find(b => b.name === name);
    return entry ? entry.id : null;
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CODEX };
}
