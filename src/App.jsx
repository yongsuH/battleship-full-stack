import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Rules from './pages/Rules';
import HighScores from './pages/HighScores';
import Navbar from './components/Navbar';
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
          <Route path="/game/:mode" element={<Game />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/highscores" element={<HighScores />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}