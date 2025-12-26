// Code of Meridaeia Shop Inventory - The Armory of Meridaeia
// All purchasable items with stats and prices

const shopInventory = {
    weapons: [
        {
            id: 'rusty_sword',
            name: 'Rusty Sword',
            description: 'A weathered blade, but still sharp enough to debug.',
            price: 50,
            stats: { attackBonus: 5 },
            icon: '🗡️'
        },
        {
            id: 'iron_axe',
            name: 'Iron Axe of Compilation',
            description: 'Grom\'s favorite. Cleaves through bugs and monsters alike.',
            price: 100,
            stats: { attackBonus: 10 },
            icon: '🪓'
        },
        {
            id: 'steel_blade',
            name: 'Steel Blade of Logic',
            description: 'Forged in the fires of clean code. Cuts deep.',
            price: 150,
            stats: { attackBonus: 15 },
            icon: '⚔️'
        },
        {
            id: 'enchanted_staff',
            name: 'Staff of Malloc',
            description: 'Channels arcane memory magic. High power, high risk.',
            price: 200,
            stats: { attackBonus: 20 },
            icon: '🔮'
        },
        {
            id: 'legendary_hammer',
            name: 'Hammer of Refactoring',
            description: 'Legendary weapon. Crushes technical debt.',
            price: 300,
            stats: { attackBonus: 30 },
            icon: '🔨'
        }
    ],
    
    armor: [
        {
            id: 'leather_vest',
            name: 'Leather Vest',
            description: 'Basic protection against logical errors.',
            price: 75,
            stats: { barrierBonus: 1 },
            icon: '🦺'
        },
        {
            id: 'chainmail',
            name: 'Chainmail of Exception Handling',
            description: 'Catches errors before they reach you.',
            price: 125,
            stats: { barrierBonus: 2 },
            icon: '🛡️'
        },
        {
            id: 'plate_armor',
            name: 'Plate Armor of Validation',
            description: 'Heavy protection. Validates all inputs.',
            price: 200,
            stats: { barrierBonus: 3 },
            icon: '🛡️'
        },
        {
            id: 'dragon_scale',
            name: 'Dragon Scale Mail',
            description: 'Forged from kernel panic scales. Nearly impenetrable.',
            price: 300,
            stats: { barrierBonus: 5 },
            icon: '🐉'
        }
    ],
    
    accessories: [
        {
            id: 'gold_ring',
            name: 'Ring of Fortune',
            description: 'Increases gold earned from combat by 25%.',
            price: 150,
            stats: { goldMultiplier: 1.25 },
            icon: '💍'
        },
        {
            id: 'xp_amulet',
            name: 'Amulet of Learning',
            description: 'Absorbs knowledge faster. +20% XP from all sources.',
            price: 150,
            stats: { xpMultiplier: 1.2 },
            icon: '📿'
        },
        {
            id: 'lucky_charm',
            name: 'Lucky Compiler Charm',
            description: 'The best of both worlds. +15% Gold and +15% XP.',
            price: 250,
            stats: { goldMultiplier: 1.15, xpMultiplier: 1.15 },
            icon: '🍀'
        },
        {
            id: 'speed_boots',
            name: 'Boots of Optimization',
            description: 'Move faster through problems. +10 seconds per question.',
            price: 200,
            stats: { timerBonus: 10 },
            icon: '👢'
        }
    ],
    
    consumables: [
        {
            id: 'skip_scroll',
            name: 'Scroll of Skipping',
            description: 'Bypass one HARD question. Single use.',
            price: 50,
            stackable: true,
            icon: '📜'
        },
        {
            id: 'barrier_potion',
            name: 'Potion of Shielding',
            description: 'Restore 1 barrier point. Single use.',
            price: 30,
            stackable: true,
            icon: '🧪'
        },
        {
            id: 'time_crystal',
            name: 'Time Crystal',
            description: 'Add 30 seconds to current question timer. Single use.',
            price: 40,
            stackable: true,
            icon: '💎'
        }
    ]
};

// Skill tree data
const skillTree = {
    combat: {
        name: 'Combat Mastery',
        icon: '⚔️',
        skills: [
            {
                id: 'extra_time',
                name: 'Extended Focus',
                description: 'Increase question timer by 10 seconds per level.',
                cost: 100,
                maxLevel: 3,
                effect: { timerBonus: 10 }
            },
            {
                id: 'critical_strike',
                name: 'Critical Strike',
                description: '10% chance to deal double damage.',
                cost: 200,
                maxLevel: 1,
                effect: { critChance: 0.1 }
            },
            {
                id: 'barrier_mastery',
                name: 'Barrier Mastery',
                description: 'Start each quest with +1 barrier point.',
                cost: 150,
                maxLevel: 2,
                effect: { startingBarrier: 1 }
            }
        ]
    },
    economy: {
        name: 'Wealth & Fortune',
        icon: '💰',
        skills: [
            {
                id: 'gold_boost',
                name: 'Treasure Hunter',
                description: '+20% gold from all sources per level.',
                cost: 150,
                maxLevel: 3,
                effect: { goldMultiplier: 1.2 }
            },
            {
                id: 'xp_boost',
                name: 'Quick Learner',
                description: '+15% XP from all sources per level.',
                cost: 150,
                maxLevel: 3,
                effect: { xpMultiplier: 1.15 }
            },
            {
                id: 'bonus_loot',
                name: 'Monster Bounty',
                description: '+10 bonus gold when defeating monsters.',
                cost: 100,
                maxLevel: 2,
                effect: { bonusGold: 10 }
            }
        ]
    },
    utility: {
        name: 'Arcane Knowledge',
        icon: '🌟',
        skills: [
            {
                id: 'auto_hint',
                name: 'Mystic Insight',
                description: 'Automatically eliminate one wrong answer on hard questions.',
                cost: 250,
                maxLevel: 1,
                effect: { autoHint: true }
            },
            {
                id: 'second_chance',
                name: 'Second Chance',
                description: 'First wrong answer each quest doesn\'t reduce barrier.',
                cost: 200,
                maxLevel: 1,
                effect: { freeWrongAnswer: true }
            }
        ]
    }
};
