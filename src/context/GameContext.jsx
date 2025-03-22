import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [playerBoard, setPlayerBoard] = useState([]); // 10x10
  const [enemyBoard, setEnemyBoard] = useState([]);   // 10x10
  const [turn, setTurn] = useState('player');
  const [winner, setWinner] = useState(null);

  return (
    <GameContext.Provider value={{
      playerBoard,
      setPlayerBoard,
      enemyBoard,
      setEnemyBoard,
      turn,
      setTurn,
      winner,
      setWinner
    }}>
      {children}
    </GameContext.Provider>
  );
}