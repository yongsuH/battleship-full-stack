import React from 'react';
import '../styles/game.css';

export default function Cell({ value, onClick, boardType }) {
  let className = 'cell';
  let symbol = '';

  const isEnemy = boardType === 'enemy';

  if (value === 'hit') {
    if (isEnemy) {
      className += ' cell-check';  // green ✔
      symbol = '✔';
    } else {
      className += ' cell-cross';  // red ✖
      symbol = '✖';
    }
  } else if (value === 'miss') {
    if (isEnemy) {
      className += ' cell-cross';  // red ✖
      symbol = '✖';
    } else {
      className += ' cell-check';  // green ✔
      symbol = '✔';
    }
  } else if (value === 'ship' && boardType === 'player') {
    symbol = '⚫';
  }

  return (
    <div className={className} onClick={onClick}>
      {symbol}
    </div>
  );
}
