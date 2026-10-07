// Library — Saved Pieces Collection
// Grid of saved pieces with empty state + remove functionality
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PieceCard from '../components/PieceCard';
import { LoadingState, ErrorState, EmptyState } from '../components/StateComponents';
import { apiService } from '../services/apiService';

const sortOptions = ['Date Saved', 'Title A–Z', 'Composer A–Z', 'Era'];

export default function Library() {
  const navigate = useNavigate();
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('Date Saved');
  const [filterEra, setFilterEra] = useState('All');

  useEffect(() => { loadLibrary(); }, []);

  async function loadLibrary() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getLibrary();
      setPieces(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSaveToggle(pieceId, nowSaved) {
    if (!nowSaved) {
      // Remove from library immediately on unsave
      setPieces(prev => prev.filter(p => p.id !== pieceId));
    }
  }

  const eras = ['All', ...Array.from(new Set(pieces.map(p => p.era)))];

  let displayed = filterEra === 'All' ? pieces : pieces.filter(p => p.era === filterEra);
  if (sort === 'Title A–Z') displayed = [...displayed].sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'Composer A–Z') displayed = [...displayed].sort((a, b) => a.composer.localeCompare(b.composer));
  else if (sort === 'Era') displayed = [...displayed].sort((a, b) => a.era.localeCompare(b.era));

  const totalDuration = pieces.reduce((acc, p) => {
    const [m, s] = (p.duration || '0:00').split(':').map(Number);
    return acc + (m || 0) * 60 + (s || 0);
  }, 0);
  const totalHours = Math.floor(totalDuration / 3600);
  const totalMins = Math.floor((totalDuration % 3600) / 60);

  return (
    <div style={{ backgroundColor: '#FFF8F0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '120rem', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Header ── */}
        <section style={{ paddingTop: '2.5rem', paddingBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: '#C08552' }}>bookmark</span>
            <span style={{ fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C08552' }}>
              Your Collection
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 800, color: '#2C1B1A',
                letterSpacing: '-0.02em', margin: '0 0 0.5rem',
              }}>
                Your Library
              </h1>
              {!loading && pieces.length > 0 && (
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {[
                    { icon: 'library_music', label: `${pieces.length} piece${pieces.length !== 1 ? 's' : ''}` },
                    { icon: 'schedule', label: `${totalHours}h ${totalMins}m total` },
                  ].map(({ icon, label }) => (
                    <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontFamily: '"Inter", sans-serif', color: '#6E544F' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{icon}</span>
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/explore')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.625rem 1.25rem',
                borderRadius: '9999px',
                backgroundColor: '#4B2E2B',
                color: '#FFF8F0',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Public Sans", sans-serif',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
              Discover More
            </button>
          </div>
        </section>

        {/* ── Stats cards ── */}
        {!loading && pieces.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.875rem',
            marginBottom: '2rem',
          }}>
            {[
              { icon: 'library_music', label: 'Saved Pieces', value: pieces.length, color: '#4B2E2B' },
              { icon: 'schedule', label: 'Total Duration', value: `${totalHours}h ${totalMins}m`, color: '#8C5A3C' },
              { icon: 'groups', label: 'Composers', value: new Set(pieces.map(p => p.composer)).size, color: '#C08552' },
              { icon: 'history_edu', label: 'Eras Covered', value: new Set(pieces.map(p => p.era)).size, color: '#36211F' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} style={{
                backgroundColor: '#fff',
                borderRadius: '1rem',
                border: '1px solid rgba(232,220,196,0.6)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
              }}>
                <div style={{
                  width: '2.5rem', height: '2.5rem',
                  borderRadius: '0.625rem',
                  backgroundColor: `${color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{icon}</span>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.125rem', fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#2C1B1A' }}>{value}</p>
                  <p style={{ margin: 0, fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#6E544F' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Controls ── */}
        {!loading && pieces.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.875rem' }}>
            {/* Era filter pills */}
            <div style={{ display: 'flex', gap: '0.375rem', overflowX: 'auto' }} className="no-scrollbar">
              {eras.map(era => (
                <button
                  key={era}
                  onClick={() => setFilterEra(era)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontFamily: '"Public Sans", sans-serif',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: filterEra === era ? '#4B2E2B' : 'rgba(232,220,196,0.5)',
                    color: filterEra === era ? '#FFF8F0' : '#6E544F',
                    transition: 'all 0.15s',
                  }}
                >{era}</button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: '#fff',
                border: '1px solid rgba(216,199,181,0.8)',
                borderRadius: '9999px',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.8125rem',
                color: '#4B2E2B',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {sortOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}

        {/* ── Content ── */}
        <div style={{ paddingBottom: '4rem' }}>
          {loading ? (
            <LoadingState message="Loading your library…" />
          ) : error ? (
            <ErrorState message={error} onRetry={loadLibrary} />
          ) : pieces.length === 0 ? (
            <EmptyState
              icon="bookmark_border"
              title="Your library is empty"
              message="Save pieces from the Explore page to build your personal classical music collection. Your saved pieces will appear here."
              action={{ label: 'Explore the Canon', onClick: () => navigate('/explore') }}
            />
          ) : displayed.length === 0 ? (
            <EmptyState
              icon="filter_alt"
              title="No pieces match this filter"
              message="Try selecting a different era or clearing the filter."
              action={{ label: 'Show All', onClick: () => setFilterEra('All') }}
            />
          ) : (
            <>
              <p style={{ margin: '0 0 1.25rem', fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#6E544F' }}>
                {displayed.length} piece{displayed.length !== 1 ? 's' : ''} {filterEra !== 'All' ? `in ${filterEra}` : 'saved'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {displayed.map(piece => (
                  <PieceCard key={piece.id} piece={piece} onSaveToggle={handleSaveToggle} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
