import { describe, expect, it } from 'vitest';
import { BALANCE, BOSS_QUESTIONS, MAIN_HEROES, QUESTIONS } from '../../src/data';
import {
  attackDamage, bossDamage, calcXP, envForProgress, goldPerCorrect, isBossAnswerCorrect, isBossUnlocked,
  isChapterUnlocked, levelForXP, maxBarrier, newProfile, rollLoot, timerDuration, allHeroesComplete,
} from '../../src/game/logic';

const FULL_TIME = BALANCE.baseTimer;

describe('combat numbers', () => {
  it('test_new_hero_uses_base_stats', () => {
    const p = newProfile();
    expect(attackDamage(p)).toBe(BALANCE.baseDamage);
    expect(maxBarrier(p)).toBe(BALANCE.baseBarrier);
    expect(timerDuration(p)).toBe(BALANCE.baseTimer);
  });

  it('test_gear_and_skills_raise_stats', () => {
    const p = newProfile();
    p.equipped = { weapons: 'legendary_hammer', armor: 'dragon_scale', accessories: 'speed_boots' };
    p.skills = { barrier_mastery: 2, extra_time: 3 };
    expect(attackDamage(p)).toBe(BALANCE.baseDamage + 30);
    expect(maxBarrier(p)).toBe(BALANCE.baseBarrier + 5 + 2);
    expect(timerDuration(p)).toBe(BALANCE.baseTimer + 10 + 30);
  });

  it('test_xp_scales_with_difficulty_time_and_streak', () => {
    const p = newProfile();
    expect(calcXP(p, 'easy', 0, FULL_TIME, 0)).toBe(BALANCE.xpByDifficulty.easy);
    expect(calcXP(p, 'hard', FULL_TIME, FULL_TIME, 0)).toBe(BALANCE.xpByDifficulty.hard + BALANCE.maxTimeBonus);
    const capped = calcXP(p, 'medium', 0, FULL_TIME, 99);
    expect(capped).toBe(Math.floor(BALANCE.xpByDifficulty.medium * (1 + BALANCE.streakCap * BALANCE.streakStep)));
  });

  it('test_gold_multipliers_stack', () => {
    const p = newProfile();
    expect(goldPerCorrect(p)).toBe(BALANCE.goldPerCorrect);
    p.equipped.accessories = 'gold_ring';
    p.skills = { gold_boost: 3 };
    expect(goldPerCorrect(p)).toBe(Math.floor(BALANCE.goldPerCorrect * 1.25 * 1.6));
  });

  it('test_level_up_at_level_times_100_xp', () => {
    expect(levelForXP(1, 99)).toBe(1);
    expect(levelForXP(1, 100)).toBe(2);
    expect(levelForXP(2, 350)).toBe(4);
  });
});

describe('boss fight', () => {
  it('test_boss_is_winnable_with_every_hint_used', () => {
    const worstCase = BOSS_QUESTIONS.length * bossDamage(BALANCE.bossMaxHints);
    expect(worstCase).toBeGreaterThanOrEqual(BALANCE.bossHP);
  });

  it('test_fewer_hints_hit_harder', () => {
    expect(bossDamage(0)).toBeGreaterThan(bossDamage(1));
    expect(bossDamage(3)).toBe(BALANCE.bossBaseDamage);
  });

  it('test_typed_answers_ignore_case_and_spacing', () => {
    expect(isBossAnswerCorrect('  FINAL ', ['final'])).toBe(true);
    expect(isBossAnswerCorrect('- >', ['->'])).toBe(true);
    expect(isBossAnswerCorrect('', ['final'])).toBe(false);
    expect(isBossAnswerCorrect('static', ['final'])).toBe(false);
  });

  it('test_every_boss_question_accepts_its_own_answer', () => {
    for (const q of BOSS_QUESTIONS) expect(isBossAnswerCorrect(q.correctAnswer, q.acceptedAnswers)).toBe(true);
  });
});

describe('progression', () => {
  it('test_chapters_unlock_in_order', () => {
    const p = newProfile();
    expect(isChapterUnlocked(p, 'java', 1)).toBe(true);
    expect(isChapterUnlocked(p, 'java', 2)).toBe(false);
    p.chapterProgress.java = [true, false, false];
    expect(isChapterUnlocked(p, 'java', 2)).toBe(true);
    expect(isChapterUnlocked(p, 'java', 3)).toBe(false);
  });

  it('test_boss_unlocks_after_one_hero_and_true_ending_needs_all', () => {
    const p = newProfile();
    expect(isBossUnlocked(p)).toBe(false);
    p.chapterProgress.cpp = [true, true, true];
    expect(isBossUnlocked(p)).toBe(true);
    expect(allHeroesComplete(p)).toBe(false);
    for (const h of MAIN_HEROES) p.chapterProgress[h] = [true, true, true];
    expect(allHeroesComplete(p)).toBe(true);
  });

  it('test_environment_follows_story_progress', () => {
    expect(envForProgress(0)).toBe('wasteland');
    expect(envForProgress(100)).toBe('forest');
    expect(envForProgress(250)).toBe('mountains');
    expect(envForProgress(399)).toBe('lakes');
    expect(envForProgress(400)).toBe('gates');
  });

  it('test_every_hero_has_questions_in_all_three_chapters', () => {
    for (const [hero, list] of Object.entries(QUESTIONS)) {
      for (const chapter of [1, 2, 3]) {
        const inChapter = list.filter((q) => q.chapter === chapter);
        expect(inChapter.length, `${hero} chapter ${chapter}`).toBeGreaterThan(0);
        for (const q of inChapter) {
          expect(q.options.length).toBe(4);
          expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
          expect(q.correctAnswer).toBeLessThan(4);
        }
      }
    }
  });
});

describe('loot', () => {
  it('test_lowest_roll_gives_common_and_highest_gives_legendary', () => {
    const p = newProfile();
    expect(rollLoot(p, 0, () => 0).rarity).toBe('common');
    expect(rollLoot(p, 0, () => 0.9999).rarity).toBe('legendary');
  });

  it('test_hot_streak_keeps_the_better_of_two_rolls', () => {
    const p = newProfile();
    const rolls = [0, 0.9999, 0, 0];
    let i = 0;
    const loot = rollLoot(p, BALANCE.luckyStreak, () => rolls[i++ % rolls.length]);
    expect(loot.rarity).toBe('legendary');
  });
});
