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
        console.log('1. Boot and intro');
        await page.goto(BASE, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);
        await page.evaluate(() => game.skipIntro());
        await page.waitForTimeout(2300);
        check('category select visible', await page.isVisible('#category-select'));

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
        await page.waitForTimeout(400);
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
            game.selectBoss();
        });
        await page.waitForTimeout(400);
        await page.evaluate(() => { game.userProfile.barrierPoints = 0; });
        await page.fill('#code-answer', 'wrong answer on purpose');
        await page.click('.code-input-container button');
        await page.waitForTimeout(300);
        await page.click('#boss-next-btn');
        await page.waitForTimeout(400);
        check('boss defeats player at 0 barrier',
            (await page.textContent('.results-card h2')).includes('Barrier'));

        console.log('8. Page errors');
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
