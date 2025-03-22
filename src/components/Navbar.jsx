import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';
import anchorIcon from '/assets/anchor-solid.svg';

export default function Navbar() {
  return (
    <nav className="navbar">
        <h1 className="logo">
          <img src={anchorIcon} alt="Logo" className="logo-icon" />
          Battleship
        </h1>
        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li className="dropdown">
          <NavLink to="#">Game ▾</NavLink>
            <ul className="dropdown-content">
              <li><NavLink to="/game/normal">Normal</NavLink></li>
              <li><NavLink to="/game/easy">Free Play</NavLink></li>
            </ul>
          </li>
          <li><NavLink to="/rules">Rules</NavLink></li>
          <li><NavLink to="/highscores">HighScores</NavLink></li>
        </ul>
    </nav>
  );
}