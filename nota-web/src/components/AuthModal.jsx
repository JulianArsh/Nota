import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function AuthModal({ isOpen, onClose, onLogin, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const modal = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(44,27,26,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      {/* Stop clicks on card from closing the modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#FFF8F0',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '28rem',
          boxShadow: '0 24px 64px rgba(44,27,26,0.25)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6E544F', padding: '0.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(216,199,181,0.4)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>close</span>
        </button>

        {/* Brand mark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '3rem', height: '3rem',
            backgroundColor: '#4B2E2B',
            borderRadius: '0.75rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFF8F0',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            fontSize: '1.5rem',
          }}>N</div>
        </div>

        <h2 style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: '1.5rem', fontWeight: 800, color: '#2C1B1A',
          textAlign: 'center', margin: '0 0 0.5rem',
          letterSpacing: '-0.02em',
        }}>
          {isLogin ? 'Welcome back to Nota' : 'Join Nota'}
        </h2>
        <p style={{
          fontFamily: '"Inter", sans-serif', fontSize: '0.9375rem',
          color: '#6E544F', textAlign: 'center', margin: '0 0 2rem',
        }}>
          {isLogin
            ? 'Log in to continue your musical journey.'
            : 'Create an account to save pieces and comparisons.'}
        </p>

        <form onSubmit={e => { e.preventDefault(); onLogin(); }}>
          {!isLogin && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block', fontSize: '0.75rem',
                fontFamily: '"Public Sans", sans-serif', fontWeight: 600,
                color: '#4B2E2B', marginBottom: '0.375rem',
              }}>Full Name</label>
              <input
                type="text"
                placeholder="Eleanor V."
                required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '0.75rem 1rem', borderRadius: '0.75rem',
                  border: '1.5px solid rgba(216,199,181,0.8)',
                  backgroundColor: '#fff',
                  fontFamily: '"Inter", sans-serif', fontSize: '0.9375rem',
                  color: '#2C1B1A', outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#C08552'}
                onBlur={e => e.target.style.borderColor = 'rgba(216,199,181,0.8)'}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem',
              fontFamily: '"Public Sans", sans-serif', fontWeight: 600,
              color: '#4B2E2B', marginBottom: '0.375rem',
            }}>Email Address</label>
            <input
              type="email"
              placeholder="eleanor@example.com"
              required
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '0.75rem 1rem', borderRadius: '0.75rem',
                border: '1.5px solid rgba(216,199,181,0.8)',
                backgroundColor: '#fff',
                fontFamily: '"Inter", sans-serif', fontSize: '0.9375rem',
                color: '#2C1B1A', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#C08552'}
              onBlur={e => e.target.style.borderColor = 'rgba(216,199,181,0.8)'}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem',
              fontFamily: '"Public Sans", sans-serif', fontWeight: 600,
              color: '#4B2E2B', marginBottom: '0.375rem',
            }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '0.75rem 1rem', borderRadius: '0.75rem',
                border: '1.5px solid rgba(216,199,181,0.8)',
                backgroundColor: '#fff',
                fontFamily: '"Inter", sans-serif', fontSize: '0.9375rem',
                color: '#2C1B1A', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#C08552'}
              onBlur={e => e.target.style.borderColor = 'rgba(216,199,181,0.8)'}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%', padding: '0.9rem',
              backgroundColor: '#C08552', color: '#FFF8F0',
              border: 'none', borderRadius: '0.75rem',
              fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: '0.9375rem',
              cursor: 'pointer', transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A66E3E'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C08552'}
          >
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '1.5rem',
          fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#6E544F',
          margin: '1.5rem 0 0',
        }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none', border: 'none', color: '#C08552',
              fontWeight: 600, cursor: 'pointer', padding: 0,
              fontFamily: '"Inter", sans-serif', fontSize: '0.875rem',
            }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
