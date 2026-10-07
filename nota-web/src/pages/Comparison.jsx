// Comparison — Side-by-side performance comparison
// Two recordings of same piece, shared score, timestamp alignment
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { createYouTubePlayer, YT_STATE } from '../services/youtubeService';
import { findActiveSyncPoint, formatTime, hasSyncChanged } from '../services/syncService';
import { LoadingState, ErrorState } from '../components/StateComponents';

function MiniPlayer({ recording, label, onTimeUpdate, accentColor }) {
  const intervalRef = useRef(null);
  const playerRef = useRef(null);
  const [state, setState] = useState('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [syncPoint, setSyncPoint] = useState(null);
  const currentSyncRef = useRef(null);
  const syncPointsRef = useRef([]);

  useEffect(() => {
    apiService.getSyncPoints(recording.id).then(sps => { syncPointsRef.current = sps; });
  }, [recording.id]);

  useEffect(() => {
    if (!recording?.youtubeId) return;
    setState('loading');
    const elId = `cmp-yt-${label.toLowerCase().replace(/\s/g, '-')}-${recording.id}`;
    let cancelled = false;

    (async () => {
      const ctrl = await createYouTubePlayer(elId, recording.youtubeId, {
        onStateChange: (e) => {
          if (e.data === YT_STATE.PLAYING) {
            intervalRef.current = setInterval(() => {
              const t = ctrl?.getCurrentTime?.() ?? 0;
              setCurrentTime(t);
              onTimeUpdate?.(t, label);
              const next = findActiveSyncPoint(t, syncPointsRef.current);
              if (hasSyncChanged(currentSyncRef.current, next)) {
                currentSyncRef.current = next;
                setSyncPoint(next);
              }
            }, 500);
          } else {
            clearInterval(intervalRef.current);
          }
        },
        onError: () => !cancelled && setState('error'),
      });
      if (cancelled) { ctrl?.destroy(); return; }
      playerRef.current = ctrl;
      setState(ctrl ? 'ready' : 'error');
    })();

    return () => {
      cancelled = true;
      clearInterval(intervalRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [recording?.id]);

  const elId = `cmp-yt-${label.toLowerCase().replace(/\s/g, '-')}-${recording.id}`;

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '1rem',
      border: '1px solid rgba(232,220,196,0.6)',
      overflow: 'hidden',
    }}>
      {/* Label badge */}
      <div style={{
        padding: '0.625rem 1rem',
        backgroundColor: accentColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: '"Public Sans", sans-serif',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#FFF8F0',
        }}>{label}</span>
        <span style={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'rgba(255,248,240,0.8)' }}>
          {formatTime(currentTime)}
        </span>
      </div>

      {/* Video */}
      <div style={{ position: 'relative', aspectRatio: '16/9', backgroundColor: '#1a0f0e' }}>
        {state === 'loading' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '2rem', height: '2rem', border: '3px solid rgba(192,133,82,0.3)', borderTopColor: '#C08552', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}
        {state === 'error' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF8F0', gap: '0.5rem', padding: '1rem', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#C08552' }}>videocam_off</span>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', margin: 0, opacity: 0.8 }}>Performance unavailable</p>
          </div>
        )}
        <div id={elId} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Recording info */}
      <div style={{ padding: '0.875rem 1rem' }}>
        <p style={{ margin: '0 0 0.125rem', fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '0.875rem', color: '#2C1B1A' }}>
          {recording.conductor || 'Solo'}
        </p>
        <p style={{ margin: '0 0 0.625rem', fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#6E544F' }}>
          {[recording.orchestra, recording.year].filter(Boolean).join(' · ')} — {recording.label}
        </p>
        {/* Sync info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          backgroundColor: syncPoint ? 'rgba(192,133,82,0.08)' : '#F5ECE1',
          borderRadius: '0.5rem',
        }}>
          {syncPoint ? (
            <>
              <span style={{ width: '0.375rem', height: '0.375rem', backgroundColor: '#C08552', borderRadius: '50%', flexShrink: 0 }} className="pulse-dot" />
              <span style={{ fontSize: '0.75rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, color: '#4B2E2B' }}>
                Measure {syncPoint.measure} · {formatTime(syncPoint.timestamp)}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: '#6E544F' }}>
              Start playback to sync…
            </span>
          )}
        </div>
        {/* Analyst notes */}
        {recording.notes && (
          <p style={{ margin: '0.625rem 0 0', fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#6E544F', lineHeight: 1.5 }}>
            {recording.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Comparison() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [piece, setPiece] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [recA, setRecA] = useState(null);
  const [recB, setRecB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('side-by-side'); // side-by-side | analysis

  useEffect(() => { load(); }, [id]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [p, recs] = await Promise.all([
        apiService.getPiece(id),
        apiService.getRecordingsForPiece(id),
      ]);
      setPiece(p);
      setRecordings(recs);
      setRecA(recs[0] || null);
      setRecB(recs[1] || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Loading comparison…" />;
  if (error) return (
    <div style={{ maxWidth: '40rem', margin: '4rem auto', padding: '0 1.5rem' }}>
      <ErrorState message={error} onRetry={load} />
    </div>
  );
  if (!piece) return null;

  return (
    <div style={{ backgroundColor: '#FFF8F0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '120rem', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Header ── */}
        <section style={{ paddingTop: '2rem', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Link to={`/piece/${id}`} style={{ fontSize: '0.8125rem', fontFamily: '"Inter", sans-serif', color: '#C08552', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>arrow_back</span>
              Back to Piece
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: '#C08552' }}>compare_arrows</span>
            <span style={{ fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C08552' }}>
              Performance Comparison
            </span>
          </div>
          <h1 style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 800, color: '#2C1B1A',
            letterSpacing: '-0.02em', margin: '0 0 0.375rem',
          }}>
            {piece.title}
          </h1>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9375rem', color: '#6E544F', margin: 0 }}>
            {piece.composer} · {piece.opus}
          </p>
        </section>

        {/* ── Recording Selectors ── */}
        {recordings.length >= 2 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            {[
              { label: 'Performance A', current: recA, accent: '#4B2E2B', setter: setRecA },
              { label: 'Performance B', current: recB, accent: '#8C5A3C', setter: setRecB },
            ].map(({ label, current, accent, setter }) => (
              <div key={label}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E544F' }}>{label}</p>
                <select
                  value={current?.id || ''}
                  onChange={e => setter(recordings.find(r => r.id === e.target.value) || null)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.875rem',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(216,199,181,0.8)',
                    borderRadius: '0.75rem',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.875rem',
                    color: '#2C1B1A',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {recordings.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.conductor || 'Solo'} ({r.year}) — {r.orchestra || r.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab bar ── */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'side-by-side', label: 'Side by Side', icon: 'splitscreen' },
            { id: 'analysis', label: 'Comparison Analysis', icon: 'analytics' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Public Sans", sans-serif',
                fontWeight: 600,
                fontSize: '0.875rem',
                backgroundColor: activeTab === tab.id ? '#4B2E2B' : 'rgba(232,220,196,0.5)',
                color: activeTab === tab.id ? '#FFF8F0' : '#6E544F',
                transition: 'all 0.15s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Side-by-side ── */}
        {activeTab === 'side-by-side' && (
          <div style={{ paddingBottom: '3rem' }}>
            {recordings.length < 2 ? (
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '1rem',
                border: '1px solid rgba(232,220,196,0.6)',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: '#6E544F',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#D8C7B5', display: 'block', marginBottom: '0.75rem' }}>compare_arrows</span>
                <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#2C1B1A', margin: '0 0 0.375rem' }}>
                  Only one recording available
                </p>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', margin: 0 }}>
                  Comparison requires at least two recordings. Check back later for additional performances of this piece.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem',
              }} className="compare-grid">
                <style>{`@media (max-width: 768px) { .compare-grid { grid-template-columns: 1fr !important; } }`}</style>
                {recA && <MiniPlayer recording={recA} label="Performance A" accentColor="#4B2E2B" />}
                {recB && <MiniPlayer recording={recB} label="Performance B" accentColor="#8C5A3C" />}
              </div>
            )}
          </div>
        )}

        {/* ── Analysis tab ── */}
        {activeTab === 'analysis' && (
          <div style={{ paddingBottom: '3rem' }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '1rem',
              border: '1px solid rgba(232,220,196,0.6)',
              padding: '1.5rem',
              marginBottom: '1.25rem',
            }}>
              <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#2C1B1A', margin: '0 0 1.25rem' }}>
                Interpretive Differences
              </h2>
              {recordings.length < 2 ? (
                <p style={{ fontFamily: '"Inter", sans-serif', color: '#6E544F', fontSize: '0.9rem' }}>
                  Select two recordings to see comparative analysis.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    {
                      label: 'Tempo Approach',
                      a: recA?.conductor === 'Herbert von Karajan' ? 'Sweeping, architectural' : 'Urgent, driven',
                      b: recB?.conductor === 'Leonard Bernstein' ? 'Expansive, theatrical' : 'Lean, precise',
                    },
                    {
                      label: 'Total Duration',
                      a: recA?.duration || '—',
                      b: recB?.duration || '—',
                    },
                    {
                      label: 'Recording Era',
                      a: recA ? `${recA.year}` : '—',
                      b: recB ? `${recB.year}` : '—',
                    },
                    {
                      label: 'Label',
                      a: recA?.label || '—',
                      b: recB?.label || '—',
                    },
                  ].map(({ label, a, b }) => (
                    <div key={label} style={{
                      padding: '1rem',
                      backgroundColor: '#F5ECE1',
                      borderRadius: '0.75rem',
                    }}>
                      <p style={{ margin: '0 0 0.75rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E544F' }}>{label}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div>
                          <p style={{ margin: '0 0 0.25rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 700, color: '#4B2E2B', textTransform: 'uppercase' }}>A</p>
                          <p style={{ margin: 0, fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#2C1B1A' }}>{a}</p>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 0.25rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 700, color: '#8C5A3C', textTransform: 'uppercase' }}>B</p>
                          <p style={{ margin: 0, fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#2C1B1A' }}>{b}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sync-point timeline comparison */}
            {recA && recB && (
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '1rem',
                border: '1px solid rgba(232,220,196,0.6)',
                padding: '1.5rem',
              }}>
                <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#2C1B1A', margin: '0 0 1.25rem' }}>
                  Sync Point Timeline
                </h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[
                    { rec: recA, label: 'A', color: '#4B2E2B' },
                    { rec: recB, label: 'B', color: '#8C5A3C' },
                  ].map(({ rec, label, color }) => (
                    <div key={label} style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 700, color, textTransform: 'uppercase' }}>
                        Performance {label} — {rec.conductor || 'Solo'}
                      </p>
                      {rec.syncPoints && rec.syncPoints.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                          {rec.syncPoints.map(sp => (
                            <div key={sp.id} style={{
                              display: 'flex', alignItems: 'center', gap: '0.75rem',
                              padding: '0.375rem 0.625rem',
                              backgroundColor: '#F5ECE1',
                              borderRadius: '0.5rem',
                            }}>
                              <span style={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 600, color, minWidth: '3rem' }}>
                                {formatTime(sp.timestamp)}
                              </span>
                              <span style={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: '#6E544F' }}>
                                → Measure {sp.measure}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#6E544F' }}>No sync points yet.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
