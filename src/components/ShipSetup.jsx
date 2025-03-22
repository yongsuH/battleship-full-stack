import React, { useState } from 'react';
import Board from './Board';

const SHIPS = [5, 4, 3, 3, 2];

export default function ShipSetup({ onComplete }) {
  const BOARD_SIZE = 10;
  const [board, setBoard] = useState(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill('')));
  const [draggingShipLength, setDraggingShipLength] = useState(null);
  const [placedShips, setPlacedShips] = useState([]);

  const handleDragStart = (e, length, index) => {
    e.dataTransfer.setData('ship-length', length);
    e.dataTransfer.setData('ship-index', index);
    setDraggingShipLength(length);
  };

  const handleDrop = (row, col) => {
    const length = parseInt(draggingShipLength);
    const index = parseInt(localStorage.getItem('ship-index'));

    if (placedShips.includes(index)) return;

    if (col + length > BOARD_SIZE) return;

    for (let i = 0; i < length; i++) {
      if (board[row][col + i] !== '') return;
    }

    const newBoard = board.map(r => [...r]);
    for (let i = 0; i < length; i++) {
      newBoard[row][col + i] = 'ship';
    }

    setBoard(newBoard);
    setPlacedShips([...placedShips, index]);
    setDraggingShipLength(null);
  };

  const allowDrop = (e) => {
    e.preventDefault(); // 必须调用以启用 onDrop
  };

  const allShipsPlaced = placedShips.length === SHIPS.length;

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      <div>
        <h2>Drag Your Ships</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {SHIPS.map((length, index) => (
            <div
              key={index}
              draggable={!placedShips.includes(index)}
              onDragStart={(e) => {
                handleDragStart(e, length, index);
                localStorage.setItem('ship-index', index); // 兼容性方式传递 index
              }}
              style={{
                backgroundColor: placedShips.includes(index) ? 'gray' : 'lightblue',
                padding: '10px',
                minWidth: `${length * 20}px`,
                textAlign: 'center',
                cursor: placedShips.includes(index) ? 'not-allowed' : 'grab',
                opacity: placedShips.includes(index) ? 0.5 : 1
              }}
            >
              {length}-length ship
            </div>
          ))}
        </div>
        {allShipsPlaced && (
          <button
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: 'green',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              borderRadius: '5px'
            }}
            onClick={() => onComplete(board)}
          >
            Start Game
          </button>
        )}
      </div>

      <div>
        <h3>Player Board</h3>
        <div className="grid">
          {board.map((rowArr, row) =>
            rowArr.map((cell, col) => {
              const key = `${row}-${col}`;
              const isShip = cell === 'ship';

              return (
                <div
                  key={key}
                  className={`cell ${isShip ? 'ship-cell' : ''}`}
                  onDragOver={allowDrop}
                  onDrop={() => handleDrop(row, col)}
                >
                  {isShip ? '⚫' : ''}
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(10, 40px);
          grid-template-rows: repeat(10, 40px);
          gap: 4px;
        }

        .cell {
          width: 40px;
          height: 40px;
          background-color: lightblue;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
        }

        .cell:hover {
          background-color: #add8e6;
        }

        .ship-cell {
          background-color: black;
          color: white;
        }
      `}</style>
    </div>
  );
}
