// AnalystEditor — Sync-Point Editor for content creators
// YouTube player + sync point list + create/edit/delete + annotation editing
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { createYouTubePlayer, YT_STATE } from '../services/youtubeService';
import { formatTime } from '../services/syncService';
import { LoadingState, ErrorState } from '../components/StateComponents';

const DEMO_NOTE = 'You are in Demo Mode. Changes are stored locally and not persisted.';

function SyncPointRow({ sp, isEditing, onEdit, onDelete, onSave, onCancel }) {
  const [measure, setMeasure] = useState(sp.measure);
  const [note, setNote] = useState(sp.note || '');

  if (isEditing) {
    return (
      <div style={{
        padding: '0.875rem',
        backgroundColor: 'rgba(192,133,82,0.06)',
        borderRadius: '0.75rem',
        border: '1px solid rgba(192,133,82,0.3)',
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, color: '#6E544F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Timestamp</label>
            <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#F5ECE1', borderRadius: '0.5rem', fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#4B2E2B', fontWeight: 600 }}>
              {formatTime(sp.timestamp)}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, color: '#6E544F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Measure</label>
            <input
              type="number"
              min={1}
              value={measure}
              onChange={e => setMeasure(Number(e.target.value))}
              style={{
                width: '5rem',
                padding: '0.5rem 0.75rem',
                border: '1px solid rgba(216,199,181,0.8)',
                borderRadius: '0.5rem',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.875rem',
                color: '#2C1B1A',
                outline: 'none',
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, color: '#6E544F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Theme A returns in the recapitulation"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.5rem 0.75rem',
              border: '1px solid rgba(216,199,181,0.8)',
              borderRadius: '0.5rem',
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.875rem',
              color: '#2C1B1A',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onSave({ ...sp, measure, measureId: measure, note })}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: '#4B2E2B',
              color: '#FFF8F0',
              cursor: 'pointer',
              fontFamily: '"Public Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >Save</button>
          <button
            onClick={onCancel}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              border: '1px solid rgba(216,199,181,0.8)',
              backgroundColor: '#fff',
              color: '#6E544F',
              cursor: 'pointer',
              fontFamily: '"Public Sans", sans-serif',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          >Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.625rem 0.75rem',
      borderRadius: '0.75rem',
      border: '1px solid rgba(232,220,196,0.5)',
      backgroundColor: '#fff',
      transition: 'background-color 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5ECE1'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
    >
      <div style={{
        minWidth: '4rem',
        padding: '0.25rem 0.5rem',
        backgroundColor: 'rgba(75,46,43,0.08)',
        borderRadius: '0.375rem',
        textAlign: 'center',
        fontFamily: '"Inter", sans-serif',
        fontWeight: 700,
        fontSize: '0.8125rem',
        color: '#4B2E2B',
      }}>
        {formatTime(sp.timestamp)}
      </div>
      <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: '#D8C7B5' }}>arrow_forward</span>
      <div style={{ flex: 1 }}>
        <span style={{ fontFamily: '"Public Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#2C1B1A' }}>
          Measure {sp.measure}
        </span>
        {sp.note && (
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#6E544F', marginLeft: '0.5rem' }}>
            — {sp.note}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        <button
          onClick={() => onEdit(sp.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6E544F', padding: '0.25rem', borderRadius: '0.375rem' }}
          title="Edit"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit</span>
        </button>
        <button
          onClick={() => onDelete(sp.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#BA1A1A', padding: '0.25rem', borderRadius: '0.375rem' }}
          title="Delete"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete</span>
        </button>
      </div>
    </div>
  );
}

export default function AnalystEditor() {
  const { id } = useParams();

  const [piece, setPiece] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [activeRecording, setActiveRecording] = useState(null);
  const [syncPoints, setSyncPoints] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerState, setPlayerState] = useState('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const nextSpId = useRef(100);

  useEffect(() => { load(); }, [id]);
  useEffect(() => {
    if (activeRecording) {
      setSyncPoints([...(activeRecording.syncPoints || []).map(sp => ({ ...sp }))]);
      initPlayer();
    }
  }, [activeRecording?.id]);

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
      setActiveRecording(recs[0] || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function initPlayer() {
    if (!activeRecording?.youtubeId) return;
    setPlayerState('loading');
    const elId = `analyst-yt-${activeRecording.id}`;
    let cancelled = false;

    playerRef.current?.destroy();
    playerRef.current = null;
    clearInterval(intervalRef.current);

    const ctrl = await createYouTubePlayer(elId, activeRecording.youtubeId, {
      onStateChange: (e) => {
        const playing = e.data === YT_STATE.PLAYING;
        setIsPlaying(playing);
        if (playing) {
          intervalRef.current = setInterval(() => {
            const t = ctrl?.getCurrentTime?.() ?? 0;
            setCurrentTime(t);
          }, 250);
        } else {
          clearInterval(intervalRef.current);
        }
      },
      onError: () => !cancelled && setPlayerState('error'),
    });

    if (cancelled) { ctrl?.destroy(); return; }
    playerRef.current = ctrl;
    setPlayerState(ctrl ? 'ready' : 'error');
  }

  function captureSync() {
    const t = currentTime;
    const newSp = {
      id: `sp-new-${nextSpId.current++}`,
      timestamp: Math.round(t),
      measureId: syncPoints.length + 1,
      measure: syncPoints.length + 1,
      note: '',
    };
    setSyncPoints(prev => [...prev, newSp].sort((a, b) => a.timestamp - b.timestamp));
    setEditingId(newSp.id);
  }

  function handleSave(updated) {
    setSyncPoints(prev => prev.map(sp => sp.id === updated.id ? updated : sp));
    setEditingId(null);
    setSaveMsg('Sync point updated.');
    setTimeout(() => setSaveMsg(''), 2500);
  }

  function handleDelete(spId) {
    setSyncPoints(prev => prev.filter(sp => sp.id !== spId));
  }

  function handleSaveAll() {
    setSaveMsg('All changes saved (demo mode — not persisted to backend).');
    setTimeout(() => setSaveMsg(''), 3000);
  }

  if (loading) return <LoadingState message="Loading analyst editor…" />;
  if (error) return (
    <div style={{ maxWidth: '40rem', margin: '4rem auto', padding: '0 1.5rem' }}>
      <ErrorState message={error} onRetry={load} />
    </div>
  );
  if (!piece) return null;

  const elId = activeRecording ? `analyst-yt-${activeRecording.id}` : '';

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

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: '#C08552' }}>edit_note</span>
                <span style={{ fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C08552' }}>
                  Analyst Sync-Point Editor
                </span>
              </div>
              <h1 style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 800, color: '#2C1B1A',
                letterSpacing: '-0.02em', margin: '0 0 0.25rem',
              }}>
                {piece.title}
              </h1>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#6E544F', margin: 0 }}>
                {piece.composer} · {piece.opus}
              </p>
            </div>

            <button
              onClick={handleSaveAll}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.625rem 1.25rem',
                borderRadius: '9999px',
                backgroundColor: '#C08552',
                color: '#FFF8F0',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Public Sans", sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>save</span>
              Save All Changes
            </button>
          </div>

          {/* Demo mode notice */}
          <div style={{
            marginTop: '1rem',
            padding: '0.625rem 0.875rem',
            backgroundColor: 'rgba(192,133,82,0.08)',
            borderRadius: '0.625rem',
            border: '1px solid rgba(192,133,82,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#C08552' }}>info</span>
            <span style={{ fontSize: '0.8125rem', fontFamily: '"Inter", sans-serif', color: '#6E544F' }}>{DEMO_NOTE}</span>
          </div>

          {saveMsg && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'rgba(34,139,34,0.08)',
              borderRadius: '0.625rem',
              border: '1px solid rgba(34,139,34,0.2)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#228B22' }}>check_circle</span>
              <span style={{ fontSize: '0.8125rem', fontFamily: '"Inter", sans-serif', color: '#1A5C1A' }}>{saveMsg}</span>
            </div>
          )}
        </section>

        {/* ── Recording selector ── */}
        {recordings.length > 1 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E544F' }}>Recording</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {recordings.map(rec => (
                <button
                  key={rec.id}
                  onClick={() => setActiveRecording(rec)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid',
                    borderColor: activeRecording?.id === rec.id ? '#4B2E2B' : 'rgba(216,199,181,0.8)',
                    backgroundColor: activeRecording?.id === rec.id ? '#4B2E2B' : '#fff',
                    color: activeRecording?.id === rec.id ? '#FFF8F0' : '#4B2E2B',
                    cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}
                >
                  {rec.conductor || 'Solo'} ({rec.year})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Main editor layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '1.5rem',
          paddingBottom: '3rem',
          alignItems: 'start',
        }} className="analyst-grid">
          <style>{`@media (max-width: 900px) { .analyst-grid { grid-template-columns: 1fr !important; } }`}</style>

          {/* Left: Video + capture */}
          <div>
            {/* Video */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '1rem',
              border: '1px solid rgba(232,220,196,0.6)',
              overflow: 'hidden',
              marginBottom: '1.25rem',
            }}>
              <div style={{ position: 'relative', aspectRatio: '16/9', backgroundColor: '#1a0f0e' }}>
                {playerState === 'loading' && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem', color: '#FFF8F0' }}>
                    <div style={{ width: '2rem', height: '2rem', border: '3px solid rgba(192,133,82,0.3)', borderTopColor: '#C08552', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Loading…</span>
                  </div>
                )}
                {playerState === 'error' && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#FFF8F0', textAlign: 'center', padding: '1rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#C08552' }}>videocam_off</span>
                    <p style={{ margin: 0, fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', opacity: 0.8 }}>Performance unavailable</p>
                  </div>
                )}
                {elId && <div id={elId} style={{ width: '100%', height: '100%' }} />}
              </div>

              {/* Current time display */}
              <div style={{
                padding: '0.875rem 1rem',
                borderTop: '1px solid rgba(232,220,196,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.125rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', color: '#6E544F' }}>Current Time</p>
                    <p style={{ margin: 0, fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#2C1B1A' }}>
                      {formatTime(currentTime)}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.125rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', color: '#6E544F' }}>Sync Points</p>
                    <p style={{ margin: 0, fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#C08552' }}>{syncPoints.length}</p>
                  </div>
                </div>

                {/* Capture button */}
                <button
                  onClick={captureSync}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '9999px',
                    backgroundColor: '#C08552',
                    color: '#FFF8F0',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: '"Public Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    boxShadow: '0 4px 16px rgba(192,133,82,0.3)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A66E3E'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C08552'}
                  title="Press to capture the current playback time as a sync point"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>fiber_manual_record</span>
                  Capture Sync Point
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '1rem',
              border: '1px solid rgba(232,220,196,0.6)',
              padding: '1.25rem',
            }}>
              <p style={{ margin: '0 0 0.875rem', fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#2C1B1A' }}>
                How to use this tool
              </p>
              <ol style={{ margin: 0, padding: '0 0 0 1.25rem', fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#6E544F', lineHeight: 1.8 }}>
                <li>Play the recording in the player above.</li>
                <li>When a structurally significant moment occurs, press <strong>Capture Sync Point</strong>.</li>
                <li>The current timestamp will be recorded. Enter the corresponding measure number and an optional note.</li>
                <li>Repeat for all key moments in the piece.</li>
                <li>Press <strong>Save All Changes</strong> when finished.</li>
              </ol>
            </div>
          </div>

          {/* Right: Sync point list */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '1rem',
            border: '1px solid rgba(232,220,196,0.6)',
            padding: '1.25rem',
            position: 'sticky',
            top: '6rem',
            maxHeight: 'calc(100vh - 8rem)',
            overflowY: 'auto',
          }} className="custom-scrollbar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#2C1B1A' }}>
                Sync Points
              </span>
              <span style={{
                padding: '0.2rem 0.625rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(192,133,82,0.1)',
                color: '#8C5A3C',
                fontSize: '0.75rem',
                fontFamily: '"Public Sans", sans-serif',
                fontWeight: 600,
              }}>{syncPoints.length}</span>
            </div>

            {syncPoints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#6E544F' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#D8C7B5', display: 'block', marginBottom: '0.625rem' }}>timer</span>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', margin: 0 }}>
                  No sync points yet. Play the recording and capture the first sync point.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {syncPoints.map(sp => (
                  <SyncPointRow
                    key={sp.id}
                    sp={sp}
                    isEditing={editingId === sp.id}
                    onEdit={spId => setEditingId(spId)}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    onCancel={() => setEditingId(null)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
