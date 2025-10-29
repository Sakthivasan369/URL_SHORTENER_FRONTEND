import React, { useState } from 'react';
import './App.css';

function App() {
  const [longURL, setLongURL] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortURL, setShortURL] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortURL('');
    setLoading(true);

    if (!longURL) {
      setError('Please enter a URL.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINT}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          long_url: longURL,
          code: customCode.trim() || '', 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortURL(data.short_url);
      } else {
        setError(data.error || 'Failed to shorten URL. Please try again.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Could not connect to backend server. Check if it’s running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Go URL Shortener</h1>

      <form onSubmit={handleSubmit} className="shortener-form">
        <input
          type="url"
          value={longURL}
          onChange={(e) => setLongURL(e.target.value)}
          placeholder="Enter a long URL to shorten"
          required
          disabled={loading}
        />
        <input
          type="text"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          placeholder="Optional: Custom alias (e.g., my-link)"
          maxLength="64"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {error && <p className="message error">{error}</p>}

      {shortURL && (
        <div className="result-box">
          <h2>Short URL Created!</h2>
          <p>
            <a href={shortURL} target="_blank" rel="noopener noreferrer">
              {shortURL}
            </a>
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(shortURL)}
            className="copy-button"
          >
            Copy URL
          </button>
        </div>
      )}
    </div>
  );
}

export default App;


console.log('Backend API URL:', import.meta.env.VITE_API_URL);
