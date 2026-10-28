import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ApplicationsProvider } from './context/ApplicationsContext';
import { SettingsProvider } from './context/SettingsContext';
import './index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <ApplicationsProvider>
          <App />
        </ApplicationsProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
