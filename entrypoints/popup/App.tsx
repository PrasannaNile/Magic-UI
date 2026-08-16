import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [isActive, setIsActive] = useState(false);
  const [pageInfo, setPageInfo] = useState<{ title: string; readingTime: number } | null>(null);

  // Send a message to the active tab's content script
  const toggleMagicMode = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    const nextState = !isActive;
    setIsActive(nextState);

    chrome.tabs.sendMessage(
      tab.id,
      { type: 'TOGGLE_MAGIC_MODE', enabled: nextState },
      (response: { success?: boolean; title?: string; readingTime?: number }) => {
        if (response?.success) {
          setPageInfo({
            title: response.title || tab.title || 'Unknown Page',
            readingTime: response.readingTime || 3,
          });
        }
      }
    );
  };

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="logo-badge">✨ Magic UI</div>
        <span className="version-tag">v0.1.0</span>
      </header>

      <main className="popup-body">
        <p className="description">Simplify and declutter this webpage.</p>

        <button
          className={`action-btn ${isActive ? 'active' : ''}`}
          onClick={toggleMagicMode}
        >
          {isActive ? 'Restore Original Page' : 'Turn On Magic View'}
        </button>

        {pageInfo && isActive && (
          <div className="info-card">
            <p className="info-title">📄 {pageInfo.title.slice(0, 35)}...</p>
            <span className="info-meta">⏱ ~{pageInfo.readingTime} min read</span>
          </div>
        )}
      </main>
    </div>
  );
}