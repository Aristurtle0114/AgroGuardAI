import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const initApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (err) {
      console.error("Critical: Failed to render React app:", err);
    }
  } else {
    console.error("Critical: Root element '#root' not found.");
  }
};

// Ensure the DOM is fully loaded before mounting
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}