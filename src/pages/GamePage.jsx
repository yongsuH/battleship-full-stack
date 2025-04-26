import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attackInProgress, setAttackInProgress] = useState(false);
  const storedUsername = localStorage.getItem('username');
  const [hoveredTile, setHoveredTile] = useState({});

  useEffect(() => {
    async function fetchGame() {
      try {
        const res = await fetch(`/api/games/${gameId}`, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch game');
        const data = await res.json();

        if (data.status === 'Active' && (!Array.isArray(data.player1Board) || !Array.isArray(data.player2Board) || data.player1Board.length === 0 || data.player2Board.length === 0)) {
          const initRes = await fetch(`/api/games/${gameId}/init-board`, {
            method: 'PATCH',
            credentials: 'include'
          });
          if (initRes.ok) {
            const initData = await initRes.json();
            setGame(initData.game);
          } else {
            console.error('Failed to initialize board');
            setGame(data);
          }
        } else {
          setGame(data);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        navigate('/allgames');
      }
    }
    fetchGame();

    const interval = setInterval(() => {
      fetchGame();
    }, 3000);

    return () => clearInterval(interval);
  }, [gameId, navigate]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading game...</div>;
  if (!game) return <div style={{ padding: '2rem' }}>Game not found.</div>;

  const isLoggedIn = !!storedUsername;
  const isPlayer1 = storedUsername === game.player1;
  const isPlayer2 = storedUsername === game.player2;
  const isParticipant = isPlayer1 || isPlayer2;

  const myBoard = isPlayer1 ? game.player1Board : game.player2Board;
  const opponentBoard = isPlayer1 ? game.player2Board : game.player1Board;
  const myHits = isPlayer1 ? game.player1Hits : game.player2Hits;
  const opponentHits = isPlayer1 ? game.player2Hits : game.player1Hits;
  const isMyTurn = (isPlayer1 && game.currentTurn === 'player1') || (isPlayer2 && game.currentTurn === 'player2');

  const handleAttack = async (x, y) => {
    if (!isMyTurn || attackInProgress) return;
    setAttackInProgress(true);
    try {
      const res = await fetch(`/api/games/${gameId}/attack`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ y, x })
      });
      if (res.ok) {
        const updatedGame = await res.json();
        setGame(updatedGame);
      } else {
        const err = await res.json();
        alert(err.message || 'Attack failed');
      }
    } catch (error) {
      console.error('Attack error:', error);
    }
    setAttackInProgress(false);
  };

  function renderBoard(board, hits, isOwnBoard, boardType){
    if (!board || board.length === 0) return <div style={{ marginBottom: '1rem' }}>Board not ready yet...</div>;

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 30px)',
        gap: '2px',
        marginBottom: '1rem'
      }}>
        {board.flatMap((row, y) =>
          row.map((cell, x) => {
            let isHit = hits.some(hit => hit[0] === y && hit[1] === x);
            let backgroundColor = 'lightblue';
            let content = '';
            let isShip = cell === 1;

            const isHovered = boardType === 'opponent' && hoveredTile.x === x && hoveredTile.y === y;

            if (isParticipant) {
              if (isOwnBoard) {
                if ((isPlayer1 ? game.player2Hits : game.player1Hits).some(hit => hit[0] === y && hit[1] === x)) {
                  backgroundColor = isHovered ? '#cc0000' : 'red';
                } else if (isShip) {
                  backgroundColor = isHovered ? '#888' : 'gray';
                } else {
                  backgroundColor = isHovered ? '#87cefa' : 'lightblue';
                }
              } else {
                if ((isPlayer1 ? game.player1Hits : game.player2Hits).some(hit => hit[0] === y && hit[1] === x)) {
                  if (isShip) {
                    backgroundColor = isHovered ? '#cc0000' : 'red';
                    content = 'X';
                  } else {
                    backgroundColor = isHovered ? '#00008b' : 'blue';
                    content = 'O';
                  }
                } else {
                  backgroundColor = isHovered ? '#87cefa' : 'lightblue';
                }
              }
            } else {
              if (isOwnBoard) {
                if ((game.player2Hits || []).some(hit => hit[0] === y && hit[1] === x)) {
                  backgroundColor = isHovered ? '#cc0000' : 'red';
                } else {
                  backgroundColor = isHovered ? '#87cefa' : 'lightblue';
                }
              } else {
                if ((game.player1Hits || []).some(hit => hit[0] === y && hit[1] === x)) {
                  backgroundColor = isHovered ? '#cc0000' : 'red';
                } else {
                  backgroundColor = isHovered ? '#87cefa' : 'lightblue';
                }
              }
            }

            return (
              <div
                key={`${y}-${x}`}
                onClick={() => isParticipant && !isOwnBoard && isMyTurn && !attackInProgress && handleAttack(x, y)}
                onMouseEnter={() => {
                    if (isParticipant && !isOwnBoard) {
                      setHoveredTile({ x, y });
                    }
                  }}
                  onMouseLeave={() => {
                    if (isParticipant && !isOwnBoard) {
                      setHoveredTile({});
                    }
                  }}
                  
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor,
                  border: '1px solid #ccc',
                  cursor: isParticipant ? (isOwnBoard ? 'default' : (isMyTurn ? (attackInProgress ? 'wait' : 'pointer') : 'not-allowed')) : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}
              >
                {content}
              </div>
            );
          })
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {game.status === 'Completed' && (
        <h2 style={{ color: 'green', textAlign: 'center' }}>{game.winner} Wins!</h2>
      )}

      <h1>Game Room</h1>
      <h2>Game ID: {gameId}</h2>
      <h3>Status: {game.status}</h3>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        <h3>Player 1: {game.player1}</h3>
        <h3>Player 2: {game.player2 ? game.player2 : 'Waiting for opponent...'}</h3>
      </div>

      {game.status === 'Open' && (
        <p>Waiting for another player to join...</p>
      )}

      {game.status === 'Active' && (
        <div style={{ display: 'flex', gap: '5rem', marginTop: '2rem' }}>
          <div>
            <h3>First Board: {isParticipant ? "Opponent's Board" : (game.player2 || 'Waiting...')}</h3>
            {renderBoard(opponentBoard, opponentHits, false, 'opponent')}
          </div>
          <div>
            <h3>Second Board: {isParticipant ? "Your Board" : game.player1}</h3>
            {renderBoard(myBoard, myHits, true, 'own')}
          </div>
        </div>
      )}
    </div>
  );
}
