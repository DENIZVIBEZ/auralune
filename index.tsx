import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './app/ErrorBoundary';

// Get the root element from the DOM
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Create a React root
const root = ReactDOM.createRoot(rootElement);

// Render the application with ErrorBoundary but without StrictMode to avoid development issues
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

