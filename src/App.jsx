import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rules from './pages/Rules';
import AllGames from './pages/AllGames';
import NewGame from './pages/NewGame'; 
import HighScores from './pages/HighScores';
import Navbar from './components/Navbar';
import GamePage from './pages/GamePage';

import { GameProvider } from './context/GameContext.jsx';
import './styles/styles.css';
import './styles/navbar.css';

export default function App() {
  return (
    <GameProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/highscores" element={<HighScores />} />
          <Route path="/allgames" element={<AllGames />} />
          <Route path="/newgame" element={<NewGame />} />
          <Route path="/game/:gameId" element={<GamePage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}