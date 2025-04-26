import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewGame() {
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        alert('You must be logged in to create a game!');
        return;
      }

      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username })
      });

      if (res.ok) {
        const data = await res.json();
        navigate(`/game/${data.gameId}`); // 创建成功后跳转到 /game/{gameId}
      } else {
        const err = await res.json();
        alert(`Failed to create game: ${err.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game.');
    }
  };

  return (
    <div className="new-game-page" style={{ padding: '2rem' }}>
      <h1>Start a New Game</h1>

      <p style={{ marginBottom: '2rem' }}>Ready to battle? Click the button below to create a new game room.</p>

      <button
        onClick={handleCreateGame}
        style={{
          padding: '0.6rem 1.2rem',
          backgroundColor: '#000080',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        Create New Game
      </button>
    </div>
  );
}
