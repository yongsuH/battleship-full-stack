import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import anchorIcon from '/assets/anchor-solid.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar() {
  const [username, setUsername] = useState(null);
  const [gamesMenuOpen, setGamesMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => setUsername(data.username))
      .catch(() => setUsername(null));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('username');
    setUsername(null);
    toast.success('You have logged out successfully!');
    navigate('/');
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: loginUsername, password: loginPassword })
    });
    if (res.ok) {
      setUsername(loginUsername);
      localStorage.setItem('username', loginUsername);
      setShowLoginModal(false);
      setLoginUsername('');
      setLoginPassword('');
      toast.success(`Login successful! Welcome, ${signupUsername}!`);
      navigate('/');
    } else {
      if (res.status === 401) {
        toast.error('Incorrect username or password!');
      } else {
        const err = await res.json();
        toast.error(`Login failed: ${err.message || 'Unknown error'}`);
      }
    }
  };
  

  const handleSignup = async (e) => {
    console.log('Signup form submitted'); 
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: signupUsername, password: signupPassword })
    });
    if (res.ok) {
      setUsername(signupUsername);
      setShowSignupModal(false);
      setSignupUsername('');
      setSignupPassword('');
      toast.success(`Signup successful! Welcome, ${signupUsername}!`);
    } else {
      const err = await res.json();
      toast.error(`Signup failed: ${err.message || 'Unknown error'}`);
    }
  };
  
  

  return (
    <>
      <nav className="navbar">
        <h1 className="logo">
          <img src={anchorIcon} alt="Logo" className="logo-icon" />
          Battleship
        </h1>
        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li className="dropdown" onMouseEnter={() => setGamesMenuOpen(true)} onMouseLeave={() => setGamesMenuOpen(false)}>
          <NavLink to="#" className="games-dropdown">Games</NavLink>
            {gamesMenuOpen && (
              <ul className="dropdown-content">
                <li><NavLink to="/allgames">All Games</NavLink></li>
                <li><NavLink to="/newgame">New Game</NavLink></li>
              </ul>
            )}
          </li>
          <li><NavLink to="/rules">Rules</NavLink></li>
          <li><NavLink to="/highscores">HighScores</NavLink></li>
          {username ? (
            <li className="dropdown user-dropdown" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
              <span className="username">👤 {username}</span>
              {userMenuOpen && (
                <ul className="dropdown-content">
                  <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                </ul>
              )}
            </li>
          ) : (
            <>
              <li><button onClick={() => setShowLoginModal(true)} className="login-button">Login</button></li>
              <li><button onClick={() => setShowSignupModal(true)} className="signup-button">Signup</button></li>
            </>
          )}
        </ul>
      </nav>

      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required />
              <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}

      {showSignupModal && (
        <div className="modal-overlay" onClick={() => setShowSignupModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
              <input type="text" placeholder="Username" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} required />
              <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
              <button type="submit">Signup</button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </>
  );
}
