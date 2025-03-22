import React from 'react';
import '../styles/score.css';

export default function HighScores() {
  return (
    <main className="scores-container">
      <h1>High Scores</h1>

      <table className="scores-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Wins</th>
            <th>Losses</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>CaptainJack</td><td>15</td><td>3</td></tr>
          <tr><td>2</td><td>SeaDestroyer</td><td>12</td><td>4</td></tr>
          <tr><td>3</td><td>NavalMaster</td><td>10</td><td>6</td></tr>
          <tr><td>4</td><td>TorpedoKing</td><td>9</td><td>7</td></tr>
          <tr><td>5</td><td>SubmarineAce</td><td>8</td><td>8</td></tr>
          <tr><td>6</td><td>MissileHawk</td><td>7</td><td>9</td></tr>
          <tr><td>7</td><td>DeepBlue</td><td>6</td><td>10</td></tr>
        </tbody>
      </table>
    </main>
  );
}