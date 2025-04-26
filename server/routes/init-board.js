const express = require('express');
const router = express.Router();
const Game = require('../models/game');

// 随机放置船只
function generateBoard() {
  const boardSize = 10;
  const ships = [5, 4, 3, 3, 2]; // 船的长度
  const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));

  for (const shipLength of ships) {
    let placed = false;
    while (!placed) {
      const isHorizontal = Math.random() < 0.5;
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);

      if (canPlaceShip(board, x, y, shipLength, isHorizontal)) {
        for (let i = 0; i < shipLength; i++) {
          if (isHorizontal) {
            board[y][x + i] = 1;
          } else {
            board[y + i][x] = 1;
          }
        }
        placed = true;
      }
    }
  }
  return board;
}

function canPlaceShip(board, x, y, length, horizontal) {
  if (horizontal) {
    if (x + length > 10) return false;
    for (let i = 0; i < length; i++) {
      if (board[y][x + i] !== 0) return false;
    }
  } else {
    if (y + length > 10) return false;
    for (let i = 0; i < length; i++) {
      if (board[y + i][x] !== 0) return false;
    }
  }
  return true;
}

// API: 初始化棋盘
router.patch('/:gameId/init-board', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (!game.player1 || !game.player2) {
      return res.status(400).json({ message: 'Need two players to initialize boards.' });
    }

    if (Array.isArray(game.player1Board) && game.player1Board.length > 0) {
      return res.status(400).json({ message: 'Boards already initialized.' });
    }

    game.player1Board = generateBoard();
    game.player2Board = generateBoard();
    game.player1Hits = [];
    game.player2Hits = [];
    game.currentTurn = 'player1';
    await game.save();

    res.json({ message: 'Boards initialized successfully.', game });
  } catch (error) {
    console.error('Error initializing boards:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
