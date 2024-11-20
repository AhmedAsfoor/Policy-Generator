/**
 * Application Entry Point
 * 
 * This file serves as the main entry point for the Azure Policy Editor application.
 * It initializes React and renders the root App component into the DOM.
 * 
 * Key responsibilities:
 * - Setting up React 18's createRoot API
 * - Enabling Strict Mode for development best practices
 * - Mounting the application to the DOM
 * 
 * The application is mounted to an element with id 'root', which should be
 * present in the index.html file.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create a root container using React 18's createRoot API
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render the application wrapped in StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
