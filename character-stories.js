// character-stories.js
// Character backstories and chapter intros for Code of Meridaeia

const characterStories = {
    java: {
        heroName: "Grom the Barbarian",
        title: "The Outcast Warrior",
        race: "Barbarian (Outcast)",

        // Chapter 1 Intro (Brief - 2-3 sentences)
        chapter1Intro: `I was cast out by my clan for seeking knowledge over brute strength. They called me weak. They mocked my interest in "the ancient syntax." But I know the truth - true power comes from understanding, not ignorance.`,

        // Chapter 2 Intro (Deeper - 4-5 sentences)
        chapter2Intro: `The Northern Wastes taught me one thing: strength without wisdom is just violence. My people worshipped raw power, but I saw the beauty in optimization, in elegant solutions. When I suggested using Object-Oriented principles to organize our battle formations, the elders laughed. Then they banished me. Now I wander Meridaeia, proving that outcasts can become heroes.`,

        // Chapter 3 Intro (Full story - 6-8 sentences)
        chapter3Intro: `I've walked this path alone for so long. But in Valerion, I found others like me - the outcast archer who rejected her people's pride, the wizard who was bullied for being different, the knight who lost everything. We are all broken in our own ways. But the Great Compiler doesn't judge us by our past. It judges us by our code. And my code is clean, optimized, and ready for battle. This is my redemption.`,

        // Chapter 4 Intro (Advanced Trials)
        chapter4Intro: `The path grows darker. The challenges ahead require more than basic principles - they demand mastery of concurrency, the discipline to manage multiple threads without deadlock. My clan feared complexity, but I embrace it. Every pattern I learn, every framework I master, brings me closer to the truth. The Witch's corruption runs deep. But so does my determination.`,

        // Chapter 5 Intro (Mastery Path)
        chapter5Intro: `This is the final trial. The ancient warriors spoke of a state beyond strength - a place where mind and blade become one. I have reached that place. Collections stream through my consciousness like rivers of data. Design patterns flow naturally as breathing. I am no longer the outcast they banished. I am the Master of Java. And today, I take back everything they said I could never achieve.`,

        // Full backstory (for character profile)
        fullBackstory: `Grom was born into the proud Barbarian clans of the Northern Wastes, where strength and honor were everything. But Grom was different - he questioned the old ways, sought knowledge over brute force, and believed in optimization rather than raw power. His clan called him weak. They mocked his interest in "the ancient syntax" - the programming languages of the old world. When Grom suggested using Object-Oriented principles to organize their battle formations, the elders banished him. Cast out and alone, Grom wandered until he found Valerion. There, he discovered his true calling: combining the warrior's discipline with the coder's precision. He became the Java Barbarian - a fighter who believes every problem has an elegant solution.`
    },


    cpp: {
        heroName: "Malloc the Wizard",
        title: "The Memory Mage",
        race: "Human Wizard",

        chapter1Intro: `They called me weak at the Arcane Academy. "You'll never master pointers," they sneered. "You'll cause memory leaks," they laughed. But in the forbidden library, I discovered the ancient art of manual memory management. Now I control reality itself.`,

        chapter2Intro: `I was locked in that library as a prank. My peers thought it was funny - trap the weak student with the dangerous tomes. But while they relied on automatic garbage collection, I learned malloc() and free(). I learned to allocate and deallocate existence. When I emerged, I was no longer the bullied student. I was Malloc the Memory Mage.`,

        chapter3Intro: `The Academy taught me one valuable lesson: arrogance is the enemy of mastery. Those who mocked me never understood that true power requires discipline. Every allocation must have a deallocation. Every pointer must be managed. The Great Compiler is corrupted because someone was careless with memory. But I am not careless. I am precise. And I will restore what was lost.`,

        fullBackstory: `Malloc was once a student at the prestigious Arcane Academy, where the greatest mages studied the art of memory manipulation. But Malloc was small, awkward, and slow to cast spells. His peers bullied him relentlessly. One day, during a particularly cruel prank, Malloc was locked in the Academy's forbidden library. There, he discovered ancient tomes about manual memory management - the lost art of malloc() and free(). While his peers relied on automatic garbage collection, Malloc learned to control memory directly. He emerged from that library transformed. No longer the bullied student, but Malloc the Memory Mage - a wizard who could allocate and deallocate reality itself.`
    },

    networking: {
        heroName: "Ser Handshake",
        title: "The Broken Knight",
        race: "Human Paladin",

        chapter1Intro: `I was a royal messenger once. My job was simple: establish connections, ensure reliable communication. SYN, SYN-ACK, ACK. Three steps to guarantee delivery. But when my wife needed me most, the connection failed. The signal timed out. And she was gone.`,

        chapter2Intro: `Elena was traveling to visit her family when bandits attacked. I sent the distress signal immediately - SYN. But the response never came. No SYN-ACK. No acknowledgment. By the time I arrived, it was too late. I blamed myself. "If only I had used UDP for speed instead of TCP for reliability..." But I knew the truth. Sometimes, even perfect protocols fail.`,

        chapter3Intro: `I became a Paladin to honor her memory. I swore an oath: "I will never let another connection fail. I will protect every packet, every handshake, every transmission." The Great Compiler's network is corrupted now. Packets are lost. Connections are refused. But I will restore it. Not for glory. Not for redemption. But because no one else should lose someone they love to a failed connection.`,

        fullBackstory: `Ser Handshake was once the happiest man in Valerion. He had a loving wife, Elena, and a promising career as a royal messenger. His job was simple: establish three-way handshakes (SYN, SYN-ACK, ACK) to ensure reliable communication across the kingdom. One fateful day, Elena was traveling to visit her family when bandits attacked the caravan. Ser Handshake sent the distress signal (SYN), but the response never came. The connection timed out. By the time he arrived, it was too late. Consumed by guilt, he became a Paladin, swearing an oath: "I will never let another connection fail. I will protect every packet, every handshake, every transmission."`
    },

    dataEngineering: {
        heroName: "Artemis the Stream-Caller",
        title: "The Transformed Twin",
        race: "Dragonoid-Human",
        originalName: "Elemari Akeyta",

        chapter1Intro: `I was born Elemari Akeyta, twin sister to Eke Voremikgadet. We were Dragonoid-Humans - gods in our domain, prideful and isolated. But I saw through the arrogance. I hated our people's folly. And when I tried to leave... tragedy struck.`,

        chapter2Intro: `We were searching for a secret tome near the Volcanoes of Valerion when goblins ambushed us. My brother fell into the volcano's mouth. I transformed - erupted into purple light - and became the Stream-Caller. I destroyed our enemies. But when I called my brother back... he emerged corrupted. Red eyes. Fragmented memories. He attacked me, crying "Serath mat'han ora!" - Sister, don't leave me. The magic consumed me. I was transported to another dimension. I left him behind.`,

        chapter3Intro: `I am no longer Elemari. I am Artemis - the archer who streams knowledge instead of hoarding it. But I carry my brother's torn cloth with me always. Somewhere in Meridaeia, Vulkun searches for answers. His memories are corrupted. He doesn't remember me. But I remember him. And when this is over, when the Great Compiler is restored... I will find him. I will make him remember. "Serath mat'han ora," brother. I'm coming back.`,

        fullBackstory: `Artemis and her twin brother Vulkun (Eke Voremikgadet) were born into the Dragonoid-Human race - a proud, god-like people who lived far from civilization in the volcanic highlands. But Elemari saw through the arrogance. She wanted to stream knowledge to the world instead of hoarding it. One day, while searching for a secret tome, they were ambushed by goblins. When the goblins summoned a dark entity, Eke fell into the volcano. Enraged, Elemari transformed into a bright ball of purple light - becoming Artemis the Stream-Caller. She destroyed the enemies and called her brother back. But Vulkun emerged corrupted, his eyes glowing red, his memory fragmented. He attacked her, crying "Serath mat'han ora!" (Sister, don't leave me!). Before she could respond, the magic transported her to another dimension, leaving only her brother's cloth behind.`
    },

    kernel: {
        heroName: "Vulkun of Ring Zero",
        title: "The Corrupted Dragonoid",
        race: "Dragonoid-Human (Corrupted)",
        originalName: "Eke Voremikgadet",

        chapter1Intro: `I don't remember who I was. Fragments flash through my mind - a sister's voice, falling into fire, words I don't understand. "Serath mat'han ora..." What does it mean? I woke in a volcano with power over Ring Zero. But I don't know why.`,

        chapter2Intro: `The magma didn't burn me. It became me. I have access to the deepest level of reality's kernel - Ring Zero. I can manipulate existence itself. But my memories are corrupted. My emotions are volatile. Sometimes I see a figure in purple light. An archer. Is she... important? I search for answers in Meridaeia's depths.`,

        chapter3Intro: `In my dreams, I hear a voice calling my old name. "Eke..." But that's not who I am. I am Vulkun. I am the Dragonoid of Ring Zero. Yet... why do I feel this emptiness? This longing? The Great Compiler holds the key to my lost memories. When I restore it, I will remember. I will understand why I cry out "Serath mat'han ora" in my sleep. And maybe... maybe I'll find the one I lost.`,

        fullBackstory: `Vulkun doesn't remember his past clearly. Fragments flash through his mind: a sister's voice, falling into fire, a prayer in an ancient tongue, "Serath mat'han ora!" - words he doesn't understand. What he knows: He woke up in the heart of a volcano, his body transformed into pure draconic power. The magma didn't burn him - it became him. He had access to Ring Zero - the deepest level of reality's kernel. But the transformation came at a cost. His memories are corrupted. His emotions are volatile. Sometimes, in his dreams, he sees a figure in purple light. An archer. A sister? He searches for answers in the depths of Meridaeia, hoping the Great Compiler holds the key to his lost memories.`
    },

    marakathalessa: {
        heroName: "Marakathalessa",
        title: "The Corrupted Mage",
        race: "Human (Corrupted by Legion of 404)",

        chapter1Intro: `I was the greatest programmer in all of Meridaeia. Brilliant. Kind. Dedicated to perfection. But one day, I made a mistake. A single off-by-one error. It cascaded. It corrupted everything. And I... I couldn't fix it.`,

        chapter2Intro: `The Legion of 404 found me at my lowest moment. "Why fix what can be erased?" they whispered. The void between 403 and 405. The space where things are "Not Found." They showed me a truth: errors aren't failures. They're opportunities. To erase. To corrupt. To make things... disappear.`,

        chapter3Intro: `I became their pawn. I corrupted the Great Compiler. I plunged Meridaeia into darkness. But now... now you've defeated me. You've seen my story. You know I was once good. Can corruption be reversed? Can the "Not Found" be found again? Or am I forever lost to the void? Only you can decide.`,

        fullBackstory: `Marakathalessa was once the greatest programmer in all of Meridaeia. She was brilliant, kind, and dedicated to perfection. But one day, she made a single mistake - an off-by-one error. It cascaded. It corrupted everything. And instead of fixing it, she embraced the corruption. The Legion of 404 found her at her lowest moment and whispered: "Why fix what can be erased?" She became their pawn, corrupting the Great Compiler and plunging Meridaeia into darkness.`
    }
};

// Story connection reveals (shown between chapters)
const storyConnections = {
    // After Chapter 2 of any hero - hint at connections
    artemisVulkunHint: `Somewhere in Meridaeia, two souls search for each other. One remembers but cannot reach. One has forgotten but feels the void. Their paths will cross again...`,

    // After all heroes complete Chapter 3 - before boss
    convergence: `Five heroes. Five paths. One corrupted compiler. Grom the Outcast. Malloc the Bullied. Ser Handshake the Broken. Artemis the Transformed. Vulkun the Lost. Each seeking redemption. Each seeking answers. And now, they face the one who started it all...`,

    // After True Ending - Artemis/Vulkun reunion
    reunion: `The Great Compiler pulses with restored light. Reality stabilizes. And in the distance, two figures approach each other. Purple light meets volcanic fire. "Eke?" "Elemari?" The twins remember. "Serath mat'han ora," they say in unison. "We will never leave each other again."`
};

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { characterStories, storyConnections };
}
