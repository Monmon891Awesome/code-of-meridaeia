// Writes all game content as plain JSON into handoff/data/, so another
// engine (Godot) can load the same questions, items, lore and numbers.
// Run: node tools/export-godot-data.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import * as data from '../src/data/index.ts';

const out = new URL('../handoff/data/', import.meta.url);
mkdirSync(out, { recursive: true });
const write = (name, value) => {
  writeFileSync(new URL(name, out), JSON.stringify(value, null, 2) + '\n');
  console.log('wrote', name);
};

write('questions.json', data.QUESTIONS);
write('boss_questions.json', data.BOSS_QUESTIONS);
write('heroes.json', { heroes: data.HEROES, mainHeroes: data.MAIN_HEROES });
write('monsters.json', { monsters: data.MONSTERS, byTier: data.MONSTERS_BY_TIER });
write('shop.json', data.SHOP);
write('skills.json', data.SKILL_TREE);
write('lore.json', { fragments: data.LORE, legion: data.LEGION_LORE });
write('stories.json', { heroes: data.STORIES, links: data.STORY_LINKS, intro: data.INTRO_TEXT });
write('balance.json', {
  balance: data.BALANCE,
  lootTable: data.LOOT_TABLE,
  virtues: data.VIRTUES,
  achievements: data.ACHIEVEMENTS,
  chapterNames: data.CHAPTER_NAMES,
  environmentNames: data.ENV_NAMES,
});
