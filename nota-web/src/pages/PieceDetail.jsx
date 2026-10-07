// PieceDetail — Interactive Listening Experience
// Three-panel layout: Performance | Score | Explanation
// YouTube + SyncPoints + Measure Highlighting + Multi-level Annotations
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { createYouTubePlayer, YT_STATE } from '../services/youtubeService';
import { findActiveSyncPoint, formatTime, hasSyncChanged } from '../services/syncService';
import { LoadingState, ErrorState } from '../components/StateComponents';

const LEVELS = ['Beginner', 'Intermediate', 'Expert'];

// ── Inline Score renderer (Verovio fallback: visual pseudo-score) ──────────
function ScorePanel({ syncPoint, piece }) {
  const measures = Array.from({ length: 20 }, (_, i) => i + 1);
  const activeMeasure = syncPoint?.measure || null;

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '1rem',
      border: '1px solid rgba(232,220,196,0.6)',
      padding: '1.25rem',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#2C1B1A' }}>
          Interactive Score
        </span>
        {activeMeasure && (
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(192,133,82,0.1)',
            color: '#8C5A3C',
            fontSize: '0.75rem',
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
          }}>
            Measure {activeMeasure}
          </span>
        )}
      </div>

      {/* Pseudo score stave grid */}
      <div style={{ overflowX: 'auto' }} className="custom-scrollbar">
        <div style={{ minWidth: '480px' }}>
          {/* Staff lines */}
          {[0, 1, 2].map(row => (
            <div key={row} style={{ marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', height: '3.5rem', marginBottom: '0.25rem' }}>
                {/* 5 staff lines */}
                {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    height: '1px',
                    backgroundColor: 'rgba(44,27,26,0.25)',
                    top: `${l * 25}%`,
                  }} />
                ))}
                {/* Measure boxes */}
                <div style={{ display: 'flex', height: '100%', gap: '2px' }}>
                  {measures.slice(row * 6, row * 6 + 7).map(m => {
                    const isActive = m === activeMeasure;
                    return (
                      <div key={m} style={{
                        flex: 1,
                        height: '100%',
                        borderLeft: '1px solid rgba(44,27,26,0.3)',
                        backgroundColor: isActive ? 'rgba(192,133,82,0.18)' : 'transparent',
                        outline: isActive ? '2px solid rgba(192,133,82,0.6)' : 'none',
                        borderRadius: isActive ? '4px' : 0,
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: '2px',
                        cursor: 'pointer',
                      }}>
                        <span style={{
                          fontSize: '0.5rem',
                          fontFamily: '"Inter", sans-serif',
                          color: isActive ? '#8C5A3C' : 'rgba(110,84,79,0.5)',
                          fontWeight: isActive ? 700 : 400,
                        }}>{m}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score info note */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.625rem 0.875rem',
        backgroundColor: '#F5ECE1',
        borderRadius: '0.625rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: '#C08552' }}>info</span>
        <span style={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: '#6E544F' }}>
          Full MusicXML score available when Verovio is connected. Measures sync automatically with playback.
        </span>
      </div>
    </div>
  );
}

// ── YouTube Player Panel ────────────────────────────────────────────────────
function PlayerPanel({ recording, onTimeUpdate, onPlayerReady }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const [playerState, setPlayerState] = useState('idle'); // idle|loading|ready|error
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!recording?.youtubeId) return;
    setPlayerState('loading');
    const elId = `yt-player-${recording.id}`;

    let cancelled = false;
    (async () => {
      const ctrl = await createYouTubePlayer(elId, recording.youtubeId, {
        onStateChange: (e) => {
          const playing = e.data === YT_STATE.PLAYING;
          setIsPlaying(playing);
          if (playing) {
            intervalRef.current = setInterval(() => {
              const t = ctrl?.getCurrentTime?.() ?? 0;
              setCurrentTime(t);
              onTimeUpdate?.(t);
            }, 500);
          } else {
            clearInterval(intervalRef.current);
          }
        },
        onError: () => !cancelled && setPlayerState('error'),
      });
      if (cancelled) { ctrl?.destroy(); return; }
      playerRef.current = ctrl;
      setPlayerState(ctrl ? 'ready' : 'error');
      if (ctrl) onPlayerReady?.(ctrl);
    })();

    return () => {
      cancelled = true;
      clearInterval(intervalRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [recording?.id, recording?.youtubeId]);

  if (!recording) return null;

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '1rem',
      border: '1px solid rgba(232,220,196,0.6)',
      overflow: 'hidden',
    }}>
      {/* Video container */}
      <div style={{ position: 'relative', aspectRatio: '16/9', backgroundColor: '#1a0f0e' }}>
        {playerState === 'loading' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            color: '#FFF8F0',
          }}>
            <div style={{
              width: '2.5rem', height: '2.5rem',
              border: '3px solid rgba(192,133,82,0.3)',
              borderTopColor: '#C08552',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span style={{ fontSize: '0.875rem', fontFamily: '"Inter", sans-serif', opacity: 0.7 }}>Loading performance…</span>
          </div>
        )}
        {playerState === 'error' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '1rem',
            color: '#FFF8F0', padding: '1.5rem', textAlign: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#C08552' }}>videocam_off</span>
            <div>
              <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1rem', margin: '0 0 0.375rem' }}>
                Performance Unavailable
              </p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', opacity: 0.7, margin: 0 }}>
                The performance video could not be loaded. You can still access the score and annotations below.
              </p>
            </div>
          </div>
        )}
        <div
          id={`yt-player-${recording.id}`}
          ref={containerRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Metadata bar */}
      <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid rgba(232,220,196,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: '0 0 0.125rem',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700, fontSize: '0.9375rem',
              color: '#2C1B1A',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {recording.conductor ? `${recording.conductor}` : recording.title}
            </p>
            <p style={{
              margin: 0, fontFamily: '"Inter", sans-serif',
              fontSize: '0.8125rem', color: '#6E544F',
            }}>
              {[recording.orchestra, recording.year, recording.hall].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
            <span style={{
              width: '0.5rem', height: '0.5rem',
              backgroundColor: '#C08552', borderRadius: '50%',
            }} className="pulse-dot" />
            <span style={{ fontSize: '0.75rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, color: '#4B2E2B' }}>
              {formatTime(currentTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Explanation Panel ───────────────────────────────────────────────────────
function ExplanationPanel({ syncPoint, annotation, level, onLevelChange, piece }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '1rem',
      border: '1px solid rgba(232,220,196,0.6)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      height: '100%',
    }}>
      {/* Sync status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.875rem',
        borderBottom: '1px solid rgba(232,220,196,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {syncPoint ? (
            <>
              <span style={{
                width: '0.5rem', height: '0.5rem',
                backgroundColor: '#C08552',
                borderRadius: '50%',
              }} className="pulse-dot" />
              <span style={{ fontSize: '0.75rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, color: '#4B2E2B' }}>
                Synced
              </span>
            </>
          ) : (
            <>
              <span style={{
                width: '0.5rem', height: '0.5rem',
                backgroundColor: '#D8C7B5',
                borderRadius: '50%',
              }} />
              <span style={{ fontSize: '0.75rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 500, color: '#6E544F' }}>
                Waiting for sync
              </span>
            </>
          )}
        </div>
        {syncPoint && (
          <span style={{
            fontSize: '0.75rem',
            fontFamily: '"Inter", sans-serif',
            color: '#6E544F',
          }}>
            Measure {syncPoint.measure} · {formatTime(syncPoint.timestamp)}
          </span>
        )}
      </div>

      {/* Level selector */}
      <div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E544F' }}>
          Analysis Level
        </p>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => onLevelChange(l.toLowerCase())}
              style={{
                flex: 1,
                padding: '0.375rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontFamily: '"Public Sans", sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: level === l.toLowerCase() ? '#4B2E2B' : 'rgba(232,220,196,0.4)',
                color: level === l.toLowerCase() ? '#FFF8F0' : '#6E544F',
                transition: 'all 0.15s',
              }}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* Annotation text */}
      <div style={{ flex: 1 }}>
        {annotation ? (
          <div style={{
            padding: '1rem',
            backgroundColor: '#F5ECE1',
            borderRadius: '0.75rem',
            border: '1px solid rgba(232,220,196,0.5)',
          }}>
            <p style={{
              margin: 0,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.9rem',
              color: '#2C1B1A',
              lineHeight: 1.75,
            }}>
              {annotation}
            </p>
          </div>
        ) : (
          <div style={{
            padding: '2rem 1rem',
            textAlign: 'center',
            color: '#6E544F',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: '#D8C7B5', display: 'block', marginBottom: '0.5rem' }}>
              music_note
            </span>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', margin: 0 }}>
              {syncPoint
                ? 'No annotation available for this measure.'
                : 'Start playback to see synchronized musical explanations here.'}
            </p>
          </div>
        )}
      </div>

      {/* Piece description */}
      {piece && (
        <div style={{
          paddingTop: '0.875rem',
          borderTop: '1px solid rgba(232,220,196,0.5)',
        }}>
          <p style={{ margin: '0 0 0.375rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6E544F' }}>
            About this piece
          </p>
          <p style={{ margin: 0, fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#6E544F', lineHeight: 1.6 }}>
            {piece.description}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main PieceDetail Page ───────────────────────────────────────────────────
export default function PieceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [piece, setPiece] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [activeRecording, setActiveRecording] = useState(null);
  const [syncPoints, setSyncPoints] = useState([]);
  const [syncPoint, setSyncPoint] = useState(null);
  const [annotation, setAnnotation] = useState(null);
  const [level, setLevel] = useState('beginner');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const currentSyncRef = useRef(null);

  useEffect(() => { loadPiece(); }, [id]);
  useEffect(() => {
    if (activeRecording) loadSyncPoints(activeRecording.id);
  }, [activeRecording?.id]);
  useEffect(() => {
    if (syncPoint?.measureId) loadAnnotation(syncPoint.measureId, level);
  }, [syncPoint?.measureId, level]);

  async function loadPiece() {
    try {
      setLoading(true);
      setError(null);
      const [p, recs] = await Promise.all([
        apiService.getPiece(id),
        apiService.getRecordingsForPiece(id),
      ]);
      setPiece(p);
      setSaved(p.saved);
      setRecordings(recs);
      setActiveRecording(recs[0] || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadSyncPoints(recordingId) {
    const sps = await apiService.getSyncPoints(recordingId);
    setSyncPoints(sps);
  }

  async function loadAnnotation(measureId, lvl) {
    const ann = await apiService.getAnnotation(measureId, lvl);
    setAnnotation(ann);
  }

  const handleTimeUpdate = useCallback((t) => {
    const next = findActiveSyncPoint(t, syncPoints);
    if (hasSyncChanged(currentSyncRef.current, next)) {
      currentSyncRef.current = next;
      setSyncPoint(next);
    }
  }, [syncPoints]);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      if (saved) {
        await apiService.unsavePiece(id);
        setSaved(false);
      } else {
        await apiService.savePiece(id);
        setSaved(true);
      }
    } catch {
      /* silently fail */
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState message="Loading piece…" />;
  if (error) return (
    <div style={{ maxWidth: '40rem', margin: '4rem auto', padding: '0 1.5rem' }}>
      <ErrorState message={error} onRetry={loadPiece} />
    </div>
  );
  if (!piece) return null;

  return (
    <div style={{ backgroundColor: '#FFF8F0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '120rem', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Breadcrumb + Header ── */}
        <div style={{ paddingTop: '2rem', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Link to="/" style={{ fontSize: '0.8125rem', fontFamily: '"Inter", sans-serif', color: '#6E544F', textDecoration: 'none' }}>Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: '#D8C7B5' }}>chevron_right</span>
            <Link to="/explore" style={{ fontSize: '0.8125rem', fontFamily: '"Inter", sans-serif', color: '#6E544F', textDecoration: 'none' }}>Explore</Link>
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: '#D8C7B5' }}>chevron_right</span>
            <span style={{ fontSize: '0.8125rem', fontFamily: '"Inter", sans-serif', color: '#4B2E2B', fontWeight: 500 }}>{piece.composerShort}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.6875rem', fontFamily: '"Public Sans", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C08552' }}>
                {piece.composerShort} · {piece.opus}
              </p>
              <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#2C1B1A', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                {piece.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
                {[
                  { icon: 'piano', text: piece.genre },
                  { icon: 'schedule', text: piece.duration },
                  { icon: 'music_note', text: `${piece.movements} movements` },
                  { icon: 'school', text: piece.difficulty },
                ].map(({ icon, text }) => (
                  <span key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontFamily: '"Inter", sans-serif', color: '#6E544F' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>{icon}</span>
                    {text}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0, flexWrap: 'wrap' }}>
              <button
                onClick={handleSave}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(216,199,181,0.8)',
                  backgroundColor: saved ? '#4B2E2B' : '#fff',
                  color: saved ? '#FFF8F0' : '#4B2E2B',
                  cursor: 'pointer',
                  fontFamily: '"Public Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  transition: 'all 0.2s',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                {saved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={() => navigate(`/compare/${id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(216,199,181,0.8)',
                  backgroundColor: '#fff',
                  color: '#4B2E2B',
                  cursor: 'pointer',
                  fontFamily: '"Public Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>compare_arrows</span>
                Compare
              </button>
              <button
                onClick={() => navigate(`/analyst/${id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(216,199,181,0.8)',
                  backgroundColor: '#fff',
                  color: '#4B2E2B',
                  cursor: 'pointer',
                  fontFamily: '"Public Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit_note</span>
                Analyst
              </button>
            </div>
          </div>
        </div>

        {/* ── Recording Selector ── */}
        {recordings.length > 1 && (
          <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }} className="no-scrollbar">
            <div style={{ display: 'flex', gap: '0.625rem', paddingBottom: '0.25rem' }}>
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
                    fontWeight: activeRecording?.id === rec.id ? 600 : 400,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ display: 'block', fontWeight: 600 }}>{rec.conductor || rec.title.split('—')[1]?.trim()}</span>
                  <span style={{ display: 'block', fontSize: '0.6875rem', opacity: 0.75 }}>{rec.year} · {rec.orchestra || 'Solo'}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Three-Panel Layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1.4fr) minmax(0,1fr)',
          gap: '1.25rem',
          paddingBottom: '3rem',
          alignItems: 'start',
        }} className="piece-detail-grid">
          <style>{`
            @media (max-width: 1024px) {
              .piece-detail-grid { grid-template-columns: 1fr 1fr !important; }
            }
            @media (max-width: 640px) {
              .piece-detail-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          {/* Panel 1: Performance */}
          <div>
            {activeRecording ? (
              <PlayerPanel
                recording={activeRecording}
                onTimeUpdate={handleTimeUpdate}
              />
            ) : (
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '1rem',
                border: '1px solid rgba(232,220,196,0.6)',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#6E544F',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#D8C7B5', display: 'block', marginBottom: '0.75rem' }}>videocam_off</span>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', margin: 0 }}>No recordings available for this piece.</p>
              </div>
            )}
          </div>

          {/* Panel 2: Score */}
          <div>
            <ScorePanel syncPoint={syncPoint} piece={piece} />
          </div>

          {/* Panel 3: Explanation */}
          <div style={{ position: 'sticky', top: '6rem' }}>
            <ExplanationPanel
              syncPoint={syncPoint}
              annotation={annotation}
              level={level}
              onLevelChange={setLevel}
              piece={piece}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
