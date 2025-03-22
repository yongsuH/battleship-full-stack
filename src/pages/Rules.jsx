import React from 'react';
import '../styles/rules.css';

export default function Rules() {
  return (
    <main className="rules-container">
      <h1>How to Play Battleship</h1>

      <h2>Objective</h2>
      <p>Battleship is a strategy game played between two players. The goal is to sink your opponent's fleet of ships before they sink yours.</p>

      <h2>Game Setup</h2>
      <ul>
        <li>Each player has a 10x10 grid for their ships and a 10x10 grid to track their attacks.</li>
        <li>Players place their ships on their grid. Ships cannot overlap.</li>
        <li>The game consists of different ships: Carrier (5 squares), Battleship (4 squares), Cruiser (3 squares), Submarine (3 squares), and Destroyer (2 squares).</li>
      </ul>

      <h2>Gameplay</h2>
      <ol>
        <li>Players take turns calling out coordinates.</li>
        <li>If a ship occupies that coordinate, it's a hit; otherwise, it's a miss.</li>
        <li>Mark hits with "✔" and misses with "✖".</li>
        <li>When all parts of a ship are hit, that ship is sunk.</li>
        <li>The first player to sink all of their opponent's ships wins.</li>
      </ol>

      <h2>Winning the Game</h2>
      <p>The game ends when one player's entire fleet has been sunk. The other player is declared the winner.</p>

      <section className="credits">
        <h2>Credits</h2>
        <p>Created by: <strong>Yongsu Huang</strong></p>
        <p>Background image from Microsoft</p>
        <ul className="credits-links">
          <li><a href="mailto:huang.yongs@northeastern.edu">Email</a></li>
          <li><a href="https://github.com/yongsuH" target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
      </section>
    </main>
  );
}