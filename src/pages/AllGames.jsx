import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllGames() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('https://battleship-full-stack.onrender.com/api/games', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch games');
        }
        return res.json();
      })
      .then(data => setGames(data))
      .catch(err => console.error('Failed to fetch games:', err));
  }, []);

  const handleNewGame = () => {
    navigate('/newgame');
  };

  const handleJoinGame = async (gameId) => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        alert('You must be logged in to join a game!');
        return;
      }
      const res = await fetch(`https://battleship-full-stack.onrender.com/api/games/${gameId}/join`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username })
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/game/${data.gameId}`);
      } else {
        const err = await res.json();
        alert(`Failed to join game: ${err.message}`);
      }
    } catch (error) {
      console.error('Failed to join game:', error);
      alert('Failed to join game.');
    }
  };

  const storedUsername = localStorage.getItem('username');

  const openGames = games.filter(game => game.status === 'Open' && game.player1 !== storedUsername);
  const myOpenGames = games.filter(game => game.status === 'Open' && game.player1 === storedUsername);
  const myActiveGames = games.filter(game => game.status === 'Active' && (game.player1 === storedUsername || game.player2 === storedUsername));
  const myCompletedGames = games.filter(game => game.status === 'Completed' && (game.player1 === storedUsername || game.player2 === storedUsername));
  const otherGames = games.filter(game => (game.status === 'Active' || game.status === 'Completed') && (game.player1 !== storedUsername && game.player2 !== storedUsername));

  return (
    <div className="all-games-page" style={{ padding: '2rem' }}>
      <h1>All Games</h1>

      {storedUsername ? (
        <>
          <button
            onClick={handleNewGame}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#000080',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '2rem'
            }}
          >
            New Game
          </button>

          <section>
            <h2>Open Games</h2>
            {openGames.length ? openGames.map(game => (
              <div key={game._id} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <p style={{ margin: 0 }}><strong>Player:</strong> {game.player1}</p>
                  <p style={{ margin: 0 }}><strong>Start Time:</strong> {new Date(game.createdAt).toLocaleString()}</p>
                  <button onClick={() => navigate(`/game/${game._id}`)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', marginRight: '0.5rem', cursor: 'pointer' }}>Go to Game</button>
                  <button onClick={() => handleJoinGame(game._id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Join</button>
                </div>
              </div>
            )) : <p>No open games yet.</p>}
          </section>

          <section>
            <h2>My Open Games</h2>
            {myOpenGames.length ? myOpenGames.map(game => (
              <div key={game._id} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <p style={{ margin: 0 }}><strong>Start Time:</strong> {new Date(game.createdAt).toLocaleString()}</p>
                  <button onClick={() => navigate(`/game/${game._id}`)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Go to Game</button>
                </div>
              </div>
            )) : <p>No games you opened yet.</p>}
          </section>

          <section>
            <h2>My Active Games</h2>
            {myActiveGames.length ? myActiveGames.map(game => {
              const opponent = game.player1 === storedUsername ? game.player2 : game.player1;
              return (
                <div key={game._id} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <p style={{ margin: 0 }}><strong>Opponent:</strong> {opponent}</p>
                    <p style={{ margin: 0 }}><strong>Start Time:</strong> {new Date(game.createdAt).toLocaleString()}</p>
                    <button onClick={() => navigate(`/game/${game._id}`)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Go to Game</button>
                  </div>
                </div>
              );
            }) : <p>No active games yet.</p>}
          </section>

          <section>
            <h2>My Completed Games</h2>
            {myCompletedGames.length ? myCompletedGames.map(game => {
              const opponent = game.player1 === storedUsername ? game.player2 : game.player1;
              const didWin = game.winner === storedUsername;
              return (
                <div key={game._id} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <p style={{ margin: 0 }}><strong>Opponent:</strong> {opponent}</p>
                    <p style={{ margin: 0 }}><strong>Start Time:</strong> {new Date(game.createdAt).toLocaleString()}</p>
                    <p style={{ margin: 0 }}><strong>End Time:</strong> {game.endedAt ? new Date(game.endedAt).toLocaleString() : 'N/A'}</p>
                    <p style={{ margin: 0 }}><strong>Result:</strong> {didWin ? 'You Won' : 'You Lost'}</p>
                    <button onClick={() => navigate(`/game/${game._id}`)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Go to Game</button>
                  </div>
                </div>
              );
            }) : <p>No completed games yet.</p>}
          </section>

          <section>
            <h2>Other Games</h2>
            {otherGames.length ? otherGames.map(game => (
              <div key={game._id} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <p style={{ margin: 0 }}><strong>Players:</strong> {game.player1} vs {game.player2}</p>
                  <p style={{ margin: 0 }}><strong>Start Time:</strong> {new Date(game.createdAt).toLocaleString()}</p>
                  {game.status === 'Completed' && (
                    <>
                      <p style={{ margin: 0 }}><strong>End Time:</strong> {game.endedAt ? new Date(game.endedAt).toLocaleString() : 'N/A'}</p>
                      <p style={{ margin: 0 }}><strong>Winner:</strong> {game.winner}</p>
                    </>
                  )}
                  <button onClick={() => navigate(`/game/${game._id}`)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Go to Game</button>
                </div>
              </div>
            )) : <p>No other games available.</p>}
          </section>
        </>
      ) : (
        <>
          {/* 未登录时显示 Active/Completed */}
          <section>
            <h2>Active Games</h2>
            {games.filter(game => game.status === 'Active' && game.player1 && game.player2).length ? games.filter(game => game.status === 'Active' && game.player1 && game.player2).map(game => (
              <div key={game._id} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <p style={{ margin: 0 }}><strong>Players:</strong> {game.player1} vs {game.player2}</p>
                  <p style={{ margin: 0 }}><strong>Start Time:</strong> {new Date(game.createdAt).toLocaleString()}</p>
                  <button onClick={() => navigate(`/game/${game._id}`)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>View Game</button>
                </div>
              </div>
            )) : <p>No active games yet.</p>}
          </section>

          <section>
            <h2>Completed Games</h2>
            {games.filter(game => game.status === 'Completed').length ? games.filter(game => game.status === 'Completed').map(game => (
              <div key={game._id} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <p style={{ margin: 0 }}><strong>Players:</strong> {game.player1} vs {game.player2}</p>
                  <p style={{ margin: 0 }}><strong>Start Time:</strong> {new Date(game.createdAt).toLocaleString()}</p>
                  <p style={{ margin: 0 }}><strong>End Time:</strong> {game.endedAt ? new Date(game.endedAt).toLocaleString() : 'N/A'}</p>
                  <p style={{ margin: 0 }}><strong>Winner:</strong> {game.winner}</p>
                  <button onClick={() => navigate(`/game/${game._id}`)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>View Game</button>
                </div>
              </div>
            )) : <p>No completed games yet.</p>}
          </section>
        </>
      )}
    </div>
  );
}
