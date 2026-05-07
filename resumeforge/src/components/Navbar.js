import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    navigate('/');
    setOpen(false);
  };

  const isActive = (path) =>
    path === '/builder'
      ? location.pathname.startsWith('/builder')
      : location.pathname === path;

  return (
    <nav className="navbar">
      <Link to={user ? '/dashboard' : '/'} className="nav-logo" onClick={() => setOpen(false)}>
        <span className="logo-icon">◈</span> ResumeForge
      </Link>

      <div className={`nav-links ${open ? 'open' : ''}`}>
        {user ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={() => setOpen(false)}>Dashboard</Link>
            <Link to="/builder?template=modern-fresher" className={isActive('/builder') ? 'active' : ''} onClick={() => setOpen(false)}>Build Resume</Link>
            <Link to="/templates" className={isActive('/templates') ? 'active' : ''} onClick={() => setOpen(false)}>Templates</Link>
            <div className="nav-user">
              <span className="nav-free-badge">✓ Free</span>
              <span className="nav-name">{user.displayName?.split(' ')[0] || 'User'}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login"  className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Get Started</Link>
          </>
        )}
      </div>

      <button className="burger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
    </nav>
  );
}
