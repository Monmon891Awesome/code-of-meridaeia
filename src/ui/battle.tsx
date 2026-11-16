// The fight interface: status plates over the 3D scene, the question panel,
// and the typed-answer boss panel.
import { useEffect, useRef, useState } from 'react';
import { BALANCE, HEROES, MONSTERS, ENV_NAMES } from '../data';
import { useGame } from '../game/store';

function Pips({ value, max }: { value: number; max: number }) {
  return (
    <div className="barrier" data-testid="barrier" data-value={value} title={`Barrier ${value} / ${max}`}>
      {Array.from({ length: max }, (_, i) => <i key={i} className={i < value ? 'on' : ''} />)}
    </div>
  );
}

/** Makes "Continue" wait until the blow has landed on screen. */
function useReady(key: unknown, delay: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [key, delay]);
  return ready;
}

function Code({ code }: { code: string | null }) {
  if (!code) return null;
  return <pre className="code"><code>{code}</code></pre>;
}

export function BattleScreen() {
  const run = useGame((s) => s.run);
  const answer = useGame((s) => s.answer);
  const tick = useGame((s) => s.tick);
  const useHint = useGame((s) => s.useHint);
  const next = useGame((s) => s.nextQuestion);
  const gold = useGame((s) => s.profile.gold);
  const blocked = useGame((s) => !!s.story || !!s.modal);
  const feedback = run?.phase === 'feedback';
  const ready = useReady(`${run?.index}-${run?.phase}`, feedback ? (run?.loot ? 1700 : 1150) : 0);

  useEffect(() => {
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [tick]);

  useEffect(() => {
    if (blocked) return;
    const onKey = (e: KeyboardEvent) => {
      const state = useGame.getState().run;
      if (!state) return;
      const key = e.key.toLowerCase();
      if (state.phase === 'question') {
        const slot = ['1', '2', '3', '4'].indexOf(key) >= 0 ? Number(key) - 1 : ['a', 'b', 'c', 'd'].indexOf(key);
        if (slot >= 0 && slot < state.order.length) answer(slot);
        else if (key === 'h') useHint();
      } else if ((key === 'enter' || key === ' ') && ready) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answer, useHint, next, blocked, ready]);

  if (!run) return null;
  const q = run.questions[run.index];
  const hero = HEROES[run.hero];
  const monster = MONSTERS[run.monster];
  const low = run.timeLeft <= 10 && !feedback;
  const correctDisplay = run.order.indexOf(q.correctAnswer);

  return (
    <>
      <div className="hud">
        <div className="plate hero-plate" style={{ ['--accent' as string]: hero.accent }}>
          <img src={hero.portrait} alt="" />
          <div>
            <b>{hero.short}</b>
            <Pips value={run.barrier} max={run.maxBarrier} />
          </div>
        </div>
        <div className={`clock ${low ? 'low' : ''}`}>
          <b data-testid="timer">{run.timeLeft}</b>
          <span>Q{run.index + 1}/{run.questions.length}</span>
          {run.streak >= 2 && <em>🔥 {run.streak} streak</em>}
        </div>
        <div className="plate enemy-plate" style={{ ['--accent' as string]: monster.accent }}>
          <div>
            <b data-testid="monster-name">{monster.name}</b>
            <div className="hp" data-testid="monster-hp" data-value={run.monsterHP}>
              <i style={{ width: `${(run.monsterHP / BALANCE.monsterHP) * 100}%` }} />
              <span>{run.monsterHP} / {BALANCE.monsterHP}</span>
            </div>
          </div>
          <img src={monster.portrait} alt="" />
        </div>
      </div>

      <div className="panel question-panel">
        <div className="q-head">
          <span className={`badge diff-${q.difficulty}`}>{q.difficulty}</span>
          <span className="where">{ENV_NAMES[run.env]} · Chapter {run.chapter}</span>
        </div>
        <p className="q-text" data-testid="question">{q.question}</p>
        <Code code={q.code} />

        <div className="answers">
          {run.order.map((orig, display) => {
            const gone = run.eliminated.includes(display);
            let cls = '';
            if (feedback) {
              if (display === correctDisplay) cls = 'correct';
              else if (display === run.picked) cls = 'wrong';
              else cls = 'faded';
            } else if (gone) cls = 'gone';
            return (
              <button key={display} className={`answer ${cls}`} disabled={feedback || gone}
                data-testid={`answer-${display}`}
                onClick={() => answer(display)}>
                <kbd>{'ABCD'[display]}</kbd>
                <span>{q.options[orig]}</span>
              </button>
            );
          })}
        </div>

        {!feedback && (
          <div className="row">
            <button className="btn" data-testid="hint" onClick={useHint} disabled={gold < BALANCE.hintCost}>
              💡 Hint <small>−{BALANCE.hintCost} 🪙</small>
            </button>
            <span className="keys">Keys: 1–4 answer · H hint</span>
          </div>
        )}

        {feedback && (
          <div className={`feedback ${run.wasCorrect ? 'good' : 'bad'}`} data-testid="feedback">
            <h4>
              {run.wasCorrect
                ? `${run.lastCrit ? 'Critical strike! ' : 'Correct! '}${run.lastDamage} damage · +${run.lastXP} XP`
                : run.picked === -1 ? "Time's up!" : run.graceSaved ? 'Wrong — but your Second Chance held!' : 'Wrong! The monster strikes your barrier.'}
            </h4>
            <p>{q.explanation}</p>
            <p className="virtue">“{run.virtue}”</p>
            {run.loot && (
              <div className={`loot rarity-${run.loot.rarity}`} data-testid="loot">
                <b>🗡️ {monster.name} slain!</b>
                <span>{run.loot.label} drop: <strong>{run.loot.item}</strong> · +{run.loot.gold} 🪙</span>
                {run.loot.lore && <small>📜 {run.loot.lore.unlocks} — “{run.loot.lore.text}”</small>}
              </div>
            )}
            <button className="btn primary" data-testid="next" disabled={!ready} onClick={next}>
              {run.defeated ? 'Fall back...' : run.index + 1 >= run.questions.length ? 'Finish Chapter' : 'Next Question ⟶'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export function BossScreen() {
  const boss = useGame((s) => s.boss);
  const submit = useGame((s) => s.bossSubmit);
  const hint = useGame((s) => s.bossHint);
  const next = useGame((s) => s.bossNext);
  const gold = useGame((s) => s.profile.gold);
  const [text, setText] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const feedback = boss?.phase === 'feedback';
  const ready = useReady(`${boss?.index}-${boss?.phase}`, feedback ? 1400 : 0);

  useEffect(() => {
    if (!feedback) { setText(''); input.current?.focus(); }
  }, [boss?.index, feedback]);

  if (!boss) return null;
  const q = boss.questions[boss.index];
  const hero = HEROES[boss.hero];
  const hintsLeft = q.hints.length - boss.hints.length;

  return (
    <>
      <div className="hud">
        <div className="plate hero-plate" style={{ ['--accent' as string]: hero.accent }}>
          <img src={hero.portrait} alt="" />
          <div>
            <b>{hero.short}</b>
            <Pips value={boss.barrier} max={boss.maxBarrier} />
          </div>
        </div>
        <div className="clock boss-clock">
          <b>{boss.index + 1}</b>
          <span>of {boss.questions.length} trials</span>
        </div>
        <div className="plate enemy-plate" style={{ ['--accent' as string]: '#d264ff' }}>
          <div>
            <b>Marakathalessa</b>
            <div className="hp boss-hp" data-testid="boss-hp" data-value={boss.hp}>
              <i style={{ width: `${(boss.hp / BALANCE.bossHP) * 100}%` }} />
              <span>{boss.hp} / {BALANCE.bossHP}</span>
            </div>
          </div>
          <img src={HEROES.marakathalessa.portrait} alt="" />
        </div>
      </div>

      <div className="panel question-panel boss-panel">
        <div className="q-head">
          <span className="badge diff-hard">Trial {boss.index + 1}</span>
          <span className="where">{ENV_NAMES.throne} · type your answer</span>
        </div>
        <p className="q-text" data-testid="boss-question">{q.question}</p>
        <Code code={q.code} />

        <form className="boss-form" onSubmit={(e) => { e.preventDefault(); if (feedback) { if (ready) next(); } else submit(text); }}>
          <input ref={input} data-testid="boss-input" value={text} onChange={(e) => setText(e.target.value)} disabled={feedback}
            placeholder="Type the answer..." autoComplete="off" autoCapitalize="off" spellCheck={false} />
          {!feedback && <button className="btn primary" data-testid="boss-submit" type="submit">Strike ⚔️</button>}
        </form>

        {!feedback && (
          <div className="row">
            <button className="btn" type="button" data-testid="boss-hint" onClick={hint} disabled={hintsLeft <= 0 || gold < BALANCE.hintCost}>
              💡 Hint <small>−{BALANCE.hintCost} 🪙 · {hintsLeft} left</small>
            </button>
            <span className="keys">Fewer hints = harder hits (up to 190)</span>
          </div>
        )}
        {boss.hints.length > 0 && (
          <ul className="hints">{boss.hints.map((h, i) => <li key={i}>💡 {h}</li>)}</ul>
        )}

        {feedback && (
          <div className={`feedback ${boss.wasCorrect ? 'good' : 'bad'}`} data-testid="feedback">
            <h4>
              {boss.wasCorrect
                ? `${boss.hp <= 0 ? 'FINAL BLOW! ' : 'Critical hit! '}${boss.lastDamage} damage`
                : boss.barrier > 0 ? `Miss! She counterattacks — ${boss.barrier} barrier left.` : 'Miss! Your barrier is destroyed!'}
            </h4>
            {!boss.wasCorrect && <p>Answer: <code>{q.correctAnswer}</code></p>}
            <p>{q.explanation}</p>
            <button className="btn primary" data-testid="next" disabled={!ready} onClick={next}>
              {boss.hp <= 0 ? 'Claim Victory 👑' : boss.barrier <= 0 ? 'Fall back...' : 'Next Trial ⟶'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
