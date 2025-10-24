// ----------------------------------------------------
// FIX: You must include this import to define 'React'
import React from 'react' 
// ----------------------------------------------------

import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// The code below uses React.StrictMode and the <App /> component
// which is why the 'React is not defined' error was triggered.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)