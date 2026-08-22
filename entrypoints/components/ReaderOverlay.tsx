import React from 'react';

interface ReaderOverlayProps {
  onClose: () => void;
}

export const ReaderOverlay: React.FC<ReaderOverlayProps> = ({ onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        zIndex: 2147483647, // Highest possible z-index to stay on top
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          padding: '2rem',
          background: '#1e293b',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#38bdf8' }}>
          ✨ Magic UI Reader Mode
        </h1>
        <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          This content is isolated safely inside the Shadow DOM. Website styles cannot touch this!
        </p>
        <button
          onClick={onClose}
          style={{
            background: '#38bdf8',
            color: '#0f172a',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Close Reader
        </button>
      </div>
    </div>
  );
};