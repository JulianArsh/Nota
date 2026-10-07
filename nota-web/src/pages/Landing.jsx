import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotaLogo from '../components/NotaLogo';
import AuthModal from '../components/AuthModal';

const COMPOSERS = [
  { name: 'Johann Sebastian Bach', years: '1685 – 1750', era: 'Baroque' },
  { name: 'Wolfgang Amadeus Mozart', years: '1756 – 1791', era: 'Classical' },
  { name: 'Ludwig van Beethoven', years: '1770 – 1827', era: 'Classical' },
  { name: 'Johannes Brahms', years: '1833 – 1897', era: 'Romantic' },
  { name: 'Claude Debussy', years: '1862 – 1918', era: 'Impressionist' },
  { name: 'Gustav Mahler', years: '1860 – 1911', era: 'Late Romantic' },
];

const FEATURES = [
  {
    icon: 'play_circle',
    img: '/images/sheet_music.jpg',
    title: 'Synchronized Listening',
    desc: 'Follow the score measure-by-measure as the music plays, with instant musical context at every moment.',
  },
  {
    icon: 'compare_arrows',
    img: '/images/conductor_hands.jpg',
    title: 'Performance Comparison',
    desc: "Place two legendary recordings side by side and discover what makes each conductor's vision unique.",
  },
  {
    icon: 'school',
    img: '/images/violin_score.jpg',
    title: 'Multi-level Analysis',
    desc: 'Switch between Beginner, Intermediate, and Expert explanations tailored to your listening depth.',
  },
];

const STATS = [
  { value: '400+', label: 'Years of repertoire' },
  { value: '2,800+', label: 'Recordings analysed' },
  { value: '12', label: 'Great concert halls' },
  { value: '3', label: 'Analysis levels' },
];

export default function Landing({ onLogin }) {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [composerIdx, setComposerIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setComposerIdx(i => (i + 1) % COMPOSERS.length), 3000);
    return () => clearInterval(t);
  }, []);

  function openLogin() { setAuthMode('login'); setAuthOpen(true); }
  function openSignup() { setAuthMode('signup'); setAuthOpen(true); }

  return (
    <div style={{ backgroundColor: '#FFF8F0', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes composerFade {
          0%   { opacity: 0; transform: translateY(8px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes slowZoom {
          from { transform: scale(1);    }
          to   { transform: scale(1.06); }
        }
        .landing-cta-primary:hover   { background-color: #36211F !important; box-shadow: 0 12px 32px rgba(44,27,26,0.25) !important; transform: translateY(-2px) !important; }
        .landing-cta-secondary:hover { background-color: rgba(75,46,43,0.08) !important; transform: translateY(-1px) !important; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(75,46,43,0.12) !important; }
        .feature-card:hover .feature-img { transform: scale(1.04); }
        .feature-img { transition: transform 0.5s ease; }
        .stat-item:hover { background: rgba(192,133,82,0.08) !important; }
      `}</style>

      {/* ─── TOP BAR ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'rgba(255,248,240,0.96)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(232,220,196,0.45)',
        padding: '0 2.5rem',
        height: '4.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <NotaLogo size="md" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={openLogin} className="landing-cta-secondary" style={{
            padding: '0.5rem 1.375rem', borderRadius: '9999px',
            border: '1.5px solid rgba(75,46,43,0.22)', backgroundColor: 'transparent',
            color: '#4B2E2B', cursor: 'pointer',
            fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem',
            transition: 'all 0.2s',
          }}>Log In</button>
          <button onClick={openSignup} className="landing-cta-primary" style={{
            padding: '0.5625rem 1.5rem', borderRadius: '9999px', border: 'none',
            backgroundColor: '#4B2E2B', color: '#FFF8F0', cursor: 'pointer',
            fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: '0.875rem',
            transition: 'all 0.2s',
            boxShadow: '0 4px 14px rgba(44,27,26,0.18)',
          }}>Get Started Free</button>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', minHeight: 'calc(100vh - 4.75rem)', display: 'flex', flexDirection: 'column' }}>

        {/* Full-bleed hero image */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <img
            src="/images/hero_concert_hall.jpg"
            alt="Grand concert hall"
            onLoad={() => setImgLoaded(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              objectPosition: 'center 30%',
              animation: imgLoaded ? 'slowZoom 18s ease-in-out infinite alternate' : 'none',
              transition: 'opacity 0.8s ease',
              opacity: imgLoaded ? 1 : 0,
            }}
          />
          {/* Dark gradient overlay so text pops */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(20,10,9,0.55) 0%, rgba(20,10,9,0.35) 40%, rgba(44,27,26,0.82) 80%, #2C1B1A 100%)',
          }} />
        </div>

        {/* Hero content — text over image */}
        <div style={{
          position: 'relative', zIndex: 1,
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '5rem 2rem 3rem',
        }}>
          {/* Era badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.375rem 1rem', borderRadius: '9999px',
            backgroundColor: 'rgba(192,133,82,0.18)',
            border: '1px solid rgba(192,133,82,0.35)',
            marginBottom: '2rem',
            animation: 'fadeSlideUp 0.8s ease both',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem', color: '#C08552' }}>music_note</span>
            <span style={{
              fontFamily: '"Public Sans", sans-serif', fontWeight: 700,
              fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#C08552',
            }}>Archival Fidelity &amp; Historical Acoustics</span>
          </div>

          <h1 style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 'clamp(2.75rem, 7.5vw, 5.75rem)',
            fontWeight: 900, color: '#FFF8F0',
            letterSpacing: '-0.04em', lineHeight: 1.04,
            maxWidth: '14ch', margin: '0 0 1.5rem',
            animation: 'fadeSlideUp 0.9s 0.1s ease both',
            textShadow: '0 2px 24px rgba(0,0,0,0.3)',
          }}>
            Discover music across centuries.
          </h1>

          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255,248,240,0.78)',
            maxWidth: '44ch', lineHeight: 1.7,
            margin: '0 0 3rem',
            animation: 'fadeSlideUp 1s 0.2s ease both',
          }}>
            Navigate 400 years of orchestral mastery, comparative interpretations,
            and hall-specific acoustics calibrated for discerning listeners.
          </p>

          <div style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
            animation: 'fadeSlideUp 1s 0.35s ease both',
          }}>
            <button onClick={openSignup} className="landing-cta-primary" style={{
              padding: '0.9375rem 2.5rem', borderRadius: '9999px', border: 'none',
              backgroundColor: '#C08552', color: '#FFF8F0', cursor: 'pointer',
              fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: '1rem',
              transition: 'all 0.2s',
              boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              Start Listening Free
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_forward</span>
            </button>
            <button onClick={openLogin} className="landing-cta-secondary" style={{
              padding: '0.9375rem 2.25rem', borderRadius: '9999px',
              border: '2px solid rgba(255,248,240,0.35)',
              backgroundColor: 'rgba(255,248,240,0.08)',
              color: '#FFF8F0', cursor: 'pointer',
              fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: '1rem',
              transition: 'all 0.2s',
            }}>
              Log In
            </button>
          </div>
        </div>

        {/* Composer ticker — bottom of hero */}
        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', padding: '2rem',
          animation: 'fadeSlideUp 1s 0.55s ease both',
        }}>
          <span style={{
            fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,248,240,0.38)',
          }}>Featuring works by</span>
          <div style={{ height: '2.25rem', overflow: 'hidden', marginTop: '0.375rem' }}>
            <span key={composerIdx} style={{
              display: 'block',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700, fontSize: '1.125rem',
              color: '#FFF8F0',
              animation: 'composerFade 3s ease forwards',
            }}>
              {COMPOSERS[composerIdx].name}
              <span style={{ fontFamily: '"Inter", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#C08552', marginLeft: '0.75rem' }}>
                {COMPOSERS[composerIdx].era}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section style={{
        backgroundColor: '#4B2E2B',
        borderTop: '1px solid rgba(255,248,240,0.06)',
        padding: '2.25rem 2rem',
      }}>
        <div style={{
          maxWidth: '72rem', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
        }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-item" style={{
              textAlign: 'center', padding: '1rem',
              borderRadius: '0.75rem', transition: 'background 0.2s',
            }}>
              <div style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 900, fontSize: '2rem',
                color: '#C08552', letterSpacing: '-0.03em', lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem',
                color: 'rgba(255,248,240,0.55)', marginTop: '0.375rem',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: '6rem 2rem', backgroundColor: '#fff', borderBottom: '1px solid rgba(232,220,196,0.5)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{
              fontFamily: '"Public Sans", sans-serif', fontWeight: 700,
              fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#C08552', marginBottom: '0.75rem',
            }}>What Nota Offers</p>
            <h2 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.875rem)',
              fontWeight: 800, color: '#2C1B1A',
              letterSpacing: '-0.03em', margin: 0,
            }}>The serious listener's companion</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
          }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{
                borderRadius: '1.375rem',
                border: '1px solid rgba(232,220,196,0.6)',
                backgroundColor: '#FFF8F0',
                overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(75,46,43,0.06)',
                transition: 'all 0.3s ease',
              }}>
                {/* Card image */}
                <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#2C1B1A' }}>
                  <img
                    src={f.img}
                    alt={f.title}
                    className="feature-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {/* Card body */}
                <div style={{ padding: '1.625rem' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '2.5rem', height: '2.5rem',
                    borderRadius: '0.625rem',
                    backgroundColor: 'rgba(192,133,82,0.1)',
                    marginBottom: '1rem',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#C08552' }}>{f.icon}</span>
                  </div>
                  <h3 style={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700, fontSize: '1.0625rem', color: '#2C1B1A',
                    margin: '0 0 0.625rem', letterSpacing: '-0.01em',
                  }}>{f.title}</h3>
                  <p style={{
                    fontFamily: '"Inter", sans-serif', fontSize: '0.875rem',
                    color: '#6E544F', lineHeight: 1.65, margin: 0,
                  }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPLIT SECTION: Score image + copy ─── */}
      <section style={{ padding: '6rem 2rem', backgroundColor: '#FFF8F0' }}>
        <div style={{
          maxWidth: '72rem', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem', alignItems: 'center',
        }}>
          {/* Image */}
          <div style={{ borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(44,27,26,0.18)' }}>
            <img
              src="/images/conductor_hands.jpg"
              alt="Conductor in performance"
              style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '4/3' }}
            />
          </div>
          {/* Copy */}
          <div>
            <p style={{
              fontFamily: '"Public Sans", sans-serif', fontWeight: 700,
              fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#C08552', marginBottom: '1rem',
            }}>Performance Comparison</p>
            <h2 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.625rem)',
              fontWeight: 800, color: '#2C1B1A',
              letterSpacing: '-0.03em', margin: '0 0 1.25rem',
            }}>
              Every conductor tells a different story.
            </h2>
            <p style={{
              fontFamily: '"Inter", sans-serif', fontSize: '1.0625rem',
              color: '#6E544F', lineHeight: 1.75, margin: '0 0 2rem',
            }}>
              Nota synchronises two recordings of the same piece frame-by-frame,
              letting you hear exactly where Karajan lingers and where Klemperer drives.
              The shared score highlights each interpretive decision in real time.
            </p>
            <button onClick={openSignup} className="landing-cta-primary" style={{
              padding: '0.8125rem 2rem', borderRadius: '9999px', border: 'none',
              backgroundColor: '#4B2E2B', color: '#FFF8F0', cursor: 'pointer',
              fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: '0.9375rem',
              transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(44,27,26,0.16)',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            }}>
              Try a Comparison
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── DARK CTA BANNER ─── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background image */}
        <img
          src="/images/hero_concert_hall.jpg"
          alt=""
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(28,14,13,0.93) 0%, rgba(44,27,26,0.9) 100%)',
        }} />
        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', padding: '6rem 2rem',
        }}>
          <p style={{
            fontFamily: '"Public Sans", sans-serif', fontWeight: 700,
            fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(192,133,82,0.85)', marginBottom: '1.25rem',
          }}>Join thousands of discerning listeners</p>
          <h2 style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)',
            fontWeight: 900, color: '#FFF8F0',
            letterSpacing: '-0.04em', margin: '0 0 2rem',
            textShadow: '0 2px 16px rgba(0,0,0,0.4)',
          }}>Your musical journey begins here.</h2>
          <button
            onClick={openSignup}
            style={{
              padding: '1.0625rem 2.75rem', borderRadius: '9999px', border: 'none',
              backgroundColor: '#C08552', color: '#FFF8F0', cursor: 'pointer',
              fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: '1.0625rem',
              transition: 'all 0.2s',
              boxShadow: '0 6px 28px rgba(0,0,0,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#A66E3E'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C08552'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Create Free Account
          </button>
          <p style={{
            fontFamily: '"Inter", sans-serif', fontSize: '0.875rem',
            color: 'rgba(255,248,240,0.38)', marginTop: '1.5rem',
          }}>
            No credit card required &nbsp;·&nbsp; Free forever for core features
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        padding: '2rem 2.5rem',
        borderTop: '1px solid rgba(232,220,196,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        backgroundColor: '#FFF8F0',
      }}>
        <NotaLogo size="sm" />
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#D8C7B5', margin: 0 }}>
          © 2026 Nota. Classical music, rediscovered.
        </p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onLogin={() => { setAuthOpen(false); onLogin && onLogin(); }}
      />
    </div>
  );
}
