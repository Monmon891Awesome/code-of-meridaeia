// Code of Meridaeia - gameplay smoke test
//
// Drives the real game in headless Chromium and verifies the core loops:
// chapter flow, combat, hints, keyboard play, defeat, and the boss fight.
//
// Requirements: Node 18+, Playwright with Chromium
//   npm i -D playwright && npx playwright install chromium
// Run from the repo root:
//   node tests/smoke-test.js
//
// The script serves the repo itself (python3 http.server) and cleans up
// after. Override the port with PORT=xxxx, or point at an already-running
// server with BASE_URL=http://localhost:xxxx.

const { spawn } = require('child_process');
const path = require('path');

function resolvePlaywright() {
    const candidates = [
        'playwright',
        path.join('/opt/node22/lib/node_modules', 'playwright'),
        path.join(process.env.HOME || '', '.npm-global/lib/node_modules/playwright')
    ];
    for (const c of candidates) {
        try { return require(c); } catch (_) { /* next */ }
    }
    console.error('Playwright not found. Install with: npm i -D playwright && npx playwright install chromium');
    process.exit(2);
}

const { chromium } = resolvePlaywright();

const PORT = process.env.PORT || 8917;
const BASE = process.env.BASE_URL || `http://localhost:${PORT}`;

let failures = 0;
function check(label, ok, detail = '') {
    const mark = ok ? 'PASS' : 'FAIL';
    if (!ok) failures++;
    console.log(`  [${mark}] ${label}${detail ? ' — ' + detail : ''}`);
}

(async () => {
    let server = null;
    if (!process.env.BASE_URL) {
        server = spawn('python3', ['-m', 'http.server', String(PORT)], {
            cwd: path.join(__dirname, '..'),
            stdio: 'ignore'
        });
        await new Promise(r => setTimeout(r, 1200));
    }

    const launchOpts = {};
    if (process.env.PLAYWRIGHT_CHROMIUM) launchOpts.executablePath = process.env.PLAYWRIGHT_CHROMIUM;
    const browser = await chromium.launch(launchOpts);
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('dialog', async d => {
        if (d.type() === 'prompt') await d.accept('SmokeTester');
        else await d.accept();
    });

    try {
        console.log('1. Boot, welcome modal, intro');
        await page.goto(BASE, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);

        // First run shows the welcome modal instead of a prompt()
        const welcomeVisible = await page.isVisible('#welcome-modal:not(.hidden)');
        check('welcome modal shown on first run', welcomeVisible);
        if (welcomeVisible) {
            await page.fill('#welcome-username', 'SmokeTester');
            await page.click('#welcome-start-btn');
            await page.waitForTimeout(500);
        }
        check('welcome modal closed after start',
            await page.isHidden('#welcome-modal'));

        await page.evaluate(() => game.skipIntro());
        await page.waitForTimeout(2300);
        check('category select visible', await page.isVisible('#category-select'));
        check('username saved from modal',
            await page.evaluate(() => game.userProfile.username) === 'SmokeTester');

        console.log('1.5 Hero wheel');
        check('wheel renders 7 medallions',
            (await page.$$('#hero-wheel .wheel-medallion')).length === 7);
        check('locked heroes are sealed silhouettes',
            (await page.$$('#hero-wheel .wheel-medallion.locked')).length === 2);
        // Focused (unlocked) hero shows a media frame with a poster; the fight
        // clip fades in over it in browsers with H.264 (not headless Chromium).
        await page.evaluate(() => { game.wheelIndex = 0; game.renderHeroWheel(); });
        await page.waitForTimeout(200);
        check('focused hero shows a media frame with poster',
            await page.$('#wheel-detail .wheel-hero-media .wheel-hero-poster') !== null);
        // The Choose button must sit above the fixed nav (not hidden behind it)
        check('Choose button clears the bottom nav',
            await page.evaluate(() => {
                const btn = document.querySelector('#wheel-detail .wheel-begin');
                const bar = document.querySelector('.bottom-bar');
                if (!btn || !bar) return false;
                return btn.getBoundingClientRect().bottom <= bar.getBoundingClientRect().top + 1;
            }));
        const idxBefore = await page.evaluate(() => game.wheelIndex);
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(300);
        check('arrow key spins the wheel',
            await page.evaluate(() => game.wheelIndex) === (idxBefore + 1) % 7);
        await page.evaluate(() => { game.wheelIndex = 0; game.renderHeroWheel(); });
        await page.waitForTimeout(300);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(400);
        check('Enter confirms wheel selection (chapter select opens)',
            await page.isVisible('#chapter-select'));
        await page.evaluate(() => game.backToHeroSelect());
        await page.waitForTimeout(300);

        console.log('2. Chapter flow');
        await page.evaluate(() => { game.selectCategory('java'); game.selectChapter(1); game.closeStory(); });
        await page.waitForTimeout(400);
        check('game area visible', await page.isVisible('#game-area'));
        const cards = await page.$$('#options-container .answer-card');
        check('4 answer cards rendered as buttons', cards.length === 4 &&
            await page.$eval('#options-container .answer-card', el => el.tagName === 'BUTTON'));
        check('answer text visible without hover',
            (await page.$eval('.answer-card .card-answer-text', el => el.textContent.trim())).length > 0);

        console.log('3. Hint with no gold (regression: used to crash)');
        await page.evaluate(() => { game.userProfile.gold = 0; });
        await page.click('#hint-button');
        await page.waitForTimeout(300);
        check('no crash, toast shown', (await page.$$('.toast-notification')).length > 0);

        console.log('4. Correct answer, XP, Enter-to-continue');
        const xpBefore = await page.evaluate(() => game.userProfile.xp);
        const ci = await page.evaluate(() => game.currentCorrectIndex);
        await (await page.$$('#options-container .answer-card'))[ci].click();
        await page.waitForTimeout(500);
        check('feedback shown', await page.isVisible('#feedback-container'));
        check('XP increased', await page.evaluate(() => game.userProfile.xp) > xpBefore);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(400);
        check('Enter advanced past feedback', await page.isHidden('#feedback-container'));

        console.log('5. Wrong answer costs barrier');
        const bBefore = await page.evaluate(() => game.userProfile.barrierPoints);
        const ci2 = await page.evaluate(() => game.currentCorrectIndex);
        await page.keyboard.press(String(((ci2 + 1) % 4) + 1));
        await page.waitForTimeout(500);
        const bAfter = await page.evaluate(() => game.userProfile.barrierPoints);
        check('barrier dropped by 1', bAfter === bBefore - 1, `${bBefore} -> ${bAfter}`);

        console.log('6. Defeat at 0 barrier');
        await page.evaluate(() => { game.userProfile.barrierPoints = 1; });
        await page.keyboard.press('Enter');
        await page.waitForTimeout(400);
        for (let i = 0; i < 6 && await page.isHidden('#results-screen'); i++) {
            const w = await page.evaluate(() => (game.currentCorrectIndex + 1) % 4);
            const cs = await page.$$('#options-container .answer-card');
            if (!cs.length) break;
            await cs[w].click();
            await page.waitForTimeout(400);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(400);
        }
        check('defeat screen shown', await page.isVisible('#results-screen') &&
            (await page.textContent('.results-card h2')).includes('Barrier'));

        console.log('7. Boss fight win and loss states');
        await page.evaluate(() => {
            game.userProfile.chapterProgress.java = { chapter1: true, chapter2: true, chapter3: true };
            document.getElementById('results-screen').classList.add('hidden');
            document.getElementById('category-select').classList.remove('hidden');
            game.selectBoss();
        });
        // selectBoss plays a short entrance cinematic first (skipped instantly
        // when the clip can't decode, e.g. headless), then reveals the fight.
        await page.waitForSelector('#boss-fight-area:not(.hidden)', { timeout: 4000 }).catch(() => {});
        check('boss fight visible', await page.isVisible('#boss-fight-area'));
        const bossAnswer = await page.evaluate(() => game.currentBossQuestion.correctAnswer);
        await page.fill('#code-answer', '  ' + String(bossAnswer).toUpperCase() + '  ');
        await page.click('.code-input-container button');
        await page.waitForTimeout(400);
        const hpAfter = await page.evaluate(() => game.bossHP);
        check('tolerant answer matching dealt damage', hpAfter < 1000, `boss HP ${hpAfter}`);
        await page.evaluate(() => { game.bossHP = 0; });
        await page.click('#boss-next-btn');
        await page.waitForTimeout(400);
        check('boss dies at 0 HP', await page.isVisible('#results-screen'));

        await page.evaluate(() => {
            document.getElementById('results-screen').classList.add('hidden');
            document.getElementById('category-select').classList.remove('hidden');
            game.selectBoss();
        });
        await page.waitForSelector('#boss-fight-area:not(.hidden)', { timeout: 4000 }).catch(() => {});
        await page.evaluate(() => { game.userProfile.barrierPoints = 0; });
        await page.fill('#code-answer', 'wrong answer on purpose');
        await page.click('.code-input-container button');
        await page.waitForTimeout(300);
        await page.click('#boss-next-btn');
        await page.waitForTimeout(400);
        check('boss defeats player at 0 barrier',
            (await page.textContent('.results-card h2')).includes('Barrier'));

        console.log('7.5 Loot drop on monster kill');
        await page.evaluate(() => {
            document.getElementById('results-screen').classList.add('hidden');
            game.selectCategory('java'); game.selectChapter(1); game.closeStory();
        });
        await page.waitForTimeout(400);
        await page.evaluate(() => { game.currentMonsterHP = 25; }); // next hit kills
        const lootCi = await page.evaluate(() => game.currentCorrectIndex);
        await (await page.$$('#options-container .answer-card'))[lootCi].click();
        await page.waitForTimeout(900);
        const lootToast = await page.$('.loot-toast');
        check('loot drop toast appeared with rarity', lootToast !== null,
            lootToast ? await lootToast.getAttribute('class') : 'none');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(300);

        console.log('7.6 Loot affixes & procedural gear');
        // rollLoot now yields equippable gear with rolled affixes
        check('rollLoot returns gear shape (slot, affixes[], id)', await page.evaluate(() => {
            const l = game.rollLoot();
            return !!l.slot && Array.isArray(l.affixes) && typeof l.id === 'string' && !!l.stats;
        }));
        check('rarity governs affix count (legendary rolls 3)', await page.evaluate(() =>
            game.rollAffixes('legendary').length === 3 &&
            game.rollAffixes('common').length <= 1));
        check('affixesToStats builds factors for mult, flats for add', await page.evaluate(() => {
            const s = game.affixesToStats([
                { stat: 'xpMultiplier', kind: 'mult', value: 0.2 },
                { stat: 'attackBonus', kind: 'add', value: 7 }
            ]);
            return Math.abs(s.xpMultiplier - 1.2) < 1e-9 && s.attackBonus === 7;
        }));
        // Equipping enchanted gear must actually change derived stats
        const gearEffect = await page.evaluate(() => {
            // clean slate
            game.userProfile.equipped = { weapons: null, armor: null, accessories: null };
            const before = {
                atk: game.calculateAttackDamage(),
                barrier: game.getMaxBarrierPoints(),
                xpMult: game.getEquipMult('xpMultiplier')
            };
            game.addLootToInventory({
                id: 'test_blade_1', item: 'Test Blade of Fury', baseName: 'Test Blade',
                rarity: 'legendary', slot: 'weapons', icon: '⚔️',
                affixes: [
                    { suffix: 'of Fury', stat: 'attackBonus', kind: 'add', value: 15, icon: '🔥' },
                    { suffix: 'of Warding', stat: 'barrierBonus', kind: 'add', value: 2, icon: '🛡️' },
                    { suffix: 'of Insight', stat: 'xpMultiplier', kind: 'mult', value: 0.3, icon: '🔮' }
                ],
                stats: { attackBonus: 15, barrierBonus: 2, xpMultiplier: 1.3 }
            });
            const inBag = (game.userProfile.inventory || []).some(i => i.id === 'test_blade_1');
            game.equipFromInventory('test_blade_1');
            const after = {
                atk: game.calculateAttackDamage(),
                barrier: game.getMaxBarrierPoints(),
                xpMult: game.getEquipMult('xpMultiplier'),
                equippedName: game.userProfile.equipped.weapons?.name,
                stillInBag: (game.userProfile.inventory || []).some(i => i.id === 'test_blade_1')
            };
            game.unequipItem('weapons');
            const afterUnequip = {
                atk: game.calculateAttackDamage(),
                backInBag: (game.userProfile.inventory || []).some(i => i.id === 'test_blade_1')
            };
            return { before, after, afterUnequip, inBag };
        });
        check('enchanted drop lands in the bag', gearEffect.inBag === true);
        check('equip raises attack (affix on a weapon)',
            gearEffect.after.atk === gearEffect.before.atk + 15, `${gearEffect.before.atk} -> ${gearEffect.after.atk}`);
        check('equip raises max barrier (affix on non-armor slot counts)',
            gearEffect.after.barrier === gearEffect.before.barrier + 2);
        check('equip applies XP multiplier affix',
            Math.abs(gearEffect.after.xpMult - 1.3) < 1e-9);
        check('equipped item leaves the bag', gearEffect.after.stillInBag === false &&
            gearEffect.after.equippedName === 'Test Blade of Fury');
        check('unequip restores baseline and returns item to bag',
            gearEffect.afterUnequip.atk === gearEffect.before.atk && gearEffect.afterUnequip.backInBag === true);
        // Inventory UI renders the new sections without crashing
        await page.evaluate(() => game.openInventory());
        await page.waitForTimeout(200);
        check('inventory renders equipped + gear sections',
            await page.evaluate(() => {
                const el = document.getElementById('inventory-items');
                return !!el && el.querySelector('.equip-loadout') !== null && el.querySelector('.inv-heading') !== null;
            }));
        await page.evaluate(() => game.closeInventory());

        console.log('7.7 Leaderboard submission pipeline');
        check('monster kill incremented lifetime counter',
            await page.evaluate(() => (game.userProfile.monstersDefeated || 0) >= 1));
        check('leaderboard submit API wired', await page.evaluate(() =>
            typeof leaderboard.queueSubmit === 'function' &&
            typeof leaderboard.submitScore === 'function'));
        check('player id minted and persisted', await page.evaluate(() => {
            const id = leaderboard.getPlayerId();
            return /^[0-9a-f-]{36}$/.test(id) &&
                localStorage.getItem('meridaeia_player_id') === id;
        }));
        // The board must render something sane whether or not Supabase is
        // configured (friendly setup notice, loading, rows, or empty state)
        await page.evaluate(() => leaderboard.showLeaderboard('xp'));
        await page.waitForTimeout(600);
        check('leaderboard modal renders without crashing',
            await page.evaluate(() => {
                const el = document.getElementById('leaderboard-list');
                return !!el && el.textContent.trim().length > 0;
            }));
        await page.evaluate(() => leaderboard.closeLeaderboard());

        console.log('8. Music radio and FX wiring');
        check('wasteland radio loaded with 4 tracks',
            await page.evaluate(() => typeof gameMusic !== 'undefined' && gameMusic.tracks.length === 4));
        check('music toggle button present', await page.$('#music-toggle') !== null);
        check('combat animations target existing orbs',
            await page.evaluate(() =>
                !!document.getElementById('hero-portrait-orb') &&
                !!document.getElementById('monster-portrait-orb')));

        console.log('8.5 Video assets present and wired');
        check('boss entrance cinematic wired', await page.evaluate(() =>
            typeof game.playCinematic === 'function'));
        const videoAssets = ['assets/video/intro.mp4', 'assets/video/hero-grom.mp4',
            'assets/video/boss-marakathalessa.mp4', 'assets/video/monster-goblin.mp4'];
        const missing = await page.evaluate(async (paths) => {
            const out = [];
            for (const p of paths) {
                try { const r = await fetch(p, { method: 'HEAD' }); if (!r.ok) out.push(p); }
                catch (_) { out.push(p); }
            }
            return out;
        }, videoAssets);
        check('all wired video files exist (200)', missing.length === 0, missing.join(', '));

        console.log('9. Page errors');
        check('no uncaught page errors', pageErrors.length === 0, pageErrors.join(' | '));
    } catch (err) {
        failures++;
        console.error('  [FAIL] test run crashed:', err.message);
    } finally {
        await browser.close();
        if (server) server.kill();
    }

    console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
    process.exit(failures === 0 ? 0 : 1);
})();
