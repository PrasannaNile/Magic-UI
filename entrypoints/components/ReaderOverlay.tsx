import React from 'react';
import type  {RedesignResponse}  from '../../src/types/types';

interface ReaderOverlayProps {
  data: RedesignResponse | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export const ReaderOverlay: React.FC<ReaderOverlayProps> = ({
  data,
  loading,
  error,
  onClose,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 2147483647,
        overflowY: 'auto',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
        padding: '3rem 1rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '740px',
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          position: 'relative',
          height: 'fit-content',
        }}
      >
        {/* Top Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.05em' }}>
            ✨ MAGIC UI READER
          </span>
          <button
            onClick={onClose}
            style={{
              background: '#334155',
              color: '#f8fafc',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem 0.9rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Esc / Close ✕
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🪄</div>
            <h3 style={{ margin: 0, color: '#94a3b8' }}>Redesigning page with Gemini...</h3>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ background: '#451a1a', border: '1px solid #dc2626', padding: '1rem', borderRadius: '8px', color: '#fca5a5' }}>
            <p style={{ margin: 0 }}><strong>Error:</strong> {error}</p>
          </div>
        )}

        {/* Parsed & Redesigned Content */}
        {data && !loading && (
          <div>
            <h1 style={{ fontSize: '2rem', lineHeight: '1.25', margin: '0 0 0.5rem 0', color: '#ffffff' }}>
              {data.title}
            </h1>
            
            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              {data.byline ? `${data.byline} • ` : ''}⏱️ {data.estimated_read_time} min read
            </div>

            {/* TL;DR Callout */}
            <div style={{ background: '#0f172a', borderLeft: '4px solid #38bdf8', padding: '1rem 1.25rem', borderRadius: '0 8px 8px 0', marginBottom: '1.5rem' }}>
              <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.25rem' }}>TL;DR</strong>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.5' }}>{data.tldr}</p>
            </div>

            {/* Key Takeaways */}
            {data.key_points?.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#e2e8f0', marginBottom: '0.75rem' }}>Key Takeaways</h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  {data.key_points.map((point, i) => (
                    <li key={i} style={{ marginBottom: '0.4rem' }}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            <hr style={{ borderColor: '#334155', margin: '2rem 0' }} />

            {/* Main Content Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {data.sections.map((block, idx) => {
                if (block.block_type === 'heading') {
                  return (
                    <h2 key={idx} style={{ fontSize: '1.4rem', color: '#f1f5f9', marginTop: '1rem', marginBottom: '0.25rem' }}>
                      {block.text}
                    </h2>
                  );
                }
                if (block.block_type === 'code') {
                  return (
                    <pre key={idx} style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', overflowX: 'auto', color: '#38bdf8', fontSize: '0.9rem' }}>
                      <code>{block.text}</code>
                    </pre>
                  );
                }
                if (block.block_type === 'quote') {
                  return (
                    <blockquote key={idx} style={{ borderLeft: '3px solid #64748b', margin: 0, paddingLeft: '1rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      {block.text}
                    </blockquote>
                  );
                }
                return (
                  <p key={idx} style={{ margin: 0, lineHeight: '1.7', color: '#cbd5e1', fontSize: '1.05rem' }}>
                    {block.text}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};