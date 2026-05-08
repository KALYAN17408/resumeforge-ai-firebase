import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { auth } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import './Auth.css';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form,         setForm]         = useState({ email: '', password: '' });
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  // Forgot password state
  const [showReset,    setShowReset]    = useState(false);
  const [resetEmail,   setResetEmail]   = useState('');
  const [resetSent,    setResetSent]    = useState(false);
  const [resetError,   setResetError]   = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  /* ── Login handler ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Password reset handler ── */
  const handleReset = async (e) => {
    e.preventDefault();
    setResetError('');

    if (!resetEmail.trim()) {
      setResetError('Please enter your email address.');
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSent(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        setResetError('No account found with this email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setResetError('Too many requests. Please try again later.');
      } else {
        setResetError(err.message || 'Failed to send reset email. Try again.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  /* ── Forgot password panel ── */
  if (showReset) {
    return (
      <div className="auth-page">
        <div className="auth-glow" />
        <div className="auth-card">
          <div className="auth-logo">◈ ResumeForge</div>
          <h2>Reset Password</h2>
          <p className="auth-sub">
            Enter your account email and we'll send you a reset link.
          </p>

          {resetSent ? (
            <div className="reset-success">
              <div className="reset-success-icon">📧</div>
              <h3>Check your inbox</h3>
              <p>
                A password reset link has been sent to{' '}
                <strong>{resetEmail}</strong>.<br />
                Check your spam folder if you don't see it within a minute.
              </p>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }}
                onClick={() => {
                  setShowReset(false);
                  setResetSent(false);
                  setResetEmail('');
                }}
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="auth-form">
              {resetError && <div className="auth-error">{resetError}</div>}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={resetLoading}
              >
                {resetLoading ? 'Sending…' : '📧 Send Reset Link'}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                onClick={() => {
                  setShowReset(false);
                  setResetError('');
                  setResetEmail('');
                }}
              >
                ← Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  /* ── Normal login panel ── */
  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card">
        <div className="auth-logo">◈ ResumeForge</div>
        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to continue building</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              {/* Forgot password link — sits right-aligned next to label */}
              <button
                type="button"
                className="forgot-link"
                onClick={() => {
                  setResetEmail(form.email); // pre-fill if user already typed email
                  setShowReset(true);
                }}
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}