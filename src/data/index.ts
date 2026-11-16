// Central typed access to all game content and tuning values.
// Numbers here mirror the original game's balance (see legacy/ and
// .claude/agents/balance-keeper.md).
import { javaQuestions } from './questions/java.js';
import { cppQuestions } from './questions/cpp.js';
import { networkingQuestions } from './questions/networking.js';
import { dataEngineeringQuestions } from './questions/data-engineering.js';
import { kernelQuestions } from './questions/kernel.js';
import { marakathalessaQuestions } from './questions/marakathalessa.js';
import { bossQuestions } from './questions/boss.js';
import { shopInventory, skillTree } from './shop.js';
import { loreSnippets, legionLore } from './lore.js';
import { characterStories, storyConnections } from './stories.js';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type HeroKey = 'java' | 'cpp' | 'networking' | 'dataEngineering' | 'kernel' | 'marakathalessa';
export type MonsterKey = 'goblin' | 'wolf' | 'demon' | 'wraith' | 'compiler';
export type EnvKey = 'wasteland' | 'forest' | 'mountains' | 'lakes' | 'gates' | 'throne';
export type GearSlot = 'weapons' | 'armor' | 'accessories';
export type ShopCategory = GearSlot | 'consumables';

export interface Question {
  id: string;
  chapter: number;
  category: string;
  difficulty: Difficulty;
  type: string;
  question: string;
  code: string | null;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface BossQuestion {
  id: string;
  difficulty: Difficulty;
  question: string;
  code: string | null;
  correctAnswer: string;
  acceptedAnswers: string[];
  hints: string[];
  explanation: string;
}

export interface ItemStats {
  attackBonus?: number;
  barrierBonus?: number;
  goldMultiplier?: number;
  xpMultiplier?: number;
  timerBonus?: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stats?: ItemStats;
  stackable?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  effect: Record<string, number | boolean>;
}

export interface SkillBranch {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface HeroDef {
  key: HeroKey;
  name: string;
  short: string;
  cls: string;
  tag: string;
  desc: string;
  portrait: string;
  accent: string;
  style: 'melee' | 'ranged';
}

export interface LoreSnippet {
  id: string;
  environment: string;
  text: string;
  unlocks: string;
  depth: number;
}

export interface Story {
  heroName: string;
  title: string;
  race: string;
  chapter1Intro: string;
  chapter2Intro: string;
  chapter3Intro: string;
  fullBackstory: string;
}

export const HEROES: Record<HeroKey, HeroDef> = {
  java: {
    key: 'java', name: 'Grom the Uncompiled', short: 'Grom', cls: 'Barbarian Warrior', tag: 'Java',
    desc: 'Master of the "Write Once, Crush Everywhere" arts. High resilience and brute force.',
    portrait: '/assets/heroes/hero-grom-portrait.png', accent: '#ff8a3c', style: 'melee',
  },
  cpp: {
    key: 'cpp', name: 'Malloc the Void-Walker', short: 'Malloc', cls: 'Dark Wizard', tag: 'C++',
    desc: 'Wielder of volatile arcane memory. High power, but one slip leads to a Void Segfault.',
    portrait: '/assets/heroes/hero-malloc-portrait.png', accent: '#4de8e0', style: 'ranged',
  },
  networking: {
    key: 'networking', name: 'Ser Handshake', short: 'Handshake', cls: 'Knight Paladin', tag: 'Networking',
    desc: 'Guardian of the Great Gateway. Restoring the Three-Way Handshake of light.',
    portrait: '/assets/heroes/hero-handshake-portrait.png', accent: '#7fd4ff', style: 'melee',
  },
  dataEngineering: {
    key: 'dataEngineering', name: 'Artemis the Stream-Caller', short: 'Artemis', cls: 'Knight Archer', tag: 'Data Eng',
    desc: 'Purifier of the Corrupted Lakes. Her Pipeline of Arrows never misses the mark.',
    portrait: '/assets/heroes/hero-artemis-portrait.png', accent: '#b07cff', style: 'ranged',
  },
  kernel: {
    key: 'kernel', name: 'Vulkun of Ring Zero', short: 'Vulkun', cls: 'Dragonoid Mercenary', tag: 'Kernel Dev',
    desc: 'Born from Silicon fires. Master of the Low-Level Ring Zero magic.',
    portrait: '/assets/heroes/hero-vulkun-portrait.png', accent: '#ff5a2a', style: 'melee',
  },
  marakathalessa: {
    key: 'marakathalessa', name: 'Marakathalessa Redeemed', short: 'Marakathalessa', cls: 'Corrupted Mage', tag: 'Her Story',
    desc: 'Play her story. Learn how she fell to the Legion of 404.',
    portrait: '/assets/monsters/boss-marakathalessa-alt.png', accent: '#d264ff', style: 'ranged',
  },
};

/** The five heroes whose stories gate the true ending. */
export const MAIN_HEROES: HeroKey[] = ['java', 'cpp', 'networking', 'dataEngineering', 'kernel'];

export const QUESTIONS: Record<HeroKey, Question[]> = {
  java: javaQuestions as Question[],
  cpp: cppQuestions as Question[],
  networking: networkingQuestions as Question[],
  dataEngineering: dataEngineeringQuestions as Question[],
  kernel: kernelQuestions as Question[],
  marakathalessa: marakathalessaQuestions as Question[],
};

export const BOSS_QUESTIONS = bossQuestions as BossQuestion[];

export interface MonsterDef {
  key: MonsterKey;
  name: string;
  tier: Difficulty;
  lore: string;
  portrait: string;
  accent: string;
}

export const MONSTERS: Record<MonsterKey, MonsterDef> = {
  goblin: {
    key: 'goblin', name: 'Syntax Goblin', tier: 'easy', accent: '#ff4a4a',
    portrait: '/assets/monsters/monster-syntax-goblin.png',
    lore: "Once a humble data structure, corrupted by Marakathalessa's dark magic. It now prowls the wasteland, causing syntax errors in all who cross its path.",
  },
  wolf: {
    key: 'wolf', name: 'Null Pointer Wolf', tier: 'easy', accent: '#7fd4ff',
    portrait: '/assets/monsters/monster-null-wolf.png',
    lore: 'A spectral beast born from dereferenced memory. It hunts those who forget to initialize their variables, leading them into null dimensions.',
  },
  demon: {
    key: 'demon', name: 'Memory Leak Demon', tier: 'medium', accent: '#8a6cff',
    portrait: '/assets/monsters/monster-memory-demon.png',
    lore: 'This creature was once a function - clean, pure, purposeful. But when the Great Compiler fell, it lost its return statement and now wanders forever, never completing.',
  },
  wraith: {
    key: 'wraith', name: 'Segfault Wraith', tier: 'medium', accent: '#4de8e0',
    portrait: '/assets/monsters/monster-segfault-wraith.png',
    lore: 'The ghost of a crashed program, forever trapped between memory segments. It seeks to drag others into the void of undefined behavior.',
  },
  compiler: {
    key: 'compiler', name: 'Corrupted Compiler', tier: 'hard', accent: '#ff2d3d',
    portrait: '/assets/monsters/monster-corrupted-compiler.png',
    lore: "A shard of the Great Compiler itself, twisted by Marakathalessa's dark magic. It rejects all who dare challenge the corruption of Meridaeia.",
  },
};

export const MONSTERS_BY_TIER: Record<Difficulty, MonsterKey[]> = {
  easy: ['goblin', 'wolf'],
  medium: ['demon', 'wraith'],
  hard: ['compiler'],
};

export const ENV_NAMES: Record<EnvKey, string> = {
  wasteland: 'The Ashen Wasteland',
  forest: 'The Whispering Forest',
  mountains: 'The Frozen Peaks',
  lakes: 'The Data Lakes',
  gates: 'The Gates of Meridaeia',
  throne: "Marakathalessa's Sanctum",
};

export const CHAPTER_NAMES = ['The Awakening', 'Rising Storm', 'The Reckoning'];

/** All tunable gameplay numbers in one place. */
export const BALANCE = {
  xpByDifficulty: { easy: 10, medium: 20, hard: 30 } as Record<Difficulty, number>,
  maxTimeBonus: 10,
  streakStep: 0.1,
  streakCap: 5,
  goldPerCorrect: 5,
  hintCost: 10,
  baseBarrier: 3,
  monsterHP: 100,
  baseDamage: 25,
  bossHP: 1000,
  bossBaseDamage: 100,
  bossHintlessBonus: 30,
  bossMaxHints: 3,
  baseTimer: 60,
  timeCrystalSeconds: 30,
  chapterClearAccuracy: 50,
  storyPerChapter: 5,
  storyPerKill: 20,
  luckyStreak: 3,
};

export interface LootTier {
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  label: string;
  weight: number;
  gold: [number, number];
  items: string[];
}

export const LOOT_TABLE: LootTier[] = [
  { rarity: 'common', label: 'Common', weight: 55, gold: [4, 10],
    items: ["Goblin's Cracked Semicolon", 'Rusty Loop Counter', 'Torn Stack Frame', 'Bent Null Terminator'] },
  { rarity: 'uncommon', label: 'Uncommon', weight: 25, gold: [12, 20],
    items: ['Vial of Sanitized Input', 'Polished Boolean Gem', 'Cloak of Caught Exceptions', 'Wolf-Fang Pointer'] },
  { rarity: 'rare', label: 'Rare', weight: 13, gold: [25, 40],
    items: ['Rune of Constant Time', 'Demonhide Debugger', 'Chalice of Closed Sockets', 'Wraithbone Compiler Flag'] },
  { rarity: 'epic', label: 'Epic', weight: 5.5, gold: [50, 80],
    items: ['Crown of the Root User', 'Heart of the Deadlock Dragon', 'Sigil of Zero Downtime'] },
  { rarity: 'legendary', label: 'LEGENDARY', weight: 1.5, gold: [120, 200],
    items: ['Blade of the Final Keyword', 'The Uncorrupted Kernel', "Marakathalessa's Lost Tear"] },
];

export const VIRTUES = {
  correct: [
    'Wisdom grows with each victory.', 'Patience and study bear fruit.', 'Your perseverance is rewarded.',
    'Knowledge is the beginning of wisdom.', 'Well done! Keep pressing forward.', 'Diligence leads to mastery.',
    'Every step forward is progress.', 'Your dedication shines through.', 'The path of understanding unfolds.',
    'Excellence comes through practice.',
  ],
  incorrect: [
    'Grace covers all mistakes. Learn and grow.', 'Even heroes stumble. Rise again.',
    'Every failure plants seeds of wisdom.', 'Patience with yourself is strength.',
    'Mistakes are teachers in disguise.', 'The journey matters more than perfection.',
    'Tomorrow brings new opportunities.', 'Growth comes through challenge.',
    'Persistence overcomes all obstacles.', 'Take heart, redemption is always possible.',
  ],
  streak: [
    'Your consistency inspires!', 'A pattern of excellence emerges.', 'Faithfulness in the small things.',
    'Building momentum through dedication.', 'Steadfast and sure!',
  ],
};

export interface Achievement { id: string; name: string; description: string; icon: string }

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_question', name: 'First Steps', description: 'Answer your first question', icon: '🎯' },
  { id: 'perfect_round', name: 'Perfect!', description: 'Get every question right in a chapter', icon: '⭐' },
  { id: 'level_5', name: 'Getting Good', description: 'Reach Level 5', icon: '📈' },
  { id: 'questions_50', name: 'Dedicated Learner', description: 'Answer 50 questions', icon: '📚' },
  { id: 'first_blood', name: 'Bug Squasher', description: 'Slay your first monster', icon: '🗡️' },
  { id: 'witch_fallen', name: 'Witchbreaker', description: 'Defeat Marakathalessa', icon: '👑' },
];

export const SHOP = shopInventory as Record<ShopCategory, ShopItem[]>;
export const SKILL_TREE = skillTree as unknown as Record<string, SkillBranch>;
export const LORE = loreSnippets as LoreSnippet[];
export const LEGION_LORE = legionLore as { id: string; title: string; text: string }[];
export const STORIES = characterStories as unknown as Record<HeroKey, Story>;
export const STORY_LINKS = storyConnections as { artemisVulkunHint: string; convergence: string; reunion: string };

export const ALL_SKILLS: Skill[] = Object.values(SKILL_TREE).flatMap((b) => b.skills);

export function findItem(id: string): { item: ShopItem; category: ShopCategory } | null {
  for (const category of Object.keys(SHOP) as ShopCategory[]) {
    const item = SHOP[category].find((i) => i.id === id);
    if (item) return { item, category };
  }
  return null;
}

export const INTRO_TEXT =
  'The Great Compiler has fallen. Valerion, your home, is but a whispering echo of ash. ' +
  'Marakathalessa, the Witch of Corrupted Code, has stolen the Ancient Logic and retreated to her ' +
  'fortress in Meridaeia. The land is plagued by syntax errors and memory leaks. Only you can ' +
  'reclaim your heritage and restore order to the realm.';
