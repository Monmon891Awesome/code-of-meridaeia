// Title, hero select, chapter select and results screens.
import { useEffect } from 'react';
import { CHAPTER_NAMES, ENV_NAMES, HEROES, MAIN_HEROES, QUESTIONS, BOSS_QUESTIONS, type HeroKey } from '../data';
import { envForProgress, heroComplete, isBossUnlocked, isChapterUnlocked } from '../game/logic';
import { useGame } from '../game/store';

export function Title() {
  const begin = useGame((s) => s.begin);
  const hasSave = useGame((s) => s.profile.seenIntro);
  const openModal = useGame((s) => s.openModal);
  return (
    <div className="title">
      <div className="title-top">
        <p className="kicker">A single-player coding RPG</p>
        <h1>Code of <span>Meridaeia</span></h1>
        <p className="tagline">The Great Compiler has fallen. Answer with knowledge. Strike with code.</p>
      </div>
      <div className="title-bottom">
        <button className="btn primary big" data-testid="begin" onClick={begin}>
          {hasSave ? 'Continue the Siege' : 'Begin the Siege'}
        </button>
        <button className="btn ghost" onClick={() => openModal('settings')}>Settings</button>
      </div>
    </div>
  );
}

type Entry = HeroKey | 'boss';
const ENTRIES: Entry[] = [...MAIN_HEROES, 'boss', 'marakathalessa'];

export function HeroSelect() {
  const browse = useGame((s) => s.browse);
  const setBrowse = useGame((s) => s.setBrowse);
  const selectHero = useGame((s) => s.selectHero);
  const startBoss = useGame((s) => s.startBoss);
  const profile = useGame((s) => s.profile);
  const blocked = useGame((s) => !!s.story || !!s.modal);

  const index = ENTRIES.indexOf(browse);
  const step = (d: number) => setBrowse(ENTRIES[(index + d + ENTRIES.length) % ENTRIES.length]);
  const bossOpen = isBossUnlocked(profile);
  const isBoss = browse === 'boss';
  const locked = isBoss ? !bossOpen : browse === 'marakathalessa' && !profile.maraUnlocked;
  const choose = () => (isBoss ? startBoss() : selectHero(browse));

  useEffect(() => {
    if (blocked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Enter') choose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const info = isBoss
    ? {
      name: 'Marakathalessa', cls: 'The Witch of Corrupted Code', tag: '⚔️ Boss Fight', accent: '#d264ff',
      desc: 'The ancient sorceress who corrupted the realm. Type your answers — no multiple choice. Face her if you dare.',
      count: `${BOSS_QUESTIONS.length} Trials`,
      lock: 'A great evil stirs... Complete all 3 chapters of any hero to face her.',
    }
    : {
      ...HEROES[browse], count: `${QUESTIONS[browse].length} Questions`,
      lock: 'A soul awaits redemption... Defeat the boss and complete every hero to hear her story.',
    };
  const chapters = isBoss ? null : profile.chapterProgress[browse] ?? [false, false, false];

  return (
    <div className="panel hero-panel" style={{ ['--accent' as string]: info.accent }}>
      <p className="kicker">Choose your champion · {ENV_NAMES[envForProgress(profile.storyProgress)]}</p>
      <div className="carousel-head">
        <button className="arrow" aria-label="Previous" onClick={() => step(-1)}>‹</button>
        <div className="carousel-name">
          <span className="badge">{info.tag}</span>
          <h2 data-testid="hero-name">{info.name}</h2>
          <h3>{info.cls}</h3>
        </div>
        <button className="arrow" aria-label="Next" data-testid="hero-next" onClick={() => step(1)}>›</button>
      </div>
      <p className="desc">{locked ? `🔒 ${info.lock}` : info.desc}</p>
      <div className="meta-row">
        <span>{info.count}</span>
        {chapters && (
          <span className="pips" title="Chapters completed">
            {chapters.map((done, i) => <i key={i} className={done ? 'on' : ''}>{done ? '★' : '☆'}</i>)}
          </span>
        )}
        {isBoss && profile.bossDefeated && <span>{profile.bossDefeated === 'true' ? '👑 Vanquished' : '⚔️ Escaped once'}</span>}
      </div>
      <button className="btn primary big" data-testid="hero-choose" disabled={locked} onClick={choose}>
        {locked ? 'Locked' : isBoss ? 'Challenge the Witch' : `Play as ${'short' in info ? info.short : info.name}`}
      </button>
      <div className="thumbs">
        {ENTRIES.map((e) => {
          const lock = e === 'boss' ? !bossOpen : e === 'marakathalessa' && !profile.maraUnlocked;
          const src = e === 'boss' ? HEROES.marakathalessa.portrait : HEROES[e].portrait;
          const done = e !== 'boss' && heroComplete(profile, e);
          return (
            <button key={e} className={`thumb ${e === browse ? 'active' : ''} ${lock ? 'locked' : ''}`} onClick={() => setBrowse(e)}
              aria-label={e === 'boss' ? 'Boss fight' : HEROES[e].name}>
              <img src={src} alt="" loading="lazy" />
              {lock && <span>🔒</span>}
              {done && <span className="done">★</span>}
              {e === 'boss' && !lock && <span className="done">⚔️</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ChapterSelect() {
  const hero = useGame((s) => s.hero);
  const profile = useGame((s) => s.profile);
  const choose = useGame((s) => s.chooseChapter);
  if (!hero) return null;
  const def = HEROES[hero];
  return (
    <div className="panel hero-panel" style={{ ['--accent' as string]: def.accent }}>
      <p className="kicker">{def.cls} · {def.tag}</p>
      <h2>{def.name}</h2>
      <p className="desc">Each chapter is a battle. Clear it with at least 50% accuracy — and your barrier intact — to unlock the next.</p>
      <div className="chapters">
        {[1, 2, 3].map((n) => {
          const open = isChapterUnlocked(profile, hero, n);
          const done = !!profile.chapterProgress[hero]?.[n - 1];
          const count = QUESTIONS[hero].filter((q) => q.chapter === n).length;
          return (
            <button key={n} className={`chapter ${done ? 'done' : ''}`} disabled={!open} data-testid={`chapter-${n}`} onClick={() => choose(n)}>
              <b>{open ? (done ? '★' : n) : '🔒'}</b>
              <span>
                <strong>Chapter {n}: {CHAPTER_NAMES[n - 1]}</strong>
                <small>{count} questions · {done ? 'Completed — replay any time' : open ? 'Ready' : 'Complete the previous chapter'}</small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ResultsPanel() {
  const results = useGame((s) => s.results);
  const run = useGame((s) => s.run);
  const goto = useGame((s) => s.goto);
  const selectHero = useGame((s) => s.selectHero);
  const startBoss = useGame((s) => s.startBoss);
  const openModal = useGame((s) => s.openModal);
  if (!results) return null;
  const again = () => {
    if (results.kind === 'chapter' && run) { goto('heroes'); selectHero(run.hero); } else if (results.kind === 'bossLost') startBoss();
    else goto('heroes');
  };
  return (
    <div className="panel results" data-testid="results">
      <div className="results-icon">{results.icon}</div>
      <h2 data-testid="results-title">{results.title}</h2>
      <p className="desc">{results.message}</p>
      <div className="result-stats">
        {results.stats.map((s) => (
          <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>
        ))}
      </div>
      <div className="row">
        <button className="btn primary" data-testid="results-continue" onClick={again}>
          {results.kind === 'chapter' ? (results.cleared ? 'Next Chapter' : 'Try Again') : results.kind === 'bossLost' ? 'Challenge Again' : 'Continue'}
        </button>
        <button className="btn" onClick={() => openModal('shop')}>🏪 Armory</button>
        <button className="btn ghost" onClick={() => goto('heroes')}>Heroes</button>
      </div>
    </div>
  );
}
