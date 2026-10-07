// PieceCard — faithful reproduction of Stitch card design
// Cream background, 20px radius, subtle shadow, bookmark toggle
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { apiService } from '../services/apiService';

const eraColors = {
  Baroque:   { bg: 'rgba(192,133,82,0.12)',  text: '#8C5A3C' },
  Classical: { bg: 'rgba(75,46,43,0.1)',     text: '#4B2E2B' },
  Romantic:  { bg: 'rgba(140,90,60,0.12)',   text: '#5A3020' },
  Modern:    { bg: 'rgba(107,71,58,0.12)',   text: '#4B3530' },
};

export default function PieceCard({ piece, onSaveToggle }) {
  const [saved, setSaved] = useState(piece.saved);
  const [saving, setSaving] = useState(false);
  const era = eraColors[piece.era] || eraColors.Romantic;

  async function handleBookmark(e) {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    try {
      if (saved) {
        await apiService.unsavePiece(piece.id);
        setSaved(false);
      } else {
        await apiService.savePiece(piece.id);
        setSaved(true);
      }
      onSaveToggle?.(piece.id, !saved);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  return (
    <Link to={`/piece/${piece.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        border: '1px solid rgba(232,220,196,0.6)',
        boxShadow: '0 2px 12px rgba(75,46,43,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(75,46,43,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(75,46,43,0.06)';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
          <img
            src={piece.cardImageUrl || piece.imageUrl}
            alt={piece.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => {
              e.target.src = `https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80`;
            }}
          />
          {/* Era badge overlay */}
          <span style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            fontSize: '0.6875rem',
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            backgroundColor: era.bg,
            color: era.text,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${era.bg}`,
          }}>
            {piece.era}
          </span>
          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            style={{
              position: 'absolute',
              top: '0.625rem',
              right: '0.625rem',
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: saved ? '#4B2E2B' : 'rgba(255,248,240,0.9)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}
            aria-label={saved ? 'Remove from library' : 'Save to library'}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '1rem',
                color: saved ? '#FFF8F0' : '#4B2E2B',
                fontVariationSettings: saved ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400",
              }}
            >bookmark</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1rem 1.125rem 1.125rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            <p style={{
              fontSize: '0.75rem',
              fontFamily: '"Public Sans", sans-serif',
              fontWeight: 500,
              color: '#C08552',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 0.25rem',
            }}>
              {piece.composerShort} · {piece.opus}
            </p>
            <h3 style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#2C1B1A',
              margin: 0,
              lineHeight: 1.3,
            }}>
              {piece.title}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.6875rem',
              fontFamily: '"Public Sans", sans-serif',
              fontWeight: 500,
              backgroundColor: 'rgba(192,133,82,0.1)',
              color: '#8C5A3C',
              border: '1px solid rgba(192,133,82,0.2)',
            }}>{piece.genre}</span>
            <span style={{
              fontSize: '0.75rem',
              color: '#6E544F',
              fontFamily: '"Inter", sans-serif',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', verticalAlign: 'middle' }}>schedule</span>
              {' '}{piece.duration}
            </span>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: 'auto' }}>
            {piece.tags.slice(0, 2).map(tag => (
              <span key={tag} style={{
                fontSize: '0.6875rem',
                fontFamily: '"Public Sans", sans-serif',
                color: '#6E544F',
                backgroundColor: 'rgba(245,236,225,0.8)',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                border: '1px solid rgba(216,199,181,0.5)',
              }}>{tag}</span>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: '#C08552',
            fontSize: '0.8125rem',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 600,
            marginTop: '0.5rem',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>play_circle</span>
            Listen & Explore
          </div>
        </div>
      </div>
    </Link>
  );
}
