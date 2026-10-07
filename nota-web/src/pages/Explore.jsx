// Explore & Search — faithful to Stitch design
// Left filter sidebar + piece grid + search header
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PieceCard from '../components/PieceCard';
import { SkeletonCard, ErrorState, EmptyState } from '../components/StateComponents';
import { apiService } from '../services/apiService';
import { genreFilters, eraFilters } from '../data/mockData';

const sortOptions = ['Relevance', 'Title A–Z', 'Composer A–Z', 'Era (Oldest)', 'Era (Newest)', 'Duration'];

export default function Explore() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const [query, setQuery] = useState(params.get('q') || '');
  const [inputVal, setInputVal] = useState(params.get('q') || '');
  const [activeGenre, setActiveGenre] = useState('All Forms');
  const [activeEra, setActiveEra] = useState('All Eras');
  const [sort, setSort] = useState('Relevance');
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    load();
  }, [query, activeGenre, activeEra]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPieces({ query, genre: activeGenre, era: activeEra });
      setPieces(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setQuery(inputVal);
    navigate(`/explore?q=${encodeURIComponent(inputVal)}`, { replace: true });
  }

  return (
    <div style={{ backgroundColor: '#FFF8F0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '120rem', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── SEARCH HEADER ── */}
        <section style={{ paddingTop: '2.5rem', paddingBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: '#C08552' }}>library_music</span>
            <span style={{
              fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif',
              fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C08552',
            }}>Canon Archive</span>
          </div>
          <h1 style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 800, color: '#2C1B1A',
            letterSpacing: '-0.02em', margin: '0 0 1.5rem',
          }}>
            {query ? `Results for "${query}"` : 'Explore & Search'}
          </h1>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: '52rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              backgroundColor: '#fff',
              border: '1px solid rgba(216,199,181,0.8)',
              borderRadius: '9999px',
              padding: '0.375rem 0.5rem 0.375rem 1rem',
              boxShadow: '0 2px 12px rgba(75,46,43,0.06)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#C08552', marginRight: '0.75rem' }}>search</span>
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Search pieces, recordings, composers, opus..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: '"Inter", sans-serif', fontSize: '0.9375rem', color: '#2C1B1A',
                }}
              />
              <kbd style={{
                marginRight: '0.75rem',
                fontSize: '0.6875rem',
                fontFamily: '"Public Sans", sans-serif',
                fontWeight: 500,
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
                backgroundColor: '#F5ECE1',
                border: '1px solid rgba(216,199,181,0.6)',
                color: '#6E544F',
              }}>⌘K</kbd>
              <button type="submit" style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: '#4B2E2B',
                color: '#FFF8F0',
                border: 'none', borderRadius: '9999px',
                cursor: 'pointer',
                fontFamily: '"Public Sans", sans-serif',
                fontWeight: 600, fontSize: '0.875rem',
              }}>Search</button>
            </div>
          </form>

          {/* Active filters */}
          {(query || activeGenre !== 'All Forms' || activeEra !== 'All Eras') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: '#6E544F', fontFamily: '"Inter", sans-serif' }}>Active filters:</span>
              {query && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.25rem 0.625rem', borderRadius: '9999px',
                  backgroundColor: '#4B2E2B', color: '#FFF8F0',
                  fontSize: '0.75rem', fontFamily: '"Public Sans", sans-serif',
                }}>
                  "{query}"
                  <button onClick={() => { setQuery(''); setInputVal(''); navigate('/explore'); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FFF8F0', padding: 0, lineHeight: 1 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>close</span>
                  </button>
                </span>
              )}
              {activeGenre !== 'All Forms' && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.25rem 0.625rem', borderRadius: '9999px',
                  backgroundColor: '#C08552', color: '#FFF8F0',
                  fontSize: '0.75rem', fontFamily: '"Public Sans", sans-serif',
                }}>
                  {activeGenre}
                  <button onClick={() => setActiveGenre('All Forms')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FFF8F0', padding: 0, lineHeight: 1 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>close</span>
                  </button>
                </span>
              )}
            </div>
          )}
        </section>

        {/* ── MAIN LAYOUT: SIDEBAR + GRID ── */}
        <div style={{ display: 'flex', gap: '2rem', paddingBottom: '4rem', alignItems: 'flex-start' }}>

          {/* Filter Sidebar */}
          {sidebarOpen && (
            <aside style={{
              width: '220px',
              flexShrink: 0,
              backgroundColor: '#fff',
              borderRadius: '1rem',
              border: '1px solid rgba(232,220,196,0.6)',
              padding: '1.25rem',
              boxShadow: '0 2px 12px rgba(75,46,43,0.04)',
              position: 'sticky',
              top: '6rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#2C1B1A' }}>Filters</span>
                <button onClick={() => { setActiveGenre('All Forms'); setActiveEra('All Eras'); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#C08552', fontFamily: '"Public Sans", sans-serif', fontWeight: 600 }}>
                  Clear all
                </button>
              </div>

              {/* Genre */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ margin: '0 0 0.625rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E544F' }}>Form</p>
                {genreFilters.map(g => (
                  <button key={g} onClick={() => setActiveGenre(g)} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '0.4375rem 0.625rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8125rem',
                    fontFamily: '"Inter", sans-serif',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: activeGenre === g ? 'rgba(75,46,43,0.08)' : 'transparent',
                    color: activeGenre === g ? '#4B2E2B' : '#6E544F',
                    fontWeight: activeGenre === g ? 600 : 400,
                    marginBottom: '0.125rem',
                    transition: 'all 0.15s',
                  }}>{g}</button>
                ))}
              </div>

              {/* Era */}
              <div>
                <p style={{ margin: '0 0 0.625rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E544F' }}>Era</p>
                {eraFilters.map(e => (
                  <button key={e} onClick={() => setActiveEra(e)} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '0.4375rem 0.625rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8125rem',
                    fontFamily: '"Inter", sans-serif',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: activeEra === e ? 'rgba(75,46,43,0.08)' : 'transparent',
                    color: activeEra === e ? '#4B2E2B' : '#6E544F',
                    fontWeight: activeEra === e ? 600 : 400,
                    marginBottom: '0.125rem',
                    transition: 'all 0.15s',
                  }}>{e}</button>
                ))}
              </div>
            </aside>
          )}

          {/* Results */}
          <div style={{ flex: 1 }}>
            {/* Result count + sort */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p style={{ margin: 0, fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#6E544F' }}>
                {loading ? 'Loading...' : `${pieces.length} piece${pieces.length !== 1 ? 's' : ''} found`}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.375rem 0.75rem',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(216,199,181,0.8)',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    fontFamily: '"Public Sans", sans-serif',
                    fontWeight: 500, fontSize: '0.75rem', color: '#4B2E2B',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>tune</span>
                  {sidebarOpen ? 'Hide' : 'Show'} Filters
                </button>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{
                    padding: '0.375rem 0.75rem',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(216,199,181,0.8)',
                    borderRadius: '9999px',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.8125rem', color: '#4B2E2B',
                    cursor: 'pointer', outline: 'none',
                  }}
                >
                  {sortOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={load} />
            ) : pieces.length === 0 ? (
              <EmptyState
                icon="search_off"
                title="No pieces found"
                message="Try adjusting your search or filters to find what you're looking for."
                action={{ label: 'Clear Filters', onClick: () => { setQuery(''); setInputVal(''); setActiveGenre('All Forms'); setActiveEra('All Eras'); navigate('/explore'); } }}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {pieces.map(piece => <PieceCard key={piece.id} piece={piece} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
