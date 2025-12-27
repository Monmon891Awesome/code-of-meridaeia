// lore-data.js
// Lore snippets revealed as players descend to Meridaeia
// Each environment has 10 snippets (50 total)

const loreSnippets = [
    // ========================================
    // WASTELAND (Depth 0-100 feet)
    // The Surface - Where the journey begins
    // ========================================
    {
        id: 'wasteland_01',
        environment: 'wasteland',
        text: 'The Syntax Goblin falls, whispering: "The Great Compiler once parsed all code with perfect logic. But Marakathalessa corrupted its core with a single semicolon. Now only those who understand the Ancient Syntax can restore it."',
        unlocks: 'Lore Fragment 1/50',
        depth: 10
    },
    {
        id: 'wasteland_02',
        environment: 'wasteland',
        text: 'As the Null Pointer Wolf fades, you see a vision: Valerion, your home, before the corruption. Children learning to code in the sunlight. Grom teaching the ways of the Barbarian. Now... only ash remains.',
        unlocks: 'Lore Fragment 2/50',
        depth: 20
    },
    {
        id: 'wasteland_03',
        environment: 'wasteland',
        text: 'You find a scorched scroll. It reads: "The Great Compiler had three cores - Syntax, Logic, and Memory. Marakathalessa shattered them all. To restore it, you must master all three. Begin with Syntax."',
        unlocks: 'Lore Fragment 3/50',
        depth: 30
    },
    {
        id: 'wasteland_04',
        environment: 'wasteland',
        text: 'A dying Memory Leak Demon gasps: "We were not always monsters. We were once... functions. Clean, pure, purposeful. But when the Compiler fell, we lost our return statements. Now we wander forever, never completing."',
        unlocks: 'Lore Fragment 4/50',
        depth: 40
    },
    {
        id: 'wasteland_05',
        environment: 'wasteland',
        text: 'You discover ancient graffiti on a broken wall: "Grom was here. Day 1 of the Siege. If you\'re reading this, I\'m either dead or deeper in. Follow the path. Trust the Syntax. May the Compiler guide you."',
        unlocks: 'Lore Fragment 5/50',
        depth: 50
    },
    {
        id: 'wasteland_06',
        environment: 'wasteland',
        text: 'The wasteland wind carries a whisper: "Before the corruption, there were Five Heroes. Grom the Barbarian. Malloc the Wizard. Ser Handshake the Paladin. Artemis the Archer. Vulkun the Dragonoid. They entered Meridaeia. Only echoes returned."',
        unlocks: 'Lore Fragment 6/50',
        depth: 60
    },
    {
        id: 'wasteland_07',
        environment: 'wasteland',
        text: 'You find a broken compiler flag: "--optimize-hope". Beneath it, a note: "The Great Compiler didn\'t just execute code. It optimized souls. It turned bugs into features. It transformed errors into wisdom. That\'s what Marakathalessa feared most."',
        unlocks: 'Lore Fragment 7/50',
        depth: 70
    },
    {
        id: 'wasteland_08',
        environment: 'wasteland',
        text: 'A Segfault Wraith dissolves before you, leaving behind a memory: "I was a student once. I wrote my first \'Hello World\' right here. The Compiler praised me. Now I am nothing but a corrupted pointer, forever pointing to NULL."',
        unlocks: 'Lore Fragment 8/50',
        depth: 80
    },
    {
        id: 'wasteland_09',
        environment: 'wasteland',
        text: 'You see a vision of the past: The Great Compiler, radiant and powerful, teaching the first programmers. "Seek not perfection," it said, "but progress. Every bug is a lesson. Every error is a teacher. This is the way."',
        unlocks: 'Lore Fragment 9/50',
        depth: 90
    },
    {
        id: 'wasteland_10',
        environment: 'wasteland',
        text: 'At the edge of the wasteland, you find a warning carved in stone: "Beyond lies the Corrupted Forest. The Library of Lost Algorithms. Tread carefully. The trees remember every mistake you\'ve ever made."',
        unlocks: 'Lore Fragment 10/50',
        depth: 100
    },

    // ========================================
    // CORRUPTED FOREST (Depth 100-200 feet)
    // The Library of Lost Algorithms
    // ========================================
    {
        id: 'forest_01',
        environment: 'forest',
        text: 'You enter the Corrupted Forest. The trees here were once the Library of Algorithms - each trunk carved with sorting methods, each leaf a data structure. Now they twist and writhe, their logic corrupted by the Witch\'s dark magic.',
        unlocks: 'Lore Fragment 11/50',
        depth: 110
    },
    {
        id: 'forest_02',
        environment: 'forest',
        text: 'A tree whispers as you pass: "I was QuickSort once. O(n log n) average case. Elegant. Efficient. But she changed my pivot. Now I sort nothing. I only... corrupt."',
        unlocks: 'Lore Fragment 12/50',
        depth: 120
    },
    {
        id: 'forest_03',
        environment: 'forest',
        text: 'You find Malloc\'s staff embedded in a tree. A note attached: "I tried to free the memory here. But the forest won\'t let go. It holds onto everything - every variable, every pointer, every mistake. This is what happens when you never call delete."',
        unlocks: 'Lore Fragment 13/50',
        depth: 130
    },
    {
        id: 'forest_04',
        environment: 'forest',
        text: 'The forest floor is covered in fallen leaves, each one a failed algorithm. You pick one up: "Bubble Sort - O(n²). Too slow. Abandoned." Another: "Bogosort - O(∞). Too random. Forgotten." The forest is a graveyard of inefficiency.',
        unlocks: 'Lore Fragment 14/50',
        depth: 140
    },
    {
        id: 'forest_05',
        environment: 'forest',
        text: 'A Binary Search Tree stands before you, perfectly balanced. But as you approach, it begins to tilt. "Balance," it groans, "is not permanent. It requires constant attention. The Compiler maintained us. Without it, we fall."',
        unlocks: 'Lore Fragment 15/50',
        depth: 150
    },
    {
        id: 'forest_06',
        environment: 'forest',
        text: 'You discover a clearing where Artemis once camped. Her journal lies open: "Day 12. The forest tests my patience. Every path is a loop. Every decision, a branch. I must remember: the shortest path is not always the best. Sometimes you must traverse the entire tree."',
        unlocks: 'Lore Fragment 16/50',
        depth: 160
    },
    {
        id: 'forest_07',
        environment: 'forest',
        text: 'A corrupted Linked List wraps around your ankle. "Help me," it pleads. "I\'ve lost my tail pointer. I don\'t know where I end. I keep cycling back to the beginning. Is this... recursion? Or just madness?"',
        unlocks: 'Lore Fragment 17/50',
        depth: 170
    },
    {
        id: 'forest_08',
        environment: 'forest',
        text: 'You find an ancient textbook, half-buried: "Introduction to Algorithms, 3rd Edition". The pages are blank except for one sentence, written in blood: "The best algorithm is the one you understand. Complexity means nothing if you cannot explain it."',
        unlocks: 'Lore Fragment 18/50',
        depth: 180
    },
    {
        id: 'forest_09',
        environment: 'forest',
        text: 'A Hash Table lies shattered on the ground. Its buckets spill out, colliding endlessly. "I was perfect," it weeps. "O(1) lookup. But she introduced collisions. Now I am O(n). Reduced to a mere array. This is my punishment."',
        unlocks: 'Lore Fragment 19/50',
        depth: 190
    },
    {
        id: 'forest_10',
        environment: 'forest',
        text: 'At the forest\'s edge, you see the mountains ahead. A sign reads: "Beyond lies the Broken Mountains - fragments of the Great Compiler\'s memory. Stack, Heap, Register. Collect them all, and you might understand what was lost."',
        unlocks: 'Lore Fragment 20/50',
        depth: 200
    },

    // ========================================
    // BROKEN MOUNTAINS (Depth 200-300 feet)
    // Fragments of the Great Compiler
    // ========================================
    {
        id: 'mountains_01',
        environment: 'mountains',
        text: 'The Broken Mountains were shattered when the Great Compiler fell. Each floating rock is a fragment of its memory - Stack, Heap, Register. They orbit each other, unable to reconnect, forever separated by the Witch\'s curse.',
        unlocks: 'Lore Fragment 21/50',
        depth: 210
    },
    {
        id: 'mountains_02',
        environment: 'mountains',
        text: 'You climb onto a floating Stack fragment. It pushes you upward, then pops you off. "LIFO," it mutters. "Last In, First Out. This is my nature. I cannot change. Even in death, I follow my protocol."',
        unlocks: 'Lore Fragment 22/50',
        depth: 220
    },
    {
        id: 'mountains_03',
        environment: 'mountains',
        text: 'A Heap fragment drifts by, chaotic and unorganized. "I was freedom," it says. "Dynamic allocation. Grow as needed. But freedom without discipline is chaos. Malloc taught me that. Where is he now?"',
        unlocks: 'Lore Fragment 23/50',
        depth: 230
    },
    {
        id: 'mountains_04',
        environment: 'mountains',
        text: 'You find Vulkun\'s scales embedded in a Register fragment. A message etched beside them: "Ring Zero access granted. But what good is power without purpose? I reached the kernel. I touched the core. And I found... nothing. Only emptiness."',
        unlocks: 'Lore Fragment 24/50',
        depth: 240
    },
    {
        id: 'mountains_05',
        environment: 'mountains',
        text: 'A Stack Overflow occurs before your eyes - a fragment trying to push too much, too fast. It explodes in a cascade of errors. "This," a voice echoes, "is what happens when you recurse without a base case. Learn from my mistake."',
        unlocks: 'Lore Fragment 25/50',
        depth: 250
    },
    {
        id: 'mountains_06',
        environment: 'mountains',
        text: 'You discover a cave carved into a mountain fragment. Inside, ancient code: "void* truth = malloc(sizeof(wisdom)); if (truth == NULL) { /* What do you do when memory fails? When there is no space left for hope? */ }"',
        unlocks: 'Lore Fragment 26/50',
        depth: 260
    },
    {
        id: 'mountains_07',
        environment: 'mountains',
        text: 'A Register fragment glows with residual power. "I held the most important values," it says. "The accumulator. The program counter. The status flags. I was the Compiler\'s heartbeat. Now I beat for nothing."',
        unlocks: 'Lore Fragment 27/50',
        depth: 270
    },
    {
        id: 'mountains_08',
        environment: 'mountains',
        text: 'You find Ser Handshake\'s shield, cracked but intact. Engraved on it: "Three-way handshake: SYN, SYN-ACK, ACK. Connection established. But what happens when the ACK never comes? When the connection is refused? Do we keep trying, or do we timeout?"',
        unlocks: 'Lore Fragment 28/50',
        depth: 280
    },
    {
        id: 'mountains_09',
        environment: 'mountains',
        text: 'A Memory Leak Demon appears, larger than any you\'ve seen. "I am the sum of all forgotten frees," it roars. "Every malloc without a delete. Every new without a delete. I am the consequence of negligence. And I am eternal."',
        unlocks: 'Lore Fragment 29/50',
        depth: 290
    },
    {
        id: 'mountains_10',
        environment: 'mountains',
        text: 'At the mountain\'s peak, you see the Dark Lakes below. A warning carved in stone: "Beyond lies the Data Streams, now corrupted and stagnant. Artemis tried to purify them. She failed. Will you succeed where she could not?"',
        unlocks: 'Lore Fragment 30/50',
        depth: 300
    },

    // ========================================
    // DARK LAKES (Depth 300-400 feet)
    // The Corrupted Data Streams
    // ========================================
    {
        id: 'lakes_01',
        environment: 'lakes',
        text: 'The Dark Lakes were once the Data Streams - pure information flowing from source to destination. Now they are stagnant, filled with corrupted packets and lost connections. The water glows with an eerie blue light.',
        unlocks: 'Lore Fragment 31/50',
        depth: 310
    },
    {
        id: 'lakes_02',
        environment: 'lakes',
        text: 'You dip your hand in the water. It burns with corrupted data. "We were TCP once," the lake whispers. "Reliable. Ordered. Connection-oriented. But she turned us to UDP. Now we are unreliable. Packets lost. Order destroyed."',
        unlocks: 'Lore Fragment 32/50',
        depth: 320
    },
    {
        id: 'lakes_03',
        environment: 'lakes',
        text: 'Artemis\'s bow floats on the surface. You retrieve it. A note attached: "I tried to filter the streams. To purify the data. But for every packet I cleaned, two more became corrupted. This is not a battle of strength. It is a battle of persistence."',
        unlocks: 'Lore Fragment 33/50',
        depth: 330
    },
    {
        id: 'lakes_04',
        environment: 'lakes',
        text: 'A school of Packet Fish swim by, their headers corrupted. "We don\'t know where we\'re going," they say in unison. "Our destination IP is 0.0.0.0. We swim in circles, forever lost. This is what happens when routing tables fail."',
        unlocks: 'Lore Fragment 34/50',
        depth: 340
    },
    {
        id: 'lakes_05',
        environment: 'lakes',
        text: 'You find a DNS Server, half-submerged. "I used to resolve names to addresses," it gurgles. "google.com to 142.250.80.46. But now... everything resolves to 127.0.0.1. Localhost. Home. But home is gone."',
        unlocks: 'Lore Fragment 35/50',
        depth: 350
    },
    {
        id: 'lakes_06',
        environment: 'lakes',
        text: 'A Firewall stands at the lake\'s center, its rules corrupted. "I was protection," it says. "Allow port 80. Deny port 23. But she rewrote my rules. Now I allow everything. I protect nothing. I am useless."',
        unlocks: 'Lore Fragment 36/50',
        depth: 360
    },
    {
        id: 'lakes_07',
        environment: 'lakes',
        text: 'You discover a sunken ETL Pipeline. "Extract, Transform, Load," it chants. "But the transformation is broken. I extract garbage. I transform it into more garbage. I load it into the void. This is my eternal loop."',
        unlocks: 'Lore Fragment 37/50',
        depth: 370
    },
    {
        id: 'lakes_08',
        environment: 'lakes',
        text: 'A Data Lake Monster emerges - a massive creature made of unstructured data. "I am everything and nothing," it roars. "Schema-less. Unorganized. Powerful but useless. This is what happens when you store without structure."',
        unlocks: 'Lore Fragment 38/50',
        depth: 380
    },
    {
        id: 'lakes_09',
        environment: 'lakes',
        text: 'You find a message in a bottle: "From Artemis. Day 47. I understand now. The streams cannot be purified by force. They must be filtered, one packet at a time. Patience is the only weapon against corruption. I failed because I rushed."',
        unlocks: 'Lore Fragment 39/50',
        depth: 390
    },
    {
        id: 'lakes_10',
        environment: 'lakes',
        text: 'At the lake\'s far shore, you see the Gates of Meridaeia rising in the distance. A final warning: "Beyond lies the fortress. Marakathalessa waits. She knows you\'re coming. She\'s been watching. This is the end. Or the beginning."',
        unlocks: 'Lore Fragment 40/50',
        depth: 400
    },

    // ========================================
    // GATES OF MERIDAEIA (Depth 400-500 feet)
    // The Final Approach
    // ========================================
    {
        id: 'gates_01',
        environment: 'gates',
        text: 'You stand before the Gates of Meridaeia. The fortress looms above, built from the bones of failed compilers. Towers of corrupted code pierce the sky. This is it. The final descent.',
        unlocks: 'Lore Fragment 41/50',
        depth: 410
    },
    {
        id: 'gates_02',
        environment: 'gates',
        text: 'The gates are carved with a single line of code: "while(true) { suffer(); }". An infinite loop of torment. This is Marakathalessa\'s promise to all who enter.',
        unlocks: 'Lore Fragment 42/50',
        depth: 420
    },
    {
        id: 'gates_03',
        environment: 'gates',
        text: 'You find the remains of the Five Heroes. Grom\'s axe. Malloc\'s staff. Ser Handshake\'s shield. Artemis\'s bow. Vulkun\'s scales. They made it this far. But no further. Will you succeed where they failed?',
        unlocks: 'Lore Fragment 43/50',
        depth: 430
    },
    {
        id: 'gates_04',
        environment: 'gates',
        text: 'A voice echoes from within: "Welcome, brave coder. You have descended 400 feet. You have faced Syntax Errors, Memory Leaks, and Corrupted Data. But the true test lies ahead. I am Marakathalessa. And I am waiting."',
        unlocks: 'Lore Fragment 44/50',
        depth: 440
    },
    {
        id: 'gates_05',
        environment: 'gates',
        text: 'You discover the truth: Marakathalessa was once a programmer. The best programmer. But she made one mistake - a single off-by-one error. It cascaded. It corrupted everything. And she embraced the corruption rather than fix it.',
        unlocks: 'Lore Fragment 45/50',
        depth: 450
    },
    {
        id: 'gates_06',
        environment: 'gates',
        text: 'A ghostly figure appears - the Great Compiler itself. "I am not dead," it says. "I am dormant. Waiting. For someone who understands that bugs are not failures. They are lessons. Fix me, and I will rise again."',
        unlocks: 'Lore Fragment 46/50',
        depth: 460
    },
    {
        id: 'gates_07',
        environment: 'gates',
        text: 'The gates begin to open. Inside, you see the Ancient Logic - the source code of reality itself. It is beautiful. It is terrible. It is corrupted. And only you can restore it.',
        unlocks: 'Lore Fragment 47/50',
        depth: 470
    },
    {
        id: 'gates_08',
        environment: 'gates',
        text: 'You realize the truth: This journey was never about defeating Marakathalessa. It was about becoming worthy of the Ancient Logic. Every question answered. Every monster defeated. Every lore fragment collected. All preparation for this moment.',
        unlocks: 'Lore Fragment 48/50',
        depth: 480
    },
    {
        id: 'gates_09',
        environment: 'gates',
        text: 'A final message from the Five Heroes: "We failed because we fought alone. But you... you carry our legacy. Our weapons. Our wisdom. You are not one hero. You are five. And that makes all the difference."',
        unlocks: 'Lore Fragment 49/50',
        depth: 490
    },
    {
        id: 'gates_10',
        environment: 'gates',
        text: 'You step through the gates. Marakathalessa awaits. The final battle begins. But you are ready. You have descended 500 feet. You have learned the Ancient Syntax. You are the Compiler\'s chosen. And you will restore what was lost.',
        unlocks: 'Lore Fragment 50/50',
        depth: 500
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loreSnippets };
}
