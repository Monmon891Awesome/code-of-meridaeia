import { GameCanvas } from './three/GameCanvas';
import { useGame } from './game/store';
import { useLayout } from './ui/useLayout';
import { StoryModal, Toasts, TopBar } from './ui/chrome';
import { ChapterSelect, HeroSelect, ResultsPanel, Title } from './ui/screens';
import { BattleScreen, BossScreen } from './ui/battle';
import { Modals } from './ui/modals';

export function App() {
  const screen = useGame((s) => s.screen);
  const layout = useLayout();
  const danger = useGame((s) => {
    const fight = s.boss ?? s.run;
    if (!fight || (s.screen !== 'battle' && s.screen !== 'boss')) return 0;
    return 1 - fight.barrier / fight.maxBarrier;
  });

  return (
    <div className={`app ${layout} screen-${screen}`}>
      <GameCanvas />
      <div className="danger" style={{ opacity: danger * 0.85 }} />
      <div className="ui">
        {screen !== 'title' && <TopBar />}
        {screen === 'title' && <Title />}
        {screen === 'heroes' && <HeroSelect />}
        {screen === 'chapters' && <ChapterSelect />}
        {screen === 'battle' && <BattleScreen />}
        {screen === 'boss' && <BossScreen />}
        {screen === 'results' && <ResultsPanel />}
        <Modals />
        <StoryModal />
        <Toasts />
      </div>
    </div>
  );
}
