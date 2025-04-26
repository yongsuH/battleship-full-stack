const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    player1: { type: String, required: true },
    player2: { type: String, default: null },
    status: { type: String, enum: ['Open', 'Active', 'Completed'], default: 'Open' },
    winner: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
  
    player1Board: { type: [[Number]], default: [] }, // player1 board
    player2Board: { type: [[Number]], default: [] }, // player2 board
    player1Hits: { type: [[Number]], default: [] },  // player1 hit
    player2Hits: { type: [[Number]], default: [] },   // player2 hit
    currentTurn: { type: String, default: null } 

  });
  

// 防止重复注册模型
const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

module.exports = Game;
