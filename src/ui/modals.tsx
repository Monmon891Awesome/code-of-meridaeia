// Pop-up windows: Armory, Skills, Bag, Codex, Hero sheet, Settings.
import { useRef, useState, type ReactNode } from 'react';
import {
  ACHIEVEMENTS, ENV_NAMES, HEROES, LEGION_LORE, LORE, MAIN_HEROES, MONSTERS, SHOP, SKILL_TREE, STORIES, findItem,
  type EnvKey, type GearSlot, type ShopCategory, type ShopItem,
} from '../data';
import { accuracy, attackDamage, critChance, maxBarrier, skillLevel, timerDuration } from '../game/logic';
import { useGame } from '../game/store';

const ICONS: Record<string, string> = {
  rusty_sword: '🗡️', iron_axe: '🪓', steel_blade: '⚔️', enchanted_staff: '🪄', legendary_hammer: '🔨',
  leather_vest: '🦺', chainmail: '⛓️', plate_armor: '🛡️', dragon_scale: '🐉',
  gold_ring: '💍', xp_amulet: '📿', lucky_charm: '🍀', speed_boots: '👢',
  skip_scroll: '📜', barrier_potion: '🧪', time_crystal: '💎',
};

const CONSUMABLE_NOTES: Record<string, string> = {
  skip_scroll: 'Skip the current question with no penalty. Single use.',
  time_crystal: 'Add 30 seconds to the current question timer. Single use.',
};

function statLine(item: ShopItem): string {
  const s = item.stats;
  if (!s) return '';
  const parts: string[] = [];
  if (s.attackBonus) parts.push(`+${s.attackBonus} damage`);
  if (s.barrierBonus) parts.push(`+${s.barrierBonus} barrier`);
  if (s.goldMultiplier) parts.push(`+${Math.round((s.goldMultiplier - 1) * 100)}% gold`);
  if (s.xpMultiplier) parts.push(`+${Math.round((s.xpMultiplier - 1) * 100)}% XP`);
  if (s.timerBonus) parts.push(`+${s.timerBonus}s timer`);
  return parts.join(' · ');
}

function Window({ title, children, wide }: { title: string; children: ReactNode; wide?: boolean }) {
  const close = useGame((s) => s.openModal);
  return (
    <div className="overlay" onClick={() => close(null)}>
      <div className={`window ${wide ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <header>
          <h2>{title}</h2>
          <button className="chip-btn" data-testid="close-modal" onClick={() => close(null)} aria-label="Close">✕</button>
        </header>
        <div className="window-body">{children}</div>
      </div>
    </div>
  );
}

const TABS: { key: ShopCategory; label: string }[] = [
  { key: 'weapons', label: '⚔️ Weapons' }, { key: 'armor', label: '🛡️ Armor' },
  { key: 'accessories', label: '💍 Accessories' }, { key: 'consumables', label: '📜 Consumables' },
];

function Shop() {
  const [tab, setTab] = useState<ShopCategory>('weapons');
  const profile = useGame((s) => s.profile);
  const buy = useGame((s) => s.buy);
  return (
    <Window title="The Armory of Meridaeia" wide>
      <div className="tabs">
        {TABS.map((t) => <button key={t.key} className={tab === t.key ? 'on' : ''} onClick={() => setTab(t.key)}>{t.label}</button>)}
        <span className="purse">🪙 {profile.gold}</span>
      </div>
      <div className="cards">
        {SHOP[tab].map((item) => {
          const consumable = tab === 'consumables';
          const owned = !consumable && profile.owned.includes(item.id);
          const equipped = !consumable && profile.equipped[tab as GearSlot] === item.id;
          const count = profile.inventory[item.id] ?? 0;
          return (
            <div key={item.id} className={`card ${equipped ? 'equipped' : ''}`}>
              <div className="card-icon">{ICONS[item.id] ?? '✨'}</div>
              <b>{item.name}</b>
              <p>{CONSUMABLE_NOTES[item.id] ?? item.description}</p>
              <small>{statLine(item)}{consumable && count > 0 ? `In bag: ${count}` : ''}</small>
              <button className="btn primary" data-testid={`buy-${item.id}`} disabled={!owned && profile.gold < item.price} onClick={() => buy(item.id)}>
                {equipped ? 'Equipped ✓' : owned ? 'Equip' : `Buy · ${item.price} 🪙`}
              </button>
            </div>
          );
        })}
      </div>
    </Window>
  );
}

function Skills() {
  const profile = useGame((s) => s.profile);
  const upgrade = useGame((s) => s.upgradeSkill);
  return (
    <Window title="Skill Tree" wide>
      <p className="note">Skills are bought with XP: <b>✦ {profile.xp}</b> available. Spending XP never lowers your level.</p>
      {Object.entries(SKILL_TREE).map(([key, branch]) => (
        <section key={key}>
          <h3>{branch.icon} {branch.name}</h3>
          <div className="cards">
            {branch.skills.map((skill) => {
              const level = skillLevel(profile, skill.id);
              const maxed = level >= skill.maxLevel;
              return (
                <div key={skill.id} className={`card ${maxed ? 'equipped' : ''}`}>
                  <b>{skill.name}</b>
                  <p>{skill.description}</p>
                  <small>Level {level} / {skill.maxLevel}</small>
                  <button className="btn primary" data-testid={`skill-${skill.id}`} disabled={maxed || profile.xp < skill.cost} onClick={() => upgrade(skill.id)}>
                    {maxed ? 'Mastered ✓' : `Learn · ${skill.cost} ✦`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </Window>
  );
}

function Bag() {
  const profile = useGame((s) => s.profile);
  const use = useGame((s) => s.useConsumable);
  const equip = useGame((s) => s.equip);
  const consumables = SHOP.consumables.filter((i) => (profile.inventory[i.id] ?? 0) > 0);
  return (
    <Window title="Bag">
      <h3>Consumables</h3>
      {consumables.length === 0 && <p className="note">Empty. Buy scrolls, potions and crystals in the Armory.</p>}
      <div className="cards">
        {consumables.map((item) => (
          <div key={item.id} className="card">
            <div className="card-icon">{ICONS[item.id]}</div>
            <b>{item.name} × {profile.inventory[item.id]}</b>
            <p>{CONSUMABLE_NOTES[item.id] ?? item.description}</p>
            <button className="btn primary" data-testid={`use-${item.id}`} onClick={() => use(item.id)}>Use</button>
          </div>
        ))}
      </div>
      <h3>Gear</h3>
      {profile.owned.length === 0 && <p className="note">No gear yet.</p>}
      <div className="cards">
        {profile.owned.map((id) => {
          const found = findItem(id);
          if (!found) return null;
          const on = profile.equipped[found.category as GearSlot] === id;
          return (
            <div key={id} className={`card ${on ? 'equipped' : ''}`}>
              <div className="card-icon">{ICONS[id]}</div>
              <b>{found.item.name}</b>
              <small>{statLine(found.item)}</small>
              <button className="btn" onClick={() => equip(id)}>{on ? 'Unequip' : 'Equip'}</button>
            </div>
          );
        })}
      </div>
    </Window>
  );
}

function Codex() {
  const profile = useGame((s) => s.profile);
  const [tab, setTab] = useState<'lore' | 'bestiary' | 'heroes' | 'legion'>('lore');
  const envs: EnvKey[] = ['wasteland', 'forest', 'mountains', 'lakes', 'gates'];
  return (
    <Window title="Codex" wide>
      <div className="tabs">
        <button className={tab === 'lore' ? 'on' : ''} onClick={() => setTab('lore')}>📜 Lore {profile.lore.length}/{LORE.length}</button>
        <button className={tab === 'bestiary' ? 'on' : ''} onClick={() => setTab('bestiary')}>👹 Bestiary</button>
        <button className={tab === 'heroes' ? 'on' : ''} onClick={() => setTab('heroes')}>🧙 Heroes</button>
        <button className={tab === 'legion' ? 'on' : ''} onClick={() => setTab('legion')}>🕳️ Legion of 404</button>
      </div>
      {tab === 'lore' && envs.map((env) => (
        <section key={env}>
          <h3>{ENV_NAMES[env]}</h3>
          <ul className="lore">
            {LORE.filter((l) => l.environment === env).map((l) => (
              <li key={l.id} className={profile.lore.includes(l.id) ? '' : 'locked'}>
                {profile.lore.includes(l.id) ? l.text : '🔒 Slay monsters to uncover this fragment.'}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {tab === 'bestiary' && (
        <div className="entries">
          {Object.values(MONSTERS).map((m) => (
            <article key={m.key}><img src={m.portrait} alt="" loading="lazy" /><div><b>{m.name}</b><small>{m.tier} tier</small><p>{m.lore}</p></div></article>
          ))}
        </div>
      )}
      {tab === 'heroes' && (
        <div className="entries">
          {MAIN_HEROES.map((h) => (
            <article key={h}><img src={HEROES[h].portrait} alt="" loading="lazy" /><div><b>{STORIES[h].heroName}</b><small>{STORIES[h].title} · {STORIES[h].race}</small><p>{STORIES[h].fullBackstory}</p></div></article>
          ))}
        </div>
      )}
      {tab === 'legion' && (
        profile.bossDefeated === 'true'
          ? <ul className="lore">{LEGION_LORE.map((l) => <li key={l.id}><b>{l.title}.</b> {l.text}</li>)}</ul>
          : <p className="note">🔒 Sealed. Complete every hero's story and defeat Marakathalessa to learn the truth.</p>
      )}
    </Window>
  );
}

function Sheet() {
  const profile = useGame((s) => s.profile);
  const gear = (slot: GearSlot) => {
    const id = profile.equipped[slot];
    return id ? findItem(id)?.item.name ?? '—' : '—';
  };
  return (
    <Window title="Hero Sheet">
      <div className="result-stats">
        <div><b>{profile.level}</b><span>Level</span></div>
        <div><b>{attackDamage(profile)}</b><span>Damage</span></div>
        <div><b>{maxBarrier(profile)}</b><span>Barrier</span></div>
        <div><b>{timerDuration(profile)}s</b><span>Timer</span></div>
        <div><b>{Math.round(critChance(profile) * 100)}%</b><span>Crit</span></div>
        <div><b>{profile.stats.monstersSlain}</b><span>Slain</span></div>
      </div>
      <h3>Equipped</h3>
      <p className="note">⚔️ {gear('weapons')} · 🛡️ {gear('armor')} · 💍 {gear('accessories')}</p>
      <h3>Accuracy by hero</h3>
      <ul className="bars">
        {MAIN_HEROES.map((h) => {
          const s = profile.stats.byHero[h] ?? { answered: 0, correct: 0 };
          const pct = accuracy(s.correct, s.answered);
          return (
            <li key={h}>
              <span>{HEROES[h].tag}</span>
              <i><em style={{ width: `${pct}%`, background: HEROES[h].accent }} /></i>
              <b>{s.answered ? `${pct}%` : '—'}</b>
            </li>
          );
        })}
      </ul>
      <h3>Achievements</h3>
      <ul className="achievements">
        {ACHIEVEMENTS.map((a) => (
          <li key={a.id} className={profile.achievements.includes(a.id) ? 'on' : ''}>
            <span>{a.icon}</span><div><b>{a.name}</b><small>{a.description}</small></div>
          </li>
        ))}
      </ul>
    </Window>
  );
}

function SettingsWindow() {
  const settings = useGame((s) => s.settings);
  const set = useGame((s) => s.setSettings);
  const exportSave = useGame((s) => s.exportSave);
  const importSave = useGame((s) => s.importSave);
  const reset = useGame((s) => s.resetProgress);
  const toast = useGame((s) => s.toast);
  const file = useRef<HTMLInputElement>(null);
  const [confirming, setConfirming] = useState(false);

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportSave()], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'code-of-meridaeia-save.json';
    link.click();
    URL.revokeObjectURL(url);
  };
  const upload = async (f?: File) => {
    if (!f) return;
    toast(importSave(await f.text()) ? '✅ Save imported.' : '❌ That file is not a valid save.');
  };

  return (
    <Window title="Settings">
      <label className="toggle"><input type="checkbox" checked={settings.music} onChange={(e) => set({ music: e.target.checked })} /> Music</label>
      <label className="toggle"><input type="checkbox" checked={settings.sfx} onChange={(e) => set({ sfx: e.target.checked })} /> Sound effects</label>
      <label className="toggle">Music volume
        <input type="range" min={0} max={1} step={0.05} value={settings.volume} onChange={(e) => set({ volume: Number(e.target.value) })} />
      </label>
      <label className="toggle">
        <input type="checkbox" checked={settings.quality === 'high'} onChange={(e) => set({ quality: e.target.checked ? 'high' : 'low' })} />
        High quality graphics (glow and shadows — turn off on slow devices)
      </label>
      <h3>Save data</h3>
      <p className="note">Progress saves automatically in this browser. Export a file to move it to another device.</p>
      <div className="row">
        <button className="btn" onClick={download}>⬇️ Export save</button>
        <button className="btn" onClick={() => file.current?.click()}>⬆️ Import save</button>
        <input ref={file} type="file" accept="application/json" hidden onChange={(e) => upload(e.target.files?.[0])} />
        {confirming
          ? <button className="btn danger" onClick={() => { reset(); setConfirming(false); }}>Really erase everything?</button>
          : <button className="btn ghost" onClick={() => setConfirming(true)}>Reset progress</button>}
      </div>
    </Window>
  );
}

export function Modals() {
  const modal = useGame((s) => s.modal);
  switch (modal) {
    case 'shop': return <Shop />;
    case 'skills': return <Skills />;
    case 'inventory': return <Bag />;
    case 'codex': return <Codex />;
    case 'sheet': return <Sheet />;
    case 'settings': return <SettingsWindow />;
    default: return null;
  }
}
