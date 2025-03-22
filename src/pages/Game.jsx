import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Board from '../components/Board';
import ShipSetup from '../components/ShipSetup';

const BOARD_SIZE = 10;
const SHIPS = [5, 4, 3, 3, 2];
const totalShipCells = SHIPS.reduce((a, b) => a + b, 0);

const generateRandomBoardWithShips = () => {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(''));
  for (let shipLength of SHIPS) {
    let placed = false;
    while (!placed) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * (BOARD_SIZE - shipLength + 1));
      let canPlace = true;
      for (let i = 0; i < shipLength; i++) {
        if (board[row][col + i] !== '') {
          canPlace = false;
          break;
        }
      }
      if (canPlace) {
        for (let i = 0; i < shipLength; i++) {
          board[row][col + i] = 'ship';
        }
        placed = true;
      }
    }
  }
  return board;
};

const formatTime = (seconds) => {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
};

export default function Game() {
  const { mode } = useParams();
  const [playerBoard, setPlayerBoard] = useState([]);
  const [enemyBoard, setEnemyBoard] = useState([]);
  const [playerHits, setPlayerHits] = useState(0);
  const [aiHits, setAiHits] = useState(0);
  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(mode === 'easy');

  const timerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('battleship-save');
    if (mode === 'easy') {
      if (saved) {
        const data = JSON.parse(saved);
        setEnemyBoard(data.enemyBoard);
        setTimer(data.timer);
        setHasStarted(data.hasStarted);
        setWinner(data.winner);
        setIsSetupComplete(true);
      } else {
        // first-time load free play, initialize
        setEnemyBoard(generateRandomBoardWithShips());
        setIsSetupComplete(true);
      }
    }
  
    if (mode === 'normal') {
      if (!saved) {
        // Only reset if no saved game exists
        setIsSetupComplete(false);
        setPlayerBoard([]);
        setEnemyBoard([]);
        setWinner(null);
        setTimer(0);
        setHasStarted(false);
        setPlayerHits(0);
        setAiHits(0);
      }
      // if saved exists, do nothing (let useEffect [] handle it)
    }
  }, [mode]);
  

  // initialize normal mode
  useEffect(() => {
    const saved = localStorage.getItem('battleship-save');
    if (saved && mode === 'normal') {
      const data = JSON.parse(saved);
      setPlayerBoard(data.playerBoard);
      setEnemyBoard(data.enemyBoard);
      setPlayerHits(data.playerHits);
      setAiHits(data.aiHits);
      setWinner(data.winner);
      setTimer(data.timer);
      setHasStarted(data.hasStarted);
      setIsSetupComplete(true);
    } else if (mode === 'easy') {
      //setEnemyBoard(generateRandomBoardWithShips());
      setIsSetupComplete(true);
    }
  }, []);

  // save game status in Normal
  useEffect(() => {
    if (mode === 'normal' && isSetupComplete && playerBoard.length && enemyBoard.length) {
      const saveData = {
        playerBoard,
        enemyBoard,
        playerHits,
        aiHits,
        winner,
        timer,
        hasStarted
      };
      localStorage.setItem('battleship-save', JSON.stringify(saveData));
    }
  }, [playerBoard, enemyBoard, playerHits, aiHits, winner, timer, hasStarted]);

  // save game status in free play
  useEffect(() => {
    if (mode === 'easy' && enemyBoard.length > 0) {
      const saveData = {
        enemyBoard,
        timer,
        hasStarted,
        winner
      };
      localStorage.setItem('battleship-save', JSON.stringify(saveData));
    }
  }, [enemyBoard, timer, hasStarted, winner]);

  // initialize normal
  useEffect(() => {
    if (mode === 'normal' && isSetupComplete && enemyBoard.length === 0) {
      setEnemyBoard(generateRandomBoardWithShips());
    }
  }, [isSetupComplete]);

  // clear and refresh after winning
  useEffect(() => {
    if (winner) {
      localStorage.removeItem('battleship-save');
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [winner]);

  // Timer
  useEffect(() => {
    if (hasStarted && !winner) {
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [hasStarted, winner]);

  const startTimer = () => {
    if (!hasStarted) setHasStarted(true);
  };

  const handlePlayerClick = (row, col) => {
    if (winner || isAiThinking) return;
    if (['hit', 'miss'].includes(enemyBoard[row][col])) return;

    startTimer();

    const newBoard = enemyBoard.map(row => [...row]);

    if (enemyBoard[row][col] === 'ship') {
      newBoard[row][col] = 'hit';
      setPlayerHits(h => {
        const newHits = h + 1;
        if (newHits === totalShipCells) setWinner('Player');
        return newHits;
      });
    } else {
      newBoard[row][col] = 'miss';
    }

    setEnemyBoard(newBoard);

    if (mode === 'normal') {
      setIsAiThinking(true);
      setTimeout(() => {
        aiTurn();
        setIsAiThinking(false);
      }, 500);
    }
  };

  const aiTurn = () => {
    let row, col;
    do {
      row = Math.floor(Math.random() * BOARD_SIZE);
      col = Math.floor(Math.random() * BOARD_SIZE);
    } while (['hit', 'miss'].includes(playerBoard[row][col]));

    const newBoard = playerBoard.map(row => [...row]);

    if (playerBoard[row][col] === 'ship') {
      newBoard[row][col] = 'hit';
      setAiHits(h => {
        const newHits = h + 1;
        if (newHits === totalShipCells) setWinner('AI');
        return newHits;
      });
    } else {
      newBoard[row][col] = 'miss';
    }

    setPlayerBoard(newBoard);
  };

  const handleRestart = () => {
    localStorage.removeItem('battleship-save');
    window.location.reload();
  };

  return (
    <main className="game-container">
      {winner && <h2 style={{ color: 'orange' }}>Game Over! {winner} Won!</h2>}
  
      <h1>
        {mode === 'normal' ? 'Game Mode: Normal' : 'Game Mode: Free Play'}
      </h1>
  
      {mode === 'easy' ? (
        enemyBoard.length > 0 ? (
          <>
            <div className="game-info">
              <p>Time Elapsed: <span>{formatTime(timer)}</span></p>
              <button className="restart-button" onClick={handleRestart}>Restart</button>
            </div>
            <div className="game-boards">
              <Board
                boardData={enemyBoard}
                onCellClick={handlePlayerClick}
                boardType="enemy"
              />
            </div>
          </>
        ) : (
          <p>Loading enemy board...</p>
        )
      ) : !isSetupComplete ? (
        <ShipSetup onComplete={(board) => {
          setPlayerBoard(board);
          setIsSetupComplete(true);
        }} />
      ) : (
        <>
          <div className="game-info">
            <p>Time Elapsed: <span>{formatTime(timer)}</span></p>
            <button className="restart-button" onClick={handleRestart}>Restart</button>
          </div>
          <div className="game-boards">
            <Board
              boardData={playerBoard}
              onCellClick={() => {}}
              boardType="player"
            />
            <Board
              boardData={enemyBoard}
              onCellClick={handlePlayerClick}
              boardType="enemy"
            />
          </div>
        </>
      )}
    </main>
  );
  
}
