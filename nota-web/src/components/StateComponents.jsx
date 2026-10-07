// Shared utility components: Loading, Error, Empty states
// All styled with Nota design system

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      gap: '1rem',
      color: '#6E544F',
      fontFamily: '"Inter", sans-serif',
    }}>
      <div style={{
        width: '2.5rem',
        height: '2.5rem',
        border: '3px solid rgba(192,133,82,0.2)',
        borderTopColor: '#C08552',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ margin: 0, fontSize: '0.9375rem' }}>{message}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      gap: '1rem',
      textAlign: 'center',
    }}>
      <div style={{
        width: '3rem', height: '3rem',
        backgroundColor: 'rgba(186,26,26,0.08)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#BA1A1A',
      }}>
        <span className="material-symbols-outlined">error_outline</span>
      </div>
      <div>
        <p style={{
          margin: '0 0 0.5rem',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 600,
          color: '#2C1B1A',
          fontSize: '1rem',
        }}>Unable to load content</p>
        <p style={{
          margin: 0,
          fontFamily: '"Inter", sans-serif',
          color: '#6E544F',
          fontSize: '0.875rem',
        }}>{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.5rem 1.25rem',
            backgroundColor: '#4B2E2B',
            color: '#FFF8F0',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = 'library_music', title = 'Nothing here yet', message = '', action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      gap: '1rem',
      textAlign: 'center',
    }}>
      <div style={{
        width: '4rem', height: '4rem',
        backgroundColor: 'rgba(192,133,82,0.1)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#C08552',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>{icon}</span>
      </div>
      <div>
        <p style={{
          margin: '0 0 0.375rem',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          color: '#2C1B1A',
          fontSize: '1.125rem',
        }}>{title}</p>
        {message && (
          <p style={{
            margin: 0,
            fontFamily: '"Inter", sans-serif',
            color: '#6E544F',
            fontSize: '0.875rem',
            maxWidth: '28rem',
          }}>{message}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: '#4B2E2B',
            color: '#FFF8F0',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Skeleton card loader
export function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '1.25rem',
      overflow: 'hidden',
      border: '1px solid rgba(232,220,196,0.6)',
      animation: 'shimmer 1.5s infinite',
    }}>
      <style>{`
        @keyframes shimmer {
          0%   { opacity: 1; }
          50%  { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
      <div style={{ height: '180px', backgroundColor: '#F5ECE1' }} />
      <div style={{ padding: '1rem 1.125rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ height: '0.75rem', width: '60%', backgroundColor: '#F5ECE1', borderRadius: '4px' }} />
        <div style={{ height: '1rem', width: '85%', backgroundColor: '#F5ECE1', borderRadius: '4px' }} />
        <div style={{ height: '0.75rem', width: '40%', backgroundColor: '#F5ECE1', borderRadius: '4px' }} />
      </div>
    </div>
  );
}
