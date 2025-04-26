const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const User = require('../models/user');

// PATCH /api/games/:gameId/attack
router.patch('/:gameId/attack', async (req, res) => {
  try {
    const { x, y } = req.body;
    const username = req.cookies.user;
    const game = await Game.findById(req.params.gameId);

    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (!username) return res.status(401).json({ message: 'Not authenticated' });
    if (game.status !== 'Active') return res.status(400).json({ message: 'Game not active' });

    const isPlayer1 = username === game.player1;
    const isMyTurn = (isPlayer1 && game.currentTurn === 'player1') || (!isPlayer1 && game.currentTurn === 'player2');

    if (!isMyTurn) {
      return res.status(403).json({ message: 'Not your turn' });
    }

    const opponentBoard = isPlayer1 ? game.player2Board : game.player1Board;
    const myHits = isPlayer1 ? game.player1Hits : game.player2Hits;

    const alreadyHit = myHits.some(hit => hit[0] === y && hit[1] === x);
    if (alreadyHit) {
      return res.status(400).json({ message: 'Already attacked this cell' });
    }

    myHits.push([y, x]);

    const allShips = opponentBoard.flatMap((row, yIndex) =>
      row.map((cell, xIndex) => (cell === 1 ? [yIndex, xIndex] : null))
    ).filter(pos => pos !== null);

    const allHits = isPlayer1 ? game.player1Hits : game.player2Hits;

    const isWin = allShips.every(shipPos => allHits.some(hit => hit[0] === shipPos[0] && hit[1] === shipPos[1]));

    if (isWin) {
      game.status = 'Completed';
      game.winner = username;
      game.endedAt = new Date();
      // update win lose
      const winner = username;
      const loser = isPlayer1 ? game.player2 : game.player1;

      await User.findOneAndUpdate({ username: winner }, { $inc: { wins: 1 } });
      await User.findOneAndUpdate({ username: loser }, { $inc: { losses: 1 } });

    } else {
      game.currentTurn = isPlayer1 ? 'player2' : 'player1';
    }

    await game.save();
    res.json(game);
  } catch (error) {
    console.error('Attack error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
