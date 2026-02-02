import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("AgroGuard AI: App entry point executing...");

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("AgroGuard AI: Root render triggered.");
  } catch (error) {
    console.error("AgroGuard AI: Failed to render app:", error);
  }
} else {
  console.error("AgroGuard AI: Critical: Could not find root element.");
}