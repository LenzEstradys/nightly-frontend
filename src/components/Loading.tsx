export function Loading({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.96)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        textAlign: 'center',
        padding: '24px 32px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(251,191,36,0.15)',
        maxWidth: '260px',
        width: '100%',
      }}>
        <img
          src="/logo.png"
          alt="LaMovida"
          style={{ width: '64px', height: '64px', borderRadius: '14px', marginBottom: '12px', display: 'block', margin: '0 auto 12px' }}
        />
        <p style={{
          color: '#ffffff',
          fontSize: '1.25rem',
          fontWeight: '800',
          margin: '0 0 4px',
          letterSpacing: '-0.01em',
        }}>
          LaMovida
        </p>
        <p style={{
          color: '#94a3b8',
          fontSize: '0.8rem',
          margin: '0 0 16px',
        }}>
          Bares · Clubs · Pubs
        </p>
        <div style={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'center',
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#a855f7',
                animation: `nlPulse 1.5s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes nlPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
