import React ,{ useState } from 'react';
import './App.css';

function App() {
  // State for the long URL input
  const [longURL, setLongURL] = useState('');
  const [customCode, setCustomCode] = useState('');
  // State to display the result (short URL)
  const [shortURL, setShortURL] = useState('');
  // State for error messages
  const [error, setError] = useState('');
  // State for loading status
  const [loading, setLoading] = useState(false);

  // NOTE: Your Go backend is running on http://localhost:8080 or meta,env
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
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the long URL to the Go backend
     body: JSON.stringify({ 
  long_url: longURL, 
  code: customCode.trim()  // send the optional alias
}),

      });

      const data = await response.json();

      if (response.ok) {
        // Success: The Go backend returns the short_url
        setShortURL(data.short_url);
      } else {
        // Error: Display message from the Go backend (e.g., validation errors)
        setError(data.error || 'Failed to shorten URL. Check backend logs.');
      }
    } catch (err) {
      // Network error (e.g., backend server is down)
      setError('Could not connect to the backend server (Is the Go server running on port 8080?).');
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
console.log("Backend API URL:", import.meta.env.VITE_API_URL);


export default App;