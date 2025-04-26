import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HighScores() {
  const [scores, setScores] = useState([]);
  const storedUsername = localStorage.getItem('username');

  useEffect(() => {
    fetch('https://battleship-full-stack.onrender.com/api/highscores', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setScores(data))
      .catch(err => console.error('Failed to fetch high scores:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>High Scores</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '0.5rem' }}>Username</th>
            <th style={{ padding: '0.5rem' }}>Wins</th>
            <th style={{ padding: '0.5rem' }}>Losses</th>
          </tr>
        </thead>
        <tbody>
          {scores.map(player => (
            <tr key={player.username} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{
                padding: '0.5rem',
                fontWeight: storedUsername === player.username ? 'bold' : 'normal',
                color: storedUsername === player.username ? '#007BFF' : 'white'
              }}>
                {player.username}
              </td>
              <td style={{ padding: '0.5rem' }}>{player.wins}</td>
              <td style={{ padding: '0.5rem' }}>{player.losses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
