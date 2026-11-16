// Game state: the saved profile, the current battle, and every action the UI
// can take. Rules live in logic.ts; this file only sequences them.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ACHIEVEMENTS, BALANCE, BOSS_QUESTIONS, CHAPTER_NAMES, HEROES, LEGION_LORE, LORE, MONSTERS,
  MONSTERS_BY_TIER, QUESTIONS, STORIES, STORY_LINKS, VIRTUES, INTRO_TEXT, findItem, ALL_SKILLS,
  type BossQuestion, type EnvKey, type GearSlot, type HeroKey, type LoreSnippet, type MonsterKey, type Question,
} from '../data';
import {
  accuracy, allHeroesComplete, attackDamage, bossDamage, calcXP, critChance, envForProgress,
  goldPerCorrect, hasSkillFlag, heroComplete, isBossAnswerCorrect, isBossUnlocked, isChapterUnlocked,
  levelForXP, maxBarrier, newProfile, pick, rollLoot, shuffled, skillLevel, timerDuration,
  type Loot, type Profile,
} from './logic';
import { audio } from './audio';

export type Screen = 'title' | 'heroes' | 'chapters' | 'battle' | 'boss' | 'results';
export type Modal = null | 'shop' | 'skills' | 'inventory' | 'codex' | 'sheet' | 'settings';

export interface StoryCard {
  badge: string;
  name: string;
  title: string;
  text: string;
  portrait?: string;
  accent: string;
  then?: 'beginChapter' | 'reunion' | 'heroes';
}

/** One-shot cue for the 3D scene to choreograph. `id` changes on every new cue. */
export interface FxAction {
  id: number;
  kind: 'heroAttack' | 'enemyAttack';
  damage?: number;
  crit?: boolean;
  kill?: boolean;
  blocked?: boolean;
  fatal?: boolean;
}

export interface Run {
  /** Unique per battle, so the 3D stage starts fresh each time. */
  fightId: number;
  hero: HeroKey;
  chapter: number;
  env: EnvKey;
  questions: Question[];
  index: number;
  /** order[displayIndex] = original option index */
  order: number[];
  eliminated: number[];
  phase: 'question' | 'feedback';
  picked: number | null;
  wasCorrect: boolean;
  graceSaved: boolean;
  timeLeft: number;
  duration: number;
  barrier: number;
  maxBarrier: number;
  monster: MonsterKey;
  monsterId: number;
  monsterHP: number;
  monsterDead: boolean;
  streak: number;
  score: number;
  correct: number;
  answered: number;
  pendingGold: number;
  freeWrongUsed: boolean;
  defeated: boolean;
  lastXP: number;
  lastDamage: number;
  lastCrit: boolean;
  virtue: string;
  loot: (Loot & { lore?: LoreSnippet }) | null;
}

export interface BossRun {
  fightId: number;
  hero: HeroKey;
  questions: BossQuestion[];
  index: number;
  hints: string[];
  hp: number;
  barrier: number;
  maxBarrier: number;
  phase: 'question' | 'feedback';
  wasCorrect: boolean;
  lastDamage: number;
  dead: boolean;
}

export interface Results {
  kind: 'chapter' | 'bossLost' | 'bossIncomplete' | 'bossTrue';
  icon: string;
  title: string;
  message: string;
  stats: { label: string; value: string }[];
  cleared: boolean;
}

export interface Settings { music: boolean; sfx: boolean; volume: number; quality: 'high' | 'low' }

interface State {
  profile: Profile;
  settings: Settings;
  lastHero: HeroKey;

  screen: Screen;
  modal: Modal;
  story: StoryCard | null;
  hero: HeroKey | null;
  /** Which entry the hero-select carousel is showing. */
  browse: HeroKey | 'boss';
  pendingChapter: number | null;
  run: Run | null;
  boss: BossRun | null;
  results: Results | null;
  action: FxAction | null;
  toasts: { id: number; text: string }[];

  begin(): void;
  setBrowse(browse: HeroKey | 'boss'): void;
  goto(screen: Screen): void;
  openModal(modal: Modal): void;
  closeStory(): void;
  toast(text: string): void;
  dismissToast(id: number): void;

  selectHero(hero: HeroKey): void;
  chooseChapter(chapter: number): void;
  answer(displayIndex: number): void;
  tick(): void;
  useHint(): void;
  nextQuestion(): void;
  useConsumable(id: string): void;
  retreat(): void;

  startBoss(): void;
  bossHint(): void;
  bossSubmit(text: string): void;
  bossNext(): void;

  buy(id: string): void;
  equip(id: string): void;
  upgradeSkill(id: string): void;

  setSettings(patch: Partial<Settings>): void;
  exportSave(): string;
  importSave(json: string): boolean;
  resetProgress(): void;
}

let uid = 1;
const nextId = () => uid++;

function pickMonster(q: Question): MonsterKey {
  return pick(MONSTERS_BY_TIER[q.difficulty] ?? MONSTERS_BY_TIER.medium);
}

function grantAchievements(profile: Profile, run: Run | null, toast: (t: string) => void): Profile {
  const earned = (id: string) => profile.achievements.includes(id);
  const fresh: string[] = [];
  const check = (id: string, ok: boolean) => { if (ok && !earned(id)) fresh.push(id); };
  check('first_question', profile.stats.answered >= 1);
  check('questions_50', profile.stats.answered >= 50);
  check('level_5', profile.level >= 5);
  check('first_blood', profile.stats.monstersSlain >= 1);
  check('witch_fallen', profile.bossDefeated !== false);
  if (run) check('perfect_round', run.answered >= 4 && run.correct === run.answered && run.index >= run.questions.length - 1);
  if (!fresh.length) return profile;
  for (const id of fresh) {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (a) toast(`${a.icon} Achievement: ${a.name}`);
  }
  audio.play('levelup');
  return { ...profile, achievements: [...profile.achievements, ...fresh] };
}

/** Lay out the next question: shuffle options, auto-hint, reset the clock. */
function dealQuestion(run: Run, profile: Profile): Run {
  const q = run.questions[run.index];
  const order = shuffled(q.options.map((_, i) => i));
  const eliminated: number[] = [];
  if (q.difficulty === 'hard' && hasSkillFlag(profile, 'autoHint')) {
    const wrong = order.map((orig, display) => ({ orig, display })).filter((o) => o.orig !== q.correctAnswer);
    eliminated.push(pick(wrong).display);
  }
  const duration = timerDuration(profile);
  const needsMonster = run.monsterDead || run.monsterHP <= 0;
  return {
    ...run,
    order, eliminated,
    phase: 'question', picked: null, wasCorrect: false, graceSaved: false,
    duration, timeLeft: duration,
    loot: null,
    ...(needsMonster
      ? { monster: pickMonster(q), monsterId: nextId(), monsterHP: BALANCE.monsterHP, monsterDead: false }
      : {}),
  };
}

export const useGame = create<State>()(
  persist(
    (set, get) => ({
      profile: newProfile(),
      settings: { music: true, sfx: true, volume: 0.35, quality: 'high' },
      lastHero: 'java',

      screen: 'title',
      modal: null,
      story: null,
      hero: null,
      browse: 'java',
      pendingChapter: null,
      run: null,
      boss: null,
      results: null,
      action: null,
      toasts: [],

      toast(text) {
        const id = nextId();
        set((s) => ({ toasts: [...s.toasts.slice(-3), { id, text }] }));
        setTimeout(() => get().dismissToast(id), 4200);
      },
      dismissToast(id) {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      },

      setBrowse(browse) {
        audio.play('select');
        set({ browse });
      },

      begin() {
        audio.unlock();
        audio.play('select');
        const { profile } = get();
        if (!profile.seenIntro) {
          set({
            screen: 'heroes',
            profile: { ...profile, seenIntro: true },
            story: {
              badge: 'Prologue', name: 'The Siege of Meridaeia', title: 'Assemble your fellowship',
              text: INTRO_TEXT, accent: '#d264ff', then: 'heroes',
            },
          });
        } else {
          set({ screen: 'heroes' });
        }
      },

      goto(screen) {
        audio.play('select');
        set({ screen, modal: null, ...(screen === 'heroes' || screen === 'title' ? { run: null, boss: null, results: null } : {}) });
      },

      openModal(modal) {
        audio.play('select');
        set({ modal });
      },

      closeStory() {
        const { story, pendingChapter, hero, profile } = get();
        audio.play('select');
        if (!story) return;
        if (story.then === 'beginChapter' && hero && pendingChapter) {
          const questions = shuffled(QUESTIONS[hero].filter((q) => q.chapter === pendingChapter));
          const p: Profile = { ...profile, storyProgress: profile.storyProgress + BALANCE.storyPerChapter };
          const barrier = maxBarrier(p);
          const base: Run = {
            fightId: nextId(), hero, chapter: pendingChapter, env: envForProgress(p.storyProgress),
            questions, index: 0, order: [], eliminated: [],
            phase: 'question', picked: null, wasCorrect: false, graceSaved: false,
            timeLeft: 0, duration: 0,
            barrier, maxBarrier: barrier,
            monster: 'goblin', monsterId: 0, monsterHP: 0, monsterDead: true,
            streak: 0, score: 0, correct: 0, answered: 0, pendingGold: 0,
            freeWrongUsed: false, defeated: false,
            lastXP: 0, lastDamage: 0, lastCrit: false, virtue: '', loot: null,
          };
          set({ story: null, profile: p, run: dealQuestion(base, p), screen: 'battle', pendingChapter: null, action: null });
          return;
        }
        if (story.then === 'reunion') {
          set({
            story: {
              badge: 'Finale', name: 'The Twins Reunited', title: 'Elemari & Eke',
              text: STORY_LINKS.reunion, portrait: HEROES.dataEngineering.portrait, accent: HEROES.dataEngineering.accent,
            },
          });
          return;
        }
        set({ story: null });
      },

      selectHero(hero) {
        audio.play('select');
        const { profile } = get();
        if (hero === 'marakathalessa' && !profile.maraUnlocked) {
          get().toast('🔒 Defeat the boss and complete every hero to hear her story.');
          return;
        }
        set({ hero, browse: hero, lastHero: hero, screen: 'chapters' });
      },

      chooseChapter(chapter) {
        const { hero, profile } = get();
        if (!hero) return;
        if (!isChapterUnlocked(profile, hero, chapter)) {
          get().toast('🔒 Complete the previous chapter first!');
          return;
        }
        audio.play('select');
        const story = STORIES[hero];
        const text = [story.chapter1Intro, story.chapter2Intro, story.chapter3Intro][chapter - 1];
        set({
          pendingChapter: chapter,
          story: {
            badge: `Chapter ${chapter} · ${CHAPTER_NAMES[chapter - 1]}`,
            name: story.heroName, title: story.title, text,
            portrait: HEROES[hero].portrait, accent: HEROES[hero].accent, then: 'beginChapter',
          },
        });
      },

      answer(displayIndex) {
        const { run } = get();
        let { profile } = get();
        if (!run || run.phase !== 'question') return;
        if (displayIndex >= 0 && run.eliminated.includes(displayIndex)) return;
        const q = run.questions[run.index];
        const correct = displayIndex >= 0 && run.order[displayIndex] === q.correctAnswer;
        const next: Run = { ...run, phase: 'feedback', picked: displayIndex, wasCorrect: correct, answered: run.answered + 1 };
        const byHero = { ...profile.stats.byHero };
        const mine = byHero[run.hero] ?? { answered: 0, correct: 0 };
        byHero[run.hero] = { answered: mine.answered + 1, correct: mine.correct + (correct ? 1 : 0) };
        profile = {
          ...profile,
          stats: { ...profile.stats, answered: profile.stats.answered + 1, correct: profile.stats.correct + (correct ? 1 : 0), byHero },
        };
        let action: FxAction;

        if (correct) {
          const xp = calcXP(profile, q.difficulty, run.timeLeft, run.duration, run.streak);
          const crit = Math.random() < critChance(profile);
          const damage = attackDamage(profile) * (crit ? 2 : 1);
          const hp = Math.max(0, run.monsterHP - damage);
          const kill = hp <= 0;
          next.correct++;
          next.streak = run.streak + 1;
          next.score += xp;
          next.lastXP = xp;
          next.lastDamage = damage;
          next.lastCrit = crit;
          next.monsterHP = hp;
          next.pendingGold += goldPerCorrect(profile);
          next.virtue = next.streak >= 3 && next.streak % 3 === 0 ? pick(VIRTUES.streak) : pick(VIRTUES.correct);
          const before = profile.level;
          const xpTotal = profile.xp + xp;
          profile = { ...profile, xp: xpTotal, level: levelForXP(profile.level, xpTotal) };
          if (profile.level > before) {
            get().toast(`⬆️ Level ${profile.level} reached!`);
            setTimeout(() => audio.play('levelup'), 900);
          }
          if (kill) {
            const loot = rollLoot(profile, next.streak);
            const env = envForProgress(profile.storyProgress);
            const locked = LORE.filter((l) => !profile.lore.includes(l.id));
            const lore = locked.find((l) => l.environment === env) ?? locked[0];
            profile = {
              ...profile,
              gold: profile.gold + next.pendingGold + loot.gold,
              storyProgress: profile.storyProgress + BALANCE.storyPerKill,
              lore: lore ? [...profile.lore, lore.id] : profile.lore,
              stats: { ...profile.stats, monstersSlain: profile.stats.monstersSlain + 1 },
            };
            next.pendingGold = 0;
            next.monsterDead = true;
            next.loot = { ...loot, lore };
          }
          action = { id: nextId(), kind: 'heroAttack', damage, crit, kill };
          audio.play('correct');
        } else {
          const grace = !run.freeWrongUsed && hasSkillFlag(profile, 'freeWrongAnswer');
          next.streak = 0;
          next.lastXP = 0;
          next.virtue = pick(VIRTUES.incorrect);
          if (grace) {
            next.freeWrongUsed = true;
            next.graceSaved = true;
          } else {
            next.barrier = Math.max(0, run.barrier - 1);
          }
          next.defeated = next.barrier <= 0;
          action = { id: nextId(), kind: 'enemyAttack', blocked: grace, fatal: next.defeated };
          audio.play('wrong');
        }

        profile = grantAchievements(profile, next, get().toast);
        set({ run: next, profile, action });
      },

      tick() {
        const { run, story, modal } = get();
        if (!run || run.phase !== 'question' || story || modal) return;
        if (run.timeLeft <= 1) {
          set({ run: { ...run, timeLeft: 0 } });
          get().answer(-1);
          return;
        }
        if (run.timeLeft === 11) audio.play('tick');
        set({ run: { ...run, timeLeft: run.timeLeft - 1 } });
      },

      useHint() {
        const { run, profile } = get();
        if (!run || run.phase !== 'question') return;
        if (profile.gold < BALANCE.hintCost) {
          get().toast(`💰 Not enough gold for a hint (need ${BALANCE.hintCost}).`);
          return;
        }
        const q = run.questions[run.index];
        const wrong = run.order
          .map((orig, display) => ({ orig, display }))
          .filter((o) => o.orig !== q.correctAnswer && !run.eliminated.includes(o.display));
        if (wrong.length <= 1) {
          get().toast('No more hints available for this question.');
          return;
        }
        audio.play('hint');
        set({
          run: { ...run, eliminated: [...run.eliminated, pick(wrong).display] },
          profile: { ...profile, gold: profile.gold - BALANCE.hintCost },
        });
      },

      nextQuestion() {
        const { run } = get();
        let { profile } = get();
        if (!run || run.phase !== 'feedback') return;
        const finished = run.defeated || run.index + 1 >= run.questions.length;
        if (!finished) {
          set({ run: dealQuestion({ ...run, index: run.index + 1 }, profile), action: null });
          return;
        }

        const acc = accuracy(run.correct, run.answered);
        const cleared = !run.defeated && acc >= BALANCE.chapterClearAccuracy;
        profile = { ...profile, gold: profile.gold + run.pendingGold };
        let message: string;
        if (cleared) {
          const bossWasUnlocked = isBossUnlocked(profile);
          const chapters = [...(profile.chapterProgress[run.hero] ?? [false, false, false])];
          chapters[run.chapter - 1] = true;
          profile = { ...profile, chapterProgress: { ...profile.chapterProgress, [run.hero]: chapters } };
          message = `Chapter ${run.chapter}: ${CHAPTER_NAMES[run.chapter - 1]} complete!`;
          if (heroComplete(profile, run.hero) && !bossWasUnlocked) {
            get().toast('⚔️ A great evil stirs... Marakathalessa can now be challenged!');
          }
          audio.play('fanfare');
        } else if (run.defeated) {
          message = 'Defeated! Regroup, visit the Armory, and try the chapter again.';
          audio.play('defeat');
        } else {
          message = `You need at least ${BALANCE.chapterClearAccuracy}% accuracy to complete the chapter. Try again!`;
          audio.play('defeat');
        }
        profile = grantAchievements(profile, run, get().toast);
        set({
          profile,
          screen: 'results',
          results: {
            kind: 'chapter',
            icon: cleared ? '🏆' : run.defeated ? '💀' : '📖',
            title: cleared ? 'Quest Complete!' : run.defeated ? 'Your Barrier Shattered...' : 'The Chapter Resists',
            message, cleared,
            stats: [
              { label: 'XP Earned', value: String(run.score) },
              { label: 'Correct', value: `${run.correct} / ${run.answered}` },
              { label: 'Accuracy', value: `${acc}%` },
            ],
          },
        });
      },

      useConsumable(id) {
        const { run, boss, profile } = get();
        const count = profile.inventory[id] ?? 0;
        if (count <= 0) return;
        const spend = (): Profile => ({ ...profile, inventory: { ...profile.inventory, [id]: count - 1 } });
        const inQuestion = run?.phase === 'question';

        if (id === 'barrier_potion') {
          if (run && !run.defeated && run.barrier < run.maxBarrier) {
            set({ run: { ...run, barrier: run.barrier + 1 }, profile: spend() });
          } else if (boss && boss.barrier > 0 && boss.barrier < boss.maxBarrier) {
            set({ boss: { ...boss, barrier: boss.barrier + 1 }, profile: spend() });
          } else {
            get().toast(run || boss ? '⚠️ Barrier already at maximum!' : '⚠️ Potions can only be used in battle.');
            return;
          }
          audio.play('heal');
          get().toast('🛡️ Barrier restored!');
        } else if (id === 'time_crystal') {
          if (!run || !inQuestion) { get().toast('⚠️ Can only be used during a question!'); return; }
          set({ run: { ...run, timeLeft: run.timeLeft + BALANCE.timeCrystalSeconds }, profile: spend() });
          audio.play('heal');
          get().toast(`⏰ +${BALANCE.timeCrystalSeconds} seconds!`);
        } else if (id === 'skip_scroll') {
          if (!run || !inQuestion) { get().toast('⚠️ Can only be used during a question!'); return; }
          const p = spend();
          audio.play('hint');
          get().toast('📜 Question skipped!');
          if (run.index + 1 >= run.questions.length) {
            set({ profile: p, run: { ...run, phase: 'feedback' }, modal: null });
            get().nextQuestion();
          } else {
            set({ profile: p, run: dealQuestion({ ...run, index: run.index + 1 }, p), modal: null });
          }
        }
      },

      retreat() {
        const { run, profile } = get();
        audio.play('select');
        set({
          profile: run ? { ...profile, gold: profile.gold + run.pendingGold } : profile,
          run: null, boss: null, screen: 'heroes', modal: null, action: null,
        });
      },

      startBoss() {
        const { profile, lastHero } = get();
        if (!isBossUnlocked(profile)) {
          get().toast('🔒 Complete all 3 chapters of any hero first!');
          return;
        }
        audio.play('boss');
        const barrier = maxBarrier(profile);
        const hero = lastHero === 'marakathalessa' ? 'java' : lastHero;
        set({
          screen: 'boss', hero, run: null, action: null,
          boss: {
            fightId: nextId(), hero, questions: shuffled(BOSS_QUESTIONS), index: 0, hints: [],
            hp: BALANCE.bossHP, barrier, maxBarrier: barrier,
            phase: 'question', wasCorrect: false, lastDamage: 0, dead: false,
          },
        });
      },

      bossHint() {
        const { boss, profile } = get();
        if (!boss || boss.phase !== 'question') return;
        const q = boss.questions[boss.index];
        if (boss.hints.length >= q.hints.length) { get().toast('No more hints available.'); return; }
        if (profile.gold < BALANCE.hintCost) { get().toast(`💰 Not enough gold (need ${BALANCE.hintCost}).`); return; }
        audio.play('hint');
        set({
          boss: { ...boss, hints: [...boss.hints, q.hints[boss.hints.length]] },
          profile: { ...profile, gold: profile.gold - BALANCE.hintCost },
        });
      },

      bossSubmit(text) {
        const { boss } = get();
        if (!boss || boss.phase !== 'question') return;
        if (!text.trim()) { get().toast('Please enter an answer.'); return; }
        const q = boss.questions[boss.index];
        if (isBossAnswerCorrect(text, q.acceptedAnswers)) {
          const damage = bossDamage(boss.hints.length);
          const hp = Math.max(0, boss.hp - damage);
          audio.play('correct');
          set({
            boss: { ...boss, phase: 'feedback', wasCorrect: true, lastDamage: damage, hp, dead: hp <= 0 },
            action: { id: nextId(), kind: 'heroAttack', damage, crit: boss.hints.length === 0, kill: hp <= 0 },
          });
        } else {
          const barrier = Math.max(0, boss.barrier - 1);
          audio.play('wrong');
          set({
            boss: { ...boss, phase: 'feedback', wasCorrect: false, lastDamage: 0, barrier },
            action: { id: nextId(), kind: 'enemyAttack', fatal: barrier <= 0 },
          });
        }
      },

      bossNext() {
        const { boss } = get();
        let { profile } = get();
        if (!boss || boss.phase !== 'feedback') return;
        const dealt = BALANCE.bossHP - boss.hp;

        if (boss.hp <= 0) {
          audio.play('fanfare');
          if (allHeroesComplete(profile)) {
            profile = { ...profile, bossDefeated: 'true', maraUnlocked: true };
            profile = grantAchievements(profile, null, get().toast);
            set({
              profile, screen: 'results',
              results: {
                kind: 'bossTrue', icon: '👑', title: 'TRUE VICTORY!', cleared: true,
                message: 'You have defeated Marakathalessa and saved Meridaeia! Her own story — and the secrets of the Legion of 404 — are now unlocked.',
                stats: [{ label: 'Title', value: 'Champion' }, { label: 'Damage', value: String(dealt) }, { label: 'Rank', value: 'MASTER' }],
              },
              story: {
                badge: 'Epilogue', name: 'The Fellowship Stands', title: 'Five paths, one dawn',
                text: STORY_LINKS.convergence, accent: '#ffd76a', then: 'reunion',
              },
            });
          } else {
            profile = { ...profile, bossDefeated: profile.bossDefeated || 'incomplete' };
            profile = grantAchievements(profile, null, get().toast);
            set({
              profile, screen: 'results',
              results: {
                kind: 'bossIncomplete', icon: '⚔️', title: 'Boss Defeated... For Now', cleared: true,
                message: '"I am but a pawn... The Legion of 404 awaits..." Complete ALL five heroes, then defeat her again to find the truth.',
                stats: [{ label: 'Outcome', value: 'Escaped' }, { label: 'Damage', value: String(dealt) }, { label: 'Truth', value: '???' }],
              },
            });
          }
          return;
        }

        const outOfBarrier = boss.barrier <= 0;
        if (outOfBarrier || boss.index + 1 >= boss.questions.length) {
          audio.play('defeat');
          set({
            screen: 'results',
            results: {
              kind: 'bossLost', icon: '💀', cleared: false,
              title: outOfBarrier ? 'Your Barrier Shattered!' : 'Marakathalessa Endures...',
              message: outOfBarrier
                ? 'Her counterattacks broke through! Train, stock up on gold for hints, and challenge her again.'
                : 'You survived her trials but her power remains. Strike harder — fewer hints deal more damage!',
              stats: [{ label: 'Outcome', value: 'Defeated' }, { label: 'Damage', value: `${dealt} / ${BALANCE.bossHP}` }, { label: 'Next', value: 'Retry' }],
            },
          });
          return;
        }

        set({ boss: { ...boss, index: boss.index + 1, hints: [], phase: 'question', wasCorrect: false }, action: null });
      },

      buy(id) {
        const { profile } = get();
        const found = findItem(id);
        if (!found) return;
        const { item, category } = found;
        if (category !== 'consumables' && profile.owned.includes(id)) { get().equip(id); return; }
        if (profile.gold < item.price) { get().toast('❌ Not enough gold!'); return; }
        audio.play('buy');
        if (category === 'consumables') {
          set({ profile: { ...profile, gold: profile.gold - item.price, inventory: { ...profile.inventory, [id]: (profile.inventory[id] ?? 0) + 1 } } });
        } else {
          set({
            profile: {
              ...profile, gold: profile.gold - item.price,
              owned: [...profile.owned, id],
              equipped: { ...profile.equipped, [category]: id },
            },
          });
        }
        get().toast(`✅ Purchased ${item.name}!`);
      },

      equip(id) {
        const { profile } = get();
        const found = findItem(id);
        if (!found || found.category === 'consumables' || !profile.owned.includes(id)) return;
        const slot = found.category as GearSlot;
        audio.play('select');
        set({ profile: { ...profile, equipped: { ...profile.equipped, [slot]: profile.equipped[slot] === id ? null : id } } });
      },

      upgradeSkill(id) {
        const { profile } = get();
        const skill = ALL_SKILLS.find((s) => s.id === id);
        if (!skill) return;
        const level = skillLevel(profile, id);
        if (level >= skill.maxLevel) { get().toast('Skill already mastered.'); return; }
        if (profile.xp < skill.cost) { get().toast('❌ Not enough XP!'); return; }
        audio.play('levelup');
        set({ profile: { ...profile, xp: profile.xp - skill.cost, skills: { ...profile.skills, [id]: level + 1 } } });
        get().toast(`✨ ${skill.name} upgraded!`);
      },

      setSettings(patch) {
        const settings = { ...get().settings, ...patch };
        set({ settings });
        audio.configure(settings);
      },

      exportSave() {
        const { profile, settings, lastHero } = get();
        return JSON.stringify({ game: 'code-of-meridaeia', version: 2, profile, settings, lastHero }, null, 2);
      },

      importSave(json) {
        try {
          const data = JSON.parse(json);
          if (data?.game !== 'code-of-meridaeia' || typeof data.profile !== 'object') return false;
          set({ profile: { ...newProfile(), ...data.profile }, screen: 'title', run: null, boss: null, modal: null, story: null });
          return true;
        } catch {
          return false;
        }
      },

      resetProgress() {
        set({ profile: newProfile(), screen: 'title', run: null, boss: null, results: null, modal: null, story: null, hero: null });
      },
    }),
    {
      name: 'code-of-meridaeia-save-v2',
      partialize: (s) => ({ profile: s.profile, settings: s.settings, lastHero: s.lastHero }),
      merge: (saved, current) => {
        const data = (saved ?? {}) as Partial<State>;
        return {
          ...current,
          ...data,
          profile: { ...newProfile(), ...(data.profile ?? {}) },
          settings: { ...current.settings, ...(data.settings ?? {}) },
        };
      },
    },
  ),
);

export { MONSTERS, LEGION_LORE };
