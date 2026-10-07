// Home Page — faithful to Stitch "Classical Music Discovery Homepage"
// Hero + search + featured spotlight + collections + composers + epoch tabs
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PieceCard from '../components/PieceCard';
import { LoadingState, ErrorState, SkeletonCard } from '../components/StateComponents';
import { apiService } from '../services/apiService';
import { pieces as allPieces, collections, composers, genreFilters } from '../data/mockData';

const eraEpochs = ['Baroque', 'Classical', 'Romantic', 'Modern'];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('All Forms');
  const [activeEpoch, setActiveEpoch] = useState('Romantic');
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPieces();
  }, []);

  async function loadPieces() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPieces();
      setPieces(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) navigate(`/explore?q=${encodeURIComponent(search)}`);
  }

  const epochPieces = pieces.filter(p => p.era === activeEpoch);

  const s = { // shared styles shorthand
    section: {
      maxWidth: '120rem',
      margin: '0 auto',
      padding: '0 1.5rem',
    },
  };

  return (
    <div style={{ backgroundColor: '#FFF8F0', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ ...s.section, paddingTop: '3rem', paddingBottom: '3.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glows */}
        <div style={{
          position: 'absolute', top: '-4rem', right: '25%',
          width: '24rem', height: '24rem',
          backgroundColor: 'rgba(192,133,82,0.1)',
          borderRadius: '50%', filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '5rem', left: '2.5rem',
          width: '18rem', height: '18rem',
          backgroundColor: 'rgba(232,220,196,0.4)',
          borderRadius: '50%', filter: 'blur(48px)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Tag pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            borderRadius: '9999px',
            backgroundColor: '#F5ECE1',
            border: '1px solid rgba(216,199,181,0.8)',
            fontSize: '0.6875rem',
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#C08552',
            marginBottom: '1.25rem',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>graphic_eq</span>
            Archival Fidelity & Historical Acoustics
          </div>

          {/* Hero headline */}
          <h1 style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 800,
            color: '#2C1B1A',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 1rem',
          }}>
            Discover acoustic architecture across centuries.
          </h1>
          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '1.0625rem',
            color: '#6E544F',
            lineHeight: 1.7,
            margin: '0 0 2.25rem',
          }}>
            Navigate 400 years of orchestral mastery, comparative interpretations,
            and hall-specific acoustics calibrated for discerning listeners.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '1rem',
              padding: '0.5rem',
              boxShadow: '0 8px 40px rgba(75,46,43,0.1)',
              border: '1px solid rgba(216,199,181,0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', flex: 1 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: '#C08552' }}>search</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by piece, composer (e.g. Mahler, Debussy), soloist, or opus number..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.9375rem',
                    color: '#2C1B1A',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4B2E2B',
                  color: '#FFF8F0',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: '"Public Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#36211F'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4B2E2B'}
              >
                Search
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
              </button>
            </div>

            {/* Quick filter chips */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
              marginTop: '1rem',
            }} className="no-scrollbar">
              <span style={{
                fontSize: '0.6875rem',
                fontFamily: '"Public Sans", sans-serif',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#6E544F',
                whiteSpace: 'nowrap',
                marginRight: '0.25rem',
              }}>Tonal Form:</span>
              {genreFilters.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setActiveGenre(g)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontFamily: '"Public Sans", sans-serif',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: activeGenre === g ? 'none' : '1px solid rgba(216,199,181,0.8)',
                    backgroundColor: activeGenre === g ? '#4B2E2B' : '#fff',
                    color: activeGenre === g ? '#FFF8F0' : '#6E544F',
                    transition: 'all 0.15s',
                  }}
                >{g}</button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* ── FEATURED PERFORMANCE SPOTLIGHT ── */}
      <section style={{ ...s.section, marginBottom: '4rem' }}>
        <div style={{
          position: 'relative',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          border: '1px solid rgba(216,199,181,0.5)',
          boxShadow: '0 8px 40px rgba(75,46,43,0.12)',
          backgroundColor: '#4B2E2B',
          color: '#FFF8F0',
          minHeight: '22rem',
          display: 'flex',
          alignItems: 'center',
        }}>
          {/* BG image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
          }} />
          {/* Gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(75,46,43,1) 0%, rgba(75,46,43,0.85) 50%, rgba(75,46,43,0.4) 100%)',
          }} />

          <div style={{ position: 'relative', padding: '3rem', maxWidth: '40rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(192,133,82,0.2)',
              border: '1px solid rgba(192,133,82,0.3)',
              fontSize: '0.6875rem',
              fontFamily: '"Public Sans", sans-serif',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#C08552',
              marginBottom: '1.25rem',
            }}>
              <span style={{
                width: '0.5rem', height: '0.5rem',
                backgroundColor: '#C08552',
                borderRadius: '50%',
                animation: 'pulse-ring 2s infinite',
              }} />
              Featured Performance
            </div>

            <h2 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 800,
              color: '#FFF8F0',
              margin: '0 0 0.5rem',
              letterSpacing: '-0.01em',
            }}>
              Beethoven: Symphony No. 9
            </h2>
            <p style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.9375rem',
              color: 'rgba(255,248,240,0.75)',
              margin: '0 0 0.5rem',
            }}>Berlin Philharmonic · Herbert von Karajan · 1963</p>
            <p style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.875rem',
              color: 'rgba(255,248,240,0.6)',
              margin: '0 0 1.75rem',
              lineHeight: 1.6,
              maxWidth: '32rem',
            }}>
              The legendary 1963 Deutsche Grammophon recording. Experience the full symphony
              with synchronized score and multi-level musical analysis.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={() => navigate('/piece/1')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#C08552',
                  color: '#FFF8F0',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontFamily: '"Public Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  transition: 'background-color 0.2s',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>play_circle</span>
                Start Listening
              </button>
              <button
                onClick={() => navigate('/explore')}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'rgba(255,248,240,0.1)',
                  color: '#FFF8F0',
                  border: '1px solid rgba(255,248,240,0.25)',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontFamily: '"Public Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CURATED COLLECTIONS ── */}
      <section style={{ ...s.section, marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C08552' }}>Curated</p>
            <h2 style={{ margin: 0, fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#2C1B1A' }}>Collections</h2>
          </div>
          <button onClick={() => navigate('/explore')} style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600,
            fontSize: '0.875rem', color: '#C08552',
          }}>
            View all <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
        }}>
          {collections.map(col => (
            <div key={col.id} style={{
              backgroundColor: '#fff',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              border: '1px solid rgba(232,220,196,0.6)',
              boxShadow: '0 2px 12px rgba(75,46,43,0.05)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(75,46,43,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(75,46,43,0.05)'; }}
            >
              <div style={{ height: '8rem', backgroundColor: col.color, backgroundImage: `url(${col.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundColor: col.color, opacity: 0.6 }} />
                <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.625rem',
                    borderRadius: '9999px',
                    fontSize: '0.6875rem',
                    fontFamily: '"Public Sans", sans-serif',
                    fontWeight: 600,
                    backgroundColor: 'rgba(255,248,240,0.2)',
                    color: '#FFF8F0',
                    border: '1px solid rgba(255,248,240,0.3)',
                  }}>{col.count} pieces</span>
                </div>
              </div>
              <div style={{ padding: '0.875rem 1rem' }}>
                <h3 style={{ margin: '0 0 0.25rem', fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#2C1B1A' }}>{col.title}</h3>
                <p style={{ margin: 0, fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#6E544F', lineHeight: 1.5 }}>{col.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EPOCH NAVIGATOR ── */}
      <section style={{ ...s.section, marginBottom: '4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C08552' }}>Browse by Era</p>
          <h2 style={{ margin: '0 0 1rem', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#2C1B1A' }}>Epoch Navigator</h2>

          {/* Era tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }} className="no-scrollbar">
            {eraEpochs.map(era => (
              <button
                key={era}
                onClick={() => setActiveEpoch(era)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontFamily: '"Public Sans", sans-serif',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: activeEpoch === era ? 'none' : '1px solid rgba(216,199,181,0.8)',
                  backgroundColor: activeEpoch === era ? '#4B2E2B' : '#fff',
                  color: activeEpoch === era ? '#FFF8F0' : '#6E544F',
                  transition: 'all 0.15s',
                }}
              >{era}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={loadPieces} />
        ) : epochPieces.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6E544F', fontFamily: '"Inter", sans-serif' }}>
            No pieces found for the {activeEpoch} era.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {epochPieces.map(piece => <PieceCard key={piece.id} piece={piece} />)}
          </div>
        )}
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{
        backgroundColor: '#4B2E2B',
        color: '#FFF8F0',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        marginTop: '2rem',
      }}>
        <div style={{ maxWidth: '36rem', margin: '0 auto' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#C08552', marginBottom: '1rem', display: 'block' }}>music_note</span>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.75rem', letterSpacing: '-0.01em' }}>
            Begin your musical journey
          </h2>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: 'rgba(255,248,240,0.7)', margin: '0 0 2rem', lineHeight: 1.7 }}>
            Explore the complete canon with synchronized scores, expert analysis, and
            historical recordings — all in one place.
          </p>
          <button onClick={() => navigate('/explore')} style={{
            padding: '0.875rem 2rem',
            backgroundColor: '#C08552',
            color: '#FFF8F0',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
          }}>
            Explore the Canon
          </button>
        </div>
      </section>
    </div>
  );
}
