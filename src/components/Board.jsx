import React from 'react';
import Cell from './Cell';
import '../styles/game.css';

export default function Board({ boardData, onCellClick, boardType }) {
  return (
    <div className="board">
      <h3>{boardType === 'player' ? 'Player Board' : 'Enemy Board'}</h3>
      <div className="grid">
        {boardData.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              onClick={() => onCellClick(rowIndex, colIndex)}
              boardType={boardType}
            />
          ))
        )}
      </div>
    </div>
  );
}