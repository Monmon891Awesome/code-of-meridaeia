// Always-present interface pieces: the top bar, toasts, and story cards.
import { useEffect } from 'react';
import { useGame } from '../game/store';

export function TopBar() {
  const screen = useGame((s) => s.screen);
  const profile = useGame((s) => s.profile);
  const openModal = useGame((s) => s.openModal);
  const goto = useGame((s) => s.goto);
  const retreat = useGame((s) => s.retreat);
  const inFight = screen === 'battle' || screen === 'boss';
  const xpGoal = profile.level * 100;

  return (
    <header className="topbar">
      <div className="topbar-left">
        {inFight ? (
          <button className="chip-btn" onClick={retreat} title="Leave this battle">⟵ <span className="lbl">Retreat</span></button>
        ) : (
          <button className="chip-btn" onClick={() => goto(screen === 'chapters' ? 'heroes' : 'title')} title="Back">⟵ <span className="lbl">Back</span></button>
        )}
        <div className="stat" title="Level"><b>Lv {profile.level}</b></div>
        <div className="stat xp" title={`${profile.xp} / ${xpGoal} XP to next level`}>
          <span>✦ {profile.xp}</span>
          <i><em style={{ width: `${Math.min(100, (profile.xp / xpGoal) * 100)}%` }} /></i>
        </div>
        <div className="stat gold" data-testid="gold">🪙 {profile.gold}</div>
      </div>
      <nav className="topbar-right">
        {!inFight && <button className="chip-btn" onClick={() => openModal('shop')}>🏪 <span className="lbl">Armory</span></button>}
        {!inFight && <button className="chip-btn" onClick={() => openModal('skills')}>🌟 <span className="lbl">Skills</span></button>}
        <button className="chip-btn" data-testid="open-bag" onClick={() => openModal('inventory')}>🎒 <span className="lbl">Bag</span></button>
        {!inFight && <button className="chip-btn" onClick={() => openModal('codex')}>📖 <span className="lbl">Codex</span></button>}
        {!inFight && <button className="chip-btn" onClick={() => openModal('sheet')}>🛡️ <span className="lbl">Hero</span></button>}
        <button className="chip-btn" onClick={() => openModal('settings')} title="Settings">⚙️</button>
      </nav>
    </header>
  );
}

export function Toasts() {
  const toasts = useGame((s) => s.toasts);
  const dismiss = useGame((s) => s.dismissToast);
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} className="toast" onClick={() => dismiss(t.id)}>{t.text}</button>
      ))}
    </div>
  );
}

export function StoryModal() {
  const story = useGame((s) => s.story);
  const close = useGame((s) => s.closeStory);
  useEffect(() => {
    if (!story) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); close(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [story, close]);
  if (!story) return null;
  return (
    <div className="overlay story-overlay">
      <div className="story" style={{ ['--accent' as string]: story.accent }}>
        {story.portrait && <img className="story-portrait" src={story.portrait} alt={story.name} />}
        <div className="story-body">
          <span className="badge">{story.badge}</span>
          <h2>{story.name}</h2>
          <h3>{story.title}</h3>
          <p>{story.text}</p>
          <button className="btn primary" data-testid="story-continue" onClick={close} autoFocus>
            {story.then === 'beginChapter' ? 'Enter Battle ⚔️' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
