// =====================================================
// Navbar — faithful to Stitch design
// Plus Jakarta Sans headlines, pill user profile,
// sticky top, backdrop blur, mobile-responsive
// =====================================================
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import AuthModal from './AuthModal';
import NotaLogo from './NotaLogo';

const navLinks = [
  { label: 'Home',    to: '/home' },
  { label: 'Explore', to: '/explore' },
  { label: 'Library', to: '/library' },
  { label: 'Compare', to: '/compare/1' },
];

export default function Navbar({ isLoggedIn, onLogout }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255,248,240,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(232,220,196,0.5)',
    }}>
      <div style={{
        maxWidth: '120rem',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>

        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <NotaLogo size="md" />
          </Link>
          <span style={{
            display: 'none',
            padding: '0.125rem 0.625rem',
            fontSize: '0.6875rem',
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#C08552',
            backgroundColor: 'rgba(192,133,82,0.1)',
            borderRadius: '9999px',
            border: '1px solid rgba(192,133,82,0.25)',
          }} className="nota-badge">Acoustics</span>
        </div>

        {/* Navigation Links — desktop */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: '0.875rem',
        }}>
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{
                textDecoration: 'none',
                color: isActive(to) ? '#4B2E2B' : '#6E544F',
                fontWeight: isActive(to) ? 600 : 400,
                borderBottom: isActive(to) ? '2px solid #4B2E2B' : '2px solid transparent',
                paddingBottom: '0.25rem',
                transition: 'color 0.15s',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>

          {/* Mini now-playing */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem',
            backgroundColor: 'rgba(245,236,225,0.8)',
            border: '1px solid rgba(232,220,196,0.8)',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontFamily: '"Public Sans", sans-serif',
            color: '#4B2E2B',
          }} className="now-playing-widget">
            <span style={{
              width: '0.5rem', height: '0.5rem',
              backgroundColor: '#C08552',
              borderRadius: '50%',
              animation: 'pulse-ring 2s infinite',
            }} />
            <span style={{
              maxWidth: '8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}>Brahms: Op. 115</span>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#4B2E2B', display: 'flex', alignItems: 'center',
              padding: 0,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>play_arrow</span>
            </button>
          </div>

          {/* Bookmark */}
          <Link to="/library">
            <button style={{
              width: '2.5rem', height: '2.5rem',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: '1px solid transparent',
              cursor: 'pointer',
              color: '#4B2E2B',
              transition: 'all 0.15s',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>bookmark</span>
            </button>
          </Link>

          {/* Notifications */}
          <button style={{
            width: '2.5rem', height: '2.5rem',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: '1px solid transparent',
            cursor: 'pointer',
            color: '#4B2E2B',
            position: 'relative',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>notifications</span>
            <span style={{
              position: 'absolute', top: '0.5rem', right: '0.5rem',
              width: '0.5rem', height: '0.5rem',
              backgroundColor: '#C08552',
              borderRadius: '50%',
            }} />
          </button>

          <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'rgba(232,220,196,0.7)' }} />

          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0',
                  borderRadius: '50%',
                  border: '2px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(192,133,82,0.4)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div style={{
                  width: '2.25rem', height: '2.25rem',
                  borderRadius: '50%',
                  backgroundColor: '#C08552',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: '"Public Sans", sans-serif',
                }}>E</div>
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '200px',
                  backgroundColor: '#fff',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 25px rgba(44,27,26,0.1)',
                  border: '1px solid rgba(232,220,196,0.8)',
                  padding: '0.5rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 100,
                }}>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      padding: '0.625rem 1rem', textDecoration: 'none', color: '#4B2E2B',
                      fontFamily: '"Inter", sans-serif', fontSize: '0.875rem',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(192,133,82,0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>person</span>
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      padding: '0.625rem 1rem', textDecoration: 'none', color: '#4B2E2B',
                      fontFamily: '"Inter", sans-serif', fontSize: '0.875rem',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(192,133,82,0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>settings</span>
                    Settings
                  </Link>
                  <div style={{ height: '1px', backgroundColor: 'rgba(232,220,196,0.5)', margin: '0.25rem 0' }} />
                  <button
                    onClick={() => { setProfileOpen(false); onLogout(); }}
                    style={{
                      padding: '0.625rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
                      color: '#D32F2F', textAlign: 'left',
                      fontFamily: '"Inter", sans-serif', fontSize: '0.875rem',
                      display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(211,47,47,0.05)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              style={{
                padding: '0.5rem 1.25rem',
                backgroundColor: '#4B2E2B',
                color: '#FFF8F0',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontFamily: '"Public Sans", sans-serif',
                fontWeight: 600,
                fontSize: '0.8125rem',
                transition: 'background-color 0.15s',
              }}
            >
              Log In
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'none', border: 'none',
              cursor: 'pointer', color: '#4B2E2B',
            }}
            className="mobile-menu-btn"
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          borderTop: '1px solid rgba(232,220,196,0.5)',
          backgroundColor: 'rgba(255,248,240,0.98)',
          padding: '1rem 1.5rem',
        }}>
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '0.75rem 0',
                textDecoration: 'none',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: isActive(to) ? 600 : 400,
                color: isActive(to) ? '#4B2E2B' : '#6E544F',
                borderBottom: '1px solid rgba(232,220,196,0.4)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={() => {
          setAuthOpen(false);
        }}
      />
    </>
  );
}
