// Pure game rules. No React, no storage, no randomness that isn't injected —
// so every formula here is unit-testable.
import {
  ALL_SKILLS, BALANCE, LOOT_TABLE, MAIN_HEROES, findItem,
  type Difficulty, type EnvKey, type GearSlot, type HeroKey, type ItemStats, type LootTier,
} from '../data';

export interface Profile {
  xp: number;
  level: number;
  gold: number;
  owned: string[];
  equipped: Record<GearSlot, string | null>;
  inventory: Record<string, number>;
  skills: Record<string, number>;
  chapterProgress: Partial<Record<HeroKey, boolean[]>>;
  storyProgress: number;
  bossDefeated: false | 'incomplete' | 'true';
  maraUnlocked: boolean;
  lore: string[];
  achievements: string[];
  stats: {
    answered: number;
    correct: number;
    monstersSlain: number;
    byHero: Partial<Record<HeroKey, { answered: number; correct: number }>>;
  };
  seenIntro: boolean;
}

export function newProfile(): Profile {
  return {
    xp: 0, level: 1, gold: 0,
    owned: [],
    equipped: { weapons: null, armor: null, accessories: null },
    inventory: {},
    skills: {},
    chapterProgress: {},
    storyProgress: 0,
    bossDefeated: false,
    maraUnlocked: false,
    lore: [],
    achievements: [],
    stats: { answered: 0, correct: 0, monstersSlain: 0, byHero: {} },
    seenIntro: false,
  };
}

export type Rng = () => number;

/** Floor that forgives float drift (9.999999 counts as 10). */
const floor = (x: number) => Math.floor(x + 1e-9);

export function skillLevel(p: Profile, id: string): number {
  return p.skills[id] ?? 0;
}

/** Sum of a skill effect across levels. Multipliers return the bonus part (0.2 = +20%). */
export function skillBonus(p: Profile, effect: string): number {
  let total = 0;
  for (const skill of ALL_SKILLS) {
    const level = skillLevel(p, skill.id);
    const value = skill.effect[effect];
    if (level > 0 && typeof value === 'number') {
      total += effect.includes('Multiplier') ? (value - 1) * level : value * level;
    }
  }
  return total;
}

export function hasSkillFlag(p: Profile, effect: string): boolean {
  return ALL_SKILLS.some((s) => skillLevel(p, s.id) > 0 && s.effect[effect] === true);
}

export function equippedStat(p: Profile, slot: GearSlot, stat: keyof ItemStats): number | undefined {
  const id = p.equipped[slot];
  if (!id) return undefined;
  return findItem(id)?.item.stats?.[stat];
}

export function maxBarrier(p: Profile): number {
  return BALANCE.baseBarrier + (equippedStat(p, 'armor', 'barrierBonus') ?? 0) + skillBonus(p, 'startingBarrier');
}

export function attackDamage(p: Profile): number {
  return BALANCE.baseDamage + (equippedStat(p, 'weapons', 'attackBonus') ?? 0);
}

export function critChance(p: Profile): number {
  return skillBonus(p, 'critChance');
}

export function timerDuration(p: Profile): number {
  return BALANCE.baseTimer + (equippedStat(p, 'accessories', 'timerBonus') ?? 0) + skillBonus(p, 'timerBonus');
}

/** XP for a correct answer. `streak` is the count of correct answers before this one. */
export function calcXP(p: Profile, difficulty: Difficulty, timeLeft: number, duration: number, streak: number): number {
  const base = BALANCE.xpByDifficulty[difficulty] ?? BALANCE.xpByDifficulty.medium;
  const timeBonus = Math.floor((Math.max(0, timeLeft) / duration) * BALANCE.maxTimeBonus);
  let xp = base + timeBonus;
  xp *= equippedStat(p, 'accessories', 'xpMultiplier') ?? 1;
  xp *= 1 + skillBonus(p, 'xpMultiplier');
  xp = floor(xp);
  const streakBonus = Math.min(streak, BALANCE.streakCap) * BALANCE.streakStep;
  return floor(xp * (1 + streakBonus));
}

function goldMultiplier(p: Profile): number {
  return (equippedStat(p, 'accessories', 'goldMultiplier') ?? 1) * (1 + skillBonus(p, 'goldMultiplier'));
}

export function goldPerCorrect(p: Profile): number {
  return floor(BALANCE.goldPerCorrect * goldMultiplier(p));
}

export function levelForXP(currentLevel: number, xp: number): number {
  let level = currentLevel;
  while (xp >= level * 100) level++;
  return level;
}

export interface Loot { rarity: LootTier['rarity']; label: string; item: string; gold: number }

/** Weighted rarity roll. A hot streak grants a second roll, keeping the rarer result. */
export function rollLoot(p: Profile, streak: number, rng: Rng = Math.random): Loot {
  const total = LOOT_TABLE.reduce((s, t) => s + t.weight, 0);
  const roll = (): number => {
    let r = rng() * total;
    for (let i = 0; i < LOOT_TABLE.length; i++) {
      r -= LOOT_TABLE[i].weight;
      if (r <= 0) return i;
    }
    return 0;
  };
  let index = roll();
  if (streak >= BALANCE.luckyStreak) index = Math.max(index, roll());
  const tier = LOOT_TABLE[index];
  const [lo, hi] = tier.gold;
  const baseGold = lo + Math.floor(rng() * (hi - lo + 1));
  const gold = floor(baseGold * goldMultiplier(p)) + skillBonus(p, 'bonusGold');
  const item = tier.items[Math.floor(rng() * tier.items.length) % tier.items.length];
  return { rarity: tier.rarity, label: tier.label, item, gold };
}

/** Boss damage rewards using fewer hints: 100 (all 3 hints) up to 190 (none). */
export function bossDamage(hintsUsed: number): number {
  return BALANCE.bossBaseDamage + BALANCE.bossHintlessBonus * Math.max(0, BALANCE.bossMaxHints - hintsUsed);
}

function normalize(text: string): [string, string] {
  const tidy = text.trim().toLowerCase().replace(/\s+/g, ' ');
  return [tidy, tidy.replace(/\s/g, '')];
}

/** Typed boss answers: case-insensitive and forgiving about spaces. */
export function isBossAnswerCorrect(input: string, accepted: string[]): boolean {
  const [a, aTight] = normalize(input);
  if (!a) return false;
  return accepted.some((candidate) => {
    const [c, cTight] = normalize(candidate);
    return c === a || cTight === aTight;
  });
}

export function envForProgress(storyProgress: number): EnvKey {
  if (storyProgress >= 400) return 'gates';
  if (storyProgress >= 300) return 'lakes';
  if (storyProgress >= 200) return 'mountains';
  if (storyProgress >= 100) return 'forest';
  return 'wasteland';
}

export function heroComplete(p: Profile, hero: HeroKey): boolean {
  const c = p.chapterProgress[hero];
  return !!c && c[0] && c[1] && c[2];
}

export function isChapterUnlocked(p: Profile, hero: HeroKey, chapter: number): boolean {
  if (chapter <= 1) return true;
  return !!p.chapterProgress[hero]?.[chapter - 2];
}

export function isBossUnlocked(p: Profile): boolean {
  return (Object.keys(p.chapterProgress) as HeroKey[]).some((h) => heroComplete(p, h));
}

export function allHeroesComplete(p: Profile): boolean {
  return MAIN_HEROES.every((h) => heroComplete(p, h));
}

export function accuracy(correct: number, answered: number): number {
  return answered > 0 ? Math.round((correct / answered) * 100) : 0;
}

export function shuffled<T>(items: T[], rng: Rng = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pick<T>(items: T[], rng: Rng = Math.random): T {
  return items[Math.floor(rng() * items.length) % items.length];
}
