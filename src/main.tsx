import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { useGame } from './game/store';
import { audio } from './game/audio';
import './styles.css';

audio.configure(useGame.getState().settings);
// Handy for the automated smoke test and for curious players.
(window as unknown as { __game: typeof useGame }).__game = useGame;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
