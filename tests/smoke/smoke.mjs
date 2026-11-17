// End-to-end smoke test: plays the real game in a headless browser.
// Covers: title -> hero -> chapter -> full battle (win), a defeat, the
// armory, and a full boss fight. Saves screenshots as evidence.
//
// Run:  npm run build && npm run smoke
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  console.error('Playwright not found. Install with: npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}

const PORT = process.env.PORT || 4179;
const BASE = process.env.BASE_URL || `http://localhost:${PORT}`;
const OUT = process.env.EVIDENCE_DIR || 'production/qa/evidence';
mkdirSync(OUT, { recursive: true });

let failures = 0;
const check = (label, ok, detail = '') => {
  if (!ok) failures++;
  console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${label}${detail ? ' — ' + detail : ''}`);
};

const server = process.env.BASE_URL ? null
  : spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(BASE)).ok) break; } catch { /* not up yet */ }
    await sleep(250);
  }
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const game = (fn, arg) => page.evaluate(fn, arg);
  const state = () => game(() => {
    const s = window.__game.getState();
    return { screen: s.screen, gold: s.profile.gold, xp: s.profile.xp, run: s.run, boss: s.boss, results: s.results, profile: s.profile };
  });
  const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });
  const click = (id) => page.click(`[data-testid=${id}]`);
  const correctIndex = () => game(() => { const r = window.__game.getState().run; return r.order.indexOf(r.questions[r.index].correctAnswer); });
  const next = async () => { await page.waitForSelector('[data-testid=next]:not([disabled])', { timeout: 8000 }); await click('next'); };

  console.log('Title and hero select');
  // ?capture keeps each 3D frame readable so screenshots are never blank.
  await page.goto(`${BASE}/?capture`);
  await page.waitForSelector('[data-testid=begin]');
  await sleep(2500);
  await shot('01-title');
  await click('begin');
  await click('story-continue');
  await sleep(1500);
  check('hero select opens', (await state()).screen === 'heroes');
  await shot('02-hero-select');
  await click('hero-choose');
  check('chapter select opens', (await state()).screen === 'chapters');
  check('chapter 2 starts locked', await page.isDisabled('[data-testid=chapter-2]'));

  console.log('Chapter 1 — all correct');
  await click('chapter-1');
  await click('story-continue');
  await sleep(1500);
  let s = await state();
  check('battle starts with full barrier', s.screen === 'battle' && s.run.barrier === 3);
  await shot('03-battle-start');
  const total = s.run.questions.length;
  for (let i = 0; i < total; i++) {
    await click(`answer-${await correctIndex()}`);
    if (i === 0) { await sleep(600); await shot('04-hero-attack'); }
    if (i === total - 1) { await sleep(1900); await shot('05-monster-slain'); }
    await next();
  }
  s = await state();
  check('chapter cleared', s.screen === 'results' && s.results.cleared, s.results?.title);
  check('XP and gold were earned', s.xp > 0 && s.gold > 0, `xp ${s.xp}, gold ${s.gold}`);
  check('a monster was slain and lore unlocked', s.profile.stats.monstersSlain === 1 && s.profile.lore.length === 1);
  check('chapter 1 marked complete', s.profile.chapterProgress.java?.[0] === true);
  await sleep(800);
  await shot('06-victory');

  console.log('Armory');
  await game(() => window.__game.setState((st) => ({ profile: { ...st.profile, gold: 500 } })));
  await game(() => window.__game.getState().openModal('shop'));
  await click('buy-rusty_sword');
  s = await state();
  check('buying a weapon equips it and costs gold', s.profile.equipped.weapons === 'rusty_sword' && s.gold === 450);
  await shot('07-armory');
  await click('close-modal');

  console.log('Chapter 2 — defeat');
  await click('results-continue');
  check('chapter 2 unlocked', !(await page.isDisabled('[data-testid=chapter-2]')));
  await click('chapter-2');
  await click('story-continue');
  await sleep(1200);
  for (let i = 0; i < 3; i++) {
    await click(`answer-${((await correctIndex()) + 1) % 4}`);
    if (i === 0) { await sleep(700); await shot('08-monster-attack'); }
    await next();
  }
  s = await state();
  check('three wrong answers break the barrier', s.screen === 'results' && !s.results.cleared, s.results?.title);
  check('chapter 2 not marked complete', !s.profile.chapterProgress.java?.[1]);
  await sleep(600);
  await shot('09-defeat');

  console.log('Boss fight');
  await game(() => {
    const g = window.__game;
    g.setState((st) => ({ profile: { ...st.profile, chapterProgress: { java: [true, true, true] } } }));
    g.getState().goto('heroes');
    g.getState().startBoss();
  });
  await sleep(1800);
  s = await state();
  check('boss fight starts at 1000 HP', s.screen === 'boss' && s.boss.hp === 1000);
  await shot('10-boss-start');
  for (let i = 0; i < 10; i++) {
    const answer = await game(() => { const b = window.__game.getState().boss; return b.questions[b.index].correctAnswer; });
    await page.fill('[data-testid=boss-input]', answer);
    await click('boss-submit');
    if (i === 0) { await sleep(800); await shot('11-boss-hit'); }
    const dead = (await state()).boss.hp <= 0;
    await next();
    if (dead) break;
  }
  s = await state();
  check('boss defeated (incomplete ending without all heroes)', s.results?.kind === 'bossIncomplete', s.results?.title);
  await sleep(800);
  await shot('12-boss-defeated');

  console.log('Phone layout');
  await page.setViewportSize({ width: 390, height: 844 });
  await game(() => { const g = window.__game.getState(); g.goto('heroes'); g.selectHero('dataEngineering'); g.chooseChapter(1); g.closeStory(); });
  await sleep(9000);
  await shot('13-phone-battle');
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  check('phone layout has no sideways scroll', fits);

  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close();
}

main()
  .catch((e) => { failures++; console.error(e); })
  .finally(() => {
    server?.kill();
    console.log(failures ? `\n${failures} check(s) FAILED` : '\nAll checks passed');
    process.exit(failures ? 1 : 0);
  });
